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

brush选框的大小阈值。自 `1.2.0` 版本开始支持。

### brushZoom(boolean) = false
是否开启刷取下钻。自0.10.0版本生效。

### axisId(string|string[])

刷取联动的axisId。自0.10.0版本生效。
1. 如果开启刷取下钻, 默认联动所有关联axis和dataZoom。
2. dataZoom filterMode: 'axis'时刷取才能正常进行（filterMode: 'filter'会改变axis domain, 导致计算错误）

### axisIndex(number|number[])

刷取联动的axisIndex。自0.10.0版本生效。
1. 如果开启刷取下钻, 默认联动所有关联axis和dataZoom。
2. dataZoom filterMode: 'axis'时刷取才能正常进行（filterMode: 'filter'会改变axis domain, 导致计算错误）

### axisRangeExpand(number)
更新dataZoom范围时, 按百分比进行范围拓展, 比如: dataZoomRangeExpand = 0.05, 则代表更新时newStart - 0.05 & newEnd + 0.05。
可能需要配置dataZoomRangeExpand的情况:
1. 缩放连续轴时: 轴的zero、nice、min、max等配置可能导致轴范围与dataZoom范围不一致（这个问题最好通过DataZoom.customDomain解决）
2. 缩放连续轴时: 散点图按照散点中心定位, 如果严格按照中心范围更新，会出现散点超出画布的现象
3. 缩放离散轴时: 不希望严格按照筛选的数据范围缩放, 而是希望缩放后两端仍有空间

### style(Object)

选框样式配置。

{{ use: graphic-polygon(
  prefix = '###'
) }}







