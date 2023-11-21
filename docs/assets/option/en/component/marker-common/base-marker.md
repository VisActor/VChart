{{ target: component-base-marker }}

#${prefix} relativeSeriesIndex(number)

The series index associated with the annotated data.

#${prefix} relativeSeriesId(string)

The series ID associated with the annotated data.

#${prefix} visible(boolean) = true

Whether the annotation component is visible.

#${prefix} interactive(boolean) = false

Whether the annotation component is interactive.

#${prefix} autoRange(boolean) = false

Whether the marker component automatically expands the axis range.

#${prefix} clip(boolean) = false
Supported since `1.3.0` version, whether the marker component is clipped beyond the chart area

#${prefix} id(string | number)

The annotation component ID.

#${prefix} name(string)

Supported since `1.7.0` version, mark the component name.

{{ use: common-layout-item(
  prefix = ${prefix},
  defaultLayoutType = ${defaultLayoutType},
  defaultLayoutLevel = ${defaultLayoutLevel},
  defaultLayoutZIndex = ${defaultLayoutZIndex},
  noOrient = true,
  noClip = true
) }}
