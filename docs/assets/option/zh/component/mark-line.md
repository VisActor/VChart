{{ target: component-mark-line }}

## markLine (Array|Object)

数据标注线。

{{ use: component-base-marker(
  prefix = '##'
) }}

### x(string|number)

标注目标：笛卡尔坐标系x坐标空间。
x轴上的标注线。可以配置标注线在x轴上的值，或者聚合计算类型。

{{ use: component-marker-aggregation-type() }}

### y(string|number)

标注目标：笛卡尔坐标系y坐标空间。
y轴上的标注线。可以配置标注线在y轴上的值，或者聚合计算类型。

{{ use: component-marker-aggregation-type() }}

### coordinates(Array)

标注目标：数据元素。
指定数据点的标注线。基于指定数据点进行标注线的绘制，可以对数据点进行数据处理。

{{ use: component-marker-data-point(
  prefix = '###'
) }}

#### process(Object)

数据点的处理方法。 如果不配置则按照coordinate数组直接连接成line。

##### x(string)

对数据点基于x轴关联数据字段聚合处理。

{{ use: component-marker-aggregation-type() }}

##### y(string)

对数据点基于y轴关联数据字段聚合处理。

{{ use: component-marker-aggregation-type() }}

##### xy(string)

对数据点进行回归处理。

可选值：
- `'regression'`: 数据回归处理

### positions(Array)

标注目标：坐标点。
指定坐标点的标注线。基于指定坐标点进行标注线的绘制。

{{ use: component-marker-point-like(
  prefix = '###'
) }}

{{ use: component-marker-axis(
  prefix = '##'
) }}

### line(Object)

标注线的线。
#### style(Object)

标注线的线样式。

{{ use: graphic-line(
  prefix = '####'
) }}

### label(Object)

标注线的标签样式。

#### position(Object)

标注线的标签位置（标签相对线的相对位置）。

可选值：
- `'start'`: 线起点外侧
- `'middle'`: 线中点
- `'end'`: 线终点外侧
- `'insideStartTop'`: 线起点内侧上部
- `'insideStartBottom'`: 线起点内侧下部
- `'insideMiddleTop'`: 线中点上部
- `'insideMiddleBottom'`: 线中点下部
- `'insideEndTop'`: 线终点内侧上部
- `'insideEndBottom'`: 线终点内侧下部


{{ use: component-marker-label(
  prefix = '###'
) }}

### startSymbol(Object)
参考线起点symbol样式

{{ use: component-marker-symbol(
  prefix = '###'
) }}

### endSymbol(Object)
参考线终点symbol样式

{{ use: component-marker-symbol(
  prefix = '###'
) }}

