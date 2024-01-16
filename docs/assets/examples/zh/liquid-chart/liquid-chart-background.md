---
category: examples
group: liquid chart
title: 水波图自定义背景样式
keywords: liquidChart, proportion
order: 25-2
cover: /vchart/preview/liquid-chart-background_1.9.0.png
option: liquidChart
---

# 水波图

水波图轮廓背景支持自定义样式。

## 关键配置

- `liquidBackground.style` 属性声明为轮廓背景样式.

## 代码演示

```javascript livedemo
const spec = {
    type: 'liquid',
    valueField: 'value',
    data: {
      id: 'data',
      values: [
        {
          value: 0.4
        }
      ]
    },
    // maskShape: 'drop', // 水滴
    // maskShape: 'circle',
    maskShape: 'star',
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
            text: '40%'
          }
        }
      ]
    },
    liquidBackground: {
      style: {
        fill: 'blue'
      }
    }
  };

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[水波图](link)
