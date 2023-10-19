{{ target: component-mark-area }}

## markArea (Array|Object)

数据标注区域。

{{ use: component-base-marker(
  prefix = '##'
) }}

### x(string|number)

标注目标：笛卡尔坐标系 x 坐标空间。
x 轴上的标注区域边界，与 markArea.x1 共同构造标注区域。可以配置在 x 轴上的值，或者聚合计算类型。

{{ use: component-marker-aggregation-type() }}

### x1(string|number)

标注目标：笛卡尔坐标系 x 坐标空间。
x 轴上的标注区域边界，与 markArea.x 共同构造标注区域。可以配置在 x 轴上的值，或者聚合计算类型

{{ use: component-marker-aggregation-type() }}

### y(string|number)

y 轴上的标注区域边界，与 markArea.y1 共同构造标注区域。可以配置在 y 轴上的值，或者聚合计算类型

{{ use: component-marker-aggregation-type() }}

### y1(string|number)

y 轴上的标注区域边界，与 markArea.y 共同构造标注区域。可以配置在 y 轴上的值，或者聚合计算类型

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
