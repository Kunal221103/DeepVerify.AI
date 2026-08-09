import torch

from transformers import (
    AutoImageProcessor,
    AutoModelForImageClassification
)


MODEL_NAME = (
    "capcheck/ai-human-generated-image-detection"
)


DEVICE = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)


processor = None
model = None


def load_model():

    global processor
    global model

    if model is not None:

        return processor, model

    print(
        "Loading DeepVerify AI Image Detection Model..."
    )

    print(
        f"Device: {DEVICE}"
    )

    processor = AutoImageProcessor.from_pretrained(
        MODEL_NAME
    )

    model = AutoModelForImageClassification.from_pretrained(
        MODEL_NAME
    )

    model.to(DEVICE)

    model.eval()

    print(
        "Model Loaded Successfully."
    )

    print(
        "Labels:",
        model.config.id2label
    )

    return processor, model