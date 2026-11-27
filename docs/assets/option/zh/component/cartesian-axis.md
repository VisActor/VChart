{{ target: component-cartesian-axis }}

<!-- 直角坐标系下的坐标轴配置 -->
<!-- ICartesianAxisSpec -->

## axes(Array|Object)

直角坐标系下坐标轴配置，支持：

- 线性轴：`type: 'linear'`
- 离散轴：`type: 'band'`
- 时间轴：`type: 'time'`
- log 轴：`type: 'log'`
- symlog 轴：`type: 'symlog'`

注：直方图不支持离散轴，因为直方图用于统计数据区间内的频率分布，主轴必须以数值区间的形式传入，离散轴不支持该功能。

轴类型对应 scale 类型

- 笛卡尔坐标系下，x 轴默认为 'band'，y 轴默认为 'linear'，当 `direction` 为 'horizontal' 时，x 轴默认为 'linear'，y 轴默认为 'band'。
- 极坐标系下，半径轴默认为 'linear'，角度轴默认为 'band'。

**如果需要在一个图表中绘制多个坐标轴，需要使用数组配置。**

## axes.linear(Object)

线性轴配置。

### type(string) = 'linear'

声明线性轴。

{{ use: component-base-axis(
  prefix = '##',
  coordType = 'cartesian',
  type='linear'
) }}

{{ if: !${noBandAxis} }}

## axes.band(Object)

离散轴配置。

### type(string) = 'band'

声明离散轴。

{{ use: component-base-axis(
  prefix = '##',
  coordType = 'cartesian',
  type='band'
) }}
{{ /if }}

## axes.time(Object)

时间轴按实际时间间隔定位数据点。时间字段使用毫秒级 Unix 时间戳。`Date` 对象可用 `.getTime()` 转换，ISO 8601 字符串（如 `'2023-10-05T12:00:00.000Z'`）可用 `Date.parse()` 转换。显式配置的 `min` 和 `max` 也使用毫秒时间戳。

通过 `layers[0].timeFormat` 和 `layers[0].timeFormatMode` 设置第一层刻度标签。用法和可运行示例见[坐标轴教程](/vchart/guide/tutorial_docs/Chart_Concepts/Axes)。

### type(string) = 'time'

声明时间轴。

{{ use: component-base-axis(
  prefix = '##',
  coordType = 'cartesian',
  type='time'
) }}

## axes.log(Object)

自`1.2.0`版本开始支持，log 轴配置。

### type(string) = 'log'

声明 log 轴。

{{ use: component-base-axis(
  prefix = '##',
  coordType = 'cartesian',
  type='log'
) }}

## axes.symlog(Object)

自`1.3.0`版本开始支持，symlog 轴配置。

### type(string) = 'symlog'

声明 symlog 轴。

{{ use: component-base-axis(
  prefix = '##',
  coordType = 'cartesian',
  type='symlog'
) }}
