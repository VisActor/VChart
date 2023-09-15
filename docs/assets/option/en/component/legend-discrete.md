{{ target: component-legend-discrete }}

<!-- IDiscreteLegendSpec Discrete Legend Configuration -->

## legends.discrete(Object)

Discrete legend configuration.

### type(string) = 'discrete'

**Optional**, discrete legend type declaration, optional as the legend type defaults to `'discrete'`.

{{ use: component-base-legend(
  prefix = '##'
) }}

### defaultSelected(Array)

Sets the legend item that is selected by default when the legend is initialized. The element in the array is the name of the legend item, e.g. `['Legend 1', 'Legend 2']` means that the legend items named `'Legend 1'` and `'Legend 2'` are selected by default.

### select(boolean) = true

Whether or not to enable the checking of the legend, the default is on.

### selectMode(string) = 'multiple'

The check mode of the legend, with optional values: `'multiple'`, `'single'`, for multiple and single selection respectively.

### hover(boolean) = true

If or not hover interaction is enabled.

### allowAllCanceled(boolean) = false

Whether to allow all legend items to be unchecked, default is no, only valid if `selectMode` is `'multiple'`.

### reversed(boolean) = false

Whether to reverse the ordering of the legend items, the default is not.

### maxWidth(number)

The overall maximum width of the legend, which determines whether horizontally laid out legends (with an orientation attribute of `'left'` | `'right'`) are automatically line-breaking.

### maxCol(number)

Effective only when `orient` is `'left'` | `'right'`, indicates the maximum number of rows for the legend item, the legend item beyond the maximum number of rows will be hidden.

### maxHeight(number)

The maximum height of the legend as a whole, which determines whether vertically laid out legends (with an orientation attribute of `'top'` | `'bottom'`) are automatically line-breaking.

### maxRow(number)

Effective only when `orient` is `'top'` | `'bottom'`, indicates the maximum number of columns for the legend item, the legend item beyond the maximum number of columns will be hidden.

### item(Object)

Legend Item Configuration, which contains the configuration of graphics, text, etc. within the legend item.

#### visible(boolean) = true

Whether or not to display the legend item, the default is displayed.

#### spaceCol(number)

Column spacing for legend items, horizontal spacing.

#### spaceRow(number)

Line spacing for legend items, vertical spacing.

#### maxWidth(number|string)

The maximum width of the legend item, defaults to null. a percentage can be used to indicate the percentage of the width of the display area.

#### width(number|string)

The width of the legend item, calculated automatically by default. A percentage can be used, indicating the percentage of the width of the display area.

#### height(number|string)

Height setting for legend items, not set, automatically calculated by default. A percentage can be used, indicating the percentage of the height of the display area.

#### padding(number|number[]|Object)

{{ use: common-padding(
  componentName='Legend item'
) }}

#### background(Object)

The background configuration of the legend item.

##### visible(boolean) = false

Whether or not to show the legend item background.

##### style(Object|Function)

Legend item background style configuration, support function callback, when need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item background style',
  componentType = 'discrete-legend'
) }}

example:

```ts
background: {
  style: () => {},
}
```

{{ use: graphic-rect(
  prefix = '#####'
) }}

##### state(Object)

Style configuration of the legend item background in different interaction states, the current interaction states supported by the legend component are:

- `'selected'`: Selected state
- `'unSelected'`: Unselected state
- `'selectedHover'`: Selected and hover state
- `'unSelectedHover'`: Unselected and hover state

###### selected(Object|Function)

Background selected state style configuration , support function callback , when need to go some personalized configuration can use the callback function .

{{ use: component-common-style-callback(
  description = 'Legend item background selected state style',
  componentType = 'discrete-legend'
) }}

example:

```ts
background: {
  state: {
    selected: () => {};
  }
}
```

{{ use: graphic-rect(
  prefix = '######'
) }}

###### unSelected(Object|Function)

Background non-checked state of the style configuration , support function callback , when need to go some personalized configuration can use the callback function .

{{ use: component-common-style-callback(
  description = 'Legend item background unSelected status style',
  componentType = 'discrete-legend'
) }}

example:

