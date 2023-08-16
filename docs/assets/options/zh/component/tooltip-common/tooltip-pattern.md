{{ target: component-tooltip-pattern }}

<!-- ITooltipPattern -->

#${prefix} visible(boolean) = true

是否显示该类型的 tooltip。

#${prefix} title(Object)

tooltip 标题配置

{{ use: component-tooltip-line-pattern(
  prefix = '#' + ${prefix},
  content = false
) }}

#${prefix} content(Object|Object[])

tooltip 内容配置，配置项为`IToolTipLinePattern`对象或者该对象的数组。如果配置为对象，则每个数据项（datum）都会在 tooltip 内容区添加对应的一行；如果配置为数组，则每个数据项（datum）都会在 tooltip 内容区添加对应的多行。

{{ use: component-tooltip-line-pattern(
  prefix = '#' + ${prefix},
  content = true
) }}

#${prefix} position(Object|string)

tooltip 位置配置，支持对象和字符串类型的配置。

如果配置为字符串属性，则 tooltip 将固定在对应图元的四周或内部（目前仅 mark tooltip 支持）。有以下几种显示类型：

- `'top'`，tooltip 显示在鼠标所在图形上侧
- `'bottom'`, tooltip 显示在鼠标所在图形下侧
- `'left'`，tooltip 显示在鼠标所在图形左侧
- `'right'`, tooltip 显示在鼠标所在图形右侧
- `'inside'`, tooltip 显示在鼠标所在图形中心位置

如果配置为对象类型，则是相对容器布局的模式。可以配置以下可选属性：

##${prefix} left(number|Function)

**可选** tooltip 触发点距容器左边的距离。

{{ use: component-tooltip-position-callback(
  prefix = '##' + ${prefix}
) }}

##${prefix} right(number|Function)

**可选** tooltip 触发点距容器右边的距离。

{{ use: component-tooltip-position-callback(
  prefix = '##' + ${prefix}
) }}

##${prefix} top(number|Function)

**可选** tooltip 触发点距容器顶边的距离。

{{ use: component-tooltip-position-callback(
  prefix = '##' + ${prefix}
) }}

##${prefix} bottom(number|Function)

**可选** tooltip 触发点距容器底边的距离。

{{ use: component-tooltip-position-callback(
  prefix = '##' + ${prefix}
) }}

<!-- TODO: updateContent 等回调比较高阶且需求面比较小，是否推荐暴露给用户？ -->
