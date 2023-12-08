{{ target: graphic-rich-text }}

<!-- Canopus IRichTextGraphicAttribute -->

#${prefix} width(number)

富文本容器宽度。

#${prefix} height(number)

富文本容器高度。

#${prefix} ellipsis(boolean|string)

超出容器范围后文字的省略方式。

#${prefix} suffixPosition(string) = 'end'

自 `1.7.3` 版本开始支持，用于配置文本省略的位置，默认尾部省略。

- 'start' 文字首部省略
- 'middle' 文本中间省略
- 'end' 文本尾部省略

#${prefix} wordBreak(string)

富文本文字折行方式。

可选值：

- `'break-word'`: 在单词间折行
- `'break-all'`: 可在任意字符间折行

#${prefix} verticalDirection(string)

富文本文字对齐方向。

可选值：

- `'top'`
- `'middle'`
- `'bottom'`

#${prefix} maxHeight(number)

富文本容器最小高度。

#${prefix} maxWidth(number)

富文本容器最小宽度。

#${prefix} textAlign(string)

富文本文字对齐方式。

可选值：

- `'left'`: 左对齐
- `'right'`: 右对齐
- `'center'`: 居中对齐

#${prefix} textBaseline(string)

富文本文字基线。

可选值：

- `'top'`
- `'middle'`
- `'bottom'`

#${prefix} layoutDirection(string)

富文本文字排列方向。

可选值：

- `'horizontal'`: 横排
- `'vertical'`: 纵排

#${prefix} textConfig(Array)

富文本文字配置。

{{ use: graphic-rich-text-character(
  prefix = '#' + ${prefix},
) }}

#${prefix} singleLine(boolean)

富文本是否单行排列。

{{ use: graphic-attribute(
  prefix = '#' + ${prefix},
) }}
