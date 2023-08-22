{{ target: graphic-rich-text-character }}

<!-- Canopus 图形属性，IRichTextCharacter -->

#${prefix} text(string)

文本内容。

#${prefix} fontSize(number)

字号。

#${prefix} fontFamily(string)

字体。

#${prefix} fill(string|Object)

文字填充色。支持使用 `rgb(255,255,255)`，`rgba(255,255,255,1)`，`#fff` 等方式设置为纯色，也支持设置为渐变色填充。

- 渐变色使用

{{ use: graphic-gradient }}

#${prefix} stroke(string|Object)

文字描边色。支持使用 `rgb(255,255,255)`，`rgba(255,255,255,1)`，`#fff` 等方式设置为纯色，也支持设置为渐变色描边。

- 渐变色使用

{{ use: graphic-gradient }}

#${prefix} fontWeight(string)

文字字体的粗细。

#${prefix} fontStyle(string) = 'normal'

文字字体的风格。

可选：

- `'normal'`
- `'italic'`
- `'oblique'`

#${prefix} textDecoration(string) = 'none'

文字的装饰线。

可选：

- `'none'`
- `'underline'`
- `'line-through'`

#${prefix} script(string) = 'normal'

文字的脚本格式。支持上下角标写法。

可选：

- `'normal'`
- `'sub'`
- `'super'`
