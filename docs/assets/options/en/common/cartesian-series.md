{{ target: common-cartesian-series }}

<!-- ICartesianSeriesSpec -->

{{ use: common-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  seriesType = ${seriesType},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  noPreset = ${noPreset},
  preset = ${preset},
  defaultPreset = ${defaultPreset}
) }}

{{ use: common-direction(
  prefix = ${prefix}
) }}

#${prefix} xField(string|string[])

x field. It can be declared as an array type, and the data will be grouped in sequence according to the declared fields.

#${prefix} yField(string|string[])

y field. It can be declared as an array type, and the data will be grouped in sequence according to the declared fields.

#${prefix} zField(string|string[])

z field. It can be declared as an array type, and the data will be grouped in sequence according to the declared fields. (Normally, it doesn't need to be configured. If you want a 3D scatter plot, 3D line chart, or 3D area chart, you can configure it, and you can also configure a z-axis)

{{ if: ${x2Field} }}
#${prefix} x2Field(string)

Used for interval data, declaring the data field for the end of the interval.

{{ /if }}

{{ if: ${y2Field} }}
#${prefix} y2Field(string)

Used for interval data, declaring the data field for the end of the interval.

{{ /if }}