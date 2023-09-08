{{ target: series-bar-style }}

#${prefix} barWidth(number)

The width of the bar, in px. If not configured, it will be adaptive by default.

#${prefix} barMinWidth(number)

The minimum width of the bar, in px.

#${prefix} barMaxWidth(number)

The maximum width of the bar, in px.

#${prefix} barGapInGroup(number|string)

Supported since `1.2.0` version, it is used to adjust the column spacing in each group in the grouped column chart. You can set absolute pixel values or use percentages (such as '10%'). When there are multiple layers of grouping, arrays can be used to set the spacing of different levels, such as [10, '20%'], which means that the spacing of the first level grouping is 10px, and the spacing of the second level grouping is '20%'.

If the number of arrays of `barGapInGroup` is less than the number of grouping layers, the last value will be used for the subsequent grouping gaps.

- `number` represents the pixel value
- `string` percentage usage, such as '10%', the value corresponds to the bandWidth ratio of the scale corresponding to the last grouping field (because the columns are of equal width, the scale of the last layer grouping is used)
