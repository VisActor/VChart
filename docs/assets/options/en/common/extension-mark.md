{{ target: common-extension-mark }}

<!-- IExtensionMarkSpec -->

## extensionMark(Array)

extension marks are a user-customizable interface for drawing arbitrary content on series. Currently supported graphical types are as follows:

- `symbol` Point shape
- `rule` A line segment that requires specifying the start and end points
- `text` Text
- `rect` Rectangle
- `path` Path
- `arc` Sector
- `polygon` Polygon
- `image` Image
- `group` Group, allows other marks to be placed within the group

## extensionMark.symbol(Object)

Graphical type `symbol`

### type(string) = "symbol"

{{ use: common-extension-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-symbol(
  prefix = '###'
) }}

## extensionMark.rule(Object)

Graphical type `rule`

### type(string) = "rule"

Required configuration to specify the graphical type

{{ use: common-extension-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-rule(
  prefix = '###'
) }}

## extensionMark.text(Object)

Graphical type `text`

### type(string) = "text"

Required configuration to specify the graphical type

{{ use: common-extension-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-text(
  prefix = '###'
) }}

## extensionMark.rect(Object)

Graphical type `rect`

### type(string) = "rect"

Required configuration to specify the graphical type

{{ use: common-extension-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-rect(
  prefix = '###'
) }}

## extensionMark.path(Object)

Graphical type `path`

### type(string) = "path"

Required configuration to specify the graphical type

{{ use: common-extension-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-path(
  prefix = '###'
) }}

## extensionMark.arc(Object)

Graphical type `arc`

### type(string) = "arc"

Required configuration to specify the graphical type

{{ use: common-extension-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-arc(
  prefix = '###'
) }}

## extensionMark.polygon(Object)

Graphical type `polygon`

### type(string) = "polygon"

Required configuration to specify the graphical type

{{ use: common-extension-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-polygon(
  prefix = '###'
) }}

## extensionMark.image(Object)

Graphical type `image`

### type(string) = "image"

Required configuration to specify the graphical type

{{ use: common-extension-mark-base(
  prefix = '##'
) }}

### style(Object)

{{ use: graphic-image(
  prefix = '###'
) }}

## extensionMark.group(Object)

Graphical type `group`

### type(string) = "group"

Required configuration to specify the graphical type

{{ use: common-extension-mark-base(
  prefix = '##'
) }}

### children(Array)

Group acts as a special mark. It allows for new marks to be configured within the group's children section
