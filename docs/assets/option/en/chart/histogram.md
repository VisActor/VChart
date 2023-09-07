{{ target: chart-histogram }}

# histogramChart

Histogram

{{ use: common-chart-spec(
    prefix = '#',
    chartType = 'histogram'
) }}

{{ use: series-bar(
  prefix = '#',
  noType = true,
  noData = true,
  noMorph = true,
  useInChart = true
) }}

## x2Field(string|string[])

x2 field. (x field is the left interval field of frequency statistics, x2 field is the right interval field of frequency statistics)

## y2Field(string|string[])

y2 field. (y field is the left interval field of frequency statistics, y2 field is the right interval field of frequency statistics)

{{ use: chart-component(
  axisType = 'cartesian',
  noBandAxis = true
) }}