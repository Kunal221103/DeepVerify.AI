import librosa


def load_audio(audio_path):

    audio, sr = librosa.load(
        audio_path,
        sr=16000,
        mono=True
    )

    return audio