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

## autoBandSize(Object)

是否开启自动 bandSize。如果开启，会根据传入的 barWidth 等配置自动计算 bandSize，从而影响轴实际长度。自 1.10.0 版本开始支持。

### barMinWidth(number)

计算 bandSize 所需的最小柱宽。

### barMaxWidth(number)

计算 bandSize 所需的最大柱宽。

### barWidth(number)

计算 bandSize 所需的固定柱宽。

### barGapInGroup(number)

计算 bandSize 所需的柱间距。

### extend(number)

根据 barWidth 计算出 bandSize，从而固定轴整体长度之后，添加的扩增值。单位为 px。

{{ use: chart-component(
  axisType = 'cartesian'
) }}
