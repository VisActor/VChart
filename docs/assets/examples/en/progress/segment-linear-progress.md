---
category: examples
group: progress
title: Segmented Bar Progress Chart
keywords: linearProgress,comparison,rectangle
order: 16-1
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/progress-segment-linear-progress.png
option: linearProgressChart
---

# Segmented bar charts of progress

Segmented bar graphs can be realized with `extensionMark`.

## Key configuration

- `extensionMark.rule` implements segmented bars

## Code demo

```javascript livedemo
const spec = {
  type: 'linearProgress',
  data: [
    {
      id: 'id0',
      values: [
        {
          type: 'Tradition Industries',
          value: 0.85,
          goal: 0.7,
          text: '79.5%'
        }
      ]
    }
  ],
  direction: 'horizontal',
  xField: 'value',
  yField: 'type',
  seriesField: 'type',
  height: 80,
  cornerRadius: 20,
  progress: {
    style: {
      cornerRadius: 0
    }
  },
  bandWidth: 30,
  axes: [
    {
      orient: 'right',
      type: 'band',
      domainLine: { visible: false },
      tick: { visible: false },
      label: {
        formatMethod: val => '随便写点啥',
        style: {
          fontSize: 16
        }
      }
    },
    {
      orient: 'bottom',
      type: 'linear',
      visible: true,
      grid: {
        visible: false
      },
      label: {
        formatMethod: val => `${val * 100}%`,
        flush: true
      }
    }
  ],
  extensionMark: [
    {
      type: 'rule',
      dataId: 'id0',
      visible: true,
      style: {
        x: (datum, ctx, elements, dataView) => {
          return ctx.valueToX([1 / 3]);
        },
        y: (datum, ctx, elements, dataView) => {
          return ctx.valueToY([datum.type]) - 15;
        },
        x1: (datum, ctx, elements, dataView) => {
          return ctx.valueToX([1 / 3]);
        },
        y1: (datum, ctx, elements, dataView) => {
          return ctx.valueToY([datum.type]) + 15;
        },
        stroke: '#fff',
        lineWidth: 4,
        zIndex: 1
      }
    },
    {
      type: 'rule',
      dataId: 'id0',
      visible: true,
      style: {
        x: (datum, ctx, elements, dataView) => {
          return ctx.valueToX([2 / 3]);
        },
        y: (datum, ctx, elements, dataView) => {
          return ctx.valueToY([datum.type]) - 15;
        },
        x1: (datum, ctx, elements, dataView) => {
          return ctx.valueToX([2 / 3]);
        },
        y1: (datum, ctx, elements, dataView) => {
          return ctx.valueToY([datum.type]) + 15;
        },
        stroke: '#fff',
        lineWidth: 4,
        zIndex: 1
      }
    }
  ]
};

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderAsync();

// Just for the convenience of console debugging, DO NOT COPY!
window['vchart'] = vchart;
```

## Related Tutorials

[LinearProgress Chart](link)
