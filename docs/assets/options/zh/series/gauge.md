{{ target: series-gauge }}

<!-- IGaugeSeriesSpec -->

**gauge 系列**，用于绘制仪表盘背景板。**仅适用于极坐标系**。

{{ use: series-progress-like(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'gaugePointer',
) }}

#${prefix} padAngle(number)

配置扇区间隔角度。

#${prefix} segment(Object)

扇区样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

###${prefix} innerPadding(number)

扇区内侧 padding。

###${prefix} outerPadding(number)

扇区外侧 padding。

{{ use: mark-style(
  markName = 'arc'
) }}

{{ use: mark-arc(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} track(Object)

扇区背景样式配置。

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
