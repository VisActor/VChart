---
category: examples
group: liquid chart
title: liquid chart supports custom shape
keywords: liquidChart, proportion
order: 25-1
cover: /vchart/preview/liquid-chart-shape_1.9.0.png
option: liquidChart
---

# 水波图

liquid chart supports custom shape.

## Key Option

- `maskShape` declared as outline shape.

option values: 
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

## Demo Source

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
    maskShape: 'drop', // drop shape
    // maskShape: 'circle',
    // maskShape: 'star',
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

## Related Tutorials

[Liquid Chart](link)