{{ target: component-linear-axis }}

<!-- ILinearAxisSpec -->

#${prefix} min(number)

**Applies only when the axis is a linear or time axis**. Minimum value(time axis only support timeStamp), **takes precedence over zero and nice**.

#${prefix} max(number)

**Applies only when the axis is a linear or time axis**. Maximum value(time axis only support timeStamp), **takes precedence over zero and nice**.

#${prefix} nice(boolean) = true

**Applies only when the axis is a linear or time axis**. Whether to adjust the axis range to a relatively neat value based on the data. When `min` and `max` are configured, this option is invalid.

For example, when `max = 999`, `nice` will not optimize the axis range to 1000.

#${prefix} niceType(string) = 'tickCountFirst'

**Applies only when the axis is a linear or time axis**. The type of nice effect, either accuracy-first or tickCount-first (e.g., if tickCount is 2, the nice precision is very low). If not configured, the default is tickCountFirst.

Optional values:

- `'tickCountFirst'`
- `'accurateFirst'`

Example: If the data range is 0~6000 and the tickCount is 2, the `tickCountFirst` range will be [0, 10000], while the `accurateFirst` range will be [0, 6000], but 10000 will not be displayed.

#${prefix} zero(boolean) = true

**Applies only when the axis is a linear or time axis**. Whether to include 0 value. When min and max are configured, this option is invalid.

#${prefix} expand(Object)

**Applies only when the axis is a linear or time axis**. The axis range expands proportionally, and when min and max are configured, this option is invalid.

##${prefix} min(number)

Minimum value of axis range expanded proportionally.

##${prefix} max(number)

Maximum value of axis range expanded proportionally.

#${prefix} sync(Object)

Synchronize the current axis with other axes

##${prefix} axisId(number)

The id of the other axis to sync

##${prefix} zeroAlign(number)

Keep the 0 values of the 2 axes aligned

##${prefix} tickAlign(number)

Make this axis' ticks proportionally aligned with the target axis

#${prefix} tooltipFilterRange(number | [number, number])

**Applies only when the axis is a linear or time axis**. Configure the dimension tooltip data filtering range on the linear axis. Supported since version 1.4.0.

If configured as a single number such as `d`, the filtering interval is `[x0 - d, x0 + d]`. If configured as a binary tuple such as `[d1, d2]`, the filtering interval is `[x0 + d1, x0 + d2]`.
