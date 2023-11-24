{{ target: component-marker-data-point }}

#${prefix} [key(string | number)](string | number)

数据或聚合方式配置。

可选值：

- 'sum'
- 'average'
- 'min'
- 'max'
- 'variance'
- 'standardDeviation'
- 'median'

#${prefix} refRelativeSeriesIndex(number)

具体某个数据元素关联的 series 索引（仅在标注目标：数据元素下有效）。

#${prefix} refRelativeSeriesId(string)

具体某个数据元素关联的 series ID（仅在标注目标：数据元素下有效）。

#${prefix} xFieldIndex(number) = 0

自 `1.7.0` 版本开始支持，用于指定使用 xField 上的那个维度索引，因为 xField 字段有可能会包含多个维度，比如分组场景。默认值为 0。

#${prefix} xFieldDim(string)

自 `1.7.0` 版本开始支持，指定使用 xField 上的维度名称，因为 xField 字段有可能会包含多个维度，比如分组场景。

`xFieldIndex` 和 `xFieldDim` 声明一个即可，同时声明则 `xFieldDim` 优先级更高。

#${prefix} yFieldIndex(number) = 0

自 `1.7.0` 版本开始支持，指定使用 yField 上的那个维度索引，因为 yField 字段有可能会包含多个维度，比如分组场景。默认值为 0。

#${prefix} yFieldDim(string)

自 `1.7.0` 版本开始支持，指定使用 yField 上的维度名称，因为 yField 字段有可能会包含多个维度，比如分组场景。

`yFieldIndex` 和 `yFieldDim` 声明一个即可，同时声明则 `yFieldDim` 优先级更高。
