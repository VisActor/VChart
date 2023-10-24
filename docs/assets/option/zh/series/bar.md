{{ target: series-bar }}

<!-- IBarSeriesSpec -->

**柱系列**，可用于绘制柱状图、条形图以及直方图等。**仅适用于直角坐标系**。

{{ use: common-cartesian-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'bar',
  seriesMarks = ['bar'],
  preset = 'grow' + '|' + 'fadeIn' + '|' + 'scaleIn',
  defaultPreset = 'grow'
) }}

#${prefix} bar(Object)

bar 图元样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'bar'
) }}

{{ use: mark-rect(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} label(Object)

标签配置。

##${prefix} position(string) = 'outside'

标签位置。可选值为：

- `'outside'`
- `'top'`
- `'bottom'`
- `'left'`
- `'right'`
- `'inside'`
- `'inside-top'`
- `'inside-bottom'`
- `'inside-right'`
- `'inside-left'`

{{ use: component-label(
  prefix = '#' + ${prefix},
  noPosition = true,
  hasOverlap = true,
  hasSmartInvert = true,
  defaultOffset = 5,
) }}

{{ use: series-bar-style(
  prefix =  ${prefix}
) }}

#${prefix} totalLabel(Object)

总计标签，当图表在堆叠场景时生效。自`1.3.0`版本开始支持。

{{ use: component-label(
  prefix = '#' + ${prefix},
  noPosition = true,
  hasOverlap = false,
  hasSmartInvert = false,
  defaultOffset = 5,
  ignoreCustom = true
) }}
