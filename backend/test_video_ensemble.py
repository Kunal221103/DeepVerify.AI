from ai.video_ensemble import combine_visual_scores


def test_aligned_fourth_model_gets_full_weight():
    result = combine_visual_scores(40.0, 60.0, 55.0)

    assert result["model4_status"] == "aligned"
    assert result["model4_weight"] == 0.25


def test_outlier_fourth_model_is_excluded():
    result = combine_visual_scores(10.0, 20.0, 95.0)

    assert result["model4_status"] == "excluded_outlier"
    assert result["model4_weight"] == 0.0
    assert result["fake_probability"] == 17.333333333333332
