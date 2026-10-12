# 混淆矩阵 `confusionMatrix`

`data: [{actual, predicted}]`，每行一个样本的实际类别、预测类别，均为非空字符串。不支持 series。

## 计算与配置

- 可选 `classOrder` 非空、无重复，覆盖所有实际及预测类别；允许声明未出现的类别。不提供时取两个字段中首次出现顺序。
- 生成完整类别方阵，未出现组合计数为 0。默认 `normalization: "none"`；`actual` 按实际类别总数、`predicted` 按预测类别总数、`all` 按总样本数。
- 零分母用 null / NA 显示，不能替换成 0。Tooltip 保留原始计数和归一化结果。
- 不接收旧 count，不能从归一化矩阵恢复观测。

## 默认显示与解读

- 与相关矩阵共用方形布局和静态色条。单元格为正方形、紧密排列，以主题背景色的 1 CSS px 边界分隔；宽容器外侧留白，格子不横向拉伸。
- x 为预测类别，y 为实际类别；两轴使用相同类别顺序，y 从上到下排列。隐藏轴线和刻度短线，保留类别标签及“预测类别／实际类别”标题；fieldLabels 可修改这些名称。
- `none` 显示整数计数；`actual` 每行以本行实际样本数为分母，`predicted` 每列以本列预测样本数为分母，`all` 以全部样本数为分母。三种归一化模式的格内文字显示一位小数百分比。
- 色条最大值在上、最小值在下，不提供拖动或筛选控件。默认使用 sequential 的 viridis 色板：计数范围为 0 到当前最大单元格计数（上限至少为 1），比例范围固定为 0%～100%。色条标题采用 fieldLabels.count / proportion，默认“计数／比例”；自定义顺序色板与格子共用同一颜色映射。
- 灰格 `NA` 表示分母为零、比例不可计算，区别于有效比例 0%；计数模式中没有观测的组合仍为 0。Tooltip 保留原始计数及归一化结果，不因显示百分比改变底层数值。
- 小矩阵显示全部数值，密集时标签自动避让；单元格和数据仍完整保留，可用 Tooltip 查看。空数据保留空态，不生成色条或伪计数格。

[主例](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/examples/specs/confusionMatrix.json) 展示三个都有实际样本的类别，每行合计 100%。[空类别变体](../../examples/specs/variants/confusionMatrix-actual.json) 专门展示 classOrder 声明 C 类但没有实际 C 样本时，整行归一化结果为 NA 的区别。

## 示例

```json
{
  "type": "confusionMatrix",
  "data": [
    {
      "actual": "A",
      "predicted": "A"
    },
    {
      "actual": "A",
      "predicted": "B"
    },
    {
      "actual": "A",
      "predicted": "B"
    },
    {
      "actual": "B",
      "predicted": "B"
    }
  ]
}
```

[分图 Schema](../../schema/plots/confusionMatrix.schema.json) · [主例](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/examples/specs/confusionMatrix.json) · [公共配置](../spec.md)。输入保持不可变，空数据显示空态；更新重新调用 `compileStatPlot(nextSpec)` 后执行 `chart.updateSpec`。内部绘图结果不是可传回的公共输入。
