{{ target: component-tooltip-text-theme }}

<!-- ITooltipTextTheme -->

#${prefix} fontFamily(string)

**可选** 配置${componentName}字体。

#${prefix} fontSize(number)

**可选** 配置${componentName}字体大小。

#${prefix} fontColor(string)

**可选** 配置${componentName}字体颜色。

#${prefix} fontWeight(string|number)

**可选** 配置${componentName}字重（属性值可参考 css 的 `fontWeight`）。

#${prefix} textAlign('left'|'right'|'center')

**可选** 配置${componentName}文本对齐方式。

#${prefix} textBaseline('top'|'bottom'|'middle'|'alphabetic')

**可选** 配置${componentName}文本基线。

#${prefix} lineHeight(number)

**可选** 配置${componentName}行高。

#${prefix} multiLine(boolean) = false

**可选** 配置${componentName}是否支持换行和自动换行。

#${prefix} maxWidth(number)

**可选** 配置${componentName}的最大宽度。

#${prefix} wordBreak(string) = 'break-word'

**可选** 配置${componentName}的换行模式，有以下两种模式：

- `'break-word'`: 在单词结尾换行
- `'break-all'`: 在任意位置换行

{{ if: ${labelType} === 'title' }}

#${prefix} autoWidth(boolean) = false

**可选** 配置${componentName}是否自适应宽度。自 1.4.2 版本开始支持。

`autoWidth` 默认为 `false`。如果配置为 `true`，则 tooltip 标题会保持和 tooltip 内容一致的宽度。

{{ /if }}

{{ if: ${labelType} === 'value' }}

#${prefix} autoWidth(boolean) = true

**可选** 配置${componentName}是否自适应宽度。自 1.4.2 版本开始支持。

`autoWidth` 默认为 `true`。如果配置为 `true`，则 tooltip value 标签会自动占满 tooltip 整体宽度的剩余部分。

{{ /if }}

{{ if: ${spacing} }}

#${prefix} spacing(number)

**可选** 配置${componentName}与右边相邻元素的水平间距。

{{ /if }}
