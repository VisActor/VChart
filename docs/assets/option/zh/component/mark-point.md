{{ target: component-mark-point }}

## markPoint (Array|Object)

数据标注点。

{{ use: component-base-marker(
  prefix = '##'
) }}

### coordinates(Object)

标注目标：数据元素。
指定数据点的标注区域。基于指定数据点进行标注区域的绘制。

{{ use: component-marker-data-point(
  prefix = '###'
) }}

### position(Object)

标注目标：坐标点。
指定坐标点的标注区域。基于指定坐标点进行标注区域的绘制。

{{ use: component-marker-point-like(
  prefix = '###'
) }}

### regionRelative(boolean) = false

自 `1.7.0` 版本支持，是否为相对 region 的坐标，默认为 false，即相对画布的坐标，默认 false。

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
  prefix = '####'
) }}

#### richText(Object)

##### style(Object)

标注内容类型为 richText 时，richText 的样式。

{{ use: graphic-rich-text(
  prefix = '#####'
) }}
