from services.media_processor import MediaProcessor

from ai.ela import calculate_ela_score
from ai.noise import calculate_noise_score

from models.video_detector import detect_video
from models.audio_detector import detect_audio
from models.image_detector import detect_image
from models.metadata_detector import detect_metadata
from models.lipsync_detector import detect_lipsync


processor = MediaProcessor()


def analyze(filepath, media_type):

    metadata = detect_metadata(filepath)

    # ==========================================================
    # VIDEO
    # ==========================================================
    if media_type == "video":

        media = processor.process(filepath, media_type)

        video = detect_video(media["frames_folder"])

        audio = detect_audio(media["audio_path"])

        lipsync = detect_lipsync(filepath)

        score = (
            video["face_score"] * 0.55 +
            audio["voice_score"] * 0.20 +
            lipsync["lipsync_score"] * 0.15 +
            metadata["metadata_score"] * 0.10
        )

        return {
            "media": "video",
            "score": round(score, 2),
            "video": video,
            "audio": audio,
            "lipsync": lipsync,
            "metadata": metadata
        }

    # ==========================================================
    # AUDIO
    # ==========================================================
    elif media_type == "audio":

        audio = detect_audio(filepath)

        score = (
            audio["voice_score"] * 0.80 +
            metadata["metadata_score"] * 0.20
        )

        return {
            "media": "audio",
            "score": round(score, 2),
            "audio": audio,
            "metadata": metadata
        }

    # ==========================================================
    # IMAGE
    # ==========================================================
    elif media_type == "image":

        # ======================================================
        # IMAGE MODELS
        # ======================================================

        from ai.inference import predict
        from ai.second_detector import predict_second
        from ai.third_detector import predict_third
        from ai.ensemble import calculate_ensemble

        model1 = predict(filepath)

        model2 = predict_second(filepath)

        model3 = predict_third(filepath)

        ensemble = calculate_ensemble(
            model1,
            model2,
            model3,
        )

        # ======================================================
        # FORENSIC ANALYSIS
        # ======================================================

        ela = calculate_ela_score(
            filepath
        )

        noise = calculate_noise_score(
            filepath
        )

        # metadata was already calculated above
        # and should NOT be calculated twice.

        # ======================================================
        # FINAL IMAGE RESULT
        # ======================================================

        return {

            "media": "image",

            "score": ensemble["score"],

            "verdict": ensemble["verdict"],

            "real_probability": ensemble[
                "real_probability"
            ],

            "fake_probability": ensemble[
                "fake_probability"
            ],

            "image": {

                "prediction": ensemble[
                    "verdict"
                ],

                "real_probability": ensemble[
                    "real_probability"
                ],

                "fake_probability": ensemble[
                    "fake_probability"
                ],

                "confidence": ensemble[
                    "score"
                ],

                "model_evidence": ensemble[
                    "model_evidence"
                ],
            },

            "metadata": metadata,

            "ela": ela,

            "noise": noise,

            "forensic": {

                "ela": ela,

                "noise": noise,

                "metadata": metadata,
            },
        }

    # ==========================================================
    # UNKNOWN
    # ==========================================================

    else:
        raise ValueError(f"Unsupported media type: {media_type}")