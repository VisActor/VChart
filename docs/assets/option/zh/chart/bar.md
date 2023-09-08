{{ target: chart-bar }}

# barChart

柱状图

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

{{ use: chart-component(
  axisType = 'cartesian'
) }}
