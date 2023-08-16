{{ target: series-rose }}

<!-- IRadarSeriesSpec -->

**rose 系列**，用于绘制玫瑰图。**仅适用于极坐标系**。

{{ use: common-polar-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'rose',
  noInvalidType = true,
  preset = 'growAngle' + '|' + 'growRadius' + '|' + 'fadeIn',
  defaultPreset = 'growRadius'
) }}

#${prefix} rose(Object)

rose图元样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'arc'
) }}

{{ use: mark-arc(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} label(Object)

标签配置。

{{ use: component-label(
  prefix = '#' + ${prefix},
  defaultOffset = 5,
) }}
