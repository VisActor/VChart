"""离线对照：numpy 1.26.4 / scipy 1.13.1 / sklearn 1.5.2 / statsmodels 0.14.4。

运行 python scripts/generate-raw-input-fixtures.py；JS 测试直接读取生成的 JSON。
"""
import json
from pathlib import Path

import numpy as np
import scipy
from scipy import stats
import sklearn
from sklearn.metrics import roc_curve, roc_auc_score, precision_recall_curve, average_precision_score
from sklearn.calibration import calibration_curve
import statsmodels
from statsmodels.graphics.gofplots import ProbPlot
from statsmodels.tsa.stattools import acf, pacf

versions = {"numpy": np.__version__, "scipy": scipy.__version__, "sklearn": sklearn.__version__, "statsmodels": statsmodels.__version__}
expected_versions = {"numpy": "1.26.4", "scipy": "1.13.1", "sklearn": "1.5.2", "statsmodels": "0.14.4"}
assert versions == expected_versions, versions
cases = []
score_inputs = [([False, False, True, True], [0.1, 0.4, 0.35, 0.8]),
                ([True, False], [-2, -2]),
                ([False, True, False, True, True, False], [8, 8, -2, 4, 4, 3])]
for actual, scores in score_inputs:
    data = [{"actual": a, "score": s} for a, s in zip(actual, scores)]
    fpr, tpr, thresholds = roc_curve(actual, scores, drop_intermediate=False)
    cases.append({"spec": {"type": "rocCurve", "data": data},
                  "expected": {"points": np.column_stack((fpr, tpr)).tolist(), "metric": roc_auc_score(actual, scores),
                               "thresholds": [None if not np.isfinite(t) else float(t) for t in thresholds]},
                  "parameters": {"drop_intermediate": False, "pos_label": True}})
    precision, recall, thresholds = precision_recall_curve(actual, scores, drop_intermediate=False)
    cases.append({"spec": {"type": "precisionRecallCurve", "data": data},
                  "expected": {"points": np.column_stack((recall[::-1], precision[::-1])).tolist(),
                               "metric": average_precision_score(actual, scores), "thresholds": [None] + thresholds[::-1].tolist()},
                  "parameters": {"drop_intermediate": False, "pos_label": True}})

for actual, probabilities in [([False, True, False, True], [0, 0.5, 0.5, 1]),
                              ([True, True, False, False], [0.5] * 4),
                              ([False, False, True, True, False, True], [0, 0.1, 0.1, 0.6, 0.9, 1])]:
    for strategy in ["uniform", "quantile"]:
        observed, predicted = calibration_curve(actual, probabilities, n_bins=4, strategy=strategy, pos_label=True)
        cases.append({"spec": {"type": "calibrationCurve", "binning": {"binCount": 4, "strategy": strategy},
                               "data": [{"actual": a, "probability": p} for a, p in zip(actual, probabilities)]},
                      "expected": {"points": np.column_stack((predicted, observed)).tolist()},
                      "parameters": {"n_bins": 4, "strategy": strategy, "pos_label": True}})

for data, mean, sd in [([3, 1, 2], 0, 1), ([5, 2, 2, 7, -1, 0], 3, 2), ([4, 4, 4], 0, 1)]:
    model = ProbPlot(np.asarray(data), dist=stats.norm, loc=mean, scale=sd, fit=False, a=0)
    cases.append({"spec": {"type": "qqPlot", "distribution": {"type": "normal", "mean": mean, "standardDeviation": sd},
                           "data": [{"value": v} for v in data]},
                  "expected": {"points": np.column_stack((model.theoretical_quantiles, model.sample_quantiles)).tolist()},
                  "parameters": {"a": 0, "fit": False, "loc": mean, "scale": sd}})

for data in [[1, 3, 2, 5, 4, 7, 1, 6, 3, 8], [0, 3, 1, 5, 2, 7, 4, 8]]:
    for method in ["acf", "pacf"]:
        if method == "acf":
            correlations, confidence = acf(data, nlags=3, adjusted=False, fft=False, alpha=0.05, bartlett_confint=True, missing="raise")
        else:
            correlations, confidence = pacf(data, nlags=3, method="ywm", alpha=0.05)
        cases.append({"spec": {"type": "autocorrelationPlot", "method": method, "maxLag": 3,
                               "data": [{"value": v} for v in data]},
                      "expected": {"correlations": correlations.tolist(), "widths": (confidence[:, 1] - correlations).tolist()},
                      "parameters": {"nlags": 3, "alpha": 0.05, "method": "ywm" if method == "pacf" else "non-adjusted/Bartlett"}})

probabilities = [1e-12, 1e-9, 0.02424, 0.02425, 0.25, 0.5, 0.97575, 0.97576, 1 - 1e-9, 1 - 1e-12]
output = {"versions": versions, "absoluteTolerance": 5e-8, "cases": cases,
          "normalQuantiles": [[p, float(stats.norm.ppf(p))] for p in probabilities]}
path = Path(__file__).resolve().parent.parent / "__tests__/fixtures/raw-input-python.json"
path.write_text(json.dumps(output, ensure_ascii=False, indent=2, allow_nan=False) + "\n")
print(f"{len(cases)} fixtures generated: {path}")
