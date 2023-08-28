{{ target: graphic-image }}

<!-- Canopus IImageGraphicAttribute -->

#${prefix} width(number)

Image width.

#${prefix} height(number)

Image height.

#${prefix} repeatX(string)

The repeat mode for the image in the x direction.

 Optional values:
- `'no-repeat'`
- `'repeat'`
- `'stretch'`

#${prefix} repeatY(string)

The repeat mode for the image in the y direction.

 Optional values:
- `'no-repeat'`
- `'repeat'`
- `'stretch'`

#${prefix} image(string | Object)

Image resource, can be a url, HTMLImageElement, or HTMLCanvasElement.

{{ use: graphic-attribute(
  prefix = ${prefix},
) }}