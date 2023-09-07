{{ target: mark-text }}

<!-- ITextMarkSpec -->

#${prefix} text(string|number|string[])

Text.

#${prefix} dx(number)

X-axis offset.

#${prefix} dy(number)

Y-axis offset.

#${prefix} textAlgin(string)

Text alignment.

Optional values:
- `'left'`: Align left
- `'right'`: Align right
- `'center'`: Align center

#${prefix} textBaseline(string)

Text baseline.

Optional values:
- `'top'`
- `'bottom'`
- `'middle'`

#${prefix} fontFamily(string)

Text font.

#${prefix} fontWeight(string|number)

Font weight of the text.

Optional:

- `'normal'`
- `'bold'`
- `'bolder'`
- `'lighter'`
- `100 | 200 | 300 | 400`...

#${prefix} fontStyle(string)

Style of text font.

Optional:

- `'normal'`
- `'italic'`
- `'oblique'`

#${prefix} limit(number)

Text length limit.

#${prefix} ellipsis(string)

Text truncation method.