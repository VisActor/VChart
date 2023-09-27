{{ target: component-mark-area }}

## markArea (Array|Object)

Data annotation area.

{{ use: component-base-marker(
  prefix = '##'
) }}

### x(string|number)

Annotation target: Cartesian coordinate system x-axis space.
The boundary of the annotation area on the x-axis, jointly constructing the annotation area with markArea.x1. It can be configured with values on the x-axis or aggregate calculation types.

{{ use: component-marker-aggregation-type() }}

### x1(string|number)

Annotation target: Cartesian coordinate system x-axis space.
The boundary of the annotation area on the x-axis, jointly constructing the annotation area with markArea.x. It can be configured with values on the x-axis or aggregate calculation types.

{{ use: component-marker-aggregation-type() }}

### y(string|number)

The boundary of the annotation area on the y-axis, jointly constructing the annotation area with markArea.y1. It can be configured with values on the y-axis or aggregate calculation types.

{{ use: component-marker-aggregation-type() }}

### y1(string|number)

The boundary of the annotation area on the y-axis, jointly constructing the annotation area with markArea.y. It can be configured with values on the y-axis or aggregate calculation types.

{{ use: component-marker-aggregation-type() }}

### coordinates(Array)

Annotation target: data elements.
Specify the annotation area for the data points. Draw the annotation area based on the specified data points.

{{ use: component-marker-data-point(
  prefix = '###'
) }}

### positions(Array)

Annotation target: coordinate points.
Specify the annotation area for the coordinate points. Draw the annotation area based on the specified coordinate points.

{{ use: component-marker-point-like(
  prefix = '###'
) }}

{{ use: component-marker-axis(
  prefix = '##'
) }}

### area(Object)

#### style(Object)

The area style of the annotation area.

{{ use: graphic-polygon(
  prefix = '####'
) }}

### label(Object)

The label style of the annotation line.

#### position(Object)

The label position of the annotation area (relative position of the label to the area).

Optional values:

- `'left'`: outside the area on the left
- `'right'`: outside the area on the right
- `'top'`: outside the area on the top
- `'bottom'`: outside the area on the bottom
- `'middle'`: center of the area
- `'insideLeft'`: inside the area on the left
- `'insideRight'`: inside the area on the right
- `'insideTop'`: inside the area on the top
- `'insideBottom'`: inside the area on the bottom

{{ use: component-marker-label(
  prefix = '###',
  noMarkerRef = true
) }}
