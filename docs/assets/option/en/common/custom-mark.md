{{ target: common-custom-mark }}

<!-- ICustomMarkSpec -->

## customMark(Array)

Custom marks are a user-customizable interface for drawing arbitrary content on charts. Currently supported graphical types are as follows:

- `symbol` Point shape
- `rule` A line segment that requires specifying the start and end points
- `text` Text
- `rect` Rectangle
- `path` Path
- `arc` Sector
- `polygon` Polygon
- `image` Image
- `group` Group, allows other marks to be placed within the group

## customMark.symbol(Object)

Graphical type `symbol`

### type(string) = "symbol"

{{ use: common-custom-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-symbol(
  prefix = '###'
) }}

## customMark.rule(Object)

Graphical type `rule`

### type(string) = "rule"

Required configuration to specify the graphical type

{{ use: common-custom-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-rule(
  prefix = '###'
) }}

## customMark.text(Object)

Graphical type `text`

### type(string) = "text"

Required configuration to specify the graphical type

{{ use: common-custom-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-text(
  prefix = '###'
) }}

## customMark.rect(Object)

Graphical type `rect`

### type(string) = "rect"

Required configuration to specify the graphical type

{{ use: common-custom-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-rect(
  prefix = '###'
) }}

## customMark.path(Object)

Graphical type `path`

### type(string) = "path"

Required configuration to specify the graphical type

{{ use: common-custom-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-path(
  prefix = '###'
) }}

## customMark.arc(Object)

Graphical type `arc`

### type(string) = "arc"

Required configuration to specify the graphical type

{{ use: common-custom-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-arc(
  prefix = '###',
  markType = 'arc'
) }}

## customMark.polygon(Object)

Graphical type `polygon`

### type(string) = "polygon"

Required configuration to specify the graphical type

{{ use: common-custom-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-polygon(
  prefix = '###'
) }}

## customMark.image(Object)

Graphical type `image`

### type(string) = "image"

Required configuration to specify the graphical type

{{ use: common-custom-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-image(
  prefix = '###'
) }}

## customMark.group(Object)

Graphical type `group`

### type(string) = "group"

Required configuration to specify the graphical type

{{ use: common-custom-mark-base(
  prefix = '##'
) }}

### children(Array)

Group acts as a special mark. It allows for new marks to be configured within the group's children section
