import librosa
import numpy as np


TARGET_SR = 16000


def assess_segment_quality(audio, frame_length=512, hop_length=256):
    """Estimate whether a segment contains reliable speech-like signal.

    The waveform is never denoised because that could discard forensic cues.
    Low-SNR segments are instead given less influence by the caller.
    """
    if len(audio) < frame_length:
        return {"snr_db": 0.0, "active_ratio": 0.0, "reliability": 0.0}

    frame_starts = range(0, len(audio) - frame_length + 1, hop_length)
    rms = np.asarray(
        [np.sqrt(np.mean(np.square(audio[start:start + frame_length]))) for start in frame_starts],
        dtype=np.float32,
    )
    noise_floor = float(np.percentile(rms, 20))
    speech_level = float(np.percentile(rms, 90))
    snr_db = 20.0 * np.log10((speech_level + 1e-8) / (noise_floor + 1e-8))
    active_threshold = max(noise_floor * 1.8, 0.003)
    active_ratio = float(np.mean(rms >= active_threshold))

    snr_reliability = float(np.clip((snr_db - 3.0) / 12.0, 0.0, 1.0))
    activity_reliability = float(np.clip(active_ratio / 0.35, 0.0, 1.0))
    return {
        "snr_db": round(float(snr_db), 2),
        "active_ratio": round(active_ratio, 3),
        "reliability": round(snr_reliability * activity_reliability, 3),
    }


def load_audio(audio_path):

    audio, sr = librosa.load(
        audio_path,
        sr=TARGET_SR,
        mono=True
    )

    return audio


def load_audio_segments(
    audio_path,
    segment_seconds=5.0,
    hop_seconds=2.5
):
    """
    Load audio and divide it into overlapping segments.

    Each segment:
        - 5 seconds long
        - 2.5 seconds hop
        - 16 kHz
        - mono
    """

    audio, sr = librosa.load(
        audio_path,
        sr=TARGET_SR,
        mono=True
    )

    segment_length = int(
        segment_seconds * sr
    )

    hop_length = int(
        hop_seconds * sr
    )

    segments = []

    if len(audio) == 0:
        return segments

    # Short audio
    if len(audio) <= segment_length:

        segments.append(audio)

        return segments

    # Normal overlapping segmentation
    start = 0

    while start < len(audio):

        end = start + segment_length

        segment = audio[start:end]

        # Ignore extremely short final fragments
        if len(segment) >= int(
            1.0 * sr
        ):

            segments.append(
                segment
            )

        if end >= len(audio):
            break

        start += hop_length

    return segments
