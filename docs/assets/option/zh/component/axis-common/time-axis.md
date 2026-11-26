{{ target: component-time-axis }}

<!-- ICartesianTimeAxisSpec -->

{{ use: component-linear-axis(
  prefix = ${prefix}
) }}

#${prefix} layers(Array)
时间轴的刻度标签最多支持两层。`layers[0]` 对应离轴线最近的第一层。配置 `layers[1]` 可添加第二层，两层可分别设置刻度和时间格式。

##${prefix} tickStep(number)

本层刻度的步长，与时间字段的时间戳单位一致。使用毫秒时间戳时，`86_400_000` 表示 24 小时。

##${prefix} timeFormat(string) = '%Y%m%d'

本层刻度标签的时间格式，例如 `'%Y-%m-%d'` 或 `'%H:%M'`。时间轴的 `label.formatMethod` 接收此处格式化后的字符串，可继续自定义文本。

| **日期粒度** | **格式配置** | **日期内容**         | **示例**  | **数值范围** |
| ------------ | ------------ | -------------------- | --------- | ------------ |
| 年           | %Y           | 年的全称             | 2022      |              |
| 月           | %b           | 简写的月             | Jul       |              |
|              | %B           | 月的全称             | July      |              |
|              | %m           | 月份                 | 7         | [01, 12]     |
| 周           | %a           | 简写的周             | Wed       |              |
|              | %A           | 周的全称             | Wednesday |              |
| 日           | %d           | 使用 0 填补位数的天  | 1         | [01, 31]     |
|              | %e           | 使用空格填补位数的天 | 1         | [ 1, 31]     |
| 时           | %H           | 24 小时制小时        | 1         | [00, 23]     |
|              | %I           | 12 小时制小时        | 1         | [01, 12]     |
|              | %p           | AM 或 PM             | AM        |              |
| 分           | %M           | 分钟                 | 0         | [00, 59]     |
| 秒           | %S           | 秒                   | 0         | [00, 61]     |
| 毫秒         | %L           | 毫秒                 | 1         | [000, 999]   |

##${prefix} timeFormatMode(string) = 'local'

本层标签的显示时区。`'utc'` 使用 UTC，`'local'` 使用运行环境的本地时区。该设置只影响标签文本。

##${prefix} tickCount(number|function) = 5

本层建议的刻度数量，用法与 `tick.tickCount` 相同。

##${prefix} forceTickCount(number)

本层强制生成的刻度数量。
