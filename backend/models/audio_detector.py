from ai.audio.inference import predict

import librosa


def detect_audio(audio_path):

    duration = librosa.get_duration(path=audio_path)

    predictions = predict(audio_path)

    real_probability = 0
    fake_probability = 0

    for item in predictions:

        label = str(item["label"]).lower()

        confidence = float(item["confidence"])

        if "bonafide" in label or "real" in label:
            real_probability = confidence

        elif "spoof" in label or "fake" in label:
            fake_probability = confidence

    if real_probability == 0 and fake_probability == 0:

        best = max(
            predictions,
            key=lambda x: x["confidence"]
        )

        if "spoof" in best["label"].lower():

            fake_probability = best["confidence"]
            real_probability = 100 - fake_probability

        else:

            real_probability = best["confidence"]
            fake_probability = 100 - real_probability

    return {

        "voice_score": round(real_probability, 2),

        "real_probability": round(real_probability, 2),

        "fake_probability": round(fake_probability, 2),

        "duration": round(duration, 2),

        "model": "Vansh180/deepfake-audio-wav2vec2",

        "raw_predictions": predictions

    }