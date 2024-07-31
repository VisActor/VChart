{{ target: series-pie }}

<!-- IPieSeriesSpec -->

**Sector Series**

{{ use: common-polar-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'pie',
  seriesMarks = ['pie'],
) }}

#${prefix} categoryField(string)

Category field.
By default, each sector of the pie chart is an independent series.

#${prefix} valueField(string)

Value field.

#${prefix} centerX(number)

Pie chart center point x coordinate.

#${prefix} centerY(number)

Pie chart center point y coordinate.

#${prefix} centerOffset(number)

Configuration for the offset of the sectors in the pie chart, used for scenarios where emphasizing or highlighting one or a few sectors is desired. As shown below:

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/2894f40f27a9380faa39de500.png)

To configure the pie chart sector offset in hover/selected interaction, you can configure in pie.state, as follows:

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

Pie chart outer sector radius. The default value is 0.6.

#${prefix} outerRadius(number)

Pie chart inner sector radius. The default value is 0.

#${prefix} cornerRadius(number)

Pie chart sector corner radius. The default value is 0.

#${prefix} startAngle(number)

Sector start angle.

#${prefix} endAngle(number)

Sector end angle.

#${prefix} padAngle(number)

Sector spacing angle.

#${prefix} minAngle(number)

Supported since version `1.4.0`, it is used to configure the minimum sector angle (0 ~ 360) to prevent a certain value from being too small, causing the sector to be too small and affecting interaction.

#${prefix} pie(Object)

Sector graphic style configuration.

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

Label configuration.

{{ use: component-label(
  prefix = '#' + ${prefix},
) }}

<!-- IArcLabelSpec -->

##${prefix} position(string)

Label layout mode.
The default value is `'outside'`.

Optional values:

- `'outside'`
- `'inside'`
- `'inside-outer'`
- `'inside-inner'`

##${prefix} offsetRadius(number)

自`1.4.2`版本开始支持，标签距离外半径或内半径的径向偏移值。

如果 `posision` 设为 `'inside-outer'`，则相对于外半径，如果 `posision` 设为 `'inside-inner'`，则相对于内半径。

##${prefix} coverEnable(boolean)

Allow label overlapping.
The default value is `false`.

##${prefix} rotate(boolean)

Allow label rotation.
The default value is `true`.

##${prefix} spaceWidth(number)

Text and guide line spacing width.
The default value is `5`.

##${prefix} layoutArcGap(number)

Gap between sector labels.
The default value is `6`.

##${prefix} line(Object)

Label guide line style.

###${prefix} visible(boolean)

Display guide line.
The default value is `true`.

###${prefix} line1MinLength(number)

Guide line line1 part minimum length.
The default value is `20`.

###${prefix} line2MinLength(number)

Guide line line2 part minimum length.
The default value is `10`.

###${prefix} smooth(boolean)

Whether the guide line is smooth.
The default value is `false`.
Supported since version 1.4.0.

{{ use: common-mark(
  prefix = '##' + ${prefix}
) }}

###${prefix} style(Object)

Guide line style.

{{ use: mark-style(
  markName = 'line'
) }}

{{ use: mark-path(
  prefix = '###' + ${prefix}
) }}

###${prefix} state(Object)

{{ use: mark-state-style() }}

##${prefix} layout(Object)

Label layout configuration.

###${prefix} align(string)

Label alignment mode.
The default value is `'arc'`.

Optional values:

- `'arc'`
- `'labelLine'`
- `'edge'`

###${prefix} strategy(string)

Label layout strategy.
The default value is `'priority'`.

Optional values:

- `'priority'`
- `'vertical'`
- `'none'`

###${prefix} tangentConstraint(boolean)

Enable tangent constraint.
The default value is `true`.

#${prefix} emptyPlaceholder(Object)

Set the placeholder to be displayed when data is empty.

##${prefix} showEmptyCircle(Boolean)

Supported since version `1.12.0`.
Determines whether to show a placeholder circle when data is empty.
The default value is `false`.

##${prefix} emptyCircle(Object)

Empty circle style configuration.

```ts
emptyPlaceholder: {
  showEmptyCircle: true,
  emptyCircle: {
    style: {
      innerRadius: 0.5,
      fill: '#66ccff'
    }
  }
}
```

#${prefix} showAllZero(boolean)

Determines whether to display evenly divided sectors when all data are 0.
The default value is `false`.
