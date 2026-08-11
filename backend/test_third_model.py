from backend.ai.sdxl_detector import predict_third


images = [
    "test_real.jpg",
    "test_ai.jpg",
    "test_edit.jpg"
]


for image in images:

    print("\n================================")
    print("IMAGE:", image)
    print("================================")

    try:

        results = predict_third(image)

        for result in results:

            print(
                result["label"],
                "->",
                result["confidence"],
                "%"
            )

    except Exception as e:

        print("ERROR:", e)