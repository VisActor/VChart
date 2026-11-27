{{ target: mark-rect }}

<!-- IRectMarkSpec -->
#${prefix} x1(number|Function)
右下角顶点x坐标。

#${prefix} y1(number|Function)
右下角顶点y坐标。

{{ use: graphic-rect(
  prefix = ${prefix},
  callbackType = '|Function'
) }}

