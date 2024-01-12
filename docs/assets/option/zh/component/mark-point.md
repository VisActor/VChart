{{ target: component-mark-point }}

## markPoint (Array|Object)

数据标注点。

{{ use: component-base-marker(
  prefix = '##'
) }}

### x(string|number|function)

自 `1.7.3` 版本支持，参考点在 x 轴的起点位置，可以配置 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。

- 相对位置（string）：可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
- 聚合计算类型（string）
- 回调函数

{{ use: component-marker-aggregation-type() }}

### y(string|number|function)

自 `1.7.3` 版本支持，参考点在 y 轴上位置，可以配置参考线在 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。

- 相对位置（string）：可以将 y 配置为 '15%' 百分比的形式，表示该位置位于 region 纵轴（从上到下）的百分之 15 位置处。
- 聚合计算类型（string）
- 回调函数

{{ use: component-marker-aggregation-type() }}

### coordinates(Object)

标注目标：数据元素。
指定数据点的标注区域。基于指定数据点进行标注区域的绘制。

{{ use: component-marker-data-point(
  prefix = '###'
) }}

{{ use: component-marker-data-point-offset(
   prefix = '##',
   isSingle = true
) }}

### position(Object)

标注目标：坐标点。
指定坐标点的标注区域。基于指定坐标点进行标注区域的绘制。

{{ use: component-marker-point-like(
  prefix = '###'
) }}

### regionRelative(boolean) = false

自 `1.7.0` 版本支持，仅对使用 `position` 属性进行定位的情况生效，是否为相对 region 的坐标，默认为 false，即相对画布的坐标，默认 false。

### relativeRelativeSeriesIndex(number)

被标注数据关联的 series 索引（默认使用当前 region 第一个有效 series）。

### relativeRelativeSeriesId(string)

被标注数据关联的 series ID（默认使用当前 region 第一个有效 series）。

### itemLine(Object)

标注点引导线。

#### type(string)

标注点引导线类型。

可选值：

- `'type-s'`: 起点和终点直接连线
- `'type-do'`: 表示包含一个折点，且折点 x 坐标为起点到终点的 1/2 x 坐标，折点 y 坐标为起点 y 坐标
- `'type-po'`: 表示包含一个折点，且折点 x 坐标为终点 x 坐标，折点 y 坐标为起点 y 坐标
- `'type-op'`: 表示包含一个折点，且折点 x 坐标为起点 x 坐标，折点 y 坐标为终点 y 坐标
  具体形式参考：https://journals.sagepub.com/doi/10.1177/1473871618799500

#### visible(boolean)

标注点引导线可见性。

#### decorativeLine(Object)

垂直于引导线的装饰线。

##### visible(boolean)

装饰线可见性。

##### length(boolean)

装饰线长度。

#### startSymbol(Object)

引导线起点 symbol 样式。

{{ use: component-marker-symbol(
  prefix = '####'
) }}

#### endSymbol(Object)

引导线终点 symbol 样式。

{{ use: component-marker-symbol(
  prefix = '####'
) }}

#### line(Object)

##### style(Object)

引导线样式。

{{ use: graphic-line(
  prefix = '#####'
) }}

### itemContent(Object)

标注内容。

#### type(string)

标注内容类型。

可选值：

- 'symbol'
- 'text'
- 'image'
- 'richText'

#### position(string)

标注内容相对于定位点的位置。

可选值：

- 'top'
- 'bottom'
- 'middle'
- 'insideTop'
- 'insideBottom'
- 'insideMiddle'

#### offsetX(number)

标注内容相对于标注点的 x 方向偏移量。

#### offsetY(number)

标注内容相对于标注点的 y 方向偏移量。

{{ use: component-marker-ref(
  prefix = '###'
) }}

#### confine(boolean) = false
自 1.8.7 版本开始, 是否自动调整 item content 使其展示在 marker 可见区域内。

#### symbol(Object)

##### style(Object)

标注内容类型为 symbol 时，symbol 的样式。

{{ use: graphic-symbol(
  prefix = '#####'
) }}

#### image(Object)

##### style(Object)

标注内容类型为 image 时，image 的样式。

{{ use: graphic-image(
  prefix = '#####'
) }}

#### text(Object)

标注内容类型为 text 时，text 的样式。

{{ use: component-marker-label(
  prefix = '####',
  noConfine = true
) }}

#### richText(Object)

##### style(Object)

标注内容类型为 richText 时，richText 的样式。

{{ use: graphic-rich-text(
  prefix = '#####'
) }}
