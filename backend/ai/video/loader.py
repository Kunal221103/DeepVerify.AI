from transformers import AutoImageProcessor
from transformers import AutoModelForImageClassification

MODEL_NAME = "HrutikAdsare/deepfake-detector-faceforensics"

processor = AutoImageProcessor.from_pretrained(MODEL_NAME)

model = AutoModelForImageClassification.from_pretrained(
    MODEL_NAME
)

model.eval()