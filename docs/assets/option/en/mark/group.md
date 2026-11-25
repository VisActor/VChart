{{ target: mark-group }}

<!-- IGroupMarkSpec -->

#${prefix} clip(boolean|Function)
Whether to clip the primitive.

#${prefix} width(number|Function)
width.

#${prefix} height(number|Function)
high.

#${prefix} cornerRadius(number|Array|Function)
Rounded corner configuration.
1. If a value is passed in, the four corners will be uniformly rounded.
2. If an array is passed in, they will be [top left, top right, bottom right, bottom left]

{{ use: graphic-attribute(
  prefix = ${prefix},
  callbackType = '|Function',
) }}