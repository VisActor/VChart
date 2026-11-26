{{ target: mark-point }}

<!-- ISymbolMarkSpec -->

#${prefix} visible(boolean|Function) = true

Whether to display the title.

<!-- #${prefix} shape(string)

Same as symbolType. Declare using shape externally, the corresponding vrender graphic attribute is shape. -->

{{ use: graphic-symbol(
  prefix = ${prefix},
  callbackType = '|Function'
) }}
