{{ target: mark-area }}

<!-- IAreaMarkSpec -->

#${prefix} curveType(string)

Curve interpolation type.

Available options:

- `basis`
- `bundle`
- `cardinal`
- `catmullRom`
- `linear`
- `monotone`
- `monotoneX`
- `monotoneY`
- `natural`
- `step`
- `stepAfter`
- `stepBefore`
- `linearClosed`
- `cardinalClosed`

#${prefix} orient(string) = `horizontal`

Available options:

- `horizontal`: Horizontal
- `vertical`: Vertical

{{ use: graphic-attribute(
  prefix = ${prefix},
) }}