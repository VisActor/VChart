{{ target: component-data-zoom }}

## dataZoom(Array)

Data zoom axis configuration.

### valueField(string)

Field corresponding to the background trend line.

### startText(string)

Starting point text style configuration.

#### padding(number)

Starting point text margin configuration.

#### style(Object)

Starting point text style configuration.

{{ use: graphic-text(
  prefix = '####'
) }}

#### formatMethod(Function)

Starting point text format configuration, using the callback function form.

{{ use:text-format-callback(
  description = 'Starting point text'
) }}

### endText(string)

End point text style configuration.

#### padding(number)

End point text margin configuration.

#### style(Object)

End point text style configuration.

{{ use: graphic-text(
  prefix = '####'
) }}

#### formatMethod(Function)

End point text format configuration, using the callback function form.

{{ use:text-format-callback(
  description = 'End point text'
) }}

### brushSelect(string) = true

Whether to enable box selection. If not enabled, support selectedBackground dragging (box selection and dragging are mutually exclusive).

### showDetail(string | boolean) = 'auto'

Whether to display starting point text and end point text.

### middleHandler(Object)

Middle handle style.

#### visible(boolean) = false

The middle handle is visible.

#### icon(Object)

The center icon of the middle handle.

##### style(Object)

The center icon style of the middle handle.

{{ use: graphic-symbol(
  prefix = '#####'
) }}

#### background(Object)

The background rectangle of the middle handle.

##### size(number)

The size of the background rectangle of the middle handle (when the data zoom axis is horizontal, this size represents the height; similarly, when the data zoom axis is vertical, this size represents the width).

##### style(Object)

The style of the middle handle background rectangle.

{{ use: graphic-rect(
  prefix = '#####'
) }}

### background(Object)

The background rectangle of the data zoom axis.

#### size(Object)

The size of the data zoom axis background rectangle (when the data zoom axis is horizontal, this size represents the height; similarly, when the data zoom axis is vertical, this size represents the width).

#### style(Object)

The style of the data zoom axis background rectangle.

{{ use: graphic-rect(
  prefix = '####'
) }}

### startHandler(Object)

The starting handle of the data zoom axis.

#### style(Object)

The style of the starting handle.

{{ use: graphic-symbol(
  prefix = '####'
) }}

### endHandler(Object)

The end handle of the data zoom axis.

#### style(Object)

The style of the end handle.

{{ use: graphic-symbol(
  prefix = '####'
) }}

### dragMask(Object)

The draggable track object of the data zoom axis.

#### style(Object)

The style of the draggable track object.

{{ use: graphic-rect(
  prefix = '####'
) }}

### selectedBackground(Object)

The selected part background of the data zoom axis.

#### style(Object)

The style of the selected part background.

{{ use: graphic-rect(
  prefix = '####'
) }}

### backgroundChart(Object)

The preview chart of the data zoom axis.

#### line(Object)

The preview chart stroke of the data zoom axis.

##### style(Object)

The style of the preview chart stroke.

{{ use: graphic-line(
  prefix = '#####'
) }}

#### area(Object)

The preview chart fill of the data zoom axis.

##### style(Object)

The style of the preview chart fill.

{{ use: graphic-polygon(
  prefix = '#####'
) }}

### selectedBackgroundChart(Object)

The selected part preview chart of the data zoom axis.

#### line(Object)

The selected part preview chart stroke of the data zoom axis.

##### style(Object)

The style of the selected part preview chart stroke.

{{ use: graphic-line(
  prefix = '#####'
) }}

#### area(Object)

The selected part preview chart fill of the data zoom axis.

##### style(Object)

The style of the selected part preview chart fill.

{{ use: graphic-polygon(
  prefix = '#####'
) }}

### ignoreBandSize(boolean)

Whether to ignore the fixed bandSize configured on the axis. Supported since version 1.7.0.

If set to true, the data zoom can arbitrarily change the bandSize of the axis. But if the bandSize range is configured on the axis, the first rendering will keep the bandSize within the configured range.

This configuration only takes effect when `auto` is set to true.

### tolerance(number)
Background graph node compression rate. If not configured, the number of nodes will be limited to 10,000 by default. Supported since version 1.10.0.

{{ use: component-data-filter-base(
  prefix = '##'
) }}
