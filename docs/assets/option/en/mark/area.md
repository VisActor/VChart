{{ target: mark-area }}

<!-- IAreaMarkSpec -->

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

#${prefix} orient(string|Function) = `horizontal`

Available options:

- `horizontal`: Horizontal
- `vertical`: Vertical

{{ use: graphic-attribute(
  prefix = ${prefix},
  callbackType = '|Function',
) }}
