{{ target: series-bar }}

<!-- IBarSeriesSpec -->

**Bar series**, can be used to draw bar charts, bar graphs, and histograms, etc. **Only applicable to Cartesian coordinate systems**.

{{ use: common-cartesian-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'bar',
  preset = 'grow' + '|' + 'fadeIn' + '|' + 'scaleIn',
  defaultPreset = 'grow'
) }}

#${prefix} bar(Object)

Bar graphic style configuration.

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

Label configuration.

##${prefix} position(string) = 'outside'

Label position. Optional values are:

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
  prefix = ${prefix}
) }}
