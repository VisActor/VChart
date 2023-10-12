{{ target: component-tooltip-theme }}

<!-- ITooltipTheme -->

#${prefix} panel(Object)

Configure tooltip background frame style.

##${prefix} padding(Object)

{{ use: common-padding(
  prefix = '#' + ${prefix},
  componentName = 'tooltip background frame'
) }}

##${prefix} backgroundColor(string)

**Optional** Configure background color.

##${prefix} border(Object)

**Optional** Configure background frame border.

###${prefix} color(string)

**Optional** Configure background frame border color.

###${prefix} width(number)

**Optional** Configure background frame border width.

###${prefix} radius(number)

**Optional** Configure background frame border radius.

##${prefix} shadow(Object)

**Optional** Configure background frame shadow.

###${prefix} x(number)

**Optional** Configure background frame shadow offset x.

###${prefix} y(number)

**Optional** Configure background frame shadow offset y.

###${prefix} blur(number)

**Optional** Configure background frame shadow blur radius.

###${prefix} spread(number)

**Optional** Configure background frame shadow spread radius.

###${prefix} color(string)

**Optional** Configure background frame shadow color.

#${prefix} shape(Object)

**Optional** Configure tooltip shape style.

##${prefix} size(number)

**Optional** Configure tooltip shape width and height.

##${prefix} spacing(number)

**Optional** Configure tooltip shape horizontal spacing with adjacent element on the right.

#${prefix} titleLabel(Object)

**Optional** Configure tooltip title row style.

{{ use: component-tooltip-text-theme(
  prefix = '#' + ${prefix},
  componentName = 'tooltip title row',
  labelType = 'title',
  spacing = false
) }}

#${prefix} keyLabel(Object)

**Optional** Configure tooltip content row key column style.

{{ use: component-tooltip-text-theme(
  prefix = '#' + ${prefix},
  componentName = 'tooltip content row key column',
  labelType = 'key',
  spacing = true
) }}

#${prefix} valueLabel(Object)

**Optional** Configure tooltip content row value column style.

{{ use: component-tooltip-text-theme(
  prefix = '#' + ${prefix},
  componentName = 'tooltip content row value column',
  labelType = 'value',
  spacing = true
) }}

#${prefix} spaceRow(number)

**Optional** Configure tooltip content row spacing.
