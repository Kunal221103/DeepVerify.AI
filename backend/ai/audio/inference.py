import torch

from ai.audio.loader import load_model
from ai.audio.preprocess import load_audio

processor, model = load_model()


def predict(audio_path):

    audio = load_audio(audio_path)

    inputs = processor(
        audio,
        sampling_rate=16000,
        return_tensors="pt"
    )

    with torch.no_grad():

        outputs = model(**inputs)

        probs = torch.softmax(
            outputs.logits,
            dim=1
        )[0]

    labels = model.config.id2label

    predictions = []

    for i, probability in enumerate(probs):

        predictions.append({

            "label": labels[i],

            "confidence": round(
                float(probability) * 100,
                2
            )

        })

    return predictions