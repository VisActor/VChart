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

- `'top'`，tooltip 显示在图形上侧
- `'bottom'`, tooltip 显示在图形下侧
- `'left'`，tooltip 显示在图形左侧
- `'right'`, tooltip 显示在图形右侧
- `'inside'`, tooltip 显示在图形中心位置
- `'tl'` / `'lt'`, tooltip 显示在图形左上角
- `'tr'` / `'rt'`, tooltip 显示在图形右上角
- `'bl'` / `'lb'`, tooltip 显示在图形左下角
- `'br'` / `'rb'`, tooltip 显示在图形右下角

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

#${prefix} positionMode(string)

tooltip 位置模式，决定 `position` 相对固定于什么图形，如固定在鼠标指针周围或图元周围。该配置只有 `position` 设为字符串时生效。

有以下几种模式，默认为 `'mark'`：

- `'mark'`，tooltip 固定在鼠标所在图元附近
- `'pointer'`, tooltip 固定在鼠标指针附近

#${prefix} updateContent(Function)

tooltip 内容的回调，在最终显示 tooltip 前调用，可以在这个回调中修改 tooltip 内容的文本和样式，以及对 tooltip 内容行进行增、删、改、重新排序。

其类型定义如下：

```ts
(prev: IToolTipLineActual[] | undefined, data?: TooltipData, params?: TooltipHandlerParams) => IToolTipLineActual[] | undefined;
```

其中第一个参数是 VChart 在显示 tooltip 前计算得出的最终 tooltip 内容数组，包含每行的文本和样式。在回调中对此数组进行修改并返回即可。

#${prefix} updateTitle(Function)

tooltip 标题的回调，在最终显示 tooltip 前调用，可以在这个回调中修改 tooltip 标题的文本和样式。

其类型定义如下：

```ts
(prev: IToolTipLineActual | undefined, data?: TooltipData, params?: TooltipHandlerParams) =>
  IToolTipLineActual | undefined;
```

其中第一个参数是 VChart 在显示 tooltip 前计算得出的最终 tooltip 标题信息，包含标题的文本和样式。在回调中对此对象进行修改并返回即可。

#${prefix} maxLineCount(number)

定义 tooltip 内容的最大显示行数，超过的内容将用“其他”表示。
