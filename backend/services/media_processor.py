import os

from utils.extract_frames import extract_frames
from utils.extract_audio import extract_audio


class MediaProcessor:

    def process(self, filepath, media_type):

        result = {
            "frames_folder": None,
            "audio_path": None,
            "image_path": None,
            "thumbnail": None,
            "duration": None
        }

        if media_type == "video":

            video_name = os.path.splitext(
                os.path.basename(filepath)
            )[0]

            frame_folder = os.path.join(
                "temp",
                video_name
            )

            os.makedirs(frame_folder, exist_ok=True)

            # Extract sampled frames
            frame_info = extract_frames(
                filepath,
                frame_folder,
                max_frames=30,
            )

            audio_path = extract_audio(filepath)

            result["frames_folder"] = frame_folder
            result["audio_path"] = audio_path
            result["frame_info"] = frame_info
 
        elif media_type == "audio":

            result["audio_path"] = filepath

        elif media_type == "image":

            result["image_path"] = filepath

        else:

            raise ValueError(f"Unsupported media type: {media_type}")

        return result