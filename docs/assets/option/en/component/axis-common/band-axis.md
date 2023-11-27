{{ target: component-band-axis }}

<!-- IBandAxisSpec -->

#${prefix} trimPadding(boolean)

Supported since `1.7.0` version, used to configure whether to remove the white space at both ends of the band axis. If true, there will be no white space at both ends, **and the settings of bandPadding, paddingInner and paddingOuter will be ignored**.

#${prefix} bandPadding(number|number[])
default value is `0.2`.

**Only valid when the axis is a discrete axis**, used to set `paddingInner` and `paddingOuter` of the axis at the same time, the value is between (0,1), the priority is lower than `paddingInner` and `paddingOuter`.

**Because there may be multi-layer scales (xField is set to an array, that is, a grouping scene), the array type is supported for bandPadding configuration of multi-layer scales**

#${prefix} paddingInner(number|number[])
default value is `0.1`.

**Only takes effect when the axis is a discrete axis**, the interval within the axis group, the value is between (0,1), and the priority is higher than `bandPadding`.

** Because there may be multi-layer scales (xField is set to an array, that is, a grouping scene), the array type is supported, which is used for the paddingInner configuration of multi-layer scales. **

For more information, please refer to https://github.com/d3/d3-scale#band-scales.

#${prefix} paddingOuter(number|number[])
default value is `0.3`.

**Only effective when the axis is a discrete axis**, the interval outside the axis group, the value is between (0,1), and the priority is higher than `bandPadding`.

**Because there may be multi-layer scales (xField is set to an array, that is, a grouping scene), the array type is supported for the paddingOuter configuration of multi-layer scales.**

For more information, please refer to https://github.com/d3/d3-scale#band-scales.

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

#${prefix} autoRegionSize(boolean)

**Only valid when the axis is a discrete axis**，configure whether to automatically calculate region width or height based on band size. Supported since version `1.4.0`.

This configuration only takes effect when `bandSize` or `maxBandSize` has already been configured.
