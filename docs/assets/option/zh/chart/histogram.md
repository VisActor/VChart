{{ target: chart-histogram }}

# histogramChart

直方图

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

x2 字段。（x字段为频率统计左区间字段，x2字段为频率统计右区间字段）

## y2Field(string|string[])

y2 字段。（y字段为频率统计左区间字段，y2字段为频率统计右区间字段）

{{ use: chart-component(
  axisType = 'cartesian',
  noBandAxis = true
) }}

