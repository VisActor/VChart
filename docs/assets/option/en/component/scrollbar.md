{{ target: component-scrollbar }}

## scrollbar(Array)

Scrollbar configuration.

### round(boolean)

Whether the slider is rounded.

### innerPadding(boolean)

Scrollbar padding, affects the actual available space of the slider track [top, right, bottom, left].

### range([number, number])

The current visible range of the slider, with values between 0 - 1.

### limitRange([number, number])

The scrolling range limit of the slider, with values between 0 - 1.

### rail(Object)

Scrollbar track.

#### style(Object)

Scrollbar track style.

{{ use: graphic-rect(
  prefix = '####'
) }}

### slider(Object)

Scrollbar slider.

#### style(Object)

Scrollbar slider style.

{{ use: graphic-rect(
  prefix = '####'
) }}

{{ use: component-data-filter-base(
  prefix = '##'
) }}

### filterMode(string) = 'axis'

Data filtering mode.

Optional values:

- 'filter'
- 'axis'