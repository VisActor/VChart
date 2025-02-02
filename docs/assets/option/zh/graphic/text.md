{{ target: graphic-text }}

<!-- Canopus 图形属性，ITextGraphicAttribute -->

#${prefix} text(string|number|Array)

文本内容，如果传入数组，则会进行换行显示。

#${prefix} fontSize(number)

字号。

#${prefix} fontFamily(string)

字体。

#${prefix} fontWeight(string|number)

文字字体的粗细。

可选：

- `'normal'`
- `'bold'`
- `'bolder'`
- `'lighter'`
- `100 | 200 | 300 | 400`...

#${prefix} fontStyle(string) = 'normal'

文字字体的风格。

可选：

- `'normal'`
- `'italic'`
- `'oblique'`

#${prefix} fontVariant(string|number)

同 css [font-variant](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-variant)。

#${prefix} lineHeight(number)

行高。

#${prefix} textAlign(string)

水平对齐方式，取值：`'left'`, `'center'`, `'right'`, `'start'`, `'end'`。

如果为 `'left'`/`'start'`，表示文本最左端在 `x` 值上。如果为 `'right'`/`'end'`，表示文本最右端在 `x` 值上。

#${prefix} textBaseline(string)

垂直对齐方式，取值：`'top'`, `'middle'`, `'bottom'`, `'alphabetic'`。

#${prefix} maxLineWidth(number)

文字最大的长度，如果 `ellipsis` 非空，超出则会自动省略。

#${prefix} ellipsis(boolean|string) = '...'

仅在配置了 `maxLineWidth` 时生效，文本超出是否自动省略，如果值为 true，则默认省略符为 '...'，也可以自定义省略符，直接 `ellipsis: 'etc.'`。

#${prefix} suffixPosition(string) = 'end'

自 `1.7.3` 版本开始支持，用于配置文本省略的位置，默认尾部省略。

- 'start' 文字首部省略
- 'middle' 文本中间省略
- 'end' 文本尾部省略

#${prefix} underline(boolean)

是否开启下划线。

#${prefix} lineThrough(boolean)

是否开启删除线。

#${prefix} direction('horizontal'|'vertical') = 'horizontal'

文本的排布方向，如果需要文本纵向排布，可以配置为 'vertical'。

#${prefix} wordBreak(string) = 'break-word'

折行方式。

可选值：

- "break-all": 允许任意非 CJK（中文/日文/韩文）文本间的单词断行。
- "break-word": 不允许 CJK（中文/日文/韩文）文本中的单词换行，只能在半角空格或连字符处换行。
- "keep-all": CJK（中文/日文/韩文）文本不断行。非 CJK 文本单词不断行。（从 1.12.8 版本开始支持）

#${prefx} forceBoundsWidth(number)

强制设置文本对应的包围盒宽度，默认我们会根据文本的内容和属性，自动计算宽度，当设置了该属性之后，包围盒的宽度会被强制设置为该值。
一般用于使用 html 或者 react 渲染文本内容的时候，解决宽度没法自动计算的情况。

#${prefx} forceBoundsHeight(number)

强制设置文本对应的包围盒高度，默认我们会根据文本的内容和属性，自动计算高度，当设置了该属性之后，包围盒的高度会被强制设置为该值。
一般用于使用 html 或者 react 渲染文本内容的时候，解决宽度没法自动计算的情况。

#${prefix} keepDirIn3d(boolean)

是否在 3d 模式中始终保持方向朝向窗口（配置为 false 则会随着视角旋转而旋转，配置为 true，那么方向始终朝向窗口）

{{ use: graphic-attribute(
  prefix = ${prefix},
  noTexture = true
) }}
