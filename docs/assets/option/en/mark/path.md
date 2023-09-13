{{ target: mark-path }}

<!-- IPathMarkSpec -->

#${prefix} path(string)

Configure svg path.

#${prefix} scaleX(number)

Scale in X direction.

#${prefix} scaleY(number)

Scale in Y direction.

#${prefix} scaleCenter(Object)

Configure scale center.

{{ use: xy-pos(
  prefix = '#' + ${prefix},
  attribute = 'scale center'
) }}

{{ use: graphic-path(
  prefix = ${prefix}
) }}