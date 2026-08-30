from ai.audio.loader import load_model

processor, model = load_model()

print("\n==============================")
print("AUDIO MODEL INFORMATION")
print("==============================")

print("Model:", "Vansh180/deepfake-audio-wav2vec2")

print("Labels:")
print(model.config.id2label)

print("\nProcessor sampling rate:")
print(
    getattr(
        processor,
        "sampling_rate",
        "Not specified"
    )
)

print("\nModel input sampling rate:")
print(
    getattr(
        model.config,
        "sampling_rate",
        "Not specified"
    )
)