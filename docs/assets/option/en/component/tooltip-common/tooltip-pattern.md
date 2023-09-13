{{ target: component-tooltip-pattern }}

<!-- ITooltipPattern -->

#${prefix} visible(boolean) = true

Whether to display tooltips of this type.

#${prefix} title(Object)

Configuration of tooltip title.

{{ use: component-tooltip-line-pattern(
  prefix = '#' + ${prefix},
  content = false
) }}

#${prefix} content(Object|Object[])

Configuration of tooltip content, which can be an `IToolTipLinePattern` object or an array of such objects. If configured as an object, each data item (datum) will add a corresponding line in the tooltip content area. If configured as an array, each data item (datum) will add multiple lines in the tooltip content area.

{{ use: component-tooltip-line-pattern(
  prefix = '#' + ${prefix},
  content = true
) }}

#${prefix} position(Object|string)

Configuration of tooltip position, supporting object and string types.

If configured as a string attribute, the tooltip will be fixed around or inside the corresponding graphical element (currently only mark tooltip is supported). There are several display types:

- `'top'`, tooltip is displayed above the mouse-over element
- `'bottom'`, tooltip is displayed below the mouse-over element
- `'left'`, tooltip is displayed to the left of the mouse-over element
- `'right'`, tooltip is displayed to the right of the mouse-over element 
- `'inside'`, tooltip is displayed at the center of the mouse-over element

If configured as an object type, it uses a relative container layout mode. The following optional attributes can be configured:

##${prefix} left(number|Function)

**Optional** Distance between the tooltip trigger point and the left side of the container.

{{ use: component-tooltip-position-callback(
  prefix = '##' + ${prefix}
) }}

##${prefix} right(number|Function)

**Optional** Distance between the tooltip trigger point and the right side of the container.

{{ use: component-tooltip-position-callback(
  prefix = '##' + ${prefix}
) }}

##${prefix} top(number|Function)

**Optional** Distance between the tooltip trigger point and the top side of the container.

{{ use: component-tooltip-position-callback(
  prefix = '##' + ${prefix}
) }}

##${prefix} bottom(number|Function)

**Optional** Distance between the tooltip trigger point and the bottom side of the container.

{{ use: component-tooltip-position-callback(
  prefix = '##' + ${prefix}
) }}

<!-- TODO: updateContent, and other advanced and less demanded callbacks, should we recommend exposing them to users? -->