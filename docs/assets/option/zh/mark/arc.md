{{ target: mark-arc }}

<!-- IArcMarkSpec -->

#${prefix} startAngle(number|Function)

圆弧起始角度。

#${prefix} endAngle(number|Function)

圆弧终止角度。

#${prefix} padAngle(number|Function)

圆弧两侧的空白填充为角度。

#${prefix} innerRadius(number|Function)

圆弧内半径。

#${prefix} outerRadius(number|Function)

圆弧外半径。

#${prefix} cornerRadius(number|Function)

圆弧角半径。

#${prefix} centerOffset(number|Function)

圆弧中心点偏移距。

#${prefix} cap(boolean|Function)

圆角是否伸出 startAngle 和 endAngle 之外。

#${prefix} autoCapConical(boolean|Function)

圆弧在`cap = true`且应用环形渐变时是否对 cap 部分生效。

{{ use: graphic-arc(
  prefix = ${prefix},
  callbackType = '|Function',
  markType = 'arc'
) }}
