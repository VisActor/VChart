{{ target: series-circular-progress }}

<!-- ICircularProgressSeriesSpec -->

**Circular Progress Bar Series**

{{ use: common-polar-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'circularProgress',
  seriesMarks = ['progress', 'track']
) }}

#${prefix} categoryField(string | Array)

Category field.

#${prefix} radiusField(string)

Radius field.

#${prefix} maxValue(number)

The maximum data value, default is 1.

#${prefix} progress(Object)

Progress bar style.

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'arc'
) }}

###${prefix} innerPadding(number)

Inner padding of the progress bar (accepts negative values).

###${prefix} outerPadding(number)

Outer padding of the progress bar (accepts negative values).

{{ use: mark-arc(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} track(Object)

Background style.

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'arc'
) }}

###${prefix} innerPadding(number)

Inner padding of the progress bar (accepts negative values).

###${prefix} outerPadding(number)

Outer padding of the progress bar (accepts negative values).

{{ use: mark-arc(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}
