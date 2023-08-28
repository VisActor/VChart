{{ target: component-polar-axis-common }}

#${prefix} domainLine(Object)

Axis line configuration.

{{ use: component-axis-domain-line(
  prefix = '#' + ${prefix}
) }}

#${prefix} label(Object)

Axis label configuration.

{{ use: component-axis-label(
  prefix  = '#' + ${prefix}
) }}

#${prefix} title(Object)

Axis title configuration.

{{ use: component-axis-title(
  prefix = '#'+ ${prefix}
) }}

#${prefix} grid(Object)

Grid line configuration.

##${prefix} smooth(boolean) = false

When smooth is set to true, the grid is circular, otherwise it's a polygonal grid.

{{ use: component-axis-grid(
  prefix = '#' + ${prefix}
) }}

#${prefix} subGrid(Object)

Sub-grid line configuration.

##${prefix} smooth(boolean) = false

When smooth is set to true, the grid is circular, otherwise it's a polygonal grid.

{{ use: component-axis-grid(
  prefix = '#' + ${prefix}
) }}