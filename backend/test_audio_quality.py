import numpy as np

from ai.audio.preprocess import assess_segment_quality


def test_silence_has_no_audio_reliability():
    result = assess_segment_quality(np.zeros(16000, dtype=np.float32))

    assert result["reliability"] == 0.0


def test_clear_signal_is_more_reliable_than_silence():
    signal = np.concatenate((np.zeros(4000), np.ones(12000))).astype(np.float32) * 0.1

    assert assess_segment_quality(signal)["reliability"] > 0.0
