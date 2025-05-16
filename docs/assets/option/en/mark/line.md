{{ target: mark-line }}

<!-- ILineMarkSpec -->

#${prefix} curveType(string|function)

Curve interpolation type.

Available options:

- `basis`
- `linear`
- `monotone`
- `monotoneX`
- `monotoneY`
- `step`
- `stepAfter`
- `stepBefore`
- `linearClosed`
- `catmullRom`
- `catmullRomClosed`

#${prefix} defined(boolean|function)

Indicates if it is a valid number.

#${prefix} enableSegments(boolean|function)

A flag to inform Sirius if it should execute the getLineSegmentConfigs method.

#${prefix} strokeBoundsBuffer(number|function)

The bounded buffer for stroke.

{{ use: graphic-line(
  prefix = ${prefix}
) }}
