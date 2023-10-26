{{ target: series-range-column }}

<!-- IRangeColumnSeriesSpec -->

**Range Column Series**

{{ use: common-cartesian-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'rangeColumn',
  seriesMarks = ['bar'],
  preset = 'grow' + '|' + 'fadeIn',
  defaultPreset = 'grow'
) }}

#${prefix} bar(Object)

Bar mark style configuration.

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

BarBackground mark style configuration. This mark is invisible by default.

Supported since version 1.6.0.

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

##${prefix} position(string)

Label position. Supports displaying on both ends with `bothEnds`. Available options:

- `middle`
- `start`
- `end`
- `bothEnd`

{{ use: component-label(
  prefix = '#' + ${prefix},
  noPosition = true,
  hasOverlap = true,
  hasSmartInvert = true,
  defaultOffset = 0,
) }}

##${prefix} minLabel(Object)

Minimum value label configuration.

###${prefix} visible(boolean)

Is it visible?

###${prefix} position(string)

Label position. Available options:

- `start`
- `end`
- `bothEnd`

###${prefix} offset(number)

Label offset.

###${prefix} formatMethod(Function)

Text formatting function.
(text: string | string[], datum?: any) => string | string[]

- Input field: `text` text content.
- Input field: `datum` data record corresponding to the text
- Output field: Formatted text

##${prefix} maxLabel(Object)

Maximum value label configuration.

###${prefix} visible(boolean)

Is it visible?

###${prefix} position(string)

Label position. Available options:

- `start`
- `end`
- `bothEnd`

###${prefix} offset(number)

Label offset.

###${prefix} formatMethod(Function)

Text formatting function.
(text: string | string[], datum?: any) => string | string[];

- Input field: `text` text content.
- Input field: `datum` data record corresponding to the text
- Output field: Formatted text

#${prefix} minField(string)

Minimum value field for the range.

#${prefix} maxField(string)

Maximum value field for the range.

{{ use: series-bar-style(
  prefix = ${prefix}
) }}
