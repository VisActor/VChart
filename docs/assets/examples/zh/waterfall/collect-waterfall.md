---
category: demo
group: waterfall
title: 分解瀑布图
keywords: waterfall,comparison,distribution,rectangle
order: 18-1
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/waterfall/collect-waterfall.png
option: waterfallChart
---

# 分解瀑布图

可以通过 `total.collectCountField` 对部分数据进行总计，可以用于展示某阶段的总计信息。

## 关键配置

- `total.collectCountField` 配置总计计算，计算包含前 n 个维度值数据

## 代码演示

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

## 相关教程

[瀑布图](link)
