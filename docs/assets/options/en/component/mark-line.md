{{ target: component-mark-line }}

## markLine (Array|Object)

Data marking line.

{{ use: component-base-marker(
  prefix = '##'
) }}

### x(string|number)

Marking target: Cartesian coordinate system x coordinate space.
Marking line on the x-axis. The value or aggregation calculation type on the x-axis can be configured.

{{ use: component-marker-aggregation-type() }}

### y(string|number)

Marking target: Cartesian coordinate system y coordinate space.
Marking line on the y-axis. The value or aggregation calculation type on the y-axis can be configured.

{{ use: component-marker-aggregation-type() }}

### coordinates(Array)

Marking target: Data elements.
Marking line of specified data points. Drawing marking lines based on specified data points, data points can be processed.

{{ use: component-marker-data-point(
  prefix = '###'
) }}

#### process(Object)

Data point processing method. If not configured, the coordinate array is directly connected to form a line.

##### x(string)

Aggregate processing of data points based on x-axis related data fields.

{{ use: component-marker-aggregation-type() }}

##### y(string)

Aggregate processing of data points based on y-axis related data fields.

{{ use: component-marker-aggregation-type() }}

##### xy(string)

Regression processing of data points.

Optional values:
- `'regression'`: Data regression processing

### positions(Array)

Marking target: coordinate points.
Marking lines of specified coordinate points. Drawing marking lines based on specified coordinate points.

{{ use: component-marker-point-like(
  prefix = '###'
) }}

{{ use: component-marker-axis(
  prefix = '##'
) }}

### line(Object)

#### style(Object)

Marking line's line style.

{{ use: graphic-line(
  prefix = '####'
) }}

### label(Object)

Marking line's label style.

#### position(Object)

Marking line's label position (relative position of the label to the line).

Optional values:
- `'start'`: Outside of the line's starting point
- `'middle'`: Middle of the line
- `'end'`: Outside of the line's end point
- `'insideStartTop'`: Inside top of the line's starting point
- `'insideStartBottom'`: Inside bottom of the line's starting point
- `'insideMiddleTop'`: Upper part of the line's middle
- `'insideMiddleBottom'`: Lower part of the line's middle
- `'insideEndTop'`: Inside top of the line's end point
- `'insideEndBottom'`: Inside bottom of the line's end point

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