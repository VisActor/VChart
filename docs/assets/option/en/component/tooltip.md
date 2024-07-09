{{ target: component-tooltip }}

#${prefix} tooltip(Object)

tooltip configuration.

##${prefix} visible(boolean) = true

Whether or not to show the tooltip, the default is to show it. **_(support setting on series) (works on all handlers)_**

##${prefix} activeType('mark'|'dimension'|Array<'mark'|'dimension'>) = ['mark', 'dimension']

Supported tooltip types. Two types of tooltips are currently supported: the meta tooltip (`'mark'`) and the dimension item tooltip (`'dimension'`). **_(supported on series) (works on all handlers)_**

##${prefix} trigger('hover'|'click'|'none'|string[]) = 'hover'

Show how the tooltip is triggered. Defaults to `'hover'`, i.e. triggered on mouse hover. Optional value is:

- `'hover'`: Triggered on mouse hover.
- `'click'`: Triggered on mouse click.

**_(works on all handlers)_**

##${prefix} triggerOff('hover'|'click'|'none'|string[]) = 'hover'

Hide the tooltip trigger method. Defaults to `'hover'`, which hides the previous `tooltip` when the mouse hovers out of the hotspot. Optional values are:

- `'hover'`: Triggers the tooltip to hide when the mouse hovers out of the hotspot.
- `'click'`: Triggers tooltip hiding when mouse clicks on other elements.

Currently `triggerOff` only supports settings consistent with `trigger` and `'none'`. If configured as `'none'`, the tooltip will not disappear due to user interaction.

**_(works on all handlers)_**

##${prefix} lockAfterClick(boolean)

Supported since version `1.10.0`

Locks the tooltip after clicking, usually used in scenarios where `trigger` is `['hover', 'click']`

**_(works on all handlers)_**

##${prefix} hideTimer(Number)

Supported since version `1.11.7`

hide the tooltip after a certain time, the unit is `ms`.

this option not work with `triggerOff` set to `'none'`.

##${prefix} mark(Object)

Customized configuration of the mark tooltip. **_(supports setting on series)(only works on default handler)_**

{{ use: component-tooltip-pattern(
  prefix = '##' + ${prefix}
) }}

##${prefix} dimension(Object)

Custom configuration of the dimension tooltip. **_(only works with default handler)_**

{{ use: component-tooltip-pattern(
  prefix = '##' + ${prefix}
) }}

##${prefix} group(Object)

Custom configuration of the group tooltip. **_(only works with default handler)_**

{{ use: component-tooltip-pattern(
  prefix = '##' + ${prefix},
  groupTooltip = true
) }}

##${prefix} renderMode('html'|'canvas')

The tooltip rendering method, defaults to `html` for desktop and `canvas` for applets. **_(only works with default handler)_**

##${prefix} confine(boolean) = true

Whether or not to restrict the tooltip box to the canvas area, enabled by default when `renderMode` is `'canvas'`. **_(only works with default canvas handler)_**

##${prefix} className(string)

**Optional** className of the root element of the tooltip dom, only valid if `renderMode` is `'html'`. **_(only works with default html handler)_**

##${prefix} parentElement(HTMLElement)

**Optional** Mount point for tooltip dom elements, only works if `renderMode` is `'html'`. **_(only works with the default html handler)_**

##${prefix} enterable(boolean) = false

If or not the mouse can enter the tooltip float, default is false, can be set to true if you need to interact with the details, such as adding links, buttons, etc. Currently only works when `renderMode` is `'html'`. \*\*Currently it only works when `renderMode` is `'html'`.

##${prefix} transitionDuration(number)

**Optional** tooltip The transition time of the float movement animation (jogging) in ms, when set to 0 it will follow the mouse movement. Currently only works when `renderMode` is `'html'`. **_(only works with default html handler)_**

##${prefix} throttleInterval(number)

**Optional** tooltip Updated anti-dithering interval in ms.**_(only works on default handler)_**

##${prefix} updateElement(Function)

This is the callback used to update the tooltip dom element. It is only effective when `renderMode` is '`'html'`.

In this callback, the first parameter will provide the calculated root node of the tooltip dom tree. This callback allows modification of the content of this dom node, but does not allow replacement. The modified tooltip dom will be displayed immediately and the built-in tooltip position calculation algorithm will be reapplied.

The type definition is as follows:

```ts
(tooltipElement: HTMLElement, actualTooltip: IToolTipActual, params: TooltipHandlerParams) => void
```

##${prefix} style(Object)

**Optional** Configure tooltip styles. **_(only works with default handler)_**

{{ use: component-tooltip-theme(
  prefix = '##' + ${prefix}
) }}

##${prefix} offset(Object)

**Optional** tooltip offset. tooltip offset is positive if tooltip is far away from the trigger point, and negative if tooltip is close to the trigger point. **_(only works for default handler)_**

{{ use: xy-pos(
  prefix = '##' + ${prefix},
  attribute = 'tooltip offset'
) }}
