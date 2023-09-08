{{ target: graphic-symbol }}

<!-- Canopus ISymbolAttribute -->

#${prefix} symbolType(string)

symbol 的形状类型。目前内置了如下形状：`'circle'`, `'cross'`, `'diamond'`, `'square'`, `'arrow'`, `'arrow2Left'`, `'arrow2Right'`, `'wedge'`, `'thinTriangle'`, `'triangle'`, `'triangleUp'`, `'triangleDown'`, `'triangleRight'`, `'triangleLeft'`, `'stroke'`, `'star'`, `'wye'`, `'rect'`。

#${prefix} size(number|[number, number])

symbol 的大小。数组用于分别设置宽高。

#${prefix} keepDirIn3d(boolean)

是否在 3d 模式中始终保持方向朝向窗口（配置为 false 则会随着视角旋转而旋转，配置为 true，那么方向始终朝向窗口）

{{ use: graphic-attribute(
  prefix = ${prefix},
) }}
