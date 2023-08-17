{{ target: component-marker-symbol }}

#${prefix} visible(boolean)

Whether the symbol element is visible or not.

#${prefix} symbolType(string)

The shape of the symbol element.

Available options:
- `'circle'`
- `'cross'`
- `'diamond'`
- `'square'`
- `'arrow'`
- `'arrow2Left'`
- `'arrow2Right'`
- `'wedge'`
- `'thinTriangle'`
- `'triangle'`
- `'triangleUp'`
- `'triangleDown'`
- `'triangleRight'`
- `'triangleLeft'`
- `'stroke'`
- `'star'`
- `'wye'`
- `'rect'`

#${prefix} size(number)

The size of the symbol element.

#${prefix} style(Object)

The style of the symbol element.

{{ use: graphic-symbol(
  prefix = '#' + ${prefix}
) }}

{{ use: component-marker-ref(
  prefix = ${prefix}
) }}
