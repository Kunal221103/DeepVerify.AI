from ai.inference import predict
from ai.second_detector import predict_second
from ai.sdxl_detector import predict_sdxl

from ai.ensemble import calculate_ensemble


IMAGE_PATHS = [
    "test_real.jpg",
    "test_ai.jpg",
    "test_edit.jpg",
]


for image_path in IMAGE_PATHS:

    print("\n")
    print("=" * 50)
    print("IMAGE:", image_path)
    print("=" * 50)

    try:

        # -----------------------------
        # Model 1
        # -----------------------------

        model1 = predict(
            image_path
        )

        print("\nMODEL 1")
        print(model1)

        # -----------------------------
        # Model 2
        # -----------------------------

        model2 = predict_second(
            image_path
        )

        print("\nMODEL 2")
        print(model2)

        # -----------------------------
        # Model 3
        # -----------------------------

        model3 = predict_sdxl(
            image_path
        )

        print("\nMODEL 3")
        print(model3)

        # -----------------------------
        # Ensemble
        # -----------------------------

        final = calculate_ensemble(
            model1,
            model2,
            model3,
        )

        print("\n")
        print("******** FINAL ENSEMBLE ********")

        print(
            "VERDICT:",
            final["verdict"]
        )

        print(
            "SCORE:",
            final["score"],
            "%"
        )

        print(
            "REAL:",
            final["real_probability"],
            "%"
        )

        print(
            "FAKE:",
            final["fake_probability"],
            "%"
        )

        print(
            "********************************"
        )

    except Exception as e:

        print(
            "ERROR:",
            str(e)
        )