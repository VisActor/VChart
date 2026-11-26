{{ target: mark-text }}

<!-- ITextMarkSpec -->

#${prefix} text(string|number|Array|Function)

Text to display. Accepts strings, numbers, string arrays, and number arrays.

{{ use: graphic-fill-style(
  prefix = ${prefix},
  callbackType = '|Function'
) }}

#${prefix} dx(number|Function)

X-axis offset.

#${prefix} dy(number|Function)

Y-axis offset.

#${prefix} textAlign(string|Function)

Horizontal text alignment.

- `'left'` or `'start'` aligns text to the left.
- `'center'` centers the text.
- `'right'` or `'end'` aligns text to the right.

#${prefix} textBaseline(string|Function)

Text baseline.

Optional values:

- `'top'`
- `'bottom'`
- `'middle'`

#${prefix} fontSize(number|Function)

Font size in pixels.

#${prefix} fontFamily(string|Function)

Text font.

#${prefix} fontWeight(string|number|Function)

Font weight of the text.

Optional:

- `'normal'`
- `'bold'`
- `'bolder'`
- `'lighter'`
- `100 | 200 | 300 | 400`...

#${prefix} fontStyle(string|Function)

Style of text font.

Optional:

- `'normal'`
- `'italic'`
- `'oblique'`

#${prefix} maxLineWidth(number|Function)

Maximum width of a line of text, in pixels. By default, text that exceeds this width is truncated.

#${prefix} ellipsis(string|Function)

String to show when text is truncated, such as `'…'`. Use it with `maxLineWidth`.

#${prefix} suffixPosition(string|Function) = 'end'

Supported since `1.7.3` version, used to configure the position of text omission, the default is to omit the tail.

- 'start' text header is omitted
- 'middle' omitted from the middle of the text
- 'end' omit the end of the text
