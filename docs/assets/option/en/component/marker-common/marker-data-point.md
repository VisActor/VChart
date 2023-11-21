{{ target: component-marker-data-point }}

#${prefix} [key(string | number)](string | number)

Data or aggregation method configuration.

Optional values:

- 'sum'
- 'average'
- 'min'
- 'max'
- 'variance'
- 'standardDeviation'
- 'median'

#${prefix} refRelativeSeriesIndex(number)

The specific series index related to a data element (only valid under the target: data element).

#${prefix} refRelativeSeriesId(string)

The specific series ID related to a data element (only valid under the target: data element).

#${prefix} xFieldIndex(number) = 0

Supported since `1.7.0` version, used to specify which dimension index on xField to use, because xField field may contain multiple dimensions, such as grouping scenarios. The default value is 0.

#${prefix}xFieldDim(string)

Supported since `1.7.0` version, specify the dimension name on xField, because xField field may contain multiple dimensions, such as grouping scenarios.

`xFieldIndex` and `xFieldDim` can be declared only once. If they are declared at the same time, `xFieldDim` will have a higher priority.

#${prefix} yFieldIndex(number) = 0

Supported since version `1.7.0`, specify the dimension index on yField to use, because the yField field may contain multiple dimensions, such as grouping scenarios. The default value is 0.

#${prefix} yFieldDim(string)

Supported since `1.7.0` version, specify the dimension name on yField, because the yField field may contain multiple dimensions, such as grouping scenarios.

`yFieldIndex` and `yFieldDim` can be declared only once. If they are declared at the same time, `yFieldDim` will have a higher priority.
