{{ target: graphic-polygon }}

<!-- Canopus Graphic Attributes, IPolygonGraphicAttribute -->

#${prefix} cornerRadius(number | number[]) = 0
The corner radius of the polygon graphic element.

#${prefix} scaleX(number) = 1
X scale factor

#${prefix} scaleY(number) = 1
Y scale factor

{{ use: graphic-attribute(
  prefix = ${prefix},
  noTexture = true
) }}