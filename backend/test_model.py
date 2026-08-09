from ai.inference import predict


IMAGE_PATH = "test.jpg"


result = predict(IMAGE_PATH)

print("\n========== MODEL TEST ==========")

print("Prediction:")
print(result["predicted_label"])

print("Confidence:")
print(result["confidence"])

print("Real probability:")
print(result["real_probability"])

print("AI-generated probability:")
print(result["fake_probability"])

print("\nRaw predictions:")

for prediction in result["raw_predictions"]:
    print(
        prediction["label"],
        "->",
        prediction["confidence"],
        "%"
    )

print("================================")