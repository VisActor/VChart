{{ target: component-band-axis }}

<!-- IBandAxisSpec -->

#${prefix} bandPadding(number|number[]) = 0.2

**Only valid when the axis is a discrete axis**, used to set `paddingInner` and `paddingOuter` of the axis at the same time, the value is between (0,1), the priority is lower than `paddingInner` and `paddingOuter`.

**Because there may be multi-layer scales (xField is set to an array, that is, a grouping scene), the array type is supported for bandPadding configuration of multi-layer scales**

#${prefix} paddingInner(number|number[]) = 0.1

**Only takes effect when the axis is a discrete axis**, the interval within the axis group, the value is between (0,1), and the priority is higher than `bandPadding`.

** Because there may be multi-layer scales (xField is set to an array, that is, a grouping scene), the array type is supported, which is used for the paddingInner configuration of multi-layer scales. **

For more information, please refer to https://github.com/d3/d3-scale#band-scales.

#${prefix} paddingOuter(number|number[]) = 0.3

**Only effective when the axis is a discrete axis**, the interval outside the axis group, the value is between (0,1), and the priority is higher than `bandPadding`.

** Because there may be multi-layer scales (xField is set to an array, that is, a grouping scene), the array type is supported for the paddingOuter configuration of multi-layer scales. **

For more information, please refer to https://github.com/d3/d3-scale#band-scales.

#${prefix} domain(array)

**Only valid when the axis is a discrete axis**, configure the numerical range of the discrete axis.
