{{ target: component-polar-axis-common }}

#${prefix} domainLine(Object)

轴线配置。

{{ use: component-axis-domain-line(
  prefix = '#' + ${prefix}
) }}

#${prefix} label(Object)

轴标签配置。

{{ use: component-axis-label(
  prefix  = '#' + ${prefix}
) }}

#${prefix} title(Object)

轴标题配置。

{{ use: component-axis-title(
  prefix = '#'+ ${prefix}
) }}

#${prefix} grid(Object)

网格线配置。

##${prefix} smooth(boolean) = false

smooth 为 true 时，为圆形 grid，为 false 则为多边形 grid。

{{ use: component-axis-grid(
  prefix = '#' + ${prefix}
) }}

#${prefix} subGrid(Object)

子网格线配置。

##${prefix} smooth(boolean) = false

smooth 为 true 时，为圆形 grid，为 false 则为多边形 grid。

{{ use: component-axis-grid(
  prefix = '#' + ${prefix}
) }}
