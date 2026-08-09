from ai.inference import predict
from ai.second_detector import predict_second


TEST_IMAGES = {
    "REAL": "test_real.jpg",
    "AI_GENERATED": "test_ai.jpg",
    "AI_EDITED": "test_edit.jpg",
}


def print_model_1(path):

    result = predict(path)

    print("\nModel 1")
    print("-------------------------")
    print(
        "Prediction:",
        result["predicted_label"]
    )
    print(
        "Human:",
        result["real_probability"],
        "%"
    )
    print(
        "AI-generated:",
        result["fake_probability"],
        "%"
    )


def print_model_2(path):

    result = predict_second(path)

    print("\nModel 2")
    print("-------------------------")

    for item in result:

        print(
            item["label"],
            ":",
            item["confidence"],
            "%"
        )


for expected, image_path in TEST_IMAGES.items():

    print("\n\n======================================")
    print("EXPECTED:", expected)
    print("IMAGE:", image_path)
    print("======================================")

    try:

        print_model_1(image_path)

        print_model_2(image_path)

    except Exception as e:

        print(
            "ERROR:",
            e
        )