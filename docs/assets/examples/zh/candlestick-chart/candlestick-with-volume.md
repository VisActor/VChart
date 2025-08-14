---
category: examples
group: candlestick chart
title: 基础k线图
keywords: candlestick
order: 19-0
option: candlestickChart
---

# K 线图

K 线图基本用法

## 关键配置

- `type: 'candlestick'`
- `xField`, `openField`, `closeField`, `highField`, `lowField`
- `data`

## 代码演示

```javascript livedemo
if (VChartExtension.registerCandlestickChart) {
  VChartExtension.registerCandlestickChart();
}

const data = [
  { time: '2024-07-01', open: 100, close: 130, high: 135, low: 90, volume: 5000 },
  { time: '2024-07-02', open: 130, close: 80, high: 140, low: 75, volume: 8000 },
  { time: '2024-07-03', open: 80, close: 150, high: 155, low: 70, volume: 6000 },
  { time: '2024-07-04', open: 150, close: 140, high: 160, low: 105, volume: 7000 },
  { time: '2024-07-05', open: 140, close: 170, high: 180, low: 115, volume: 9000 },
  { time: '2024-07-06', open: 170, close: 170, high: 175, low: 95, volume: 4000 },
  { time: '2024-07-07', open: 170, close: 100, high: 175, low: 95, volume: 10000 },
  { time: '2024-07-08', open: 100, close: 160, high: 210, low: 90, volume: 11000 },
  { time: '2024-07-09', open: 160, close: 180, high: 200, low: 150, volume: 9500 },
  { time: '2024-07-10', open: 180, close: 170, high: 185, low: 160, volume: 8700 },
  { time: '2024-07-11', open: 170, close: 200, high: 210, low: 165, volume: 12000 },
  { time: '2024-07-12', open: 200, close: 210, high: 220, low: 190, volume: 10500 },
  { time: '2024-07-13', open: 210, close: 190, high: 215, low: 180, volume: 9800 },
  { time: '2024-07-14', open: 190, close: 195, high: 200, low: 185, volume: 7600 },
  { time: '2024-07-15', open: 195, close: 220, high: 225, low: 190, volume: 13000 },
  { time: '2024-07-16', open: 220, close: 210, high: 230, low: 205, volume: 9000 }
];

const spec = {
  type: 'common',
  data: [{ data }],
  layout: {
    type: 'grid',
    col: 2,
    row: 3,
    elements: [
      { modelId: 'region-k', col: 1, row: 0 },
      { modelId: 'region-volume', col: 1, row: 2 },
      { modelId: 'axis-x', col: 1, row: 1 },
      { modelId: 'axis-y-k', col: 0, row: 0 },
      { modelId: 'axis-y-volume', col: 0, row: 2 }
    ]
  },
  region: [
    { id: 'region-k', height: '70%' },
    { id: 'region-volume', height: '30%' }
  ],
  padding: {
    top: 10
  },
  series: [
    {
      regionId: 'region-k',
      type: 'candlestick',
      xField: 'time',
      openField: 'open',
      closeField: 'close',
      highField: 'high',
      lowField: 'low',
      data: { values: data }
    },
    {
      regionId: 'region-volume',
      type: 'bar',
      xField: 'time',
      yField: 'volume',
      data: { values: data },
      bar: {
        style: {
          fill: datum => {
            if (datum.open < datum.close) {
              return '#FF0000'; // 涨
            } else if (datum.open > datum.close) {
              return '#00AA00'; // 跌
            } else {
              return '#999999'; // 平
            }
          }
        }
      }
    }
  ],
  axes: [
    {
      id: 'axis-y-k',
      regionId: 'region-k',
      orient: 'left'
    },
    {
      id: 'axis-y-volume',
      regionId: 'region-volume',
      orient: 'left'
    },
    {
      id: 'axis-x',
      regionId: 'region-volume',
      orient: 'bottom'
    }
  ]
};

const vchart = new VChart(spec, {
  dom: CONTAINER_ID
});
vchart.renderSync();

window['vchart'] = vchart;
```
