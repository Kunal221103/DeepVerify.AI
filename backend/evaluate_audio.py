"""Run the current audio detector against a labeled CSV manifest.

Example:
    python evaluate_audio.py --manifest data/audio_eval/manifest.csv --output audio-evaluation.json
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from ai.audio.evaluation import evaluate_scores
from ai.audio.inference import predict


VALID_LABELS = {"real": 0, "fake": 1}


def read_manifest(manifest_path: Path) -> list[dict]:
    with manifest_path.open(newline="", encoding="utf-8-sig") as file:
        rows = list(csv.DictReader(file))
    if not rows or not {"path", "label"}.issubset(rows[0]):
        raise ValueError("manifest must include path and label columns")

    samples = []
    for line_number, row in enumerate(rows, start=2):
        label = row["label"].strip().lower()
        if label not in VALID_LABELS:
            raise ValueError(f"line {line_number}: label must be 'real' or 'fake'")
        audio_path = Path(row["path"].strip())
        if not audio_path.is_absolute():
            audio_path = manifest_path.parent / audio_path
        if not audio_path.is_file():
            raise FileNotFoundError(f"line {line_number}: audio file not found: {audio_path}")
        samples.append({"path": audio_path, "label": VALID_LABELS[label]})
    return samples


def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate DeepVerify's audio detector.")
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--output", type=Path, default=Path("audio-evaluation.json"))
    parser.add_argument("--threshold-step", type=float, default=1.0)
    args = parser.parse_args()
    if not 0 < args.threshold_step <= 100:
        parser.error("--threshold-step must be greater than 0 and at most 100")

    manifest_path = args.manifest.resolve()
    samples = read_manifest(manifest_path)
    records = []
    for index, sample in enumerate(samples, start=1):
        result = predict(str(sample["path"]))
        score = float(result["fake_probability"])
        records.append({"path": str(sample["path"]), "label": sample["label"], "fake_probability": score})
        print(f"[{index}/{len(samples)}] {sample['path'].name}: fake score {score:.2f}")

    thresholds = []
    threshold = 0.0
    while threshold <= 100.0:
        thresholds.append(round(threshold, 6))
        threshold += args.threshold_step
    report = evaluate_scores([record["label"] for record in records], [record["fake_probability"] for record in records], thresholds)
    report["records"] = records

    args.output.write_text(json.dumps(report, indent=2), encoding="utf-8")
    best = report["recommended_metrics"]
    print(f"\nRecommended threshold: {report['recommended_threshold']:.2f}% (F1 {best['f1']:.3f}, precision {best['precision']:.3f}, recall {best['recall']:.3f})")
    print(f"ROC-AUC: {report['roc_auc']:.3f}; report written to {args.output}")


if __name__ == "__main__":
    main()
