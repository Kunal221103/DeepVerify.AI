from transformers import AutoFeatureExtractor
from transformers import AutoModelForAudioClassification

MODEL_NAME = "Vansh180/deepfake-audio-wav2vec2"

print("Loading Audio AI...")

processor = AutoFeatureExtractor.from_pretrained(MODEL_NAME)

model = AutoModelForAudioClassification.from_pretrained(MODEL_NAME)

model.eval()

print("Audio AI Loaded.")


def load_model():
    return processor, model