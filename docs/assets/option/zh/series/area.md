{{ target: series-area }}

<!-- IAreaSeriesSpec -->

**面积系列**

{{ use: common-cartesian-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = ${seriesType},
  seriesMarks = ['line', 'point', 'area'],
  preset = 'clipIn' + '|' + 'fadeIn' + '|' + 'grow',
  defaultPreset = 'clipIn'
) }}

#${prefix} seriesMark('point'|'line'|'area') = 'area'

自 `1.2.0` 版本开始支持，用于配置面积系列主 mark 类型配置，该配置会影响图例的展示。

#${prefix} area(Object)

area 图元样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'area'
) }}

{{ use: mark-area(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} line(Object)

line 图元样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'line'
) }}

{{ use: mark-line(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} point(Object)

point 图元样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'point'
) }}

{{ use: mark-point(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

##${prefix} invalidType(string) = 'break'

非合规数据点连接方式。null，undefined 等非法数据点连接方式。

- 'break'指在该数据点处断开
- 'link' 指忽略该点保持连续
- 'zero' 指该点默认数值为 0
- 'ignore' 指不处理

#${prefix} label(Object)

标签配置。

##${prefix} position(string|Function) = 'top'

标签位置。

自 `1.6.0` 版本后，柱系列中，`position` 配置可以为函数形式，例如：

```ts
label: {
  position: (datum: any) => {
    return datum.year === '2000' ? 'top' : 'bottom';
  };
}
```

可选字符串值为：

- `'top'`
- `'bottom'`
- `'left'`
- `'right'`
- `'top-right'`
- `'top-left'`
- `'bottom-right'`
- `'bottom-left'`
- `'center'`

{{ use: component-label(
  prefix = '#' + ${prefix},
  noPosition = true,
  hasOverlap = true,
  hasSmartInvert = true,
  defaultOffset = 5,
) }}

#${prefix} totalLabel(Object)

总计标签，当图表在堆叠场景时生效。自`1.3.0`版本开始支持。

{{ use: component-label(
  prefix = '#' + ${prefix},
  noPosition = true,
  hasOverlap = false,
  hasSmartInvert = false,
  defaultOffset = 5,
  ignoreCustom = true
) }}
