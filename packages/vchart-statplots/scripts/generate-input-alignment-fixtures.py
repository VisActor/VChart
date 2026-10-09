"""离线 Python 对照；固定版本，不作为 JavaScript 测试运行依赖。"""
import json
import platform
from pathlib import Path
import numpy as np
import scipy
from scipy import stats
import pandas as pd
import sklearn
from sklearn.model_selection import LearningCurveDisplay

versions = dict(numpy=np.__version__, scipy=scipy.__version__, pandas=pd.__version__, sklearn=sklearn.__version__)
assert versions == dict(numpy="1.26.4", scipy="1.13.1", pandas="2.2.2", sklearn="1.5.2"), versions
cases = []
for rows in [
    [[1, 2, 5], [2, None, 5], [3, 2, 5], [4, 3, 5], [5, 4, 5]],
    [[1, 1, 5], [1, 2, 5], [2, 3, 5], [None, 4, 5]],
    [[1, 1, 5], [2, None, 5], [None, 3, 5], [4, 4, 5]],
]:
    frame = pd.DataFrame(rows, columns=["A", "B", "常量"])
    for method in ["pearson", "spearman", "kendall"]:
        expected = []
        for a in frame.columns:
            for b in frame.columns:
                pair = frame[[a, b]].dropna().to_numpy()
                if len(pair) < 2 or np.ptp(pair[:, 0]) == 0 or np.ptp(pair[:, 1]) == 0:
                    value = None
                elif method == "kendall":
                    value = float(stats.kendalltau(pair[:, 0], pair[:, 1], variant="b").statistic)
                else:
                    value = float(pd.Series(pair[:, 0]).corr(pd.Series(pair[:, 1]), method=method))
                expected.append(dict(row=a, column=b, correlation=value, sampleCount=len(pair)))
        cases.append(dict(
            spec=dict(
                type="correlationMatrix",
                variables=list(frame.columns),
                method=method,
                data=dict(observations=[
                    dict(id=str(i), values=dict(zip(frame.columns, row)))
                    for i, row in enumerate(rows)
                ]),
            ),
            expected=expected,
        ))


def resample(values, estimator, count=1000, seed=7):
    output = []
    for _ in range(count):
        sample = []
        for _ in values:
            seed = (1664525 * seed + 1013904223) % 2**32
            sample.append(values[int(seed / 2**32 * len(values))])
        output.append(float(estimator(sample)))
    return np.asarray(output)


values = np.asarray([1., 2., 4., 7., 10.])
for name, estimator in [("mean", np.mean), ("median", np.median)]:
    for kind in ["confidence", "percentile", "standardDeviation", "standardError", "range", False]:
        if name == "median" and kind == "standardError":
            continue
        estimate = float(estimator(values))
        lower = upper = None
        bar = False if kind is False else dict(kind=kind)
        if kind in ["confidence", "percentile"]:
            distribution = resample(values, estimator) if kind == "confidence" else values
            lower, upper = map(float, np.quantile(distribution, [.025, .975], method="linear"))
            if kind == "confidence":
                bar.update(resamples=1000, seed=7)
        elif kind in ["standardDeviation", "standardError"]:
            width = float(np.std(values, ddof=1)) / (np.sqrt(len(values)) if kind == "standardError" else 1)
            lower, upper = estimate - width, estimate + width
        elif kind == "range":
            lower, upper = float(values.min()), float(values.max())
        cases.append(dict(
            spec=dict(
                type="pointIntervalPlot",
                input="observations",
                estimator=name,
                errorBar=bar,
                data=[dict(category="A", value=float(v)) for v in values],
            ),
            expected=[dict(
                category="A", estimate=estimate, lower=lower, upper=upper, sampleCount=len(values)
            )],
        ))

train = np.array([[.9, .95, .99], [.8, .85, .89]])
validation = np.array([[.5, .6, .7], [.7, .8, .9]])
display = LearningCurveDisplay(train_sizes=np.array([50, 100]), train_scores=train, test_scores=validation)
expected = []
data = []
for split, scores in [("train", display.train_scores), ("validation", display.test_scores)]:
    for size, folds in zip(display.train_sizes, scores):
        center = float(folds.mean())
        sd = float(folds.std(ddof=0))
        expected.append(dict(
            trainSize=int(size), split=split, score=center, lower=center-sd, upper=center+sd,
            foldCount=len(folds), standardDeviation=sd,
        ))
        data += [
            dict(trainSize=int(size), split=split, fold=str(i), score=float(score))
            for i, score in enumerate(folds)
        ]
cases.append(dict(
    spec=dict(type="learningCurve", input="folds", metric="Accuracy", data=data[::-1]),
    expected=sorted(expected, key=lambda r: (r["trainSize"], r["split"])),
))

path = Path(__file__).resolve().parents[1] / "__tests__/fixtures/input-alignment-python.json"
path.write_text(json.dumps(
    dict(python=platform.python_version(), versions=versions, absoluteTolerance=5e-8, cases=cases),
    ensure_ascii=False, indent=2, allow_nan=False,
) + "\n")
print(f"{len(cases)} Python fixtures generated")
