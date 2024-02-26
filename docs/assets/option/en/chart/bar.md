{{ target: chart-bar }}

# barChart

Bar Chart

{{ use: common-chart-spec(
    prefix = '#',
    chartType = 'bar'
) }}

{{ use: series-bar(
  prefix = '#',
  noType = true,
  noData = true,
  noMorph = true,
  useInChart = true
) }}

## autoBandSize(boolean | Object)

Whether to enable automatic bandSize. If enabled, the bandSize will be automatically calculated based on the incoming configuration such as barWidth, thereby affecting the actual length of the axis. Supported since version 1.10.0.

### extend(number)

The expansion value added after calculating the bandSize based on barWidth to fix the overall length of the axis. The unit is px.

{{ use: chart-component(
  axisType = 'cartesian'
) }}
