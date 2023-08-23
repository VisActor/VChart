{{ target: graphic-text }}

<!-- Canopus Graphic Attributes, ITextGraphicAttribute -->

#${prefix} text(string|number|Array)

Text content. If an array is passed, it will be displayed with line breaks.

#${prefix} fontSize(number)

Font size.

#${prefix} fontFamily(string)

Font family.

#${prefix} fontWeight(string|number)

The weight of the text font.

Options:

- `'normal'`
- `'bold'`
- `'bolder'`
- `'lighter'`
- `100 | 200 | 300 | 400`...

#${prefix} fontStyle(string) = 'normal'

The style of the text font.

Options:

- `'normal'`
- `'italic'`
- `'oblique'`

#${prefix} fontVariant(string|number)

Same as CSS [font-variant](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant).

#${prefix} lineHeight(number)

Line height.

#${prefix} textAlign(string)

Horizontal alignment, values: `'left'`, `'center'`, `'right'`, `'start'`, `'end'`.

If it is `'left'`/`'start'`, the leftmost part of the text is at the `x` value. If it is `'right'`/`'end'`, the rightmost part of the text is at the `x` value.

#${prefix} textBaseline(string)

Vertical alignment, values: `'top'`, `'middle'`, `'bottom'`, `'alphabetic'`.

#${prefix} maxLineWidth(number)

The maximum length of the text. If `ellipsis` is not empty, it will be automatically truncated.

#${prefix} ellipsis(boolean|string) = '...'

Effective only when `maxLineWidth` is configured. If text exceeds, should it be automatically abbreviated? If the value is true, the default ellipsis is '...', or you can customize the ellipsis, like `ellipsis: 'etc.'`.

#${prefix} underline(boolean)

Enable underline.

#${prefix} lineThrough(boolean)

Enable strikethrough.

#${prefix} keepDirIn3d(boolean)

Whether to always maintain the direction facing the window in 3d mode (if set to false, it will rotate with the viewpoint, if set to true, the direction will always face the window)

{{ use: graphic-attribute(
  prefix = ${prefix},
  noTexture = true
) }}