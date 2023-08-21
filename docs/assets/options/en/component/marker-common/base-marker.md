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

#${prefix} id(string | number)

The annotation component ID.

{{ use: common-layout-item(
  prefix = ${prefix},
  defaultLayoutType = ${defaultLayoutType},
  defaultLayoutLevel = ${defaultLayoutLevel},
  defaultLayoutZIndex = ${defaultLayoutZIndex},
  noOrient = true
) }}