```ts
background: {
  state: {
    unSelected: () => {};
  }
}
```

{{ use: graphic-rect(
  prefix = '######'
) }}

###### selectedHover(Object|Function)

Background selected and hover state style configuration, support function callback, when need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item background selectedHover state style',
  componentType = 'discrete-legend'
) }}

example:

```ts
background: {
  state: {
    selectedHover: () => {};
  }
}
```

{{ use: graphic-rect(
  prefix = '######'
) }}

###### unSelectedHover(Object|Function)

Style configuration for background unchecked and hover state, support function callback, when need to go some personalized configuration you can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item background unSelectedHover state style',
  componentType = 'discrete-legend'
) }}

example:

```ts
background: {
  state: {
    unSelectedHover: () => {};
  }
}
```

{{ use: graphic-rect(
  prefix = '######'
) }}

#### shape(Object)

Configuration of the shape icon for the legend item.

##### visible(boolean) = false

Whether to show the shape icon of the legend item.

##### space(number)

The spacing between the shape and the label after it.

##### style(Object|Function)

shape icon style configuration, support function callback, when need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item shape style',
  componentType = 'discrete-legend'
) }}

example:

```ts
shape: {
  style: () => {};
}
```

{{ use: graphic-symbol(
  prefix = '#####'
) }}

##### state(Object)

The legend item shape is configured in different interaction states, currently the legend component supports the following interaction states:

- `'selected'`: Selected state
- `'unSelected'`: Unselected state
- `'selectedHover'`: Selected and hover state
- `'unSelectedHover'`: Unselected and hover state

###### selected(Object|Function)

The legend item shape supports function callbacks for configuring the style of the selected state, so that you can use the callback function when you need to go through some personalized configurations.

{{ use: component-common-style-callback(
  description = 'Legend item shape selected state style',
  componentType = 'discrete-legend'
) }}

example:

```ts
shape: {
  state: {
    selected: () => {};
  }
}
```

{{ use: graphic-symbol(
  prefix = '######'
) }}

###### unSelected(Object|Function)

Legend item shape state style configuration, support function callback, when need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item shape unSelected state style',
  componentType = 'discrete-legend'
) }}

example:

```ts
shape: {
  state: {
    unSelected: () => {}.
  }
}
```

{{ use: graphic-symbol(
  prefix = '######'
) }}

###### selectedHover(Object|Function)

Legend item shape selected and hover state style configuration, support function callback, when need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item selectedHover state style',
  componentType = 'discrete-legend'
) }}

example:

```ts
shape: {
  state: {
    selectedHover: () => {};
  }
}
```

{{ use: graphic-symbol(
  prefix = '######'
) }}

###### unSelectedHover(Object|Function)

Legend item shape unchecked and hover state style configuration, support function callback, when need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Style for the selectedHover status of the legend item.',
  componentType = 'discrete-legend'
) }}

example:

```ts
shape: {
  state: {
    unSelectedHover: () => {};
  }
}
```

{{ use: graphic-symbol(
  prefix = '######'
) }}

#### label(Object)

Text configuration of the legend item.

##### space(number)

The spacing between the legend item label and the value that follows it.

##### formatMethod(Function)

label's text formatting method, you can customize the display text of the label. The parameters of the function are:

```ts
/**
 * @params text Original text
 * @params item Drawing data for legend item
 * @params index Index of the legend item
 */
(text: StringOrNumber, item: LegendItemDatum, index: number) => any;
```

The legend item is drawn with the data type:

```ts
export type LegendItemDatum = {
  /**
   * :: A unique identifier for this piece of data, which can be used for animations or lookups
   */
  id?: string;
  /** Display text */
  label: string;
  /** Display of data */
  value?: string | number;
  value: string | number;
  value: string | number;
  value: string | number;
  /** Definition of shape before legend item */
  shape: {
    symbolType?: string;
    fill?: string;
    stroke?: string;
  };
  [key: string]: any;
};
```

##### style(Object|Function)

Legend item label style configuration, support function callback, when need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item label styles',
  componentType = 'discrete-legend'
) }}

example:

```ts
label: {
  style: () => {};
}
```

{{ use: graphic-text(
  prefix = '#####'
) }}

