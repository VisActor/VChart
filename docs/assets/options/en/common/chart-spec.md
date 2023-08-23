{{ target: common-chart-spec }}

<!-- IChartSpec, used for common chart configuration -->

#${prefix} type(string) = '${chartType}'

Chart type.

{{ if: !${noData} }}

{{ use: common-data(
    prefix = '#' + ${prefix},
    isHierarchy = ${isHierarchy},
    dataType = 'IDataType|IDataType[]'
) }}

{{ /if }}

#${prefix} width(number) = 500

Chart width.

#${prefix} height(number) = 500

Chart height.

#${prefix} autoFit(boolean) = true

Whether the width and height of the chart adapt to the container. The default is true in a browser environment. This configuration has a higher priority than the autoFit configuration in the constructor. If the user configures the width, the configured width will take precedence, and the same applies to the height.

#${prefix} background(string|Object)

The chart background color configuration has a higher priority than the background configuration in the constructor.

{{ use : background }}

#${prefix} padding(Object|number) = 12

Overall padding setting for the chart. Supports setting a value directly or configuring each direction separately for top, bottom, left, and right through object type.

- number: Unit is px, configured in all four directions simultaneously
- Object: object type is used as follows

{{ use: common-layout-padding(
  prefix = '#' + ${prefix},
) }}

#${prefix} color(Array|Object)

Chart color mapping configuration. Color value array can be directly passed, or data mapping can be performed for colors.

- Can directly pass color value array, and change the chart's color scheme

```ts
color: ['#BBD6B8', '#EA5455', '#19A7CE'],
```

- Perform data mapping, specifying the mapping rules through scale

{{ use: common-visual-spec-scale(
    prefix = '#' + ${prefix},
    includeId = false
) }}
