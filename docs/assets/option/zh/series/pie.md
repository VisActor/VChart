{{ target: series-pie }}

<!-- IPieSeriesSpec -->

**扇区系列**

{{ use: common-polar-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'pie',
  seriesMarks = ['pie'],
  noCategoryField = true
) }}

#${prefix} categoryField(string)

分类字段。
默认饼图每个扇区为独立的系列。

#${prefix} valueField(string)

数值字段。

#${prefix} centerX (Number|String)

饼图中心点 x 坐标，支持两种格式：

- `number`: 具体的坐标值
- `string`: 格式如`50%`的百分比字符串，相对于布局宽度计算坐标（自**1.12.10**版本开始支持）

#${prefix} centerY (Number|String)

饼图中心点 y 坐标，支持两种格式：

- `number`: 具体的坐标值
- `string`: 格式如`50%`的百分比字符串，相对于布局高度计算坐标（自**1.12.10**版本开始支持）

#${prefix} centerOffset(number)

用于配置饼图中扇区中心的偏移，用于想强调或突出某一个或几个扇形的场景。如下所示：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/2894f40f27a9380faa39de500.png)

如果想要配置饼图扇区在 hover/selected 交互状态下进行偏移的话，可以在 pie.state 中配置，如下：

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

自 **1.11.12**版本开始支持

极坐标的布局半径，即计算内径、外径的基准值，可选值如下：

- 不设置： 默认值为`Math.min(width, height) / 2`，**1.11.2**之前的版本相当于这个效果
- `'auto'`： 根据`center`、`startAngle`、`endAngle`自动计算最大可用的布局半径
- 自定义函数，函数的类型定义如下：

```ts
(layoutRect: { width: number; height: number }, center: { x: number; y: number }) => number;
```

#${prefix} outerRadius(number)

饼图扇区外半径。默认值为 0.6。

#${prefix} innerRadius(number)

饼图扇区内半径。默认值为 0。

#${prefix} cornerRadius(number)

饼图扇区的圆角半径配置，用于控制扇区边缘的圆滑程度。取值范围为 [0-1]，默认值为 0。
一、取值说明
- `0`: 完全不应用圆角效果，扇区边缘呈现尖锐的角；
- `0.1 - 0.3`: 轻微的圆角效果，适合大多数商业展示场景；
- `0.4 - 0.7`: 明显的圆角效果，使图表看起来更现代化；
- `0.8 - 1.0`: 最大圆角效果，扇区边缘近似完全圆滑；
 
二、cornerRadius 与 pie.style.cornerRadius 的区别
1️⃣ 配置层级对比

| 配置项 | cornerRadius | pie.style.cornerRadius |
|-------|-------------|----------------------|
| 位置 | 图表配置的顶层属性 | pie.style 配置对象内 |
| 语法 | `cornerRadius: number` | `cornerRadius: number \| Function` |

2️⃣ 功能特性对比

| 特性 | cornerRadius | pie.style.cornerRadius |
|-----|-------------|----------------------|
| 数据类型 | 仅支持数值 | 支持数值和回调函数 |
| 作用范围 | 全局统一 | 可独立控制每个扇区 |
| 数据访问 | 不支持 | 可访问当前扇区数据 |
| 动态计算 | 不支持 | 支持根据数据动态计算 |
| 优先级 | 低 | 高（覆盖全局配置） |

3️⃣ 应用场景方面

① cornerRadius 适用场景
- ✨ 所有扇区需要统一的圆角效果
- ✨ 追求简单直观的配置方式
- ✨ 对性能要求较高的场景

② pie.style.cornerRadius 适用场景
- 🎨 需要根据数据设置不同圆角
- 🎨 需要突出显示特定扇区
- 🎨 需要实现交互式圆角变化

4️⃣ 性能考虑方面

① cornerRadius
✅ 计算开销小  
✅ 渲染效率高  
✅ 适合大数据量场景

② pie.style.cornerRadius
⚠️ 回调函数会增加计算量  
⚠️ 需要为每个扇区单独计算  
⚠️ 数据量大时需谨慎使用

5️⃣ 使用建议方面

①一般场景
- 优先使用 `cornerRadius` 
- 设置适中的值（0.1-0.3）
- 确保视觉效果和性能的平衡

