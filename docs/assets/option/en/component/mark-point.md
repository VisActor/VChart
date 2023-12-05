{{ target: component-mark-point }}

## markPoint (Array|Object)

Data mark point.

{{ use: component-base-marker(
  prefix = '##'
) }}

### x(string|number|function)

Supported since version `1.7.3`, the reference point is at the starting point of the x-axis. The value on the x-axis can be configured, or the aggregate calculation type, or calculated by itself through the data in the form of a callback.

- Relative position (string): x can be configured as a '15%' percentage, which means that the position is located at 15 percent of the region's horizontal axis (from left to right).
- Aggregation calculation type (string)
- Callback

{{ use: component-marker-aggregation-type() }}

### y(string|number|function)

Supported since `1.7.3` version, the position of the reference point on the y-axis can be configured with the value of the reference line on the y-axis, or the aggregate calculation type, or calculated by itself through data in the form of a callback.

- Relative position (string): y can be configured as a '15%' percentage, which means that the position is located at 15 percent of the region's vertical axis (from top to bottom).
- Aggregation calculation type (string)
- Callback

{{ use: component-marker-aggregation-type() }}

### coordinates(Object)

Mark target: data element.
Specifies the mark area for the data point. Draw the mark area based on the specified data point.

{{ use: component-marker-data-point(
  prefix = '###'
) }}

{{ use: component-marker-data-point-offset(
   prefix = '##',
   isSingle = true
) }}

### position(Object)

Mark target: coordinate point.
Specifies the mark area for the coordinate point. Draw the mark area based on the specified coordinate point.

{{ use: component-marker-point-like(
  prefix = '###'
) }}

### regionRelative(boolean) = false

Supported since `1.7.0` version, it only takes effect when positioning using the `position` attribute. Whether it is the coordinate relative to the region, the default is false, that is, the coordinate relative to the canvas, the default is false.

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
