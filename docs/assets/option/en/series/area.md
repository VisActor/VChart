{{ target: series-area }}

<!-- IAreaSeriesSpec -->

**Area Series**

{{ use: common-cartesian-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = ${seriesType},
  seriesMarks = ['line', 'point', 'area'],
  preset = 'clipIn' + '|' + 'fadeIn' + '|' + 'grow',
  defaultPreset = 'clipIn'
) }}

#${prefix} seriesMark('point'|'line'|'area') = 'area'

Supported since `1.2.0` version, it is used to configure the main mark type configuration of the area series, which will affect the display of the legend.

#${prefix} area(Object)

Area glyph style configuration.

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'area'
) }}

{{ use: mark-area(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} line(Object)

Line glyph style configuration.

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

Point glyph style configuration.

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

##${prefix} invalidType(string) = 'break'

Connection method for non-compliant data points. Connection method for null, undefined, and other illegal data points.

- 'break' means to break at that data point
- 'link' means to ignore the point and keep the connection continuous
- 'zero' means the default value of the point is 0
- 'ignore' means not to process

#${prefix} label(Object)

Label configuration.

##${prefix} position(string|Function) = 'top'

Label position.

Since `1.6.0` version, in bar series, `position` can be a function, for example:

```ts
label: {
  position: (datum: any) => {
    return datum.year === '2000' ? 'top' : 'bottom';
  };
}
```

Optional string values:

- `'top'`
- `'bottom'`
- `'left'`
- `'right'`
- `'top-right'`
- `'top-left'`
- `'bottom-right'`
- `'bottom-left'`
- `'center'`

{{ use: component-label(
  prefix = '#' + ${prefix},
  noPosition = true,
  hasOverlap = true,
  hasSmartInvert = true,
  defaultOffset = 5,
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

```

```
