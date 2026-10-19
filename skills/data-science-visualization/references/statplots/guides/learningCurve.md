# 学习曲线 `learningCurve`

[TS 类型](../types/plots/learning-curve/types.d.ts) · [最小输入](../examples/specs/minimal/learningCurve.json) · [公共约束](common.md)

比较训练规模变化时的训练与验证分数。metric 必填，模型训练和打分由调用方完成。

## 两种输入

`input: "folds"`：data 为 `{trainSize, fold, split, score, series?}[]`。split 为 train/validation，fold 为非空字符串；按模型、训练规模、split 汇总均值和总体标准差（ddof=0），默认绘制均值 ± 1 SD，spread.multiplier 可指定正倍数，spread=false 关闭带。

每组至少两折，同一模型在全部训练规模及 split 上保持相同 fold 集合，重复 trainSize/fold/split/series 会拒绝。trainSize 为正整数，score 有限；输入可无序，生成结果按 trainSize 排序。不会把失败折当作 0，不裁剪指标或带到 [0,1]。Tooltip 显示折数与总体标准差。

`input: "summaries"`：data 为 `{trainSize, split, score, lower?, upper?, series?}[]`，保留已有汇总语义。原序列每组 trainSize 严格递增；上下界同时提供，满足 lower ≤ score ≤ upper，有边界时 interval 必填。禁止 spread。

带表示折间离散程度，不冒充置信区间。
