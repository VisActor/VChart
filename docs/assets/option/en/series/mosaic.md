{{ target: series-mosaic }}

<!-- IMosaicSeriesSpec -->
**Mosaic Series**, only used for mosaic charts. **Only applicable to Cartesian coordinate systems**.

{{ use: common-cartesian-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  noStack = ${noStack},
  seriesType = 'mosaic',
  seriesMarks = ['bar'],
  preset = 'grow' + '|' + 'fadeIn' + '|' + 'scaleIn',
  defaultPreset = 'grow'
) }}

#${prefix} bar(Object)

Bar element style configuration.

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

#${prefix} barBackground(Object)

Bar background element style configuration. This element is not displayed by default.

Supported since version `1.6.0`.

##${prefix} fieldLevel(number)

Determines whether the bar background element is displayed at the group level and at which level it is displayed. Supported since version `1.9.0`.

For example: In a grouped bar chart where `xField` is `['A', 'B', 'C']`, if configured as 0, each group divided by `'A'` corresponds to an overall bar background; if configured as 1, each group divided by `'B'` corresponds to an overall bar background; if configured as 2, each bar corresponds to a bar background.

Default value is each bar corresponds to a bar background.

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'barBackground'
) }}

{{ use: mark-rect(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} label(Object)

Label configuration.

##${prefix} position(string|Function) = 'outside'
Label position.

Since version `1.6.0`, in bar series, the `position` configuration can be in function form, for example:
