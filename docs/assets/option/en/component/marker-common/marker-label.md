{{ target: component-marker-label }}

#${prefix} visible(boolean)

Label visibility.

#${prefix} autoRotate(boolean)

Label as a whole - whether to auto-rotate.

{{ if: !${noMarkerRef} }}
{{ use: component-marker-ref(
  prefix = ${prefix}
) }}
{{ /if }}

#${prefix} minWidth(number) = 30

Label as a whole - minimum width in pixels.

#${prefix} maxWidth(number)

Label as a whole - maximum width in pixels. When the text exceeds the maximum width, it will be automatically abbreviated.

#${prefix} labelBackground(Object)

Label background panel configuration.

##${prefix} visible(boolean)

Label background panel visibility.

##${prefix} padding(Object)

Label panel internal padding.

{{ use: common-padding(
  prefix = '##' + ${prefix}
) }}

##${prefix} style(Object)

Label panel style.

{{ use: graphic-rect(
  prefix = '##' + ${prefix}
) }}

#${prefix} type(string)

Supported since version 1.7.0, text type.

Optional:

- 'text'
- 'rich'
- 'html'

#${prefix} text(string | Array)

Label text - text content. If you need to wrap lines, use an array format, such as ['abc', '123'].
Starting with version 1.7.0, rich text content is supported.

#${prefix} formatMethod(Function)

Label text - text formatting configuration, configured using a callback function.

{{ use:text-format-callback(
  description = 'Label text'
) }}

#${prefix} style(Object)

Label text - text style.

{{ use: graphic-text(
  prefix = '#' + ${prefix}
) }}

#${prefix} shape(Object)

Label text - preceding graphic element.

##${prefix} visible(boolean)

Visibility of the preceding graphic element.

##${prefix} style(Object)

Style of the preceding graphic element.

{{ use: graphic-symbol(
  prefix = '##' + ${prefix}
) }}

#${prefix} space(number)

Label text - spacing between the text and the preceding graphic element.

{{ if: !${noConfine} }}
#${prefix} confine(boolean) = false
Since version 1.4.0, whether to automatically adjust label so that it is displayed within the visible area of ​​​​the marker.
{{ /if }}

#${prefix}dx(number)

The horizontal offset of the text.

#${prefix}dy(number)

The vertical offset of the text.
