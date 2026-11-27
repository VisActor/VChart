{{ target: mark-line }}

<!-- ILineMarkSpec -->

#${prefix} curveType(string|Function)

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

#${prefix} defined(boolean|Function)

Indicates if it is a valid number.

#${prefix} enableSegments(boolean)

A flag to inform Sirius if it should execute the getLineSegmentConfigs method.

#${prefix} strokeBoundsBuffer(number|Function)

The bounded buffer for stroke.

{{ use: graphic-line(
  prefix = ${prefix},
  callbackType = '|Function'
) }}
