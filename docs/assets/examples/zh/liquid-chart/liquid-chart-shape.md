---
category: examples
group: liquid chart
title: 水波图自定义形状
keywords: liquidChart, proportion
order: 25-1
cover: /vchart/preview/liquid-chart-shape_1.9.0.png
option: liquidChart
---

# 水波图

水波图轮廓支持自定义形状。

## 关键配置

- `maskShape` 属性声明为轮廓形状.

可选值: 
- `'drop'`
- `'circle'`
- `'cross'`
- `'diamond'`
- `'square'`
- `'arrow'`
- `'arrow2Left'`
- `'arrow2Right'`
- `'wedge'`
- `'thinTriangle'`
- `'triangle'`
- `'triangleUp'`
- `'triangleDown'`
- `'triangleRight'`
- `'triangleLeft'`
- `'stroke'`
- `'star'`
- `'wye'`
- `'rect'`

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
    maskShape: 'drop', // 水滴
    // maskShape: 'circle',
    // maskShape: 'star',
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
  };

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## 相关教程

[水波图](link)
