---
category: examples
group: bar chart
title: Locking Categories on a Column Chart Axis
keywords: barChart,category,domain,legend,lockStatisticsByDomain
cover: /vchart/preview/bar-lock-statistics-by-domain.png
option: barChart
---

# Locking Categories on a Column Chart Axis

The `category` field has `domain: ['C', 'B', 'A']`. The data contains only `A` and `B`, in Group 1 and Group 2, respectively.

Change `data.fields.category.lockStatisticsByDomain` in the demo and click **Group 2** in the legend. The category axis shows these values from left to right.

| Setting | Initial axis | After hiding Group 2 |
| --- | --- | --- |
| `false` (default) | A, B | A |
| `true` | C, B, A | C, B, A |
| `'onlyFull'` | B, A | A |

With `true`, `C` always has a position on the axis. Hiding Group 2 removes the bar for `B` and preserves its axis position.

## Live demo

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
      { category: 'A', group: 'Group 1', value: 10 },
      { category: 'B', group: 'Group 2', value: 20 }
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
