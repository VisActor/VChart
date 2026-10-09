"""原始二分类样本交接；无需调用 sklearn 预先生成图表统计结果。"""
import json

labels = [False, False, True, True]
probabilities = [0.1, 0.4, 0.35, 0.8]
curves = [
    {"type": kind, "data": [{"actual": actual, "score": score}
                             for actual, score in zip(labels, probabilities)]}
    for kind in ["rocCurve", "precisionRecallCurve"]
]
curves.append({"type": "calibrationCurve", "data": [
    {"actual": actual, "probability": probability}
    for actual, probability in zip(labels, probabilities)
]})
print(json.dumps(curves, ensure_ascii=False, allow_nan=False, indent=2))
