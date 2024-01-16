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

- `'top'`, tooltip is displayed above the element
- `'bottom'`, tooltip is displayed below the element
- `'left'`, tooltip is displayed to the left of the element
- `'right'`, tooltip is displayed to the right of the element
- `'inside'`, tooltip is displayed at the center of the element
- `'tl'` / `'lt'`, tooltip is displayed in the upper left corner of the element
- `'tr'` / `'rt'`, tooltip is displayed in the upper right corner of the element
- `'bl'` / `'lb'`, tooltip is displayed in the bottom left corner of the element
- `'br'` / `'rb'`, tooltip is displayed in the bottom right corner of the element

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

#${prefix} positionMode(string)

The tooltip position mode determines what element the `position` is relatively fixed to, such as around the mouse pointer or mouse-over marks. This configuration only takes effect when `position` is set to a string.

There are several modes, with the default being `'mark'`:

- `'mark'`，tooltip fixed near the mouse-over mark
- `'pointer'`, tooltip fixed near the mouse pointer

#${prefix} updateContent(Function)

This is the callback of the tooltip content. It is called before the tooltip is finally displayed. You can modify the text and style of the tooltip content in this callback, and add, delete, modify, and reorder the tooltip content lines.

The type definition is as follows:

```ts
(prev: IToolTipLineActual[] | undefined, data?: TooltipData, params?: TooltipHandlerParams) => IToolTipLineActual[] | undefined;
```

The first parameter is the final tooltip content array calculated by VChart before displaying the tooltip, containing the text and style for each line. Modify this array in the callback and return it.

#${prefix} updateTitle(Function)

This is the callback of the tooltip title. It is called before the tooltip is finally displayed. You can modify the text and style of the tooltip title in this callback.

The type definition is as follows:

```ts
(prev: IToolTipLineActual | undefined, data?: TooltipData, params?: TooltipHandlerParams) =>
  IToolTipLineActual | undefined;
```

The first parameter is the final tooltip title information calculated by VChart before displaying the tooltip, including the text and style of the title. Modify this object in the callback and return it.

#${prefix} updateElement(Function)

This is the callback used to update the tooltip dom element. It is only effective when `renderMode` is '`'html'`.

In this callback, the first parameter will provide the calculated root node of the tooltip dom tree. This callback allows modification of the content of this dom node, but does not allow replacement. The modified tooltip dom will be displayed immediately and the built-in tooltip position calculation algorithm will be reapplied.

The type definition is as follows:

```ts
(tooltipElement: HTMLElement, actualTooltip: IToolTipActual, params: TooltipHandlerParams) => void
```
