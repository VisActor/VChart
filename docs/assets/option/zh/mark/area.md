{{ target: mark-area }}

<!-- IAreaMarkSpec -->

#${prefix} curveType(string)

曲线插值类型。

可选值：

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

可选值：

- `horizontal`: 水平
- `vertical`: 垂直

{{ use: graphic-attribute(
  prefix = ${prefix},
) }}