②高级定制
- 合理使用 `pie.style.cornerRadius`
- 避免过于复杂的回调逻辑
- 注意性能影响

③混合使用
- 使用 `cornerRadius` 设置基础值
- 用 `pie.style.cornerRadius` 处理特例
- 配合 `padAngle` 优化视觉效果

>💡提示：在实际应用中，建议优先使用 cornerRadius 配置统一的圆角效果，只在确实需要差异化处理时才使用 pie.style.cornerRadius。

#${prefix} startAngle(number) = -90

扇区起始角度。

#${prefix} endAngle(number) = 270

扇区结束角度。

#${prefix} padAngle(number)

扇区间隔角度。

#${prefix} minAngle(number)

自 `1.4.0` 版本开始支持，用于配置最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互。

#${prefix} pie(Object)

扇区图元样式配置。

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

标签配置。

{{ use: component-label(
  prefix = '#' + ${prefix},
) }}

<!-- IArcLabelSpec -->

##${prefix} position(string)

标签布局方式。
默认值为`'outside'`。

可选值：

- `'outside'`
- `'inside'`
- `'inside-outer'`
- `'inside-inner'`
- `'inside-center'`（自 `1.12.2` 版本支持）

##${prefix} offsetRadius(number)

自`1.4.2`版本开始支持，标签距离外半径或内半径的径向偏移值。

如果 `posision` 设为 `'inside-outer'`，则相对于外半径，如果 `posision` 设为 `'inside-inner'`，则相对于内半径。

##${prefix} coverEnable(boolean)

是否允许标签重叠。
默认值为`false`。

##${prefix} rotate(boolean)

是否允许标签旋转。
默认值为`true`。

##${prefix} spaceWidth(number)

文字与引导线间隔宽度。
默认值为`5`。

##${prefix} layoutArcGap(number)

扇区间标签的间隔。
默认值为`6`。

##${prefix} line(Object)

标签引导线样式。

###${prefix} visible(boolean)

是否显示引导线。
默认值为`true`。

###${prefix} line1MinLength(number)

引导线 line1 部分最小长度。
默认值为`20`。

###${prefix} line2MinLength(number)

引导线 line2 部分最小长度。
默认值为`10`。

###${prefix} smooth(boolean)

引导线是否光滑。
默认值为`false`。
从 1.4.0 版本开始支持。

{{ use: common-mark(
  prefix = '##' + ${prefix}
) }}

##${prefix} customShape(function)
自 1.11.11 版本, 标签引导线支持自定义 path.

回调函数的定义如下:

```ts
/**
 * @params 标签文字和对应图元属性
 * @params attrs 折点
 * @params path对象, 用户自定义绘制
 * @return 返回绘制完成后的path
 */
(mark: { text: IText; baseMark: IGraphic }, attrs: Partial<ILineGraphicAttribute>, path: ICustomPath2D) =>
  ICustomPath2D;
```

###${prefix} style(Object)

引导线样式。

{{ use: mark-style(
  markName = 'line'
) }}

{{ use: mark-path(
  prefix = '###' + ${prefix}
) }}

###${prefix} state(Object)

{{ use: mark-state-style() }}

##${prefix} layout(Object)

标签布局配置。

###${prefix} align(string)

标签对齐方式。
默认值为`'arc'`。

可选值：

- `'arc'`
- `'labelLine'`
- `'edge'`

###${prefix} strategy(string)

标签布局策略。
默认值为`'priority'`。

可选值：

- `'priority'`
- `'vertical'`
- `'none'`

###${prefix} tangentConstraint(boolean)

是否启用切线约束。
默认值为`true`。

#${prefix} emptyPlaceholder(Object)

设置当数据为空时呈现的占位符。

##${prefix} showEmptyCircle(Boolean)

从 1.12.0 版本开始支持，是否在数据为空时显示占位圆。
默认值为`false`。

##${prefix} emptyCircle(Object)

占位圆图元样式配置。

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

是否在数据均为 0 时显示均分扇区。
默认值为`false`。

#${prefix} supportNegative(boolean)

是否将负数按照绝对值进行处理。
默认值为`false`。
