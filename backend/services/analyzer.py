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

        image = detect_image(filepath)

        ela = calculate_ela_score(filepath)

        noise = calculate_noise_score(filepath)

        score = (
            image["real_probability"] * 0.60 +
            metadata["metadata_score"] * 0.10 +
            ela["ela_score"] * 0.15 +
            noise["noise_score"] * 0.15
        )

        return {
            "media": "image",
            "score": round(score, 2),
            "image": image,
            "metadata": metadata,
            "ela": ela,
            "noise": noise
        }

    # ==========================================================
    # UNKNOWN
    # ==========================================================
    else:
        raise ValueError(f"Unsupported media type: {media_type}")