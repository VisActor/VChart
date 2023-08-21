---
category: examples
group: area chart
title: Vertical Area Chart
keywords: areaChart,comparison,trend,area
order: 1-1
cover: http://tosv.byted.org/obj/bit-cloud/vchart/preview/area-chart/horizontal-area.png
option: areaChart
---

# Vertical Area Chart

A vertically oriented area chart.

## Key Configurations

- `type: area` attribute declares it as an area chart
- `direction` attribute declares it as `horizontal`
- `xField` attribute declares it as the numerical field
- `yField` attribute declares it as the categorical field or time-series field

## Code Demonstration

```javascript livedemo
const spec = {
  type: 'area',
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
  xField: 'value',
  yField: 'time',
  direction: 'horizontal'
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, do not copy
window['vchart'] = vchart;
```

## Related Tutorials

[Area Chart](link)