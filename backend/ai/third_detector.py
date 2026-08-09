import os
import sys
import json
import torch

from PIL import Image

from torchvision.transforms import (
    Compose,
    Resize,
    CenterCrop,
    ToTensor,
    Normalize,
)


# ============================================================
# MODEL LOCATION
# ============================================================

MODEL_DIR = os.path.join(
    os.path.dirname(__file__),
    "third_model"
)

DEVICE = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)


# ============================================================
# LOAD MODEL ARCHITECTURE
# ============================================================

# The official model repository provides the
# FrequencyAwareDetector architecture in train.py.
#
# We add its local directory to Python's import path.

if MODEL_DIR not in sys.path:
    sys.path.insert(0, MODEL_DIR)


try:

    from train import FrequencyAwareDetector

except ImportError as e:

    raise ImportError(
        "Could not import FrequencyAwareDetector. "
        "Make sure train.py exists inside "
        "backend/ai/third_model/"
    ) from e


# ============================================================
# MODEL FILES
# ============================================================

CONFIG_PATH = os.path.join(
    MODEL_DIR,
    "detector_config.json"
)

WEIGHTS_PATH = os.path.join(
    MODEL_DIR,
    "model_state_dict.pt"
)


# ============================================================
# LOAD CONFIG
# ============================================================

if os.path.exists(CONFIG_PATH):

    with open(
        CONFIG_PATH,
        "r",
        encoding="utf-8"
    ) as file:

        config = json.load(file)

else:

    config = {

        "backbone_name":
            "microsoft/swinv2-tiny-patch4-window8-256",

        "num_labels": 2,

        "dct_patch_size": 32,

        "num_freq_bands": 8,

        "fft_bins": 32
    }


# ============================================================
# CREATE MODEL
# ============================================================

print(
    "Loading third AI image detector..."
)

print(
    "Device:",
    DEVICE
)


model = FrequencyAwareDetector(
    backbone_name=config[
        "backbone_name"
    ],

    num_labels=config[
        "num_labels"
    ],

    dct_patch_size=config[
        "dct_patch_size"
    ],

    num_freq_bands=config[
        "num_freq_bands"
    ],

    fft_bins=config[
        "fft_bins"
    ],
)


# ============================================================
# LOAD TRAINED WEIGHTS
# ============================================================

if not os.path.exists(WEIGHTS_PATH):

    raise FileNotFoundError(
        "Third detector weights not found:\n"
        f"{WEIGHTS_PATH}\n\n"
        "Download model_state_dict.pt from:\n"
        "https://huggingface.co/"
        "Reju983/ai-generated-image-detector"
    )


state_dict = torch.load(
    WEIGHTS_PATH,
    map_location=DEVICE
)


model.load_state_dict(
    state_dict
)


model.to(DEVICE)

model.eval()


print(
    "Third model loaded successfully."
)


# ============================================================
# IMAGE TRANSFORM
# ============================================================

transform = Compose([

    Resize(
        (288, 288)
    ),

    CenterCrop(
        (256, 256)
    ),

    ToTensor(),

    Normalize(
        mean=[
            0.485,
            0.456,
            0.406
        ],

        std=[
            0.229,
            0.224,
            0.225
        ]
    )
])


# ============================================================
# PREDICTION
# ============================================================

def predict_third(image_path):

    if not os.path.exists(image_path):

        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )


    image = Image.open(
        image_path
    ).convert("RGB")


    pixel_values = transform(
        image
    ).unsqueeze(0).to(DEVICE)


    with torch.no_grad():

        output = model(
            pixel_values=pixel_values
        )

        logits = output["logits"]

        probabilities = torch.softmax(
            logits,
            dim=1
        )[0]


    real_probability = (
        float(probabilities[0]) * 100
    )

    ai_probability = (
        float(probabilities[1]) * 100
    )


    if ai_probability >= real_probability:

        prediction = "AI-generated"

        confidence = ai_probability

    else:

        prediction = "Real"

        confidence = real_probability


    return {

        "prediction": prediction,

        "confidence": round(
            confidence,
            2
        ),

        "real_probability": round(
            real_probability,
            2
        ),

        "ai_generated_probability": round(
            ai_probability,
            2
        )
    }