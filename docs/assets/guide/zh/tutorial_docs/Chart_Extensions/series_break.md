# 系列截断组件

系列截断组件配合轴截断功能一起使用，可以对图表中的系列进行截断显示。
目前支持如下系列类型的截断展示：

- `bar` 柱系列
- `line` 线系列
- `area` 面积系列

![img](/vchart/guide/extension/series-break.png)

## 如何开启轴截断

轴截断是 VChart 主包支持的功能，所以只需要在轴上开启，现在只有连续轴支持轴截断功能，配置示例如下：

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

具体配置参考： [柱图轴截断配置](/vchart/option/barChart-axes-linear#breaks)

## 如何开启系列截断

系列截断组件需要在图表上注册，注册和使用方式如下：

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

如果是通过 cdn 引入的方式，注册方式如下：

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

## 折线图绘图区截断

折线图中只有一个极端值时，可以设置 `scopeType: 'length'`，让断轴两侧按保留的数值区间长度分配空间。在下例中，`min`、`max` 和截断区间保留了 `[-20, 120]` 与 `[23100, 23120]`，两段长度之比为 7:1。

`appendSeriesBreakConfig(spec, { span: 'region' })` 会沿整个绘图区绘制截断标识。省略第二个参数时，标识只画在系列图元与断轴相交的位置。

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

## 轴截断示例

- [简单柱图轴截断](/vchart/demo/bar-chart/bar-break-by-axis)
