"""Metrics and threshold selection for audio deepfake evaluation."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Iterable

from sklearn.metrics import accuracy_score, average_precision_score, precision_recall_fscore_support, roc_auc_score


@dataclass(frozen=True)
class ThresholdMetrics:
    threshold: float
    accuracy: float
    precision: float
    recall: float
    f1: float
    false_positive_rate: float
    false_negative_rate: float


def evaluate_threshold(labels: Iterable[int], scores: Iterable[float], threshold: float) -> ThresholdMetrics:
    """Evaluate fake=1 labels and 0-100 fake-probability scores at a threshold."""
    y_true = list(labels)
    y_score = list(scores)
    y_pred = [int(score >= threshold) for score in y_score]

    precision, recall, f1, _ = precision_recall_fscore_support(
        y_true, y_pred, average="binary", zero_division=0
    )
    negatives = sum(label == 0 for label in y_true)
    positives = sum(label == 1 for label in y_true)
    false_positives = sum(label == 0 and prediction == 1 for label, prediction in zip(y_true, y_pred))
    false_negatives = sum(label == 1 and prediction == 0 for label, prediction in zip(y_true, y_pred))

    return ThresholdMetrics(
        threshold=threshold,
        accuracy=accuracy_score(y_true, y_pred),
        precision=precision,
        recall=recall,
        f1=f1,
        false_positive_rate=false_positives / negatives if negatives else 0.0,
        false_negative_rate=false_negatives / positives if positives else 0.0,
    )


def evaluate_scores(labels: Iterable[int], scores: Iterable[float], thresholds: Iterable[float]) -> dict:
    """Return threshold metrics plus threshold-independent quality metrics."""
    y_true = list(labels)
    y_score = list(scores)
    if not y_true or len(y_true) != len(y_score):
        raise ValueError("labels and scores must be non-empty lists of equal length")
    if len(set(y_true)) != 2:
        raise ValueError("evaluation data must contain both real (0) and fake (1) examples")

    threshold_results = [evaluate_threshold(y_true, y_score, threshold) for threshold in thresholds]
    if not threshold_results:
        raise ValueError("at least one threshold is required")

    best = max(threshold_results, key=lambda result: (result.f1, result.recall, -result.false_positive_rate))
    return {
        "samples": len(y_true),
        "real_samples": sum(label == 0 for label in y_true),
        "fake_samples": sum(label == 1 for label in y_true),
        "roc_auc": roc_auc_score(y_true, y_score),
        "average_precision": average_precision_score(y_true, y_score),
        "recommended_threshold": best.threshold,
        "recommended_metrics": asdict(best),
        "threshold_metrics": [asdict(result) for result in threshold_results],
    }
