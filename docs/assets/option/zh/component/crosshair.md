{{ target: component-crosshair }}

## crosshair(Array|Object)

十字准星指示器，用于标注图表中的点，并添加文字标签。在不同的坐标系下，十字准星的表现形式不同。当需要在多个坐标系下使用十字准星时，可以使用数组分别配置每个坐标系下的十字准星。

TODO: 补充图示。

{{ use: common-component-id(
  prefix = '##'
) }}

### trigger(string) = 'hover'

crosshair 的触发方式，默认为 'hover'，即鼠标悬浮时触发。可选值为：

- `'hover'`: 鼠标悬浮时触发。
- `'click'`: 鼠标点击时触发。
- `['hover', 'click']`: 鼠标悬浮和点击时同时触发。

### triggerOff(string | number)

隐藏 crosshair 的触发方式，目前支持三种设置：

- `'none'`: 不关闭 crosshair
- 和 trigger 一致的设置，即当`trigger`为`hover`时，triggerOff 也为`hover`
- `number`: 定时关闭`crosshair`，单位为 `ms`

### lockAfterClick(boolean)

`1.9.0` 版本后支持该配置；

点击后锁定`crosshair`，通常用于`trigger`为`['hover', 'click']`的场景

### labelZIndex(number) = 500

crosshair 文字标签的 z-index。

### gridZIndex(number) = 100

crosshair 辅助图形的显示层级。

{{ if: !${isPolar} }}

### xField(Object)

笛卡尔坐标系下 x 轴上 crosshair 配置。

{{ use: component-crosshair-x-field(
  prefix = '###',
  isPolar = false,
  defaultType = 'rect'
) }}

### yField(Object)

笛卡尔坐标系下 y 轴上 crosshair 配置。

{{ use: component-crosshair-x-field(
  prefix = '###',
  isPolar = false,
  defaultType = 'line'
) }}

{{ else }}

### categoryField(Object)

极坐标系下 `categoryField` 字段对应轴上的 crosshair 配置。

{{ use: component-crosshair-x-field(
  prefix = '###',
  isPolar = true,
  defaultType = 'line'
) }}

### valueField(Object)

极坐标系下 `valueField` 字段对应轴上的 crosshair 配置。

**注意：** `valueField.line.type` 仅支持 'line' 类型。

{{ use: component-crosshair-x-field(
  prefix = '###',
  isPolar = true,
  defaultType = 'line'
) }}

{{ /if }}
