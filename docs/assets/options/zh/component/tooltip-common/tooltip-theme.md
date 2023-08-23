{{ target: component-tooltip-theme }}

<!-- ITooltipTheme -->

#${prefix} panel(Object)

配置 tooltip 背景框样式。

##${prefix} padding(Object)

{{ use: common-padding(
  prefix = '#' + ${prefix},
  componentName = 'tooltip 背景框'
) }}

##${prefix} backgroundColor(string)

**可选** 配置背景色。

##${prefix} border(Object)

**可选** 配置背景框边框。

###${prefix} color(string)

**可选** 配置背景框边框颜色。

###${prefix} width(number)

**可选** 配置背景框边框宽度。

###${prefix} radius(number)

**可选** 配置背景框圆角半径。

##${prefix} shadow(Object)

**可选** 配置背景框阴影。

###${prefix} x(number)

**可选** 配置背景框阴影偏移 x。

###${prefix} y(number)

**可选** 配置背景框阴影偏移 y。

###${prefix} blur(number)

**可选** 配置背景框阴影模糊半径。

###${prefix} spread(number)

**可选** 配置背景框阴影扩展半径。

###${prefix} color(string)

**可选** 配置背景框阴影颜色。

#${prefix} shape(Object)

**可选** 配置 tooltip shape 样式。

##${prefix} size(number)

**可选** 配置 tooltip shape 宽高。

##${prefix} spacing(number)

**可选** 配置 tooltip shape 与右边相邻元素的水平间距。

#${prefix} titleLabel(Object)

**可选** 配置 tooltip 标题行样式。

{{ use: component-tooltip-text-theme(
  prefix = '#' + ${prefix},
  componentName = 'tooltip 标题行',
  spacing = false
) }}

#${prefix} keyLabel(Object)

**可选** 配置 tooltip 内容行 key 列样式。

{{ use: component-tooltip-text-theme(
  prefix = '#' + ${prefix},
  componentName = 'tooltip 内容行 key 列',
  spacing = true
) }}

#${prefix} valueLabel(Object)

**可选** 配置 tooltip 内容行 value 列样式。

{{ use: component-tooltip-text-theme(
  prefix = '#' + ${prefix},
  componentName = 'tooltip 内容行 value 列',
  spacing = true
) }}

#${prefix} spaceRow(number)

**可选** 配置 tooltip 内容行间距。
