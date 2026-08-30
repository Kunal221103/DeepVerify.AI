"""Optional second opinion for synthetic-voice detection.

The primary detector and this model have different training sources. Agreement
is useful evidence; disagreement is reported as uncertainty instead of forcing
an unreliable real/fake label.
"""

import torch
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification


MODEL_NAME = "abhishtagatya/wavlm-base-960h-itw-deepfake"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

_processor = None
_model = None
_load_attempted = False


def _load_model():
    global _processor, _model, _load_attempted
    if _load_attempted:
        return _processor, _model

    _load_attempted = True
    try:
        print(f"Loading second audio detector ({MODEL_NAME})...")
        _processor = AutoFeatureExtractor.from_pretrained(MODEL_NAME)
        _model = AutoModelForAudioClassification.from_pretrained(MODEL_NAME)
        _model.to(DEVICE)
        _model.eval()
        print("Second audio detector loaded.")
    except Exception as exc:
        print(f"Second audio detector unavailable: {exc}")
        _processor = None
        _model = None
    return _processor, _model


def predict_second_audio(audio, sampling_rate=16000):
    """Return a fake probability, or None when the optional model is unavailable."""
    processor, model = _load_model()
    if processor is None or model is None:
        return None

    inputs = processor(audio, sampling_rate=sampling_rate, return_tensors="pt")
    inputs = {key: value.to(DEVICE) for key, value in inputs.items()}
    with torch.no_grad():
        probabilities = torch.softmax(model(**inputs).logits, dim=-1)[0]

    fake_probability = 0.0
    real_probability = 0.0
    for index, probability in enumerate(probabilities):
        label = str(model.config.id2label[index]).lower()
        value = float(probability) * 100.0
        if any(term in label for term in ("fake", "spoof", "synthetic", "attack")):
            fake_probability = max(fake_probability, value)
        elif any(term in label for term in ("real", "bonafide", "bona-fide", "genuine")):
            real_probability = max(real_probability, value)

    if fake_probability > 0.0:
        return fake_probability
    if real_probability > 0.0:
        return 100.0 - real_probability
    raise ValueError(f"Unsupported labels in second audio detector: {model.config.id2label}")
