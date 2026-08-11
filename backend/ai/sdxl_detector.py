import torch

from PIL import Image

from transformers import (
    AutoImageProcessor,
    AutoModelForImageClassification
)


MODEL_NAME = "Organika/sdxl-detector"


DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


print("Loading third image detector...")

processor = AutoImageProcessor.from_pretrained(
    MODEL_NAME
)

model = AutoModelForImageClassification.from_pretrained(
    MODEL_NAME
)

model.to(DEVICE)
model.eval()

print("Third model loaded.")
print("Device:", DEVICE)
print("Labels:", model.config.id2label)


def predict_sdxl(image_path):

    image = Image.open(
        image_path
    ).convert("RGB")

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

    predictions = []

    labels = model.config.id2label

    for index, probability in enumerate(
        probabilities
    ):

        predictions.append({

            "label": labels[index],

            "confidence": round(
                float(probability) * 100,
                2
            )

        })

    return predictions