{{ target: graphic-rect }}

<!-- Canopus Graphic Attributes, IRectGraphicAttribute -->

#${prefix} cornerRadius(number|Array${callbackType})

The configuration of the rounded corners of the rectangle. The value of cornerRadius can be a single number or an array, specifying the rounded corner sizes in 4 directions.

#${prefix} width(number${callbackType})
width of rect.

#${prefix} height(number${callbackType})
height of rect.


{{ use: graphic-attribute(
  prefix = ${prefix},
  callbackType = ${callbackType},
) }}
