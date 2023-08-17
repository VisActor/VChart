{{ target: mark-point }}

<!-- ISymbolMarkSpec -->

#${prefix} visible(boolean) = true

Whether to display the title.

<!-- #${prefix} shape(string)

Same as symbolType. Declare using shape externally, the corresponding vrender graphic attribute is shape. -->

#${prefix} scaleX(number)

Scaling in the X direction.

#${prefix} scaleY(number)

Scaling in the Y direction.

{{ use: graphic-symbol(
  prefix = ${prefix}
) }}