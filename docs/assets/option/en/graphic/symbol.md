{{ target: graphic-symbol }}

<!-- Canopus ISymbolAttribute -->

#${prefix} symbolType(string)

The shape type of the symbol. The built-in shapes are as follows: `'circle'`, `'cross'`, `'diamond'`, `'square'`, `'arrow'`, `'arrow2Left'`, `'arrow2Right'`, `'wedge'`, `'thinTriangle'`, `'triangle'`, `'triangleUp'`, `'triangleDown'`, `'triangleRight'`, `'triangleLeft'`, `'stroke'`, `'star'`, `'wye'`, `'rect'`.

#${prefix} size(number|[number, number])

The size of the symbol. The array is used to set the width and height separately.

#${prefix} keepDirIn3d(boolean)

Whether to always keep the direction facing the window in 3d mode (if set to false, it will rotate with the angle of view, if set to true, the direction will always face the window)

{{ use: graphic-attribute(
  prefix = ${prefix},
) }}