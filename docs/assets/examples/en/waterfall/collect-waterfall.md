---
category: demo
group: waterfall
title: Decomposition Waterfall Chart
keywords: waterfall,comparison,distribution,rectangle
order: 18-1
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/waterfall/collect-waterfall.png
option: waterfallChart
---

# Decomposition Waterfall Chart

You can use `total.collectCountField` to perform partial data aggregation, which can be used to display the total information of a certain stage.

## Key option

- `total.collectCountField` configures the total calculation, including the data of the first n dimension values.

## Demo source

```javascript livedemo
const spec = {
  type: 'waterfall',
  data: [
    {
      id: 'id0',
      values: [
        { x: 'First quarter-primary industry', y: 10954, type: 'primary industry' },
        { x: 'First Quarter-Secondary Industry', y: 106187, type: 'Secondary Industry' },
        { x: 'First quarter-tertiary industry', y: 153037, type: 'tertiary industry' },
        { x: 'First quarter', total: true, collect: 3 },
        { x: 'Second Quarter-Primary Industry', y: 18183, type: 'Primary Industry' },
        { x: 'Second Quarter-Second Industry', y: 122450, type: 'Second Industry' },
        { x: 'Second Quarter-Tertiary Industry', y: 151831, type: 'Tertiary Industry' },
        { x: 'Second quarter', total: true, collect: 3 },
        { x: 'Third Quarter-Primary Industry', y: 25642, type: 'Primary Industry' },
        { x: 'Third Quarter-Second Industry', y: 121553, type: 'Second Industry' },
        { x: 'Third quarter-tertiary industry', y: 160432, type: 'tertiary industry' },
        { x: 'Third Quarter', total: true, collect: 3 },
        { x: 'Fourth Quarter-Primary Industry', y: 33497, type: 'Primary Industry' },
        { x: 'Fourth Quarter-Secondary Industry', y: 132601, type: 'Secondary Industry' },
        { x: 'Fourth quarter-tertiary industry', y: 169411, type: 'tertiary industry' },
        { x: 'four quarters', total: true, collect: 3 },
        { x: 'full year', total: true }
      ]
    }
  ],
  xField: 'x',
  yField: 'y',
  seriesField: 'type',
  total: {
    type: 'field',
    tagField: 'total',
    startField: 'start',
    valueField: 'value',
    collectCountField: 'collect'
  },
  stackLabel: {
    valueType: 'change'
  },
  title: {
    visible: true,
    text: 'Chinese quarterly GDP in 2022'
  },
  legends: { visible: true, orient: 'bottom' },
  axes: [
    { orient: 'left', title: { visible: true, text: 'unit: 100 million yuan' } },
    {
      orient: 'bottom',
      label: {
        visible: true,
        formatMethod: text => {
          const arr = text.split('-');
          return arr[arr.length - 1];
        }
      },
      type: 'band',
      paddingInner: 0.4
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
