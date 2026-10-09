# Skill 生成协议

先确定分析问题、实际持有的数据与区间含义，再生成最小语义 JSON。按契约提交原始样本或外部模型结果，不让模型猜测区间含义。

1. 从 [28 类目录](catalog.md) 选择 type。
2. 读取 `schema/plots/<type>.schema.json` 和对应逐图文档，避免把全部 VChart 选项送入生成上下文。
3. 计算端输出固定语义字段；只选择分析问题所需的图表选项。histogram 直接传单分布原始 `{value}` 观测与可选 binning.binCount，不生成 binStart/binEnd/count/series。hexbinPlot 直接传原始 x/y 散点与可选 binning.xBins，计数和顶点由库生成，不要求模型构造几何。pairPlot 传 variables 和 data.observations，不生成 data.diagonal 或 count；diagonal 可省略，明确要求调整箱数/关闭分布时才填写。
4. 调用 `validateStatPlot`，按错误 path 修正；不能静默换图或丢弃错误数据。
5. 调用 `compileStatPlot`，由已注册的同版本 VChart 渲染。
6. 保存原始 JSON、方法说明及外部计算元数据，便于复现。

配色默认省略 `colors`。需要统一报告配色时，复用 `{"categorical":"colorblind","sequential":"viridis","diverging":"RdBu_r"}`，不为每类图重新猜色号。用户指定业务配色时可使用 `#RRGGBB` 数组；角色规则与支持名称见[公共配色](colors.md)。`theme` 只决定深浅外观，不能通过更换颜色表达未经输入提供的统计意义。

## 典型错误

```json
{ "type": "rocCurve", "data": [{ "x": 0.1, "y": 0.8 }] }
```

会报结构错误，应使用布尔 actual 与有限 score。`{"type":"rocCurve","data":[{"actual":true,"score":"0.8"}]}` 的错误指向 `/data/0/score`；这应回到计算端检查，不能把概率裁剪到 1。

若 lower/upper 缺少 interval，不自动填写 confidence/0.95。histogram 当前只计算等宽箱数；只有预分箱结果或需要自定义不等宽边界时使用 VChart 原生 histogram。若没有观测 id，先让计算端生成稳定标识再请求蜂群或配对图。

参考实现均在 `examples/specs`，每份都由 CI 校验。图表输出仅提供视觉证据，报告解释应区分描述、统计推断和因果结论。

## 名称与变体选择

先读取 [机器可读目录](plot-catalog.json)，按 useWhen/avoidWhen 选择图表，再根据 variants 的 aliases 和 options 选择变体。每个 Spec 仅接受一个规范 type，不把自然语言别名直接填入 JSON。

- 普通蜂群：stripPlot + layout=swarm；SHAP 蜂群：shapBeeswarmPlot。
- 偏自相关：autocorrelationPlot + method=pacf。
- 类别比例：countPlot + statistic=proportion，输入为原始类别观测，默认全表比例，系列内比例需 normalizationScope=series。
- UMAP：embeddingPlot + method=umap；仅说 PCA 时须明确得分、解释方差还是载荷。
- 配对前后：pairedComparisonPlot；多变量两两关系：pairPlot。
- 训练规模学习曲线：learningCurve；epoch–loss 不属于这一契约。

fieldLabels 为展示文字；区间含义、计算方法、统计量和顺序需要由分析结果确定，不从名称猜测。旧 JSON 的迁移见 [迁移表](naming-migration.md)。

仓库中的 chart-intents.json 是 89 条选型预期，check:catalog 只检查预期与可执行契约的一致性，未执行模型命中率评测。

分类评估直接输出原始标签/分数（calibration 使用 probability）；QQ、ACF 输出原始 value/series。无需模型生成阈值、AP、AUC、分位数、滞后系数或置信带。

missingValueMatrix 与 correlationMatrix 提交 variables/data.observations，不输出掩码或系数矩阵。pointIntervalPlot 必填 input=observations/estimates，原始样本默认 mean + 95% bootstrap，外部区间要求明确 interval；scatterPlot 的 fit.input=observations 直接拟合原始 x/y，estimates 展示外部曲线；residualPlot 优先使用 observations 的原始 x/y，predictions 的 actual/fittedValue 或 residuals 用于外部模型结果；learningCurve 使用 folds 的各折分数或 summaries 的已有汇总。未知模式和混入字段应回到输入契约修正，不通过自动推断掩盖。

回归请求用 method=linear/polynomial/lowess，不能生成伪造的 fit.data 或 fittedValue。拟合模型与残差 smooth 趋势独立；LOWESS 不请求内部置信带。纯 scatterplot 不自动添加 fit，regplot 请求再明确内部拟合。原始残差默认原始 x 横轴，保留外部模式的拟合值横轴。