##### state(Object)

The style configuration of the legend item label in different interaction states, currently the legend component supports the following interaction states:

- `'selected'`: selected state
- `'unSelected'`: non-selected state
- `'selectedHover'`: selected and hover state
- `'unSelectedHover'`: unselected and hover state

###### selected(Object|Function)

The legend item label supports function callbacks to configure the style of the selected state, so you can use the callback function when you need to go through some personalized configurations.

{{ use: component-common-style-callback(
  description = 'Legend item label selected state style',
  componentType = 'discrete-legend'
) }}

example:

```ts
label: {
  state: {
    selected: () => {};
  }
}
```

{{ use: graphic-text(
  prefix = '######'
) }}

###### unSelected(Object|Function)

Legend item label unchecked state style configuration, support function callback, when need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item label unSelected status style',
  componentType = 'discrete-legend'
) }}

example:

```ts
label: {
  state: {
    unSelected: () => {}.
  }
}
```

{{ use: graphic-text(
  prefix = '######'
) }}

###### selectedHover(Object|Function)

Legend item label selected and hover state style configuration, support function callback, when you need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item label selectedHover Status Style',
  componentType = 'discrete-legend'
) }}

example:

```ts
label: {
  state: {
    selectedHover: () => {};
  }
}
```

{{ use: graphic-text(
  prefix = '######'
) }}

###### unSelectedHover(Object|Function)

Legend item label unchecked and hover state style configuration, support function callback, when need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item label unSelectedHover Status Style',
  componentType = 'discrete-legend'
) }}

example:

```ts
label: {
  state: {
    unSelectedHover: () => {};
  }
}
```

{{ use: graphic-text(
  prefix = '######'
) }}

#### value(Object)

The value of the legend entry is configured.

##### space(number)

The spacing between the legend item value and the following element.

##### alignRight(boolean) = false

Whether or not to align the value to the right side of the legend item as a whole, **only if the legend item width `itemWidth` is set**.

##### formatMethod(Function)

value's text formatting method, you can customize the display text of value. The parameters of the function are:

```ts
/**
 * @params text Original text
 * @params item Drawing data for legend item
 * @params index Index of the legend item
 */
(text: StringOrNumber, item: LegendItemDatum, index: number) => any;
```

The legend item is drawn with the data type:

```ts
export type LegendItemDatum = {
  /**
   * :: A unique identifier for this piece of data, which can be used for animations or lookups
   */
  id?: string;
  /** Display text */
  label: string;
  /** Display of data */
  value?: string | number;
  value: string | number;
  value: string | number;
  value: string | number;
  /** Definition of shape before legend item */
  shape: {
    symbolType?: string;
    fill?: string;
    stroke?: string;
  };
  [key: string]: any;
};
```

##### style(Object|Function)

Legend item value style configuration, support function callback, when need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item value styles',
  componentType = 'discrete-legend'
) }}

example:

```ts
value: {
  style: () => {},
}
```

{{ use: graphic-text(
  prefix = '#####'
) }}

##### state(Object)

The legend item value configures the style in different interaction states, currently the legend component supports the following interaction states:

- `'selected'`: selected state
- `'unSelected'`: non-selected state
- `'selectedHover'`: selected and hover state
- `'unSelectedHover'`: unselected and hover state

###### selected(Object|Function)

The legend item value supports callback functions for configuring the style of the selected state, so that you can use the callback function when you need to go through some personalized configurations.

{{ use: component-common-style-callback(
  description = 'Legend item value selected status style',
  componentType = 'discrete-legend'
) }}

example:

```ts
value: {
  state: {
    selected: () => {};
  }
}
```

{{ use: graphic-text(
  prefix = '######'
) }}

###### unSelected(Object|Function)

Legend item value Style configuration for unchecked state, support function callback, you can use the callback function when you need to go some personalized configuration.

{{ use: component-common-style-callback(
  description = 'Legend item value unSelected Status Style',
  componentType = 'discrete-legend'
) }}

example:

```ts
value: {
  state: {
    unSelected: () => {}.
  }
}
```

{{ use: graphic-text(
  prefix = '######'
) }}

