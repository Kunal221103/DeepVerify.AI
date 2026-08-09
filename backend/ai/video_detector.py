import os

from ai.inference import predict


def detect_video(frame_folder):

    fake_scores = []

    frames = sorted(os.listdir(frame_folder))

    for frame in frames[::5]:

        path = os.path.join(
            frame_folder,
            frame
        )

        prediction = predict(path)

        fake = 0

        for item in prediction:

            if "fake" in item["label"].lower():

                fake = item["score"] * 100

        fake_scores.append(fake)

    average = sum(fake_scores) / len(fake_scores)

    return {

        "face_score": round(
            100 - average,
            2
        ),

        "fake_probability": round(
            average,
            2
        ),

        "frames": len(fake_scores)

    }