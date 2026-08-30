import librosa

from ai.audio.inference import predict


def detect_audio(audio_path):

    duration = librosa.get_duration(
        path=audio_path
    )

    result = predict(
        audio_path
    )


    real_probability = float(
        result.get(
            "real_probability",
            0
        )
    )

    fake_probability = float(
        result.get(
            "fake_probability",
            0
        )
    )


    return {

        "voice_score": round(
            real_probability,
            2
        ),

        "real_probability": round(
            real_probability,
            2
        ),

        "fake_probability": round(
            fake_probability,
            2
        ),

        "raw_fake_probability": result.get(
            "raw_fake_probability",
            fake_probability
        ),

        "audio_reliability": result.get(
            "audio_reliability",
            1.0
        ),

        "model_agreement": result.get(
            "model_agreement",
            1.0
        ),

        "duration": round(
            duration,
            2
        ),

        "segments_analyzed":
            result.get(
                "segments_analyzed",
                0
            ),

        "mean_fake_probability":
            result.get(
                "mean_fake_probability",
                0
            ),

        "median_fake_probability":
            result.get(
                "median_fake_probability",
                0
            ),

        "high_fake_segments":
            result.get(
                "high_fake_segments",
                0
            ),

        "fake_segment_ratio":
            result.get(
                "fake_segment_ratio",
                0
            ),

        "suspicious_segments":
            result.get(
                "suspicious_segments",
                0
            ),

        "suspicious_segment_ratio":
            result.get(
                "suspicious_segment_ratio",
                0
            ),

        "segment_predictions":
            result.get(
                "segment_predictions",
                []
            ),

        "model":
            "Vansh180/deepfake-audio-wav2vec2"

    }
