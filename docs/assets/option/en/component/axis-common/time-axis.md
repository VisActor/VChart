{{ target: component-time-axis }}

<!-- ICartesianTimeAxisSpec -->
{{ use: component-linear-axis(
  prefix = ${prefix}
) }}

#${prefix} layers(Array)
The time axis supports up to two layers of tick labels. `layers[0]` is the first layer, closest to the axis line. Add `layers[1]` to configure the second layer. Each layer can have its own ticks and time format.

##${prefix} tickStep(number)

The tick step for this layer, in the same unit as the time field's timestamps. With millisecond timestamps, `86_400_000` means 24 hours.

##${prefix} timeFormat(string) = '%Y%m%d'

The time format for this layer's tick labels, such as `'%Y-%m-%d'` or `'%H:%M'`. The time axis's `label.formatMethod` receives the formatted string for further customization.

| **Date Granularity** | **Format Configuration** | **Date Content**            | **Example** | **Numerical Range** |
| -------------------- | ------------------------ | --------------------------- | ----------- | ------------------- |
| Year                 | %Y                       | Full year name              | 2022        |                     |
| month                | %b                       | abbreviated month           | Jul         |                     |
|                      | %B                       | full name of the month      | July        |                     |
|                      | %m                       | month                       | 7           | [01, 12]            |
| week                 | %a                       | abbreviated week            | Wed         |                     |
|                      | %A                       | full name of the week       | Wednesday   |                     |
| day                  | %d                       | day with 0-padded digits    | 1           | [01, 31]            |
|                      | %e                       | blank-padded days of digits | 1           | [ 1, 31]            |
| hour                 | %H                       | 24-hour format hour         | 1           | [00, 23]            |
|                      | %I                       | 12-hour format hour         | 1           | [01, 12]            |
|                      | %p                       | AM or PM                    | AM          |                     |
| minutes              | %M                       | minutes                     | 0           | [00, 59]            |
| seconds              | %S                       | seconds                     | 0           | [00, 61]            |
| milliseconds         | %L                       | milliseconds                | 1           | [000, 999]          |

##${prefix} timeFormatMode(string) = 'local'

The time zone for this layer's labels. `'utc'` uses UTC and `'local'` uses the runtime's local time zone. This setting affects label text only.

##${prefix} tickCount(number|function) = 5

The suggested tick count for this layer. It works the same way as `tick.tickCount`.

##${prefix} forceTickCount(number)

The exact number of ticks to generate for this layer.
