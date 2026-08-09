import torch
from PIL import Image

from ai.video.loader import (
    processor,
    model
)


def predict(image_path):

    image = Image.open(image_path).convert("RGB")

    inputs = processor(
        images=image,
        return_tensors="pt"
    )

    with torch.no_grad():

        outputs = model(**inputs)

        probs = torch.softmax(
            outputs.logits,
            dim=1
        )

    real = float(probs[0][0])

    fake = float(probs[0][1])

    return {

        "real_probability": round(real * 100, 2),

        "fake_probability": round(fake * 100, 2)

    }