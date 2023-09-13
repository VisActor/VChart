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

### relativeRelativeSeriesIndex(number)

被标注数据关联的series索引（默认使用当前region第一个有效series）。

### relativeRelativeSeriesId(string)

被标注数据关联的series ID（默认使用当前region第一个有效series）。

### itemLine(Object)

标注点引导线。

#### type(string)

标注点引导线类型。

可选值：
- `'type-s'`: 起点和终点直接连线
- `'type-do'`: 表示包含一个折点，且折点x坐标为起点到终点的 1/2 x坐标，折点y坐标为起点y坐标
- `'type-po'`: 表示包含一个折点，且折点x坐标为终点x坐标，折点y坐标为起点y坐标 
- `'type-op'`: 表示包含一个折点，且折点x坐标为起点x坐标，折点y坐标为终点y坐标
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

引导线起点symbol样式。

{{ use: component-marker-symbol(
  prefix = '####'
) }}

#### endSymbol(Object)

引导线终点symbol样式。

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

标注内容相对于标注点的x方向偏移量。

#### offsetY(number)

标注内容相对于标注点的y方向偏移量。

{{ use: component-marker-ref(
  prefix = '###'
) }}
#### symbol(Object)

##### style(Object)

标注内容类型为symbol时，symbol的样式。

{{ use: graphic-symbol(
  prefix = '#####'
) }}

#### image(Object)

##### style(Object)

标注内容类型为image时，image的样式。

{{ use: graphic-image(
  prefix = '#####'
) }}

#### text(Object)

标注内容类型为text时，text的样式。

{{ use: component-marker-label(
  prefix = '####'
) }}

#### richText(Object)

##### style(Object)

标注内容类型为richText时，richText的样式。

{{ use: graphic-rich-text(
  prefix = '#####'
) }}








