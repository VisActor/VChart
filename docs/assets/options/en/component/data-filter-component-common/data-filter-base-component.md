{{ target: component-data-filter-base }}

#${prefix} visible(boolean) = true

Whether to display the component.

#${prefix} orient(string) = 'left'

Component position.

Optional values:

- 'left'
- 'top'
- 'right'
- 'bottom'

#${prefix} width(string | number) = 'auto'

Component width.

#${prefix} height(string | number) = 'auto'

Component height.

#${prefix} field(string)

Declare the associated mapping field.

#${prefix} axisId(string)

Associated axis ID.

#${prefix} axisIndex(number)

Associated axis index.

#${prefix} regionId(string)

Associated region ID.

The component's associated region index intersects with the region associated with the axis

- Not configured: Defaults to the region controlled by the axis
- Configured: User-configured intersect with the region associated with the axis
- Configuration priority: regionIndex > regionId

#${prefix} regionIndex(number)

Associated region index.

The component's associated region index intersects with the region associated with the axis

- Not configured: Defaults to the region controlled by the axis
- Configured: User-configured intersect with the region associated with the axis
- Configuration priority: regionIndex > regionId

#${prefix} filterMode(string) = 'filter'

Data filtering mode.

Optional values:

- 'filter'
- 'axis'

#${prefix} start(number) = 0

Start configuration (percentage): Range [0, 1].

#${prefix} end(number) = 1

End configuration (percentage): Range [0, 1].

#${prefix} startValue(string | number)

Start data configuration: When not configured, it is converted according to start.

#${prefix} endValue(string | number)

End data configuration: When not configured, it is converted according to end.

#${prefix} rangeMode([string | string])

Start and end configuration modes: Only when the mode and configuration match does it take effect, such as rangeMode: ['percent', 'value'], then both start and endValue must be configured to take effect.

#${prefix} autoIndent(boolean)

Whether to automatically indent.

#${prefix} roam(boolean) = false

Enable mouse zoom and pan roaming.

{{ use: common-layout-item(
  prefix = ${prefix},
  defaultLayoutType = 'region-relative',
  defaultLayoutLevel = 40,
  defaultLayoutZIndex = 500,
  noOrient = true
) }}