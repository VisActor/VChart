{{ target: component-marker-label }}

#${prefix} visible(boolean)

标签是否可见。

#${prefix} autoRotate(boolean)

标签整体 - 是否自动旋转。

#${prefix} minWidth(number) = 30

标签整体 - 最小宽度像素值。

#${prefix} maxWidth(number)

标签整体 - 最大宽度像素值。当文字超过最大宽度时，会自动省略。

#${prefix} labelBackground(Object)

标签背景面板配置。

##${prefix} visible(boolean)

标签背景面板是否可见。

##${prefix} padding(Object)

标签面板内部边距。

{{ use: common-padding(
  prefix = '##' + ${prefix}
) }}

##${prefix} style(Object)

标签面板样式。

{{ use: graphic-rect(
  prefix = '##' + ${prefix}
) }}

#${prefix} text(string)

标签文本 - 文本内容，如果需要进行换行，则使用数组形式，如 ['abc', '123']。

#${prefix} formatMethod(Function)

标签文本 - 文本格式化配置，使用回调函数的形式配置。

{{ use:text-format-callback(
  description = '标签文本'
) }}

#${prefix} style(Object)

标签文本 - 文本样式。

{{ use: graphic-text(
  prefix = '#' + ${prefix}
) }}

#${prefix} shape(Object)

标签文本 - 文本前图元。


##${prefix} visible(boolean)

文本前图元可见性。

##${prefix} style(Object)

文本前图元样式。

{{ use: graphic-symbol(
  prefix = '##' + ${prefix}
) }}

#${prefix} space(number)

标签文本 - 文本同文本前图元之间的间距。










