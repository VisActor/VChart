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

#${prefix} centerX (Number|String)

The x-coordinate of the pie chart center, supporting two formats:

- `number`: Specific coordinate value
- `string`: A percentage string like `50%`, calculating the coordinate relative to the layout width (supported since version **1.12.10**)

#${prefix} centerY (Number|String)

The y-coordinate of the pie chart center, supporting two formats:

- `number`: Specific coordinate value
- `string`: A percentage string like `50%`, calculating the coordinate relative to the layout height (supported since version **1.12.10**)

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

#${prefix} layoutRadius(string|number|function)

Introduced in version **1.11.12**

The layout radius of the polar coordinate, which is the base value for calculating the inner and outer radii. The optional values are as follows:

- Not set: The default value is `Math.min(width, height) / 2`, which is equivalent to this effect before version **1.11.2**
- `'auto'`: Automatically calculate the maximum available layout radius based on `center`, `startAngle`, and `endAngle`
- Custom function, the type definition of the function is as follows:

```ts
(layoutRect: { width: number; height: number }, center: { x: number; y: number }) => number;
```

#${prefix} outerRadius(number)

Pie chart outer sector radius. The default value is 0.6.

#${prefix} innerRadius(number)

Pie chart inner sector radius. The default value is 0.

#${prefix} cornerRadius(number)

I. Value Description
- `0`: No corner radius effect, sector edges remain sharp and angular
- `0.1 - 0.3`: Slight corner radius effect, suitable for most business presentation scenarios
- `0.4 - 0.7`: Pronounced corner radius effect, creates a more modern look
- `0.8 - 1.0`: Maximum corner radius effect, sector edges become almost completely smooth

II. Differences between cornerRadius and pie.style.cornerRadius
1️⃣ Configuration Level Comparison

| Config Item | cornerRadius | pie.style.cornerRadius |
|------------|-------------|----------------------|
| Position | Top-level chart config | Inside pie.style config object |
| Syntax | `cornerRadius: number` | `cornerRadius: number \| Function` |

2️⃣ Feature Comparison

| Feature | cornerRadius | pie.style.cornerRadius |
|---------|-------------|----------------------|
| Data Type | Numbers only | Supports numbers and callback functions |
| Scope | Global uniform | Can control each sector independently |
| Data Access | Not supported | Can access current sector data |
| Dynamic Calculation | Not supported | Supports data-driven calculation |
| Priority | Low | High (overrides global config) |

3️⃣ Application Scenarios

① cornerRadius Suitable Scenarios
- ✨ When all sectors need uniform corner radius
- ✨ For simple and straightforward configuration
- ✨ When performance is a priority

② pie.style.cornerRadius Suitable Scenarios
- 🎨 Need different corner radius based on data
- 🎨 Need to highlight specific sectors
- 🎨 Need interactive corner radius changes

4️⃣ Performance Considerations

① cornerRadius
✅ Low computation overhead  
✅ High rendering efficiency  
✅ Suitable for large datasets

② pie.style.cornerRadius
⚠️ Callback functions increase computation  
⚠️ Requires calculation for each sector  
⚠️ Use cautiously with large datasets

5️⃣ Usage Recommendations

① General Scenarios
- Prefer using `cornerRadius`
- Use moderate values (0.1-0.3)
- Balance visual effects and performance

② Advanced Customization
- Use `pie.style.cornerRadius` judiciously
- Avoid overly complex callback logic
- Be mindful of performance impact

③ Mixed Usage
- Use `cornerRadius` for base values
- Use `pie.style.cornerRadius` for exceptions
- Combine with `padAngle` for optimal visuals

>💡 Tip: In practice, it's recommended to use cornerRadius for uniform corner effects and only use pie.style.cornerRadius when differentiated treatment is necessary.

#${prefix} startAngle(number) = -90

Sector start angle.

#${prefix} endAngle(number) = 270

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
- `'inside-center'`(since v1.12.2)

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

##${prefix} customShape(function)
Since version 1.11.11, label guide lines support custom paths.

The callback function is defined as follows:

```ts
/**
 * @params label text and base mark
 * @params attrs vertex
 * @params path object, user-defined drawing
 * @return Returns the path after drawing is completed
 */
(
  mark: {
    text: IText;
    baseMark: IGraphic;
  },
  attrs: Partial<ILineGraphicAttribute>,
  path: ICustomPath2D
) => ICustomPath2D;
```

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

#${prefix} supportNegative(boolean)

Determines whether to treat negative values as absolute values.
The default value is `false`.
