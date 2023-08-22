{{ target: series-rose }}

<!-- IRadarSeriesSpec -->

**Rose series**, for drawing rose charts. **Only applicable to polar coordinates**.

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

Rose chart element style configuration.

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

Label configuration.

{{ use: component-label(
  prefix = '#' + ${prefix},
  defaultOffset = 5,
) }}