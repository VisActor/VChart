# Series Break Component

The series break component is used in conjunction with the axis break function to display breaks in the series of a chart.
Currently, the following series types support break display:

- `bar` series
- `line` series
- `area` series

![img](/vchart/guide/extension/series-break.png)

## How to Enable Axis Break

Axis break is a feature supported by the VChart main package, so it only needs to be enabled on the axis. Currently, only continuous axes support the axis break function. The configuration example is as follows:

```js
axes: [
  {
    orient: 'left',
    breaks: [
      {
        range: [2100, 22900]
      },
      {
        range: [700, 900]
      }
    ],
    nice: false,
    tick: {
      tickMode: 'd3'
    },

    domainLine: {
      visible: true
    }
  }
];
```

For detailed configuration, refer to: [Bar Chart Axis Break Configuration](/vchart/option/barChart-axes-linear#breaks)

## How to Enable Series Break

The series break component needs to be registered on the chart. The registration and usage method is as follows:

```js
import VChart from '@visactor/vchart';
import { registerSeriesBreak, appendSeriesBreakConfig } from '@visactor/vchart-extension';

const spec = {
  //  your spec
};
registerSeriesBreak();
appendSeriesBreakConfig(spec);

const vchart = new VChart(spec, { dom: 'chart' });
vchart.renderSync();
```

If using the CDN import method, the registration method is as follows:

```html
<script src="https://cdn.jsdelivr.net/npm/@visactor/vchart/build/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@visactor/vchart-extension/build/index.min.js"></script>
<script>
  const spec = {
    //  your spec
  };
  VChartExtension.registerSeriesBreak();
  VChartExtension.appendSeriesBreakConfig(spec);

  const vchart = new VChart.default(spec, { dom: 'chart' });
  vchart.renderSync();
</script>
```

## Draw a break across a line chart

When a line chart has a single outlier, set `scopeType: 'length'` to allocate space to each side of the break in proportion to its retained value range. The `min`, `max`, and break range below keep `[-20, 120]` and `[23100, 23120]`, a 7:1 ratio.

`appendSeriesBreakConfig(spec, { span: 'region' })` draws the break marker across the plot area. Omit the second argument to draw markers where the series graphics cross the break.

```javascript livedemo
const { registerSeriesBreak, appendSeriesBreakConfig } = VChartExtension;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const seriesValues = [
  { series: 'A', values: [0, 13, 4, 23100.7, 1, 5, 0] },
  { series: 'B', values: [1, 5, 0, 4, 3, 53, 2] }
];
const spec = {
  type: 'line',
  height: 400,
  data: {
    values: seriesValues.flatMap(({ series, values }) =>
      months.map((month, i) => ({ month, value: values[i], series }))
    )
  },
  xField: 'month',
  yField: 'value',
  seriesField: 'series',
  point: { visible: false },
  line: { style: { curveType: 'monotone' } },
  axes: [
    { orient: 'bottom', type: 'band' },
    {
      orient: 'left',
      type: 'linear',
      min: -20,
      max: 23120,
      nice: false,
      label: { lastVisible: true },
      tick: { tickMode: 'd3', tickCount: 5 },
      breaks: [
        {
          range: [120, 23100],
          scopeType: 'length',
          gap: 2,
          breakSymbol: { style: { stroke: '#B1BBCB', lineDash: [3, 3] } }
        }
      ],
      domainLine: { visible: true }
    }
  ]
};

registerSeriesBreak();
appendSeriesBreakConfig(spec, { span: 'region' });

const vchart = new VChart(spec, { dom: CONTAINER_ID });
vchart.renderSync();
```

## Axis Break Example

- [Simple Bar Chart Axis Break](/vchart/demo/bar-chart/bar-break-by-axis)
