

---
category: examples
group: line chart
title: 折线图数据采样
keywords: lineChart,comparison,trend,line
order: 0-12
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vchart/preview/line-chart/basic-line.png
option: lineChart
---

# 折线图数据采样
折线图、面积图和柱状图在数据量远大于图表绘图区像素宽度（高度）时，会消耗大量冗余的计算；数据采样功能提供了这些情况的的降采样策略。使用数据采样后，在有效地优化图表加载效率的同时，也可以尽可能地展示数据的趋势。


## 关键配置

- `sampling` 属性声明为采样算法
可选值:
  - `'lttb'`: 采用 Largest-Triangle-Three-Bucket 算法，可以最大程度保证采样后线条的趋势，形状和极值。
  - `'min'`: 取过滤点的最小值
  - `'max'`: 取过滤点的最大值
  - `'sum'`: 取过滤点的和
  - `'average'`: 取过滤点的平均值

## 代码演示

```javascript livedemo
const spec = {
  type: 'line',
  data: {
    values: [
      {
        time: '2:00',
        value: 8
      },
      {
        time: '4:00',
        value: 9
      },
      {
        time: '6:00',
        value: 11
      },
      {
        time: '8:00',
        value: 14
      },
      {
        time: '10:00',
        value: 16
      },
      {
        time: '12:00',
        value: 17
      },
      {
        time: '14:00',
        value: 17
      },
      {
        time: '16:00',
        value: 16
      },
      {
        time: '18:00',
        value: 15
      }
    ]
  },
  xField: 'time',
  yField: 'value'
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[折线图](link)
