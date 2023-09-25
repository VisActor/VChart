---
category: examples
group: gauge
title: Gauge Chart with Gauge Series
keywords: gauge,comparison,circle
order: 15-4
cover: /vchart/preview/gauge-segment_1.4.0.png
option: gaugeChart
---

# Gauge Chart with Gauge Series

## Key option

- `categoryField`,`valueField` Properties are used to specify data categories and pointer angle fields, respectively
- `innerRadius`,`outerRadius` Property is used to specify the inner and outer radii of the dashboard
- `startAngle`,`endAngle` Properties are used to specify the start and end angles of the dashboard
- `gauge`Properties can be configured[Background panel series for instrument diagram](../../option/gaugeChart#gauge)

## Demo source

```javascript livedemo
const spec = {
  type: 'gauge',
  data: [
    {
      id: 'pointer',
      values: [
        {
          type: 'A',
          value: 0.6
        }
      ]
    },
    {
      id: 'segment',
      values: [
        {
          type: 'level1',
          value: 0.4
        },
        {
          type: 'level2',
          value: 0.6
        },
        {
          type: 'level3',
          value: 0.8
        }
      ]
    }
  ],
  gauge: {
    type: 'gauge',
    dataIndex: 1,
    categoryField: 'type',
    valueField: 'value',
    seriesField: 'type',
    segment: {
      style: {
        cornerRadius: 10
      }
    }
  },
  pointer: {
    style: {
      fill: '#666666'
    }
  },
  categoryField: 'type',
  valueField: 'value',
  outerRadius: 0.8,
  innerRadius: 0.5,
  startAngle: -180,
  endAngle: 0,
  axes: [{ type: 'linear', orient: 'angle', grid: { visible: false } }]
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## Related Tutorials

[Instrument diagram](link)
