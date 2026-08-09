from ai.second_detector import predict_second


result = predict_second("test.jpg")


print("\n========== SECOND MODEL TEST ==========")

for prediction in result:

    print(
        prediction["label"],
        "->",
        prediction["confidence"],
        "%"
    )

print("=======================================\n")