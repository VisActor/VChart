{{ target: component-mark-line }}

## markLine (Array|Object)

Data label lines.

{{ use: component-base-marker(
   prefix = '##'
) }}

### type(string)= 'type-step'

Used to specify the connection type of auxiliary lines. The connection method of step is composed of alternating horizontal lines and disposal lines.

### connectDirection(string)

Valid when and only when `type: 'type-step'` is declared, used to configure the link direction of the line, optional values: 'top' | 'bottom' | 'left' | 'right'.

### expandDistance(string|number)

Effective when and only when `type: 'type-step'` is declared, used to configure the extension distance in the connection direction.

- number type is pixel value
- The string type is a percentage, relative to the width/height of the region, such as '30%'

### x(string|number|function)

Annotation target: Cartesian coordinate system x coordinate space.
Reference line on the x-axis. You can configure the value of the reference line on the x-axis, or the aggregate calculation type, or calculate it yourself from the data in the form of a callback.

- Relative position (string): Supported since `1.7.0` version, x can be configured in the form of '15%' percentage, which is used to indicate that x is drawn on the horizontal axis (from left to right) of the region where the marker is located. 15/10 position.
- Aggregation calculation type (string)
- Callback

**Notice:**

1. Declare the x attribute separately to draw a label line running through the y-axis.
2. By configuring the y and y1 attributes, you can declare the drawing range of the y-axis
3. Configure the x1, y and y1 attributes to configure the two endpoints of the label line (x, y) and (x1, y1)

{{ use: component-marker-aggregation-type() }}

### y(string|number|function)

Annotation target: Cartesian coordinate system y coordinate space.
The position of the reference line on the y-axis, you can configure the value of the reference line on the y-axis, or aggregate calculation type, or calculate it yourself from the data in the form of a callback.

- Relative position (string): Supported since `1.7.0` version, y can be configured in the form of '15%' percentage, which is used to indicate that y is drawn on the vertical axis (from top to bottom) of the region where the marker is located. 15/10 position.
- Aggregation calculation type (string)
- Callback

{{ use: component-marker-aggregation-type() }}

**Notice:**

1. Declare the y attribute separately to draw a label line running through the x-axis
2. By configuring the x and x1 attributes, you can declare the drawing range of the x-axis
3. Configure the x, x1 and y1 attributes to configure the two endpoints of the label line (x, y) and (x1, y1)

### x1(string|number|function)

Supported since `1.7.3` version, the reference line is at the end position of the x-axis. You can configure the value on the x-axis, or aggregate calculation type, or calculate it yourself from the data in the form of a callback.

**Note that the usage scenarios of this attribute are:**

1. Configure the y, x and x1 properties to draw a label line from x to x1 on the y axis.
2. Configure the x, x1, y and y1 attributes to configure the two endpoints of the label line (x, y) and (x1, y1)

- Relative position (string): x can be configured in the form of '15%' percentage, which is used to indicate that x is drawn on the horizontal axis (from left to right) of the region where the marker is located. 15/10 position.
- Aggregation calculation type (string)
- Callback

{{ use: component-marker-aggregation-type() }}

### y1(string|number|function)

Supported since `1.7.3` version, the end point of the reference line is at the end of the y-axis. You can configure the value on the y-axis, or aggregate calculation type, or calculate it yourself from the data in the form of a callback.

**Note that the usage scenarios of this attribute are:**

1. Configure the x, y and y1 properties to draw a label line from y to y1 on the x axis.
2. Configure the x, x1, y and y1 attributes to configure the two endpoints of the label line (x, y) and (x1, y1)

- Relative position (string): y can be configured in the form of '15%' percentage, which is used to indicate that y is drawn on the vertical axis (from top to bottom) of the region where the marker is located. 15/10 position.
- Aggregation calculation type (string)
- Callback

{{ use: component-marker-aggregation-type() }}

### coordinates(Array)

Label target: data element.
Specifies the label line for the data points. Draw label lines based on specified data points, and perform data processing on the data points.

**For the `type: 'type-step'` type label line, the array length of `coordinates` is 2, indicating the first two data. **

{{ use: component-marker-data-point(
   prefix = '###'
) }}

#### process(Object)

How to process data points. If not configured, it will be directly connected to line according to the coordinate array.

##### x(string)

Aggregate data points based on x-axis related data fields.

{{ use: component-marker-aggregation-type() }}

#####y(string)

Aggregate data points based on y-axis associated data fields.

{{ use: component-marker-aggregation-type() }}

##### xy(string)

Perform regression on the data points.

Optional values:

- `'regression'`: data regression processing

{{ use: component-marker-data-point-offset(
   prefix = '##'
) }}

### positions(Array)

Label target: coordinate point.
Specifies the label line of the coordinate point. Draw annotation lines based on specified coordinate points.

**For `type: 'type-step'` type label line, the array length of `positions` is 2, representing the first two points. **

{{ use: component-marker-point-like(
   prefix = '###'
) }}

### regionRelative(boolean) = false

Supported since `1.7.0` version, Only takes effect when positioning using the `positions` attribute, whether it is the coordinate relative to the region, the default is false, that is, the coordinate relative to the canvas, the default is false.

{{ use: component-marker-axis(
   prefix = '##'
) }}

### line(Object)

Line to label the line.

#### multiSegment(boolean) = false

It takes effect when and only when `type: 'type-step'` is declared. It is used to configure whether to perform multi-segment processing on points. The default is false, that is, all points are directly connected into lines.
If multi-segment processing is required, the points attribute needs to be configured as Point[][] type.

#### mainSegmentIndex(number)

It takes effect when and only when `type: 'type-step'` is declared. When the `multiSegment` attribute is turned on, it is used to declare which line segment is used as the main line segment. If not declared, the entire segment will be used as the main line segment by default.

#### style(Object|Array)

The line style of the dimension line. When performing multi-section configuration, it can be passed in as an array.

{{ use: graphic-line(
   prefix = '####'
) }}

### label(Object)

Label style for dimension lines.

#### position(Object)

The label position of the dimension line (the relative position of the label relative to the line).

Optional values:

- `'start'': outside the starting point of the line
- `'middle'`: midpoint of line
- `'end'': outside the end point of the line
- `'insideStartTop'`: the inside upper part of the line starting point
- `'insideStartBottom'`: the inside lower part of the starting point of the line
- `'insideMiddleTop'`: the upper part of the line midpoint
- `'insideMiddleBottom'`: the lower part of the line midpoint
- `'insideEndTop'`: the inner upper part of the line end point
- `'insideEndBottom'`: the inner lower part of the line end point

{{ use: component-marker-label(
   prefix = '###'
) }}

### startSymbol(Object)

Reference line starting point symbol style

{{ use: component-marker-symbol(
   prefix = '###'
) }}

### endSymbol(Object)

Reference line end point symbol style

{{ use: component-marker-symbol(
   prefix = '###'
) }}
