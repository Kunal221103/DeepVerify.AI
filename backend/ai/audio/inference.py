import torch

from ai.audio.loader import load_model
from ai.audio.preprocess import assess_segment_quality, load_audio_segments
from ai.audio.second_detector import predict_second_audio


processor, model = load_model()


def _predict_segment(audio):

    inputs = processor(
        audio,
        sampling_rate=16000,
        return_tensors="pt"
    )

    device = next(
        model.parameters()
    ).device

    inputs = {
        key: value.to(device)
        for key, value in inputs.items()
    }

    with torch.no_grad():

        outputs = model(
            **inputs
        )

        probabilities = torch.softmax(
            outputs.logits,
            dim=1
        )[0]

    labels = model.config.id2label

    predictions = []

    for i, probability in enumerate(
        probabilities
    ):

        predictions.append({

            "label": labels[i],

            "confidence": round(
                float(probability) * 100,
                2
            )

        })

    return predictions


def predict(audio_path):

    """
    Analyze audio using overlapping segments.

    In addition to the average probability, calculate:

    - high-confidence fake segments
    - fake segment ratio
    - median fake probability
    """

    segments = load_audio_segments(
        audio_path,
        segment_seconds=5.0,
        hop_seconds=2.5
    )

    if not segments:

        raise ValueError(
            f"No usable audio found: {audio_path}"
        )


    fake_scores = []

    quality_scores = []

    model_agreement_scores = []

    real_scores = []

    analyzed_segments = 0


    # ======================================================
    # ANALYZE SEGMENTS
    # ======================================================

    for segment in segments:

        try:

            quality = assess_segment_quality(segment)

            predictions = _predict_segment(
                segment
            )

            real = 0.0
            fake = 0.0


            for item in predictions:

                label = str(
                    item["label"]
                ).lower().strip()

                confidence = float(
                    item["confidence"]
                )


                if (
                    "real" in label
                    or "bonafide" in label
                ):

                    real = confidence


                elif (
                    "fake" in label
                    or "spoof" in label
                ):

                    fake = confidence


            # ------------------------------------------------
            # Normalize
            # ------------------------------------------------

            total = (
                real +
                fake
            )

            if total > 0:

                real = (
                    real /
                    total
                ) * 100

                fake = (
                    fake /
                    total
                ) * 100

            # A second model was trained on different in-the-wild spoof data.
            # Do not force a verdict when the models disagree sharply: keep the
            # primary score but reduce the final reliability later.
            try:
                second_fake = predict_second_audio(segment)
            except Exception as exc:
                print(f"Second audio model failed for a segment: {exc}")
                second_fake = None
            if second_fake is None:
                model_agreement = 1.0
            else:
                second_fake = max(0.0, min(100.0, float(second_fake)))
                model_agreement = max(0.0, 1.0 - abs(fake - second_fake) / 100.0)
                fake = fake * 0.60 + second_fake * 0.40


            real_scores.append(
                real
            )

            fake_scores.append(
                fake
            )

            quality_scores.append(quality)

            model_agreement_scores.append(model_agreement)

            analyzed_segments += 1


        except Exception as exc:

            print(
                f"Audio segment analysis failed: {exc}"
            )


    if analyzed_segments == 0:

        raise ValueError(
            "All audio segment analyses failed."
        )


    # ======================================================
    # BASIC STATISTICS
    # ======================================================

    import statistics


    mean_fake = statistics.mean(
        fake_scores
    )

    median_fake = statistics.median(
        fake_scores
    )


    # ======================================================
    # HIGH-CONFIDENCE FAKE SEGMENTS
    # ======================================================

    high_fake_segments = sum(

        1
        for score in fake_scores
        if score >= 60

    )


    fake_segment_ratio = (

        high_fake_segments /
        analyzed_segments

    ) * 100


    # ======================================================
    # MODERATE FAKE SEGMENTS
    # ======================================================

    suspicious_segments = sum(

        1
        for score in fake_scores
        if score >= 50

    )


    suspicious_segment_ratio = (

        suspicious_segments /
        analyzed_segments

    ) * 100


    # ======================================================
    # FINAL AUDIO SCORE
    #
    # Mean captures the overall signal.
    #
    # Median prevents one unusual segment from dominating.
    #
    # High-confidence segment ratio captures repeated
    # synthetic evidence.
    # ======================================================

    consistency_score = min(
        fake_segment_ratio * 2.0,
        100.0
    )


    raw_final_fake = (

        mean_fake * 0.45
        + median_fake * 0.25
        + consistency_score * 0.30

    )


    raw_final_fake = max(
        0.0,
        min(
            100.0,
            raw_final_fake
        )
    )


    audio_reliability = statistics.mean(
        quality["reliability"]
        for quality in quality_scores
    )

    model_agreement = statistics.mean(model_agreement_scores)
    audio_reliability *= model_agreement

    # Avoid false positives from audio outside the model's reliable operating
    # conditions: noisy / mostly inactive clips are pulled toward neutral.
    final_fake = 50.0 + (raw_final_fake - 50.0) * audio_reliability

    final_real = (
        100.0 -
        final_fake
    )


    # ======================================================
    # SEGMENT DETAILS
    # ======================================================

    segment_predictions = []

    for index, fake in enumerate(
        fake_scores
    ):

        real = 100.0 - fake

        segment_predictions.append({

            "segment": index + 1,

            "real_probability": round(
                real,
                2
            ),

            "fake_probability": round(
                fake,
                2
            ),

            "snr_db": quality_scores[index]["snr_db"],

            "active_ratio": quality_scores[index]["active_ratio"],

            "reliability": quality_scores[index]["reliability"],

            "model_agreement": round(model_agreement_scores[index], 3)

        })


    # ======================================================
    # RETURN
    # ======================================================

    return {

        "real_probability": round(
            final_real,
            2
        ),

        "fake_probability": round(
            final_fake,
            2
        ),

        "raw_fake_probability": round(
            raw_final_fake,
            2
        ),

        "audio_reliability": round(
            audio_reliability,
            3
        ),

        "model_agreement": round(
            model_agreement,
            3
        ),

        "mean_fake_probability": round(
            mean_fake,
            2
        ),

        "median_fake_probability": round(
            median_fake,
            2
        ),

        "high_fake_segments":
            high_fake_segments,

        "fake_segment_ratio": round(
            fake_segment_ratio,
            2
        ),

        "suspicious_segments":
            suspicious_segments,

        "suspicious_segment_ratio": round(
            suspicious_segment_ratio,
            2
        ),

        "segments_analyzed":
            analyzed_segments,

        "segment_predictions":
            segment_predictions
    }
