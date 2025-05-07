{{ target: graphic-text-font }}

<!-- Canopus Graphic Attributes, ITextGraphicAttribute -->

#${prefix} text(string|number|Array|function)

Text content. If an array is passed, it will be displayed with line breaks.

#${prefix} fontSize(number|function)

Font size.

#${prefix} fontFamily(string|function)

Font family.

#${prefix} fontWeight(string|number|function)

The weight of the text font.

Options:

- `'normal'`
- `'bold'`
- `'bolder'`
- `'lighter'`
- `100 | 200 | 300 | 400`...

#${prefix} fontStyle(string|function) = 'normal'

The style of the text font.

Options:

- `'normal'`
- `'italic'`
- `'oblique'`

#${prefix} fontVariant(string|number|function)

Same as CSS [font-variant](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant).

#${prefix} lineHeight(number|function)

Line height.

#${prefix} textAlign(string|function)

Horizontal alignment, values: `'left'`, `'center'`, `'right'`, `'start'`, `'end'`.

If it is `'left'`/`'start'`, the leftmost part of the text is at the `x` value. If it is `'right'`/`'end'`, the rightmost part of the text is at the `x` value.

#${prefix} textBaseline(string|function)

Vertical alignment, values: `'top'`, `'middle'`, `'bottom'`, `'alphabetic'`.

#${prefix} maxLineWidth(number|function)

The maximum length of the text. If `ellipsis` is not empty, it will be automatically truncated.

#${prefix} ellipsis(boolean|string|function) = '...'

Effective only when `maxLineWidth` is configured. If text exceeds, should it be automatically abbreviated? If the value is true, the default ellipsis is '...', or you can customize the ellipsis, like `ellipsis: 'etc.'`.

#${prefix} suffixPosition(string|function) = 'end'

Supported since `1.7.3` version, used to configure the position of text omission, the default is to omit the tail.

- 'start' text header is omitted
- 'middle' omitted from the middle of the text
- 'end' omit the end of the text

#${prefix} underline(boolean|function)

Enable underline.

#${prefix} lineThrough(boolean|function)

Enable strikethrough.

#${prefix} direction('horizontal'|'vertical'|function) = 'horizontal'

The layout direction of the text. If you need the text to be arranged vertically, you can configure it to 'vertical'.

#${prefix} wordBreak(string|function) = 'break-word'
Word break mode.

Options:

- "break-all": Allows breaking words at any character for non-CJK (Chinese/Japanese/Korean) text.
- "break-word": Does not allow breaking words in CJK (Chinese/Japanese/Korean) text, only breaks at half-width spaces or hyphens.
- "keep-all": Does not break words in CJK (Chinese/Japanese/Korean) text. Non-CJK text words are not broken. (Supported since version 1.12.8)

#${prefix} keepDirIn3d(boolean|function)

Whether to always maintain the direction facing the window in 3d mode (if set to false, it will rotate with the viewpoint, if set to true, the direction will always face the window)
