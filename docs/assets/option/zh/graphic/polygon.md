{{ target: graphic-polygon }}

<!-- Canopus 图形属性，IPolygonGraphicAttribute -->

#${prefix} cornerRadius(number | number[]) = 0
多边形图元的圆角半径。

#${prefix} scaleX(number) = 1
x 缩放倍数

#${prefix} scaleY(number) = 1
y 缩放倍数

{{ use: graphic-attribute(
  prefix = ${prefix},
  noTexture = true
) }}
