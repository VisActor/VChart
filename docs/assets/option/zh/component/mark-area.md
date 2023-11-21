{{ target: component-mark-area }}

## markArea (Array|Object)

数据标注区域。

{{ use: component-base-marker(
  prefix = '##'
) }}

### x(string|number)

标注目标：笛卡尔坐标系 x 坐标空间。
x 轴上的标注区域边界，与 markArea.x1 共同构造标注区域。可以配置在 x 轴上的值，相对位置，或者聚合计算类型。

- 相对位置（string）：自 `1.7.0` 版本开始支持，可以将 x 配置为 '15%' 百分比的形式，用于表示将 x 绘制在 marker 所在 region 横轴（从左往右）的百分之 15 位置处。
- 聚合计算类型（string）

{{ use: component-marker-aggregation-type() }}

### x1(string|number)

标注目标：笛卡尔坐标系 x 坐标空间。
x 轴上的标注区域边界，与 markArea.x 共同构造标注区域。可以配置在 x 轴上的值，相对位置，或者聚合计算类型。

- 相对位置（string）：自 `1.7.0` 版本开始支持，可以将 x1 配置为 '15%' 百分比的形式，用于表示将 x1 绘制在 marker 所在 region 横轴（从左往右）的百分之 15 位置处。
- 聚合计算类型（string）

{{ use: component-marker-aggregation-type() }}

### y(string|number)

y 轴上的标注区域边界，与 markArea.y1 共同构造标注区域。可以配置在 y 轴上的值，相对位置，或者聚合计算类型。

- 相对位置（string）：自 `1.7.0` 版本开始支持，可以将 y 配置为 '15%' 百分比的形式，用于表示将 y 绘制在 marker 所在 region 纵轴（从上到下）的百分之 15 位置处。
- 聚合计算类型（string）

{{ use: component-marker-aggregation-type() }}

### y1(string|number)

y 轴上的标注区域边界，与 markArea.y 共同构造标注区域。可以配置在 y 轴上的值，相对位置，或者聚合计算类型。

- 相对位置（string）：自 `1.7.0` 版本开始支持，可以将 y1 配置为 '15%' 百分比的形式，用于表示将 y1 绘制在 marker 所在 region 纵轴（从上到下）的百分之 15 位置处。
- 聚合计算类型（string）

{{ use: component-marker-aggregation-type() }}

### coordinates(Array)

标注目标：数据元素。
指定数据点的标注区域。基于指定数据点进行标注区域的绘制。

{{ use: component-marker-data-point(
  prefix = '###'
) }}

### positions(Array)

标注目标：坐标点。
指定坐标点的标注区域。基于指定坐标点进行标注区域的绘制。

{{ use: component-marker-point-like(
  prefix = '###'
) }}

### regionRelative(boolean) = false

自 `1.7.0` 版本支持，是否为相对 region 的坐标，默认为 false，即相对画布的坐标，默认 false。

{{ use: component-marker-axis(
  prefix = '##'
) }}

### area(Object)

#### style(Object)

标注区域的区域样式。

{{ use: graphic-polygon(
  prefix = '####'
) }}

### label(Object)

标注线的标签样式。

#### position(Object)

标注区域的标签位置（标签相对区域的相对位置）。

可选值：

- `'left'`: 区域外部左侧
- `'right'`: 区域外部右侧
- `'top'`: 区域外部上侧
- `'bottom'`: 区域外部下侧
- `'middle'`: 区域中心
- `'insideLeft'`: 区域内部左侧
- `'insideRight'`: 区域内部右侧
- `'insideTop'`: 区域内部上侧
- `'insideBottom'`: 区域内部下侧

{{ use: component-marker-label(
  prefix = '###',
  noMarkerRef = true
) }}
