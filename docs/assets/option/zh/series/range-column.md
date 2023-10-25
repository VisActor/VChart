{{ target: series-range-column }}

<!-- IRangeColumnSeriesSpec -->

**区间柱系列**

{{ use: common-cartesian-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'rangeColumn',
  seriesMarks = ['bar'],
  preset = 'grow' + '|' + 'fadeIn',
  defaultPreset = 'grow'
) }}

#${prefix} bar(Object)

bar 图元样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'bar'
) }}

{{ use: mark-rect(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} label(Object)

标签配置。

##${prefix} position(string)

标签位置。支持两端显示 `bothEnds`。可选值为：

- `middle`
- `start`
- `end`
- `bothEnd`

{{ use: component-label(
  prefix = '#' + ${prefix},
  noPosition = true,
  hasOverlap = true,
  hasSmartInvert = true,
  defaultOffset = 0,
) }}

##${prefix} minLabel(Object)

最小值标签配置。

###${prefix} visible(boolean)

是否可见。

###${prefix} position(string)

标签位置。可选值为：

- `start`
- `end`
- `bothEnd`

###${prefix} offset(number)

标签偏移量。

###${prefix} formatMethod(Function)

文本格式化函数。
(text: string | string[], datum?: any) => string | string[]

- 输入字段： `text` 文本内容。
- 输入字段： `datum` 文本对应的数据记录
- 输出字段： 格式化后的文本

##${prefix} maxLabel(Object)

最大值标签配置。

###${prefix} visible(boolean)

是否可见。

###${prefix} position(string)

标签位置。可选值为：

- `start`
- `end`
- `bothEnd`

###${prefix} offset(number)

标签偏移量。

###${prefix} formatMethod(Function)

文本格式化函数。
(text: string | string[], datum?: any) => string | string[];

- 输入字段： `text` 文本内容。
- 输入字段： `datum` 文本对应的数据记录
- 输出字段： 格式化后的文本

#${prefix} minField(string)

区间最小值字段。

#${prefix} maxField(string)

区间最大值字段。

{{
  use: series-bar-style(
    prefix = ${prefix},
  )
}}
