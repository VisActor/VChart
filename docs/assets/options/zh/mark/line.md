{{ target: mark-line }}

<!-- ILineMarkSpec -->

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

#${prefix} defined(boolean)

是否是有效数字。

#${prefix} enableSegments(boolean)

一个标志位，用于通知 sirius 是否执行 getLineSegmentConfigs 方法。

#${prefix} strokeBoundsBuffer(number)

stroke 的有界缓冲区。

{{ use: graphic-line(
  prefix = ${prefix}
) }}
