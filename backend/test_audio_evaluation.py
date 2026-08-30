from ai.audio.evaluation import evaluate_scores


def test_evaluation_selects_the_separating_threshold():
    report = evaluate_scores(
        labels=[0, 0, 1, 1],
        scores=[10.0, 30.0, 70.0, 90.0],
        thresholds=[20.0, 50.0, 80.0],
    )

    assert report["recommended_threshold"] == 50.0
    assert report["roc_auc"] == 1.0
    assert report["recommended_metrics"]["f1"] == 1.0
