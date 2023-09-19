{{ target: series-pie }}

<!-- IPieSeriesSpec -->

**扇区系列**

{{ use: common-polar-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'pie',
  noCategoryField = true
) }}

#${prefix} categoryField(string)

分类字段。
默认饼图每个扇区为独立的系列。

#${prefix} valueField(string)

数值字段。

#${prefix} centerX(number)

饼图中心点 x 坐标。

#${prefix} centerY(number)

饼图中心点 y 坐标。

#${prefix} centerOffset(number)

用于配置饼图中扇区中心的偏移，用于想强调或突出某一个或几个扇形的场景。如下所示：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/2894f40f27a9380faa39de500.png)

如果想要配置饼图扇区在 hover/selected 交互状态下进行偏移的话，可以在 pie.state 中配置，如下：

```ts
pie: {
  state: {
    hover: {
      centerOffset: 10,
    },
    selected: {
      centerOffset: 10
    }
  }
}
```

#${prefix} outerRadius(number)

饼图扇区外半径。默认值为 0.6。

#${prefix} outerRadius(number)

饼图扇区内半径。默认值为 0。

#${prefix} cornerRadius(number)

饼图扇区圆角半径。默认值为 0。

#${prefix} startAngle(number)

扇区起始角度。

#${prefix} endAngle(number)

扇区结束角度。

#${prefix} padAngle(number)

扇区间隔角度。

#${prefix} minAngle(number)

自 `1.4.0` 版本开始支持，用于配置最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互。

#${prefix} pie(Object)

扇区图元样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'arc'
) }}

{{ use: mark-arc(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} label(Object)

标签配置。

{{ use: component-label(
  prefix = '#' + ${prefix},
) }}

<!-- IArcLabelSpec -->

##${prefix} position(string)

标签布局方式。
默认值为`'outside'`。

可选值：

- `'outside'`
- `'inside'`

##${prefix} coverEnable(boolean)

是否允许标签重叠。
默认值为`false`。

##${prefix} rotate(boolean)

是否允许标签旋转。
默认值为`true`。

##${prefix} spaceWidth(number)

文字与引导线间隔宽度。
默认值为`5`。

##${prefix} layoutArcGap(number)

扇区间标签的间隔。
默认值为`6`。

##${prefix} line(Object)

标签引导线样式。

###${prefix} visible(boolean)

是否显示引导线。
默认值为`true`。

###${prefix} line1MinLength(number)

引导线 line1 部分最小长度。
默认值为`20`。

###${prefix} line2MinLength(number)

引导线 line2 部分最小长度。
默认值为`10`。

###${prefix} smooth(boolean)

引导线是否光滑。
默认值为`false`。
从 1.4.0 版本开始支持。

{{ use: common-mark(
  prefix = '##' + ${prefix}
) }}

###${prefix} style(Object)

引导线样式。

{{ use: mark-style(
  markName = 'line'
) }}

{{ use: mark-path(
  prefix = '###' + ${prefix}
) }}

###${prefix} state(Object)

{{ use: mark-state-style() }}

##${prefix} layout(Object)

标签布局配置。

###${prefix} textAlign(string)

标签对齐方式。
默认值为`'arc'`。

可选值：

- `'arc'`
- `'labelLine'`
- `'edge'`

###${prefix} strategy(string)

标签布局策略。
默认值为`'priority'`。

可选值：

- `'priority'`
- `'vertical'`
- `'none'`

###${prefix} tangentConstraint(boolean)

是否启用切线约束。
默认值为`true`。
