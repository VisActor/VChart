{{ target: chart-common }}

<!-- TODO: series 还差 IBar3dSeriesSpec IPie3dSeriesSpec ICircularProgressSeriesSpec IGaugeSeriesSpec
IGaugePointerSeriesSpec-->

# commonChart

组合图。

{{ use: common-chart-spec(
    prefix = '#',
    chartType = 'common'
) }}

## seriesField(string)

系列分组字段。

## series(Array)

组合图内系列的配置。

## series.area(Object)

{{ use: series-area(
  prefix = '##',
  noMorph = true,
  useInChart = true,
  seriesType = 'area',
) }}

## series.line(Object)

{{ use: series-line(
  prefix = '##',
  noMorph = true,
  useInChart = true
) }}

## series.bar(Object)

{{ use: series-bar(
  prefix = '##',
  noMorph = true,
  useInChart = true
) }}

## series.rangeColumn(Object)

{{ use: series-range-column(
  prefix = '##',
  noMorph = true,
  useInChart = true
) }}

## series.rangeArea(Object)

{{ use: series-rangeArea(
 prefix = '##',
  noMorph = true,
  useInChart = true,
) }}

## series.heatmap(Object)

{{ use: series-heatmap(
 prefix = '##',
  noMorph = true,
  useInChart = true,
) }}

## series.waterfall(Object)

{{ use: series-waterfall(
 prefix = '##',
  noMorph = true,
  useInChart = true,
) }}

## series.radar(Object)

{{ use: series-radar(
  prefix = '##',
  noMorph = true,
  useInChart = true
) }}

## series.rose(Object)

{{ use: series-rose(
 prefix = '##',
  noMorph = true,
  useInChart = true
) }}

## series.boxPlot(Object)

{{ use: series-box-plot(
 prefix = '##',
  noMorph = true,
  useInChart = true
) }}

## series.map(Object)

{{ use: series-map(
  prefix = '##',
  noMorph = true,
  useInChart = true,
  noStack = true
) }}

## series.scatter(Object)

{{ use: series-scatter(
 prefix = '##',
  noMorph = true,
  useInChart = true
) }}

## series.linearProgress(Object)

{{ use: series-linear-progress(
 prefix = '##',
  noMorph = true,
  useInChart = true
) }}

## series.wordCloud(Object)

{{ use: series-word-cloud(
 prefix = '##',
  noMorph = true,
  useInChart = true
) }}

## series.funnel(Object)

{{ use: series-funnel(
  prefix = '##',
  noMorph = true,
  noStack = true,
) }}

## series.sankey(Object)

{{ use: series-sankey(
  prefix = '##',
  noMorph = true,
  useInChart = true
) }}

## series.treemap(Object)

{{ use: series-treemap(
  prefix = '##',
  noMorph = true,
  useInChart = true,
  noStack = true
) }}

## series.sunburst(Object)

{{ use: series-sunburst(
 prefix = '##',
  noMorph = true,
  useInChart = true
) }}

## series.circlePacking(Object)

{{ use: series-circle-packing(
  prefix = '##',
  noMorph = true,
  useInChart = true
) }}

## series.dot(Object)

{{ use: series-dot(
  prefix = '##'
) }}

## series.link(Object)

{{ use: series-link(
  prefix = '##'
) }}

{{ use: component-cartesian-axis(
  noBandAxis = ${noBandAxis}
) }}

{{ use: chart-component(
  axisType = 'cartesian'
) }}
