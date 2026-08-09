from ai.third_detector import predict_third


images = [
    "test_real.jpg",
    "test_ai.jpg",
    "test_edit.jpg"
]


for image in images:

    print("\n===================================")
    print("IMAGE:", image)
    print("===================================")

    try:

        result = predict_third(image)

        print(
            "Prediction:",
            result["prediction"]
        )

        print(
            "Confidence:",
            result["confidence"],
            "%"
        )

        print(
            "Real:",
            result["real_probability"],
            "%"
        )

        print(
            "AI-generated:",
            result["ai_generated_probability"],
            "%"
        )

    except Exception as e:

        print(
            "ERROR:",
            e
        )