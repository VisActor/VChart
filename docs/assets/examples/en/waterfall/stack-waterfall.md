---
category: demo
group: waterfall
title: Stacked Waterfall Chart
keywords: waterfall, comparison, distribution, rectangle
order: 18-3
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/waterfall/stack-waterfall.png
option: waterfallChart
---

# Stacked Waterfall Chart

A stacked effect can be created by having multiple data for an `x` value.

## Key Configuration

- `seriesField` configures the data grouping field

## Demo source

```javascript livedemo
const spec = {
  type: 'waterfall',
  data: {
    id: 'id0',
    values: [
      { x: 'First quarter', y: 10954, type: 'primary industry' },
      { x: 'First quarter', y: 106187, type: 'Secondary industry' },
      { x: 'First quarter', y: 153037, type: 'tertiary industry' },
      { x: 'Second quarter', y: 18183, type: 'Primary industry' },
      { x: 'Second quarter', y: 122450, type: 'Secondary industry' },
      { x: 'second quarter', y: 151831, type: 'tertiary industry' },
      { x: 'Third Quarter', y: 25642, type: 'Primary Industry' },
      { x: 'Third Quarter', y: 121553, type: 'Secondary Industry' },
      { x: 'third quarter', y: 160432, type: 'tertiary industry' },
      { x: 'fourth quarter', y: 33497, type: 'primary industry' },
      { x: 'Fourth Quarter', y: 132601, type: 'Secondary Industry' },
      { x: 'fourth quarter', y: 169411, type: 'tertiary industry' },
      { x: 'full year', total: true }
    ]
  },
  legends: { visible: true, orient: 'bottom' },
  xField: 'x',
  yField: 'y',
  seriesField: 'type',
  total: {
    type: 'field',
    tagField: 'total'
  },
  stackLabel: {
    valueType: 'change'
  },
  title: {
    visible: true,
    text: 'Chinese quarterly GDP in 2022'
  },
  axes: [
    {
      orient: 'left',
      title: { visible: true, text: 'Unit: 100 million yuan' }
    },
    {
      orient: 'bottom',
      label: { visible: true },
      type: 'band',
      paddingInner: 0.4,
      title: { visible: false }
    }
  ]
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();

// 只为了方便控制台调试用,不要拷贝
window['vchart'] = vchart;
```

## Related Tutorials

[Waterfall Chart](link)
