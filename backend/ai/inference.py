import torch

from ai.loader import load_model, DEVICE
from ai.preprocess import load_image


processor, model = load_model()


def predict(image_path):
    """
    Run AI-vs-human image classification.

    Returns:
        {
            "real_probability": float,
            "fake_probability": float,
            "predicted_label": str,
            "confidence": float,
            "raw_predictions": list
        }
    """

    image = load_image(image_path)

    inputs = processor(
        images=image,
        return_tensors="pt"
    )

    # Move input tensors to the same device as the model
    inputs = {
        key: value.to(DEVICE)
        for key, value in inputs.items()
    }

    with torch.no_grad():

        outputs = model(**inputs)

        probabilities = torch.softmax(
            outputs.logits,
            dim=-1
        )[0]

    labels = model.config.id2label

    raw_predictions = []

    human_probability = 0.0
    ai_probability = 0.0

    for index, probability in enumerate(probabilities):

        label = labels[index]

        confidence = float(probability) * 100

        raw_predictions.append({
            "label": label,
            "confidence": round(confidence, 2)
        })

        normalized_label = label.lower().strip()

        if normalized_label == "human":

            human_probability = confidence

        elif normalized_label in (
            "ai-generated",
            "ai generated",
            "ai_generated"
        ):

            ai_probability = confidence

    # Determine the winning class
    if ai_probability >= human_probability:

        predicted_label = "AI-generated"
        confidence = ai_probability

    else:

        predicted_label = "human"
        confidence = human_probability

    return {

        "real_probability": round(
            human_probability,
            2
        ),

        "fake_probability": round(
            ai_probability,
            2
        ),

        "predicted_label": predicted_label,

        "confidence": round(
            confidence,
            2
        ),

        "raw_predictions": raw_predictions
    }