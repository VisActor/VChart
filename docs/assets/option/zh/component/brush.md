{{ target: component-brush }}

## brush(Object)

框选组件。

### visible(boolean) = true

组件可见性。

### regionIndex(number|number[])

支持框选的region索引。

### regionId(string|string[])

支持框选的region ID。

### seriesIndex(number|number[])

支持框选的系列索引。

### seriesId(string|string[])

支持框选的系列 ID。

### brushLinkSeriesIndex(number|number[])

支持联动框选的系列索引。

### brushLinkSeriesId(string|string[])

支持联动框选的系列 ID。

### inBrush(Object)

框选范围内的图元样式。

{{ use: component-brush-selected-item-style(
  prefix = '###'
) }}

### outOfBrush(Object)

框选范围外的图元样式。

{{ use: component-brush-selected-item-style(
  prefix = '###'
) }}

### brushMode(string)

框选模式。

可选值：
- `'single'`: 单选
- `'multiple'`: 多选

### brushType(string)

选框类型。

可选值：
- `'x'`: 横向选择
- `'y'`: 纵向选择
- `'rect'`: 矩形选框
- `'polygon'`: 任意形状选框

### brushMoved(boolean) = true

选框是否可被平移。

### removeOnClick(boolean) = true

单选模式下，是否单击清除选框。

### delayType(string) = 'throttle'

事件触发延迟类型。

可选值：
- `'throttle'`: 节流
- `'debounce'`: 防抖

### delayTime(number) = 10

事件触发延迟时长。

### sizeThreshold(number) = 5

The size threshold of the brush selection box. Supported since version `1.2.0`.

### style(Object)

选框样式配置。

{{ use: graphic-polygon(
  prefix = '###'
) }}







