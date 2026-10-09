# 相关矩阵图 `correlationMatrix`

比较多个变量的相关方向和强度。

`correlation` 为 [-1, 1] 或 null；输入矩阵必须完整对称。非 null 的对角系数为 1；常量等无法计算的变量可用 null 表示。`variableOrder` 恰好包含每个变量一次。

`triangle` 仅影响显示，默认 full；lower 和 upper 都包含对角线，输入仍须完整矩阵。x/y 都是离散变量轴，使用相同顺序，y 从上向下排列。

## 默认显示与解读

- 单元格为正方形，紧密排列，以主题背景色的 1 CSS px 细边界分隔。矩阵大小根据标题、轴标签及右侧色条的占位自适应；宽容器中矩阵外侧会有留白，格子不会被横向拉伸。
- 与混淆矩阵共用方形布局、矩阵轴样式和静态色条；本图仍使用 [-1, 1] 发散色标，混淆矩阵使用非负计数／比例的顺序色标。
- 隐藏轴线及刻度短线，保留变量名称。小矩阵显示两位小数，文字颜色随底色自动调整；密集时文字及轴标签自动避让，单元格和数据仍完整保留，可通过 Tooltip 查看值。
- 静态色条固定为 [-1, 1]，正值在上、负值在下、零点居中，显示五个刻度。名称按 method 显示 Pearson r、Spearman ρ 或 Kendall τ；方法是调用方提供的元数据，本包不重新计算。
- 默认 `RdBu_r` 色板为负值蓝、零附近浅色、正值红。正负表示方向，绝对值表示相关强度；颜色映射不随当前数据的最大值变化，便于比较不同矩阵。
- 灰格的 `NA` 表示不可计算，区别于数值 0；常量列的相关系数（包括自身）可为 NA。三角遮罩区域的空白表示未显示，区别于灰色 NA。

`colors.diverging` 支持命名色板或自定义数组。数组从 -1 到 +1 排列，色条和单元格共用同一映射；自定义后应按实际色条解读，不能继续假定红色一定为正。

```json
{
  "type": "correlationMatrix",
  "method": "pearson",
  "triangle": "lower",
  "variableOrder": ["年龄", "收入"],
  "colors": { "diverging": "RdBu_r" },
  "data": [
    { "row": "年龄", "column": "年龄", "correlation": 1 },
    { "row": "年龄", "column": "收入", "correlation": 0.42 },
    { "row": "收入", "column": "年龄", "correlation": 0.42 },
    { "row": "收入", "column": "收入", "correlation": 1 }
  ]
}
```

## 输入与配置

语义输入字段：`row`、`column`、`correlation`。字段、必填项和单位以 [JSON Schema](../../schema/plots/correlationMatrix.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`method`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/correlationMatrix.json)；[完整主例](../../examples/specs/correlationMatrix.json)。

[上三角与 NA](../../examples/specs/variants/correlationMatrix-upper.json)；[正负与零的合成显示示例](../../examples/specs/variants/correlationMatrix-signed.json)。可以复制这些 JSON 到图库编辑器预览。

## 选型边界

- 任意数值矩阵不属于相关矩阵，不能将无界数值映射成相关系数。
- 缺失状态应使用 missingValueMatrix。
- 相关系数不表示因果关系；没有显著性或样本量信息时，不能仅凭颜色判断统计证据强弱。
