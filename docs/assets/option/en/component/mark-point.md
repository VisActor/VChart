{{ target: component-mark-point }}

## markPoint (Array|Object)

Data mark point.

{{ use: component-base-marker(
  prefix = '##'
) }}

### coordinates(Object)

Mark target: data element.
Specifies the mark area for the data point. Draw the mark area based on the specified data point.

{{ use: component-marker-data-point(
  prefix = '###'
) }}

### position(Object)

Mark target: coordinate point.
Specifies the mark area for the coordinate point. Draw the mark area based on the specified coordinate point.

{{ use: component-marker-point-like(
  prefix = '###'
) }}

### regionRelative(boolean) = false

自 `1.7.0` 版本支持，是否为相对 region 的坐标，默认为 false，即相对画布的坐标，默认 false。

### relativeRelativeSeriesIndex(number)

The index of the series associated with the marked data (defaults to using the first valid series of the current region).

### relativeRelativeSeriesId(string)

The series ID associated with the marked data (defaults to using the first valid series of the current region).

### itemLine(Object)

Mark point guide line.

#### type(string)

Mark point guide line type.

Optional values:

- `'type-s'`: Direct connection between start and end points
- `'type-do'`: Indicates a folding point, where the x-coordinate of the folding point is the x-coordinate of 1/2 from the starting point to the end point, and the y-coordinate of the folding point is the y-coordinate of the starting point
- `'type-po'`: Indicates a folding point, where the x-coordinate of the folding point is the x-coordinate of the end point, and the y-coordinate of the folding point is the y-coordinate of the starting point
- `'type-op'`: Indicates a folding point, where the x-coordinate of the folding point is the x-coordinate of the starting point, and the y-coordinate of the folding point is the y-coordinate of the end point
  For more specific forms, refer to: https://journals.sagepub.com/doi/10.1177/1473871618799500

#### visible(boolean)

Mark point guide line visibility.

#### decorativeLine(Object)

Decorative line perpendicular to the guide line.

##### visible(boolean)

Decorative line visibility.

##### length(boolean)

Decorative line length.

#### startSymbol(Object)

Guide line start point symbol style.

{{ use: component-marker-symbol(
  prefix = '####'
) }}

#### endSymbol(Object)

Guide line end point symbol style.

{{ use: component-marker-symbol(
  prefix = '####'
) }}

#### line(Object)

##### style(Object)

Guide line style.

{{ use: graphic-line(
  prefix = '#####'
) }}

### itemContent(Object)

Mark content.

#### type(string)

Mark content type.

Optional values:

- 'symbol'
- 'text'
- 'image'
- 'richText'

#### position(string)

Position of the mark content relative to the positioning point.

Optional values:

- 'top'
- 'bottom'
- 'middle'
- 'insideTop'
- 'insideBottom'
- 'insideMiddle'

#### offsetX(number)

The x-direction offset of the mark content relative to the mark point.

#### offsetY(number)

The y-direction offset of the mark content relative to the mark point.

#### symbol(Object)

##### style(Object)

For mark content type 'symbol', the symbol style.

{{ use: graphic-symbol(
  prefix = '#####'
) }}

#### image(Object)

##### style(Object)

For mark content type 'image', the image style.

{{ use: graphic-image(
  prefix = '#####'
) }}

#### text(Object)

For mark content type 'text', the text style.

{{ use: component-marker-label(
  prefix = '####'
) }}

#### richText(Object)

##### style(Object)

For mark content type 'richText', the richText style.

{{ use: graphic-rich-text(
  prefix = '#####'
) }}
