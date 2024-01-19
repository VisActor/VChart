---
category: examples
group: liquid chart
title: liquid chart custom background style
keywords: liquidChart, proportion
Order: 25-2
cover: /vchart/preview/liquid-chart-background_1.9.0.png
option: liquidChart
---

# liquid chart custom background style

The liquid outline background supports custom styles.

## Key Option

- `liquidBackground.style` declared as outline background style.

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
    // maskShape: 'drop', // drop shape
    // maskShape: 'circle',
    maskShape: 'star',
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

## Related Tutorials

[Liquid Chart](link)
