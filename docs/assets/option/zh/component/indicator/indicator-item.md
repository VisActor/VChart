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

#${prefix} fitStrategy(string) = 'default'

自适应文字计算所采用的策略。可选项：

- 'default': 默认的自适应策略，每个文本依据可用空间独立计算字号；
- 'inscribed': 内切矩形计算策略，所有配置了 inscribed 策略的文本将会共同计算可用空间的内切矩形，避免与可用空间外元素产生遮挡。

#${prefix} style(Object)

文字样式

##${prefix} type(string)

自 1.7.0 版本支持，文本类型

可选：

- 'text'
- 'rich'

##${prefix} text(string | number | Array)

文本内容。
自 1.7.0 版本支持富文本内容。

{{ use: graphic-text(
  prefix = '####'
) }}
