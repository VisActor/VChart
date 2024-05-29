{{ target: common-polar-series }}

<!-- IPolarSeriesSpec -->

{{ use: common-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  seriesType = ${seriesType},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  noPreset = ${noPreset},
  preset = ${preset},
  defaultPreset = ${defaultPreset},
  seriesMarks = ${seriesMarks}
) }}

#${prefix} categoryField(string|string[])

Category field, mapped to the angle axis. Can be declared as an array type, and the data will be grouped by the declared fields in turn.

#${prefix} valueField(string|string[])

Value field, mapped to the radius axis. Can be declared as an array type, and the data will be grouped by the declared fields in turn.

#${prefix} outerRadius(number) = 0.6

Sector outer radius, with a numerical range of 0 - 1.

#${prefix} innerRadius(number) = 0

Sector inner radius, with a numerical range of 0 - 1.

#${prefix} startAngle(number) = -90

Starting angle of the sector. In degrees.

#${prefix} endAngle(number) = 270

Ending angle of the sector. In degrees.

#${prefix} centerX (Number|String)

Polar coordinate center x coordinate, supports two formats:

- `number`: Specific coordinate value
- `string`: Percentage string format like `50%`, calculated relative to the layout width (supported since **1.11.2**)

#${prefix} centerY (Number|String)

Polar coordinate center y coordinate, supports two formats:

- `number`: Specific coordinate value
- `string`: Percentage string format like `50%`, calculated relative to the layout height (supported since **1.11.2**)
