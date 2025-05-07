{{ target: mark-text }}

<!-- ITextMarkSpec -->

#${prefix} text(string|number|string[]|function)

文本。

#${prefix} dx(number|function)

x 方向偏移。

#${prefix} dy(number|function)

y 方向偏移。

#${prefix} textAlgin(string|function)

文字对齐方式。

可选值：

- `'left'`: 左对齐
- `'right'`: 右对齐
- `'center'`: 居中对齐

#${prefix} textBaseline(string|function)

文字基线。

可选值：

- `'top'`
- `'bottom'`
- `'middle'`

#${prefix} fontFamily(string|function)

文字字体。

#${prefix} fontWeight(string|number|function)

文字字体的粗细。

可选：

- `'normal'`
- `'bold'`
- `'bolder'`
- `'lighter'`
- `100 | 200 | 300 | 400`...

#${prefix} fontStyle(string|function)

文字字体的风格。

可选：

- `'normal'`
- `'italic'`
- `'oblique'`

#${prefix} limit(number|function)

文字长度限制。

#${prefix} ellipsis(string|function)

文字省略方式。

#${prefix} suffixPosition(string|function) = 'end'

自 `1.7.3` 版本开始支持，用于配置文本省略的位置，默认尾部省略。

- 'start' 文字首部省略
- 'middle' 文本中间省略
- 'end' 文本尾部省略
