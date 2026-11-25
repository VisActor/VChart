{{ target: mark-link-path }}

#${prefix} x0(number|Function)

x0 坐标。

#${prefix} y0(number|Function)

y0 坐标。

#${prefix} x1(number|Function)

x1 坐标。

#${prefix} y1(number|Function)

y1 坐标。

#${prefix} thickness(number|Function)

厚度。

#${prefix} curvature(number|Function)

曲率。

#${prefix} round(boolean|Function)

对所有坐标进行四舍五入。

#${prefix} ratio(number|Function)

普通样式路径的比例。

#${prefix} align(string|Function)

对齐。

可选值：

- `start`
- `end`
- `center`

#${prefix} pathType(string|Function)

path 类型。

可选值：

- `line`
- `smooth`
- `polyline`

#${prefix} endArrow(boolean|Function)

是否有末尾端箭头。

#${prefix} startArrow(boolean|Function)

是否有起点端箭头。

#${prefix} backgroundStyle(any|Function)

背景样式配置。

#${prefix} direction(string|Function)

方向。

可选值：

- `horizontal`
- `vertical`
- `LR`
- `RL`
- `TB`
- `BL`
- `radial`

{{ use: graphic-attribute(
  prefix = ${prefix},
  callbackType = '|Function',
) }}
