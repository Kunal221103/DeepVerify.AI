"""Lazy fourth visual detector for frame-level video analysis."""

import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification


MODEL_NAME = "prithivMLmods/Deepfake-Detection-Exp-02-22"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

_processor = None
_model = None
_load_attempted = False


def _load_model():
    """Load once, without preventing video scans when the optional model fails."""
    global _processor, _model, _load_attempted
    if _load_attempted:
        return _processor, _model

    _load_attempted = True
    try:
        print(f"Loading fourth video detector ({MODEL_NAME})...")
        _processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
        _model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
        _model.to(DEVICE)
        _model.eval()
        print("Fourth video detector loaded.")
    except Exception as exc:
        # This detector is an enhancement. Preserve existing scan capability if
        # its initial model download or initialization is unavailable.
        print(f"Fourth video detector unavailable: {exc}")
        _processor = None
        _model = None
    return _processor, _model


def predict_fourth(image_path):
    """Return class predictions, or None when the optional model is unavailable."""
    processor, model = _load_model()
    if processor is None or model is None:
        return None

    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    inputs = {key: value.to(DEVICE) for key, value in inputs.items()}
    with torch.no_grad():
        probabilities = torch.softmax(model(**inputs).logits, dim=-1)[0]

    labels = model.config.id2label
    return [
        {"label": labels[index], "confidence": round(float(probability) * 100, 2)}
        for index, probability in enumerate(probabilities)
    ]
