---
category: examples
group: liquid chart
title: 水波图
keywords: liquidChart, proportion
order: 25-0
cover: /vchart/preview/liquid-chart_1.9.0.png
option: liquidChart
---

# 水波图

水波图通常是在圆形中填充动态水波来展示数据，通常用于展示实时进度。

## 关键配置

- `valueField` 属性声明为值字段

## 代码演示

```javascript livedemo
const spec = {
    type: 'liquid',
    valueField: 'value',
    data: {
      id: 'data',
      values: [
        {
          value: 0.3
        }
      ]
    },
    indicator: {
      visible: true,
      title: {
        visible: true,
        style: {
          text: '进度'
        }
      },
      content: [
        {
          visible: true,
          style: {
            fill: 'black',
            text: '30%'
          }
        }
      ]
    },
  };

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[水波图](link)