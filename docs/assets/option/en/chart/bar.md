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
