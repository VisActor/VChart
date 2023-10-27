{{ target: component-scrollbar }}

## scrollbar(Array)

滚动条配置。

### round(boolean)

滑块是否圆角。

### innerPadding(boolean)

滚动条内边距，影响滑轨的实际可用空间 [top, right, bottom, left]。

### range([number, number])

滑块当前的可视范围，数值为 0 - 1。

### limitRange([number, number])

滑块限制的滚动范围，数值为 0 - 1。

### rail(Object)

滚动条轨道。

#### style(Object)

滚动条轨道样式。

{{ use: graphic-rect(
  prefix = '####'
) }}

### slider(Object)

滚动条滑块。

#### style(Object)

滚动条滑块样式。

{{ use: graphic-rect(
  prefix = '####'
) }}

{{ use: component-data-filter-base(
  prefix = '##'
) }}

### filterMode(string) = 'axis'

数据过滤模式。

可选值:

- 'filter'
- 'axis'