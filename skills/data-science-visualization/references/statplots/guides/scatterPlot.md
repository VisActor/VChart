# 散点与回归图 `scatterPlot`

[TS 类型](../types/plots/scatter/types.d.ts) · [最小输入](../examples/specs/minimal/scatterPlot.json) · [公共约束](common.md)

`data` 始终为原始 `{x, y, id?, series?}[]`。省略 `fit` 显示纯散点；需要探索性回归时，配置 `fit.input="observations"`，直接从同一份观测拟合。数值必须有限，series 全表提供非空名称或全部省略，重复样本保留。空表为空态，不修改输入。

## 内部拟合

|method|参数|统计含义|
|---|---|---|
|linear|无模型参数|带截距的一元 OLS|
|polynomial|degree 必填，2–5 整数|稳定基底的多项式最小二乘|
|lowess|span 默认 2/3，iterations 默认 3，delta 默认 0|局部线性 LOWESS，残差稳健重加权|

span 在 (0,1]，iterations 为 0–10 整数，delta 为非负有限数、单位与 x 一致。LOWESS 默认全部观测参与，不暗中抽样或减少迭代；delta>0 显式启用观测锚点插值加速。精确 LOWESS 有二次计算成本，大数据可显式选择 delta。

每个 series 独立拟合。非空系列至少两个不同 x，多项式至少 degree+1 个不同 x；主设计矩阵不满秩时报结构化错误，不降次数或画零系数假曲线。常量 y 可画水平线。纯散点不受拟合最低样本限制。

线性/多项式曲线按组内 min/max x 生成网格，不外推；`fit.sampling.points` 默认 100，整数 2–512，只控制显示精度，不改变拟合。LOWESS 使用真实观测 x 的拟合节点，不允许 sampling。

### 均值响应置信带

线性/多项式省略 confidence 默认 95% 成对 percentile bootstrap，1000 次、seed=0；`confidence:false` 关闭置信带。对象为 `{kind:"confidence",level?,resamples?,seed?}`：level 在 (0,1)，resamples 为 100–10000 整数，seed 为 uint32。

每次重采样完整 (x,y) 对并拟合一次，逐网格点取线性插值分位数。这是均值响应的逐点置信带，不是预测区间或同时置信带。bootstrap 秩不足抽样使用原始组固定归一化基底中的最小范数解，不删除或重抽。有效残差自由度不足时（linear N≤2、polynomial N≤degree+1）只画拟合线，Tooltip 提示区间不可计算，不伪造零宽带。

LOWESS 无内部置信带，只允许省略 confidence 或 false。同样本同 seed 可复现，输入行/系列重排不改变结果；不承诺与 NumPy RNG 同 seed 逐点相同。CI 的次数上限不保证任意大样本都能快速同步计算。

## 外部结果与迁移

外部结果使用 `fit.input="estimates"`，保留 `{x,estimate,lower?,upper?,series?}[]`、method 显示名称和现有 Interval。区间端点出现时须有 interval；每系列 x 升序，拟合系列必须对应原始散点。外部方法可展示置信、预测、可信等区间，不重新拟合。

旧 fit 增加 `input:"estimates"`；不按字段形状自动猜测。内部算法不接受外部 fit.data/interval，也不接受其他模型参数。点、线、带共用系列颜色，图例统一筛选。`fieldLabels.x/y` 只改展示名称，不改数据键。
