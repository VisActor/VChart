# 缺失值矩阵图 `missingValueMatrix`

检查每条观测各变量的缺失位置。

必须显式给出所有 observationId×variable 单元格；未提供不代表 isMissing=false。保留输入顺序。

x 轴为变量名，y 轴为观测 ID，均使用离散的 band 分类轴；数字形式的观测 ID 也不会转为连续数值轴。两轴的内、外间距均为 0，单元格紧密铺满绘图区。行之间连续排列，列边界用固定 1 CSS px 的细线分隔，分隔颜色跟随 VChart 原生深浅主题背景。

观测行共享经过设备像素对齐的边界，避免非整数行高导致 Canvas 抗锯齿产生背景色细缝。图表缩放或更新布局时重新计算；各行显示高度最多相差一个设备像素，观测顺序不变。

轴线与刻度短线默认隐藏，保留变量名、观测 ID 和轴标题。观测较少时显示全部标签；空间不足时通过 VChart 原生采样与避让减少标签，不减少单元格或改变观测顺序。公共配色、两类状态图例及逐单元格 Tooltip 继续生效。

当观测数超过绘图区高度所能容纳的设备像素数时，部分观测行会共享同一像素边界，无法逐行辨识；需要逐行查看时请增加图表高度。数据和观测 ID 仍完整保留。

## 输入与配置

语义输入字段：`observationId`、`variable`、`isMissing`。字段、必填项和单位以 [JSON Schema](../../schema/plots/missingValueMatrix.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/missingValueMatrix.json)；[完整主例](../../examples/specs/missingValueMatrix.json)。

```json
{
  "type": "missingValueMatrix",
  "data": [
    { "observationId": "1", "variable": "收入", "isMissing": false },
    { "observationId": "1", "variable": "年龄", "isMissing": true },
    { "observationId": "2", "variable": "收入", "isMissing": false },
    { "observationId": "2", "variable": "年龄", "isMissing": false }
  ]
}
```

紧凑布局是默认行为，无需额外布局配置。

## 选型边界

- 缺失率柱状图
- 缺失相关性矩阵
