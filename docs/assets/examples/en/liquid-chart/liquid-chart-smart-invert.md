---
category: examples
group: liquid chart
title: liquid indicator smart invert
keywords: liquidChart, proportion
order: 25-3
cover: /vchart/preview/liquid-chart-smart-invert_1.9.0.png
option: liquidChart
---

# liquid indicator smart invert

The font color of the liquid chart indicator supports smart inversion (when the wave element blocks the indicator color, the indicator color can be intelligently inverted according to the color of the element to ensure the recognition of the text. Note: After the inversion is executed, the indicator color style configuration will not be takes effect.)

## Key Option

- `indicatorSmartInvert` declared as if open smart invert.

## Demo Source

```javascript livedemo
const spec = {
    type: 'liquid',
    valueField: 'value',
    data: {
      id: 'data',
      values: [
        {
          value: 0.8
        }
      ]
    },
    maskShape: 'drop', // drop shape
    // maskShape: 'circle',
    // maskShape: 'star',
    indicatorSmartInvert: true,
    indicator: {
      visible: true,
      title: {
        visible: true,
        style: {
          text: 'progress'
        }
      },
      content: [
        {
          visible: true,
          style: {
            fill: 'black',
            text: '80%'
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