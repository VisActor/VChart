{{ target: component-brush }}

## brush(Object)

Selection box component.

### visible(boolean) = true

Component visibility.

### regionIndex(number|number[])

The index of regions that support selection.

### regionId(string|string[])

The ID of regions that support selection.

### seriesIndex(number|number[])

The index of series that support selection.

### seriesId(string|string[])

The ID of series that support selection.

### brushLinkSeriesIndex(number|number[])

The index of series that support linked selection.

### brushLinkSeriesId(string|string[])

The ID of series that support linked selection.

### inBrush(Object)

The graphical element style within the selection range.

{{ use: component-brush-selected-item-style(
  prefix = '###'
) }}

### outOfBrush(Object)

The graphical element style outside the selection range.

{{ use: component-brush-selected-item-style(
  prefix = '###'
) }}

### brushMode(string)

Selection mode.

Available options:
- `'single'`: Single selection
- `'multiple'`: Multiple selection

### brushType(string)

Selection box type.

Available options:
- `'x'`: Horizontal selection
- `'y'`: Vertical selection
- `'rect'`: Rectangular selection box
- `'polygon'`: Arbitrary shape selection box

### brushMoved(boolean) = true

Whether the selection box can be moved.

### removeOnClick(boolean) = true

In single selection mode, whether to clear the selection box by clicking.

### delayType(string) = 'throttle'

Event-triggering delay type.

Available options:
- `'throttle'`: Throttle
- `'debounce'`: Debounce

### delayTime(number) = 10

Event-triggering delay duration.

### sizeThreshold(number) = 5

brush选框的大小阈值。自 `1.2.0` 版本开始支持。

### style(Object)

Selection box style configuration.

{{ use: graphic-polygon(
  prefix = '###'
) }}
