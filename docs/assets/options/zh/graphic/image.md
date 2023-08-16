{{ target: graphic-image }}

<!-- Canopus IImageGraphicAttribute -->

#${prefix} width(number)

图片宽度。

#${prefix} height(number)

图片高度。

#${prefix} repeatX(string)

图片在x方向的repeat方式。

可选值：
- `'no-repeat'` 
- `'repeat'` 
- `'stretch'`

#${prefix} repeatY(string)

图片在y方向的repeat方式。

可选值：
- `'no-repeat'`
- `'repeat'` 
- `'stretch'`

#${prefix} image(string | Object)

图片资源，可传入url、HTMLImageElement 或 HTMLCanvasElement。

{{ use: graphic-attribute(
  prefix = ${prefix},
) }}