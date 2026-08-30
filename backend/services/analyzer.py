from services.media_processor import MediaProcessor

from ai.ela import calculate_ela_score
from ai.noise import calculate_noise_score
from ai.ensemble import calculate_ensemble
from ai.inference import predict
from ai.second_detector import predict_second
from ai.sdxl_detector import predict_sdxl

from models.video_detector import detect_video
from models.audio_detector import detect_audio
from models.metadata_detector import detect_metadata
from models.lipsync_detector import detect_lipsync


processor = MediaProcessor()


def _get_video_verdict(fake_probability):
    """
    Determine video verdict from final multimodal fake probability.
    """

    if fake_probability >= 60:
        return "DEEPFAKE"

    if fake_probability >= 30:
        return "SUSPICIOUS"

    else:
        return "AUTHENTIC"


def _get_audio_verdict(fake_probability):
    """
    Determine audio-only verdict.
    """

    if fake_probability >= 60:
        return "DEEPFAKE"

    if fake_probability >= 30:
        return "SUSPICIOUS"

    else:
        return "AUTHENTIC"


def analyze(filepath, media_type):

    # ==========================================================
    # METADATA
    # ==========================================================

    metadata = detect_metadata(filepath)


    # ==========================================================
    # VIDEO
    # ==========================================================

    if media_type == "video":

        # ------------------------------------------------------
        # PROCESS VIDEO
        # ------------------------------------------------------

        media = processor.process(
            filepath,
            media_type
        )

        # ------------------------------------------------------
        # VISUAL ANALYSIS
        # ------------------------------------------------------

        video = detect_video(
            media["frames_folder"]
        )

        visual_fake = float(
            video.get(
                "fake_probability",
                100.0 - video.get(
                    "face_score",
                    100.0
                )
            )
        )

        # ------------------------------------------------------
        # AUDIO ANALYSIS
        # ------------------------------------------------------

        audio = detect_audio(
            media["audio_path"]
        )

        audio_fake = float(
            audio.get(
                "fake_probability",
                0.0
            )
        )

        audio_real = float(
            audio.get(
                "real_probability",
                100.0 - audio_fake
            )
        )

        audio_reliability = float(
            audio.get(
                "audio_reliability",
                1.0
            )
        )

        # ------------------------------------------------------
        # LIP-SYNC ANALYSIS
        # ------------------------------------------------------

        lipsync = detect_lipsync(
            filepath
        )

        lipsync_score = float(
            lipsync.get(
                "lipsync_score",
                50.0
            )
        )

        # ------------------------------------------------------
        # MULTIMODAL ENSEMBLE
        #
        # Visual evidence is stronger than audio because
        # audio-only models can produce false positives on
        # movie/dialogue recordings.
        # ------------------------------------------------------

        audio_weight = 0.25 * audio_reliability
        visual_weight = 1.0 - audio_weight

        fake_probability = (
            visual_fake * visual_weight
            + audio_fake * audio_weight
        )

        fake_probability = max(
            0.0,
            min(
                100.0,
                fake_probability
            )
        )

        real_probability = (
            100.0 - fake_probability
        )

        # ------------------------------------------------------
        # VERDICT
        # ------------------------------------------------------

        verdict = _get_video_verdict(
            fake_probability
        )

        # ------------------------------------------------------
        # CONFIDENCE
        #
        # For AUTHENTIC -> real probability
        # For DEEPFAKE  -> fake probability
        # For SUSPICIOUS -> stronger side
        # ------------------------------------------------------

        if verdict == "DEEPFAKE":

            confidence = fake_probability

        elif verdict == "AUTHENTIC":

            confidence = real_probability

        else:

            confidence = max(
                real_probability,
                fake_probability
            )

        # ------------------------------------------------------
        # FINAL VIDEO RESULT
        # ------------------------------------------------------

        return {

            "media": "video",

            "verdict": verdict,

            "score": round(
                confidence,
                2
            ),

            "confidence": round(
                confidence,
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

            # ==================================================
            # VIDEO
            # ==================================================

            "video": video,

            # ==================================================
            # AUDIO
            # ==================================================

            "audio": audio,

            # ==================================================
            # LIP SYNC
            # ==================================================

            "lipsync": lipsync,

            # ==================================================
            # METADATA
            # ==================================================

            "metadata": metadata,

            # ==================================================
            # MULTIMODAL ENSEMBLE
            # ==================================================

            "ensemble": {

                "visual_fake_probability": round(
                    visual_fake,
                    2
                ),

                "audio_fake_probability": round(
                    audio_fake,
                    2
                ),

                "visual_real_probability": round(
                    100.0 - visual_fake,
                    2
                ),

                "audio_real_probability": round(
                    audio_real,
                    2
                ),

                "visual_weight": visual_weight,

                "audio_weight": audio_weight,

                "audio_reliability": round(
                    audio_reliability,
                    3
                ),

                "fake_probability": round(
                    fake_probability,
                    2
                ),

                "real_probability": round(
                    real_probability,
                    2
                )
            }
        }


    # ==========================================================
    # AUDIO
    # ==========================================================

    elif media_type == "audio":

        audio = detect_audio(
            filepath
        )

        fake_probability = float(
            audio.get(
                "fake_probability",
                0.0
            )
        )

        real_probability = float(
            audio.get(
                "real_probability",
                100.0 - fake_probability
            )
        )

        verdict = _get_audio_verdict(
            fake_probability
        )

        if verdict == "DEEPFAKE":

            confidence = fake_probability

        elif verdict == "AUTHENTIC":

            confidence = real_probability

        else:

            confidence = max(
                real_probability,
                fake_probability
            )

        return {

            "media": "audio",

            "verdict": verdict,

            "score": round(
                confidence,
                2
            ),

            "confidence": round(
                confidence,
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

            "audio": audio,

            "metadata": metadata
        }


    # ==========================================================
    # IMAGE
    # ==========================================================

    elif media_type == "image":

        # ------------------------------------------------------
        # IMAGE MODELS
        # ------------------------------------------------------

        # ------------------------------------------------------
        # MODEL 1
        # ------------------------------------------------------

        model1 = predict(
            filepath
        )

        # ------------------------------------------------------
        # MODEL 2
        # ------------------------------------------------------

        model2 = predict_second(
            filepath
        )

        # ------------------------------------------------------
        # MODEL 3
        # ------------------------------------------------------

        model3 = predict_sdxl(
            filepath
        )

        # ------------------------------------------------------
        # ENSEMBLE
        # ------------------------------------------------------

        ensemble = calculate_ensemble(
            model1,
            model2,
            model3
        )

        # ------------------------------------------------------
        # FORENSIC ANALYSIS
        # ------------------------------------------------------

        ela = calculate_ela_score(
            filepath
        )

        noise = calculate_noise_score(
            filepath
        )

        # ------------------------------------------------------
        # IMAGE RESULT
        # ------------------------------------------------------

        return {

            "media": "image",

            "score": round(
                float(
                    ensemble["score"]
                ),
                2
            ),

            "confidence": round(
                float(
                    ensemble["score"]
                ),
                2
            ),

            "verdict": ensemble[
                "verdict"
            ],

            "real_probability": round(
                float(
                    ensemble[
                        "real_probability"
                    ]
                ),
                2
            ),

            "fake_probability": round(
                float(
                    ensemble[
                        "fake_probability"
                    ]
                ),
                2
            ),

            # --------------------------------------------------
            # IMAGE ANALYSIS
            # --------------------------------------------------

            "image": {

                "prediction": ensemble[
                    "verdict"
                ],

                "real_probability": round(
                    float(
                        ensemble[
                            "real_probability"
                        ]
                    ),
                    2
                ),

                "fake_probability": round(
                    float(
                        ensemble[
                            "fake_probability"
                        ]
                    ),
                    2
                ),

                "confidence": round(
                    float(
                        ensemble["score"]
                    ),
                    2
                ),

                "model_evidence": ensemble[
                    "model_evidence"
                ]
            },

            # --------------------------------------------------
            # INDIVIDUAL MODELS
            # --------------------------------------------------

            "models": {

                "model_1": model1,

                "model_2": model2,

                "model_3": model3
            },

            # --------------------------------------------------
            # FORENSICS
            # --------------------------------------------------

            "metadata": metadata,

            "ela": ela,

            "noise": noise,

            "forensic": {

                "ela": ela,

                "noise": noise,

                "metadata": metadata
            }
        }


    # ==========================================================
    # UNKNOWN MEDIA TYPE
    # ==========================================================

    else:

        raise ValueError(
            f"Unsupported media type: {media_type}"
        )
