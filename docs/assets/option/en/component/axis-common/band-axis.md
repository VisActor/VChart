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

#${prefix} bandSize(number)

**Only valid when the axis is a discrete axis**, configure the fixed band width of the discrete axis. Supported since version `1.4.0`.

The visual effect is that regardless of the size of the chart container, the distance between the ticks on the axis remains unchanged (if it is a bar chart, the column width also remains unchanged).

#${prefix} maxBandSize(number)

**Only valid when the axis is a discrete axis**, configure the maximum band width of the discrete axis. Supported since version `1.4.0`.

Since the chart will display all the ticks in the container proportionally by default, the automatically calculated band width will also increase proportionally when the chart container becomes bigger. When the automatically calculated band width is larger than `maxBandSize`, the band width will maintain the value of `maxBandSize`.

When `bandSize` is already configured, `maxBandSize` will no longer take effect.

#${prefix} minBandSize(number)

**Only valid when the axis is a discrete axis**, configure the minimum band width of the discrete axis. Supported since version `1.4.0`.

Since the chart will display all the ticks in the container proportionally by default, the automatically calculated band width will also decrease proportionally when the chart container becomes smaller. When the automatically calculated band width is less than `minBandSize`, the band width will maintain the value of `minBandSize`.

When `bandSize` is already configured, `minBandSize` will no longer take effect.
