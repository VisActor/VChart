{{ target: chart-gauge }}

# gaugeChart

仪表图

{{ use: common-chart-spec(
    prefix = '#',
    chartType = 'gauge'
) }}

{{ use: series-gauge-pointer(
  prefix = '#',
  noType = true,
  noData = true,
  noMorph = true,
  useInChart = true
) }}

##${prefix} gauge(Object)

配置仪表图背景板系列。可选配`gauge`以及`circularProgress`系列。通过 `gauge.animationAppear` 设置表盘的入场动画。配置层级与淡入示例见[仪表图教程](/vchart/guide/tutorial_docs/Chart_Types/Gauge)。

##${prefix} gauge（gauge 系列版本）(Object)
gauge 系列版本。

###${prefix} type('gauge')

指定系列类型为`gauge`。

{{ use: series-gauge(
  prefix = '##',
  noType = true,
  noData = true,
  noMorph = true,
  useInChart = true
) }}

##${prefix} gauge（circularProgress 系列版本）(Object)
circularProgress 系列版本。

###${prefix} type('circularProgress')

指定系列类型为`circularProgress`。

{{ use: series-circular-progress(
  prefix = '##',
  noType = true,
  noData = true,
  noMorph = true,
  useInChart = true
) }}

{{ use: chart-component(
  axisType = 'polar',
  isPolar = true
) }}
