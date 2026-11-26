{{ target: mark-group }}

<!-- IGroupMarkSpec -->

#${prefix} clip(boolean|Function)
是否为裁剪图元。

#${prefix} width(number|Function)
宽度。

#${prefix} height(number|Function)
高度。

#${prefix} cornerRadius(number|Array|Function)
圆角配置。
1. 如果传入数值，则统一为四个角设置圆角
2. 如果传入数组，则分别为 [上左, 上右, 下右, 下左]

{{ use: graphic-attribute(
  prefix = ${prefix},
  callbackType = '|Function',
) }}

