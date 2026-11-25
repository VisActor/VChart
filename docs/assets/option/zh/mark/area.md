{{ target: mark-area }}

<!-- IAreaMarkSpec -->

#${prefix} curveType(string|Function)

曲线插值类型。

可选值：

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

可选值：

- `horizontal`: 水平
- `vertical`: 垂直

{{ use: graphic-attribute(
  prefix = ${prefix},
  callbackType = '|Function',
) }}
