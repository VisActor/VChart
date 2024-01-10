{{ target: component-time-axis }}

<!-- ICartesianTimeAxisSpec -->

{{ use: component-linear-axis(
  prefix = ${prefix}
) }}

#${prefix} layers(array)
轴的层级配置。目前仅支持单层 / 双层，即layers.length <= 2。
其中，`layer[0]` 为主轴，即离坐标轴线最近的轴。

##${prefix} tickStep(number)

tick间隔。

##${prefix} timeFormat(string) = '%Y%m%d'

时间转换格式。

| **日期粒度** | **格式配置** | **日期内容**   | **示例**    | **数值范围**   |
|----------|----------|------------|-----------|------------|
| 年        | %Y       | 年的全称       | 2022      |            |
| 月        | %b       | 简写的月       | Jul       |            |
|          | %B       | 月的全称       | July      |            |
|          | %m       | 月份         | 7         | [01, 12]   |
| 周        | %a       | 简写的周       | Wed       |            |
|          | %A       | 周的全称       | Wednesday |            |
| 日        | %d       | 使用0填补位数的天  | 1         | [01, 31]   |
|          | %e       | 使用空格填补位数的天 | 1         | [ 1, 31]   |
| 时        | %H       | 24小时制小时    | 1         | [00, 23]   |
|          | %I       | 12小时制小时    | 1         | [01, 12]   |
|          | %p       | AM或PM      | AM        |            |
| 分        | %M       | 分钟         | 0         | [00, 59]   |
| 秒        | %S       | 秒          | 0         | [00, 61]   |
| 毫秒       | %L       | 毫秒         | 1         | [000, 999] |

##${prefix} timeFormatMode(string) = 'local'

时间转换模式。支持`'utc' | 'local'`模式。

##${prefix} tickCount(string) = 10

期望的连续轴tick数量。

##${prefix} forceTickCount(string) = 10

强制设置tick数量。
