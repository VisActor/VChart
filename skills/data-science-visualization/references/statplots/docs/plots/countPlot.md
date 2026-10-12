# 类别计数图 `countPlot`

`data: [{category, series?}]`，每行是一条类别观测，重复类别分别计数。不接受 count、proportion 或权重。

## 计算与配置

- `statistic` 默认 `count`，可选 `proportion`。
- 比例默认 `normalizationScope: "all"`，分母是全表观测数；`"series"` 以对应系列样本数为分母。仅比例模式可指定该配置。
- 类别、系列保留首次出现顺序。分组数据补齐类别 × 系列交叉的零计数，缺失类别不会挤走其他柱。
- 不计算均值或其他汇总；任意数值柱图使用 VChart 原生 bar。

## 示例

```json
{
  "type": "countPlot",
  "data": [
    {
      "category": "A"
    },
    {
      "category": "A"
    },
    {
      "category": "A"
    },
    {
      "category": "B"
    },
    {
      "category": "B"
    },
    {
      "category": "C"
    }
  ]
}
```

[分图 Schema](../../schema/plots/countPlot.schema.json) · [主例](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/examples/specs/countPlot.json) · [公共配置](../spec.md)。输入保持不可变，空数据显示空态；更新重新调用 `compileStatPlot(nextSpec)` 后执行 `chart.updateSpec`。内部绘图结果不是可传回的公共输入。
