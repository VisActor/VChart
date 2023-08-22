{{ target: animate-animation }}

<!-- 动画配置 -->

#${prefix} animationAppear(boolean|object)

入场动画配置。配置为 `false` 可以关闭入场动画。

{{ use: animate-state-animate(
  prefix = '#' + ${prefix},
  noPreset = ${noPreset},
  preset = ${preset},
  defaultPreset = ${defaultPreset},
  defaultDuration = 1000,
  defaultEasing = 'cubicOut',
) }}

#${prefix} animationEnter(boolean|object)

数据更新时，新增图元的动画配置。配置为 `false` 可以关闭该动画。

{{ use: animate-state-animate(
  prefix = '#' + ${prefix},
  defaultDuration = 300,
  defaultEasing = 'linear',
  noPreset = true,
) }}

#${prefix} animationUpdate(boolean|object)

数据更新时，图元更新的动画配置。配置为 `false` 可以关闭该动画。

{{ use: animate-state-animate(
  prefix = '#' + ${prefix},
  defaultDuration = 300,
  defaultEasing = 'linear',
  noPreset = true,
) }}

#${prefix} animationExit(boolean|object)

数据更新时，退场图元的动画配置。配置为 `false` 可以关闭该动画。

{{ use: animate-state-animate(
  prefix = '#' + ${prefix},
  defaultDuration = 300,
  defaultEasing = 'linear',
  noPreset = true,
) }}


#${prefix} animationDisappear(boolean|object)

图表退场动画。配置为 `false` 可以关闭该动画。

{{ use: animate-state-animate(
  prefix = '#' + ${prefix},
  defaultDuration = 500,
  defaultEasing = 'cubicIn',
  noPreset = true,
) }}
