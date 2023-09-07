{{ target: component-indicator-item }}

#${prefix} visible(boolean) = true

是否显示当前项

#${prefix} field(string)

文字内容字段。
优先级高于样式中 text 配置

#${prefix} space(number)

本文间距。

- `title.space`: title 和 content 之间的间距
- `contentItem.space`: content 之间的间距

#${prefix} autoLimit(boolean) = false

是否自适应文字空间进行缩略。

#${prefix} autoFit(boolean) = false

是否自适应文字空间缩放文字大小。

#${prefix} fitPercent(number) = 0.5

自适应文字宽度与可用空间的比例。

#${prefix} style(Object)

文字样式

{{ use: graphic-text(
  prefix = '####'
) }}
