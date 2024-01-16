---
category: examples
group: liquid chart
title: liquid chart
keywords: liquidChart, proportion
order: 25-0
cover: /vchart/preview/liquid-chart_1.9.0.png
option: liquidChart
---

# liquid chart

Liquid charts usually display data by filling a circle with dynamic water waves, and are often used to show real-time progress.

## Key Option

- `valueField` declared as value field

## Demo source

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
          text: 'progress'
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

## Related Tutorials

[Liquid Chart](link)