###### selectedHover(Object|Function)

Legend item value selected and hover state style configuration, support function callback, when need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item value selectedHover Status Style',
  componentType = 'discrete-legend'
) }}

example:

```ts
value: {
  state: {
    selectedHover: () => {};
  }
}
```

{{ use: graphic-text(
  prefix = '######'
) }}

###### unSelectedHover(Object|Function)

Legend item value unchecked and hover state style configuration, support function callback, when need to go some personalized configuration can use the callback function.

{{ use: component-common-style-callback(
  description = 'Legend item value unSelectedHover Status Style',
  componentType = 'discrete-legend'
) }}

example:

```ts
value: {
  state: {
    unSelectedHover: () => {};
  }
}
```

{{ use: graphic-text(
  prefix = '######'
) }}

#### focusIconStyle(Object)

Focus button style configuration.

{{ use: graphic-symbol(
  prefix = '####'
) }}

### autoPage(boolean) = true

Whether to enable automatic page turning, the default is on.

### pager(Object)

Page Turner Configuration.

#### layout(string)

The layout of the page turner, the optional values are `'horizontal'` and `'vertical'`. The default value logic is:

- Defaults to `'vertical'` when legend `orient` is `'left'` or `'right'`.
- Defaults to `'horizontal'` when legend `orient` is `'top'` or `'bottom'`.

#### defaultCurrent(number)

Default current page number.

#### padding(number|number[]|Object)

{{ use: common-padding(
  componentName='Pager'
) }}

#### space(number)

The spacing of the page turner from the same legend.

#### animation(boolean) = true

Whether to turn on animation.

#### animationDuration(number) = 450

Animation duration in ms.

#### animationEasing(string) = 'quadIn'

Animated jogging effect.

#### textStyle(Object)

Text style configuration.

{{ use: graphic-text(
  prefix = '####'
) }}

#### handler(Object)

Style configuration for the page turner button.

##### space(number) = 8

The spacing between the buttons and the text content area, the default is 8.

##### preShape(string)

The shape of the button on the previous page of the page turner.

##### nextShape(string)

The shape of the page turner next button.

##### style(Object)

Style configuration for the page turner button.

{{ use: graphic-symbol(
  prefix = '#####'
) }}

##### state(Object)

Configuration of the style of the page flipper buttons in different interaction states, the current interaction states supported by the page flipper are:

- `'hover'`: hover state
- `'disable'`: not available status style

###### hover(Object)

The style configuration for the hover state of the page turner button.

{{ use: graphic-symbol(
  prefix = '######'
) }}

###### disable(Object)

Style configuration for the unavailable state of the page turner button.

{{ use: graphic-symbol(
  prefix = '######'
) }}

### data(Function)

Custom Configuration for Discrete Legend Data is a function that can be customized based on the original legend plotting data, for example, the value value can be customized.

```ts
// Type of legend data
type LegendItemDatum = {
  /**
   * :: A unique identifier for this piece of data, which can be used for animations or lookups
   */
  id?: string;
  /** Display text */
  label: string;
  /** Display of data */
  value?: string | number; value: string | number; value: string | number; value: string | number
  /** Definition of shape before legend item */
  shape: {
    symbolType?: string;
    fill?: string;
    stroke?: string;
    stroke?: boolean;
  };
  [key: string]: any;
};

/**
 * Customization based on the data plotted in the original legend, e.g., you can customize the value value
 * @param data Legend drawing data
 * @returns
 */
data?: (data: LegendItemDatum[]) => LegendItemDatum[];
/**
 * Customization based on the data plotted in the original legend, e.g., you can customize the value value
 * @param data Legend drawing data
 * @param colorScale Global color map scale
 * @param globalScale All scales on the chart
 * @returns
 */
data?: (data: LegendItemDatum[], colorScale: IBaseScale, globalScale: IGlobalScale) => LegendItemDatum[];
```

{{ use: common-region-and-series-filter(
  prefix = '##',
) }}

{{ use: common-layout-item(
  prefix = '##',
  defaultLayoutType = 'normal',
  defaultLayoutLevel = 50,
  defaultLayoutZIndex = 500,
  noOrient = true
) }}
