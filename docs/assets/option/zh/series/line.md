{{ target: series-line }}

<!-- ILineSeriesSpec -->

**折线图**

{{ use: common-cartesian-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'line',
  seriesMarks = ['line', 'point'],
  preset = 'clipIn' + '|' + 'fadeIn' + '|' + 'grow',
  defaultPreset = 'clipIn'
) }}

#${prefix} seriesMark('point'|'line') = 'line'

自 `1.2.0` 版本开始支持，用于配置线系列主 mark 类型配置，该配置会影响图例的展示。

#${prefix} line(Object)

line 图元样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'line'
) }}

{{ use: mark-line(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} point(Object)

point 图元样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'point'
) }}

{{ use: mark-point(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} label(Object)

标签配置。

##${prefix} position(string)

标签位置。可选值为：

- `top`
- `bottom`
- `left`
- `right`
- `top-right`
- `top-left`
- `bottom-right`
- `bottom-left`
- `center`

{{ use: component-label(
  prefix = '#' + ${prefix},
  noPosition = true,
  hasOverlap = true,
  hasSmartInvert = true,
  defaultOffset = 5,
) }}

##${prefix} invalidType(string) = 'break'

非合规数据点连接方式。null，undefined 等非法数据点连接方式。

- 'break'指在该数据点处断开
- 'link' 指忽略该点保持连续
- 'zero' 指该点默认数值为 0
- 'ignore' 指不处理
