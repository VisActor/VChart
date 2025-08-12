---
category: examples
group: candlestick chart
title: K线图
keywords: candlestick, k线, 股票, 金融
link: '../guide/candlestick/introduction'
option: Candlestick#basic
---

# K 线图

K 线图基本用法

## 关键配置

- `type: 'candlestick'`
- `xField`, `openField`, `closeField`, `highField`, `lowField`
- `data`

## 代码演示

```javascript livedemo template=vchart
const data = [
  { time: '2024-07-01', open: 100, close: 130, high: 135, low: 90 },
  { time: '2024-07-02', open: 130, close: 80, high: 140, low: 75 },
  { time: '2024-07-03', open: 80, close: 150, high: 155, low: 70 },
  { time: '2024-07-04', open: 150, close: 140, high: 160, low: 105 },
  { time: '2024-07-05', open: 140, close: 170, high: 180, low: 115 }
];

const spec = {
  type: 'candlestick',
  xField: 'time',
  openField: 'open',
  closeField: 'close',
  highField: 'high',
  lowField: 'low',
  data: [{ values: data }]
};

const chart = new VChart(spec, {
  dom: document.getElementById(CONTAINER_ID)
});

window['chart'] = chart;
```
