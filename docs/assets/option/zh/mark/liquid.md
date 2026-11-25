{{ target: mark-liquid }}

<!-- ILiquidMarkSpec -->

#${prefix} wave(number|Function)

波浪的变化状态，范围为 [0, 1]

{{ use: graphic-attribute(
  prefix = ${prefix},
  callbackType = '|Function',
) }}