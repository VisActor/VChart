{{ target: mark-text }}

<!-- ITextMarkSpec -->

#${prefix} text(string|number|string[]|function)

Text.

#${prefix} dx(number|function)

X-axis offset.

#${prefix} dy(number|function)

Y-axis offset.

#${prefix} textAlgin(string|function)

Text alignment.

Optional values:

- `'left'`: Align left
- `'right'`: Align right
- `'center'`: Align center

#${prefix} textBaseline(string|function)

Text baseline.

Optional values:

- `'top'`
- `'bottom'`
- `'middle'`

#${prefix} fontFamily(string|function)

Text font.

#${prefix} fontWeight(string|number|function)

Font weight of the text.

Optional:

- `'normal'`
- `'bold'`
- `'bolder'`
- `'lighter'`
- `100 | 200 | 300 | 400`...

#${prefix} fontStyle(string|function)

Style of text font.

Optional:

- `'normal'`
- `'italic'`
- `'oblique'`

#${prefix} limit(number|function)

Text length limit.

#${prefix} ellipsis(string|function)

Text truncation method.

#${prefix} suffixPosition(string|function) = 'end'

Supported since `1.7.3` version, used to configure the position of text omission, the default is to omit the tail.

- 'start' text header is omitted
- 'middle' omitted from the middle of the text
- 'end' omit the end of the text
