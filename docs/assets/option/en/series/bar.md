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
  seriesMarks = ['bar'],
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

#${prefix} totalLabel(Object)

Total label, working when the data is stacked. Supported since version `1.3.0`.

{{ use: component-label(
  prefix = '#' + ${prefix},
  noPosition = true,
  hasOverlap = false,
  hasSmartInvert = false,
  defaultOffset = 5,
  ignoreCustom = true
) }}
