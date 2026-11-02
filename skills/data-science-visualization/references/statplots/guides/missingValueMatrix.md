# 缺失值矩阵 `missingValueMatrix`

[TS 类型](../types/plots/missingness/types.d.ts) · [最小输入](../examples/specs/minimal/missingValueMatrix.json) · [公共约束](common.md)

从原始表格检查每条观测各变量的缺失位置。

## 输入与计算

必填 `variables: string[]` 与 `data: {observations: [{id, values}]}`。variables 非空、唯一，定义列顺序；id 为非空唯一字符串，行顺序沿用输入。每行 values 必须恰好包含 variables 的所有键，值可为有限数字、字符串、布尔值或 null。

显式 `null` 是唯一缺失标记。`0`、`false` 和空字符串均为已观测；缺少键、undefined、NaN、Infinity 会拒绝。编译时生成完整网格，Tooltip 只展示观测、变量及状态。保持矩形密集网格，适合观测数与变量数不相等的表格；空观测显示空态。
