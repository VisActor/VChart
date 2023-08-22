{{ target: chart-common }}

<!-- TODO: series 还差 IBar3dSeriesSpec IPie3dSeriesSpec -->

# commonChart

Combined chart

{{ use: common-chart-spec(
    prefix = '#',
    chartType = 'common'
) }}

## seriesField(string)

Series grouping field.

## series(Array)

Configuration of series in combined chart.

## series.area(Object)

{{ use: series-area(
  prefix = '##',
  noMorph = true,
  useInChart = false,
  seriesType = 'area'
) }}

## series.line(Object)

{{ use: series-line(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.bar(Object)

{{ use: series-bar(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.rangeColumn(Object)

{{ use: series-range-column(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.rangeArea(Object)

{{ use: series-rangeArea(
 prefix = '##',
  noMorph = true,
  useInChart = false,
) }}

## series.heatmap(Object)

{{ use: series-heatmap(
 prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.waterfall(Object)

{{ use: series-waterfall(
 prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.radar(Object)

{{ use: series-radar(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.pie(Object)

{{ use: series-pie(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.rose(Object)

{{ use: series-rose(
 prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.boxPlot(Object)

{{ use: series-box-plot(
 prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.map(Object)

{{ use: series-map(
  prefix = '##',
  noMorph = true,
  useInChart = true,
  noStack = false
) }}

## series.scatter(Object)

{{ use: series-scatter(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.linearProgress(Object)

{{ use: series-linear-progress(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.circularProgress(Object)

{{ use: series-circular-progress(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.gauge(Object)

{{ use: series-gauge(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.gaugePointer(Object)

{{ use: series-gauge-pointer(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.wordCloud(Object)

{{ use: series-word-cloud(
 prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.funnel(Object)

{{ use: series-funnel(
  prefix = '##',
  noMorph = true,
  noStack = true,
  useInChart = false
) }}

## series.sankey(Object)

{{ use: series-sankey(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.treemap(Object)

{{ use: series-treemap(
  prefix = '##',
  noMorph = true,
  useInChart = false,
  noStack = true
) }}

## series.sunburst(Object)

{{ use: series-sunburst(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.circlePacking(Object)

{{ use: series-circle-packing(
  prefix = '##',
  noMorph = true,
  useInChart = false
) }}

## series.dot(Object)

{{ use: series-dot(
  prefix = '##',
  useInChart = false
) }}

## series.link(Object)

{{ use: series-link(
  prefix = '##',
  useInChart = false
) }}

{{ use: component-cartesian-axis(
  noBandAxis = ${noBandAxis}
) }}

{{ use: chart-component(
  axisType = 'cartesian'
) }}