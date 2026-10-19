{{ target: series-link }}

<!-- ILinkSeriesSpec -->

**link series**, can be used to draw time series charts, need to be used in conjunction with dot series. **Only applicable to Cartesian coordinates**.

{{ use: common-cartesian-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'link',
) }}

#${prefix} fromField(string)

The starting point field, used to draw the starting point of the link.
Note: The data provided by this field should be consistent with the `node_name` value of an event in the associated dot series, and the positioning of the starting point follows the nodes of the dot series.

#${prefix} toField(string)
The ending point field, used to draw the ending point of the link.
Note: The data provided by this field should be consistent with the `node_name` value of an event in the associated dot series, and the positioning of the ending point follows the nodes of the dot series.

#${prefix} dotSeriesIndex(number)

The associated dot series index.

#${prefix} dotTypeField(string)

The associated event type. It is used to distinguish the stroke logic of the link. If it is not configured, each link will use the same stroke.

#${prefix} linkType(string) = 'line'

`'line'` draws straight links; `'curve'` draws cubic Bézier curves. Both use the public link visible/style/state configuration; no curveLink option is required. Repeated links sharing endpoints receive distinct curvature in data order.

#${prefix} allowExtend(boolean) = false

Allow links to extend outside category bands. Set the datum's isExtend to `'left'` or `'right'`, or omit it to extend both ends. The interface's `'all'` value does not currently enable both ends.

#${prefix} imageLabelField(string)

Field containing the midpoint avatar image URL or data URL. No image mark is created when this field is not specified.

#${prefix} imageLabel(Object)

Avatar mark configuration: visible, style and state. style.width and style.height default to 40 pixels each.

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

Image styles, for example `{ width: 32, height: 32 }`. Unless overridden, the image is centered between the endpoints.

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} link(Object)
Line graphic style configuration.

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'link'
) }}

{{ use: mark-line(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} arrow(Object)

Arrow graphic style configuration.

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'arrow'
) }}

{{ use: mark-symbol(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}
