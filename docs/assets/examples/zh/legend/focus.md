---
category: demo
group: legend
title: 聚焦模式
keywords: barChart,comparison,rectangle,legend,distribution,rank
order: 27-1
cover: http://tosv.byted.org/obj/bit-cloud/vchart/preview/legend/focus.png
option: barChart#legends
---

# 聚焦模式

## 关键配置

- `legend.item.focus` 配置聚焦模式
- `defaultSelected` 配置默认选中项
- `allowAllCanceled` 允许全部取消

## 代码演示

```javascript livedemo
const data = [
  { city: 'City A', type: 'fruit', value: 14500 },
  { city: 'City A', type: 'rice', value: 8500 },
  { city: 'City A', type: 'specialty snacks', value: 10000 },
  { city: 'City A', type: 'tea', value: 7000 },
  { city: 'City B', type: 'fruit', value: 9000 },
  { city: 'City B', type: 'rice', value: 8500 },
  { city: 'City B', type: 'specialty snacks', value: 11000 },
  { city: 'City B', type: 'tea', value: 6000 },
  { city: 'City C', type: 'fruit', value: 16000 },
  { city: 'City C', type: 'rice', value: 5000 },
  { city: 'City C', type: 'specialty snacks', value: 6000 },
  { city: 'City C', type: 'tea', value: 10000 },
  { city: 'City D', type: 'fruit', value: 14000 },
  { city: 'City D', type: 'rice', value: 9000 },
  { city: 'City D', type: 'specialty snacks', value: 10000 },
  { city: 'City D', type: 'tea', value: 9000 },
  { city: 'City E', type: 'fruit', value: 14000 },
  { city: 'City E', type: 'rice', value: 9000 },
  { city: 'City E', type: 'specialty snacks', value: 10000 },
  { city: 'City E', type: 'tea', value: 6000 },
  { city: 'City F', type: 'fruit', value: 9000 },
  { city: 'City F', type: 'rice', value: 8500 },
  { city: 'City F', type: 'specialty snacks', value: 10000 },
  { city: 'City F', type: 'tea', value: 6000 },
  { city: 'City G', type: 'fruit', value: 17000 },
  { city: 'City G', type: 'rice', value: 6000 },
  { city: 'City G', type: 'specialty snacks', value: 7000 },
  { city: 'City G', type: 'tea', value: 10000 },
  { city: 'City H', type: 'fruit', value: 18000 },
  { city: 'City H', type: 'rice', value: 11000 },
  { city: 'City H', type: 'specialty snacks', value: 15000 },
  { city: 'City H', type: 'tea', value: 14000 }
];
const spec = {
  type: 'bar',
  data: [
    {
      id: 'bar',
      values: data
    }
  ],
  xField: ['city', 'type'],
  yField: 'value',
  seriesField: 'type',
  legends: {
    orient: 'right',
    position: 'start',
    item: {
      focus: true // enable focus
    },
    defaultSelected: ['specialty snacks', 'rice'], // config default selected data
    allowAllCanceled: true, // allow all canceled
    padding: {
      top: 0,
      left: 20
    }
  }
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

附上和该 demo 配置相关联的教程或者 api 文档的链接。
