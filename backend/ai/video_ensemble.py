"""Consensus-aware weighting for the optional fourth video detector."""


MODEL_2_WEIGHT = 0.20
MODEL_3_WEIGHT = 0.55
MODEL_4_MAX_WEIGHT = 0.25

# These are safety gates, not accuracy claims. Calibrate them against the
# labeled video benchmark before changing production policy.
FULL_WEIGHT_GAP = 20.0
EXCLUDE_GAP = 45.0


def combine_visual_scores(model2_fake, model3_fake, model4_fake=None):
    """Blend visual scores while preventing an unvalidated outlier from dominating.

    Model 4 gets its full weight when it broadly agrees with the established
    Model 2/3 consensus. Its influence is linearly reduced for partial
    disagreement and becomes zero for an extreme disagreement.
    """
    baseline_weight = MODEL_2_WEIGHT + MODEL_3_WEIGHT
    baseline = (
        model2_fake * MODEL_2_WEIGHT
        + model3_fake * MODEL_3_WEIGHT
    ) / baseline_weight

    if model4_fake is None:
        return {
            "fake_probability": baseline,
            "model4_weight": 0.0,
            "model4_consensus_gap": None,
            "model4_status": "unavailable",
        }

    gap = abs(model4_fake - baseline)
    if gap <= FULL_WEIGHT_GAP:
        model4_weight = MODEL_4_MAX_WEIGHT
        status = "aligned"
    elif gap >= EXCLUDE_GAP:
        model4_weight = 0.0
        status = "excluded_outlier"
    else:
        retained_fraction = (EXCLUDE_GAP - gap) / (EXCLUDE_GAP - FULL_WEIGHT_GAP)
        model4_weight = MODEL_4_MAX_WEIGHT * retained_fraction
        status = "downweighted"

    total_weight = baseline_weight + model4_weight
    combined = (
        model2_fake * MODEL_2_WEIGHT
        + model3_fake * MODEL_3_WEIGHT
        + model4_fake * model4_weight
    ) / total_weight
    return {
        "fake_probability": combined,
        "model4_weight": model4_weight,
        "model4_consensus_gap": gap,
        "model4_status": status,
    }
