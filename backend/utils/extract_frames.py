import os
import cv2


def extract_frames(
    video_path,
    output_folder,
    max_frames=30,
    jpeg_quality=95
):
    """
    Extract representative frames from a video.

    Parameters
    ----------
    video_path : str
    output_folder : str
    max_frames : int
        Maximum frames to save.
    jpeg_quality : int
        JPEG quality (0-100)

    Returns
    -------
    dict
    """

    os.makedirs(output_folder, exist_ok=True)

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError(f"Cannot open video: {video_path}")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    if fps <= 0:
        fps = 30

    duration = total_frames / fps

    # Evenly sample frames
    step = max(1, total_frames // max_frames)

    saved = 0
    frame_index = 0

    while True:

        success, frame = cap.read()

        if not success:
            break

        if frame_index % step == 0:

            filename = os.path.join(
                output_folder,
                f"frame_{saved:03d}.jpg"
            )

            cv2.imwrite(
                filename,
                frame,
                [
                    cv2.IMWRITE_JPEG_QUALITY,
                    jpeg_quality
                ]
            )

            saved += 1

            if saved >= max_frames:
                break

        frame_index += 1

    cap.release()

    return {

        "frames_saved": saved,

        "total_frames": total_frames,

        "fps": round(fps, 2),

        "duration": round(duration, 2)

    }