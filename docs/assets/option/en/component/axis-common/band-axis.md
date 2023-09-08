{{ target: component-band-axis }}

<!-- IBandAxisSpec -->
<!-- TODO: Inaccurate description -->

#${prefix} bandPadding(number|number[]) = 0.2

**Effective only when the axis is a discrete axis**. The interval between axis groups, with values between (0, 1).

#${prefix} paddingInner(number|number[])

**Effective only when the axis is a discrete axis**. The interval within axis groups, with values between (0, 1).

#${prefix} paddingOuter(number|number[])

**Effective only when the axis is a discrete axis**. The interval outside axis groups, with values between (0, 1).

#${prefix} domain(array)

**Only valid when the axis is a discrete axis**, configure the value range of the discrete axis.