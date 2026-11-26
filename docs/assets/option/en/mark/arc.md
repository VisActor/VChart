{{ target: mark-arc }}

<!-- IArcMarkSpec -->

#${prefix} startAngle(number|Function)

Arc start angle.

#${prefix} endAngle(number|Function)

Arc end angle.

#${prefix} padAngle(number|Function)

Padding angle on both sides of the arc.

#${prefix} innerRadius(number|Function)

Inner radius of the arc.

#${prefix} outerRadius(number|Function)

Outer radius of the arc.

#${prefix} cornerRadius(number|Function)

Corner radius of the arc.

#${prefix} centerOffset(number|Function)

Offset distance of the arc center point.

#${prefix} cap(boolean|Function)

Whether the rounded corners extend beyond the startAngle and endAngle.

#${prefix} autoCapConical(boolean|Function)

Whether the cap part is effective when the arc has `cap = true` and applies a ring gradient.

{{ use: graphic-arc(
  prefix = ${prefix},
  callbackType = '|Function',
  markType = 'arc'
) }}
