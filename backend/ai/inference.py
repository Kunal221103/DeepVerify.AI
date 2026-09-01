import torch

from ai.loader import load_model, DEVICE
from ai.preprocess import load_image


processor, model = load_model()


def predict(image_path):
    """
    Run Model 1 AI-vs-human image classification.

    Returns raw probabilities plus normalized probabilities.
    """

    image = load_image(image_path)

    inputs = processor(
        images=image,
        return_tensors="pt"
    )

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

    print("\n========== MODEL 1 DEBUG ==========")
    print("Image:", image_path)
    print("Device:", DEVICE)
    print("Labels:", labels)
    print("Logits:", outputs.logits[0].detach().cpu().tolist())
    print("Probabilities:", probabilities.detach().cpu().tolist())

    raw_predictions = []

    human_probability = None
    ai_probability = None

    for index, probability in enumerate(probabilities):

        label = str(labels[index])
        confidence = float(probability) * 100

        print(
            f"Class {index}: {label} = {confidence:.4f}%"
        )

        raw_predictions.append({
            "label": label,
            "confidence": round(confidence, 2)
        })

        normalized_label = (
            label
            .lower()
            .strip()
            .replace("_", "-")
            .replace(" ", "-")
        )

        if normalized_label == "human":

            human_probability = confidence

        elif normalized_label in (
            "ai-generated",
            "aigenerated",
            "fake",
        ):

            ai_probability = confidence

    print(
        "Human probability:",
        human_probability
    )

    print(
        "AI probability:",
        ai_probability
    )

    print("===================================\n")

    if human_probability is None or ai_probability is None:

        raise RuntimeError(
            f"Model 1 returned unexpected labels: {labels}"
        )

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