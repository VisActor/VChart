{{ target: mark-link-path }}

#${prefix} x0(number|Function)

x0 coordinate.

#${prefix} y0(number|Function)

y0 coordinate.

#${prefix} x1(number|Function)

x1 coordinate.

#${prefix} y1(number|Function)

y1 coordinate.

#${prefix} thickness(number|Function)

Thickness.

#${prefix} curvature(number|Function)

Curvature.

#${prefix} round(boolean|Function)

Round all coordinates.

#${prefix} ratio(number|Function)

Ratio of ordinary style path.

#${prefix} align(string|Function)

Alignment.

Optional values:

- `start`
- `end`
- `center`

#${prefix} pathType(string|Function)

Path type.

Optional values:

- `line`
- `smooth`
- `polyline`

#${prefix} endArrow(boolean|Function)

Whether there is an end arrow.

#${prefix} startArrow(boolean|Function)

Whether there is a start arrow.

#${prefix} backgroundStyle(any|Function)

Background style configuration.

#${prefix} direction(string|Function)

Direction.

Optional values:

- `horizontal`
- `vertical`
- `LR`
- `RL`
- `TB`
- `BL`
- `radial`

{{ use: graphic-attribute(
  prefix = ${prefix},
  callbackType = '|Function',
) }}