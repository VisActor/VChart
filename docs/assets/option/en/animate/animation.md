{{ target: animate-animation }}

<!-- Animation Configuration -->

#${prefix} animationAppear(boolean|object)

Entrance animation configuration. Setting it to `false` disables the entrance animation.

{{ use: animate-state-animate(
  prefix = '#' + ${prefix},
  noPreset = ${noPreset},
  preset = ${preset},
  defaultPreset = ${defaultPreset},
  defaultDuration = 1000,
  defaultEasing = 'cubicOut',
  seriesType = ${seriesType}
) }}

#${prefix} animationEnter(boolean|object)

Animation configuration for newly added graphic elements when data is updated. Setting it to `false` disables this animation.

{{ use: animate-state-animate(
  prefix = '#' + ${prefix},
  defaultDuration = 300,
  defaultEasing = 'linear',
  noPreset = true,
) }}

#${prefix} animationUpdate(boolean|object)

Animation configuration for graphic elements update when data is updated. Setting it to `false` disables this animation.

{{ use: animate-state-animate(
  prefix = '#' + ${prefix},
  defaultDuration = 300,
  defaultEasing = 'linear',
  noPreset = true,
) }}

#${prefix} animationExit(boolean|object)

Animation configuration for exit graphic elements when data is updated. Setting it to `false` disables this animation.

{{ use: animate-state-animate(
  prefix = '#' + ${prefix},
  defaultDuration = 300,
  defaultEasing = 'linear',
  noPreset = true,
) }}

#${prefix} animationDisappear(boolean|object)

Chart exit animation configuration. Setting it to `false` disables this animation.

{{ use: animate-state-animate(
  prefix = '#' + ${prefix},
  defaultDuration = 500,
  defaultEasing = 'cubicIn',
  noPreset = true,
) }}
