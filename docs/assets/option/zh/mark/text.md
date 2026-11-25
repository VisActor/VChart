{{ target: mark-text }}

<!-- ITextMarkSpec -->

#${prefix} text(string|number|Array|Function)

要显示的文字内容。支持字符串、数字、字符串数组和数字数组。

{{ use: graphic-fill-style(
  prefix = ${prefix},
  callbackType = '|Function'
) }}

#${prefix} dx(number|Function)

x 方向偏移。

#${prefix} dy(number|Function)

y 方向偏移。

#${prefix} textAlign(string|Function)

文字的水平对齐方式。

- `'left'` 或 `'start'`：左对齐
- `'center'`：居中
- `'right'` 或 `'end'`：右对齐

#${prefix} textBaseline(string|Function)

文字基线。

可选值：

- `'top'`
- `'bottom'`
- `'middle'`

#${prefix} fontSize(number|Function)

字号，单位为像素。

#${prefix} fontFamily(string|Function)

文字字体。

#${prefix} fontWeight(string|number|Function)

文字字体的粗细。

可选：

- `'normal'`
- `'bold'`
- `'bolder'`
- `'lighter'`
- `100 | 200 | 300 | 400`...

#${prefix} fontStyle(string|Function)

文字字体的风格。

可选：

- `'normal'`
- `'italic'`
- `'oblique'`

#${prefix} maxLineWidth(number|Function)

每行文字的最大宽度，单位为像素。默认情况下，超出宽度的文字会被截断。

#${prefix} ellipsis(string|Function)

截断文字时显示的省略符号，例如 `'…'`。与 `maxLineWidth` 配合使用。

#${prefix} suffixPosition(string|Function) = 'end'

自 `1.7.3` 版本开始支持，用于配置文本省略的位置，默认尾部省略。

- 'start' 文字首部省略
- 'middle' 文本中间省略
- 'end' 文本尾部省略
