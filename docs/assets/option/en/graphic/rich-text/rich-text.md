{{ target: graphic-rich-text }}

<!-- Canopus IRichTextGraphicAttribute -->

#${prefix} width(number)

Rich text container width.

#${prefix} height(number)

Rich text container height.

#${prefix} ellipsis(boolean ｜ string)

Text ellipsis method when exceeding the container scope.

#${prefix} suffixPosition(string) = 'end'

Supported since `1.7.3` version, used to configure the position of text omission, the default is to omit the tail.

- 'start' text header is omitted
- 'middle' omitted from the middle of the text
- 'end' omit the end of the text

#${prefix} wordBreak(string)

Rich text line wrap mode.

Optional values:

- `'break-word'`: Wrap between words
- `'break-all'`: Wrap between any characters

#${prefix} verticalDirection(string)

Rich text text alignment direction.

Optional values:

- `'top'`
- `'middle'`
- `'bottom'`

#${prefix} maxHeight(number)

Rich text container minimum height.

#${prefix} maxWidth(number)

Rich text container minimum width.

#${prefix} textAlign(string)

Rich text text alignment mode.

Optional values:

- `'left'`: Left aligned
- `'right'`: Right aligned
- `'center'`: Center aligned

#${prefix} textBaseline(string)

Rich text text baseline.

Optional values:

- `'top'`
- `'middle'`
- `'bottom'`

#${prefix} layoutDirection(string)

Rich text text layout direction.

Optional values:

- `'horizontal'`: Horizontal arrangement
- `'vertical'`: Vertical arrangement

#${prefix} textConfig(Array)

Rich text text configuration.

{{ use: graphic-rich-text-character(
  prefix = '#' + ${prefix},
) }}

#${prefix} singleLine(boolean)

Whether the rich text is arranged in a single line or not.

{{ use: graphic-attribute(
  prefix = '#' + ${prefix},
) }}
