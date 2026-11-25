---
category: examples
group: bar chart
title: 柱状图锁定分类轴类别
keywords: barChart,category,domain,legend,lockStatisticsByDomain
cover: /vchart/preview/bar-lock-statistics-by-domain.png
option: barChart
---

# 柱状图锁定分类轴类别

为分类字段 `category` 设置 `domain: ['C', 'B', 'A']`。数据中只有 `A` 和 `B`，分别属于第一组和第二组。

修改示例中的 `data.fields.category.lockStatisticsByDomain`，运行后点击图例中的「第二组」。三种配置下，分类轴从左到右显示的类别如下。

| 配置 | 初始显示 | 隐藏第二组后 |
| --- | --- | --- |
| `false`（默认） | A、B | A |
| `true` | C、B、A | C、B、A |
| `'onlyFull'` | B、A | A |

使用 `true` 时，`C` 始终有轴位置。隐藏第二组后，`B` 的柱子消失，轴位置仍然保留。

## 代码演示

```javascript livedemo
const spec = {
  type: 'bar',
  animation: false,
  data: {
    fields: {
      category: {
        type: 'ordinal',
        domain: ['C', 'B', 'A'],
        lockStatisticsByDomain: true
      }
    },
    values: [
      { category: 'A', group: '第一组', value: 10 },
      { category: 'B', group: '第二组', value: 20 }
    ]
  },
  xField: 'category',
  yField: 'value',
  seriesField: 'group',
  axes: [
    { orient: 'bottom', type: 'band' },
    { orient: 'left', type: 'linear' }
  ],
  legends: { visible: true }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();
```
