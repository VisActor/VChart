{{ target: mark-path }}

<!-- IPathMarkSpec -->

#${prefix} path(string)

配置 svg path。

#${prefix} scaleX(number)

X 方向缩放。

#${prefix} scaleY(number)

Y 方向缩放。

#${prefix} scaleCenter(Object)

配置缩放中心。

{{ use: xy-pos(
  prefix = '#' + ${prefix},
  attribute = '缩放中心'
) }}

{{ use: graphic-path(
  prefix = ${prefix}
) }}
