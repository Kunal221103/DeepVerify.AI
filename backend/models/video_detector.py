import os

from ai.inference import predict


def detect_video(frame_folder):
    """
    Analyze extracted video frames and average the AI predictions.
    """

    image_extensions = (".jpg", ".jpeg", ".png", ".bmp", ".webp")

    frames = sorted(
        [
            os.path.join(frame_folder, f)
            for f in os.listdir(frame_folder)
            if f.lower().endswith(image_extensions)
        ]
    )

    if not frames:
        raise ValueError(f"No frames found in: {frame_folder}")

    # Analyze at most 20 evenly spaced frames
    if len(frames) > 20:
        step = max(1, len(frames) // 20)
        frames = frames[::step]

    total_real = 0.0
    total_fake = 0.0

    analyzed = 0

    for frame in frames:

        result = predict(frame)

        real = 0.0
        fake = 0.0

        for item in result:

            label = str(item["label"]).lower()

            confidence = float(item["confidence"])

            if "real" in label or "authentic" in label or "human" in label:
                real = confidence

            elif "fake" in label or "deepfake" in label or "ai" in label:
                fake = confidence

        # Fallback if labels are different
        if real == 0 and fake == 0:

            best = max(result, key=lambda x: x["confidence"])

            if "fake" in best["label"].lower():
                fake = best["confidence"]
                real = 100 - fake
            else:
                real = best["confidence"]
                fake = 100 - real

        total_real += real
        total_fake += fake

        analyzed += 1

    return {

        "face_score": round(total_real / analyzed, 2),

        "fake_probability": round(total_fake / analyzed, 2),

        "frames_analyzed": analyzed,

        "model": "DeepVerify Video Detector"

    }