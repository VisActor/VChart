{{ target: series-gauge }}

<!-- IGaugeSeriesSpec -->

**gauge series** is used to draw the background plate of the dashboard. **Only applicable to polar coordinate system**.

{{ use: series-progress-like(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'gauge',
) }}

#${prefix} padAngle(number)

Configure the angle between sectors.

#${prefix} segment(Object)

Sector style configuration.

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

###${prefix} innerPadding(number)

Inner padding of the sector.

###${prefix} outerPadding(number)

Outer padding of the sector.

{{ use: mark-style(
  markName = 'arc'
) }}

{{ use: mark-arc(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} track(Object)

Sector background style configuration.

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