# 缺失值矩阵 `missingValueMatrix`

从原始表格检查每条观测各变量的缺失位置。

## 输入与计算

必填 `variables: string[]` 与 `data: {observations: [{id, values}]}`。variables 非空、唯一，定义列顺序；id 为非空唯一字符串，行顺序沿用输入。每行 values 必须恰好包含 variables 的所有键，值可为有限数字、字符串、布尔值或 null。

显式 `null` 是唯一缺失标记。`0`、`false` 和空字符串均为已观测；缺少键、undefined、NaN、Infinity 会拒绝。编译时生成完整网格，Tooltip 只展示观测、变量及状态。保持矩形密集网格，适合观测数与变量数不相等的表格；空观测显示空态。

```json
{"type":"missingValueMatrix","variables":["age","active"],"data":{"observations":[{"id":"001","values":{"age":null,"active":false}},{"id":"002","values":{"age":20,"active":true}}]}}
```

## 迁移与 Python 对照

替换原 `observationId/variable/isMissing` 掩码输入，提供真实 values/null。只持有掩码时使用原生 heatmap，不伪造样本。与 missingno 的原始 DataFrame 入口一致；JSON 仅支持显式 null，不自动执行 pandas 的缺失值归一化。

[最小示例](../../examples/specs/minimal/missingValueMatrix.json)；[Schema](../../schema/plots/missingValueMatrix.schema.json)。
