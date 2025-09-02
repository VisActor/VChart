{{ target: animate-animation }}

<!-- 动画配置 -->

#${prefix} animationAppear(boolean|object)

入场动画配置。配置为 `false` 可以关闭入场动画。

##${prefix} type='IStateAnimateSpec'(object)
简化的动画配置。配置项将作用于所有系列图元上。
{{ use: animate-state-animate(
  prefix = '##' + ${prefix},
  noPreset = ${noPreset},
  preset = ${preset},
  defaultPreset = ${defaultPreset},
  defaultDuration = 1000,
  defaultEasing = 'cubicOut',
  seriesType = ${seriesType}
) }}

##${prefix} type='IAnimationConfig'(object)
完整的动画配置，系列的图元可以分别设置动画。请参考[教程文档-动画-复杂动画的配置与编排]。

{{ for: ${seriesMarks} as ${markName} }}

###${prefix} ${markName}(object|array)
${markName} 图元的动画配置。

{{ use: marks-animate(type = ${markName}, name = ${markName},prefix = '###' + ${prefix}) }}

{{ /for }}

#${prefix} animationEnter(boolean|object)

数据更新时，新增图元的动画配置。配置为 `false` 可以关闭该动画。

##${prefix} type='IStateAnimateSpec'(object)
简化的动画配置。配置项将作用于所有系列图元上。

{{ use: animate-state-animate(
  prefix = '##' + ${prefix},
  defaultDuration = 300,
  defaultEasing = 'linear',
  noPreset = true,
  seriesType = ${seriesType}
) }}

##${prefix} type='IAnimationConfig'(object)
完整的动画配置，系列的图元可以分别设置动画。请参考[教程文档-动画-复杂动画的配置与编排]。

{{ for: ${seriesMarks} as ${markName} }}

###${prefix} ${markName}(object|array)
${markName} 图元的动画配置。

{{ use: marks-animate(type = ${markName}, name = ${markName},prefix = '###' + ${prefix}) }}

{{ /for }}

#${prefix} animationUpdate(boolean|object)

数据更新时，图元更新的动画配置。配置为 `false` 可以关闭该动画。

##${prefix} type='IStateAnimateSpec'(object)
简化的动画配置。配置项将作用于所有系列图元上。

{{ use: animate-state-animate(
  prefix = '##' + ${prefix},
  defaultDuration = 300,
  defaultEasing = 'linear',
  noPreset = true,
) }}

##${prefix} type='IAnimationConfig'(object)
完整的动画配置，系列的图元可以分别设置动画。请参考[教程文档-动画-复杂动画的配置与编排]。

{{ for: ${seriesMarks} as ${markName} }}

###${prefix} ${markName}(object|array)
${markName} 图元的动画配置。

{{ use: marks-animate(type = ${markName}, name = ${markName},prefix = '###' + ${prefix}) }}

{{ /for }}

#${prefix} animationExit(boolean|object)

数据更新时，退场图元的动画配置。配置为 `false` 可以关闭该动画。

##${prefix} type='IStateAnimateSpec'(object)
简化的动画配置。配置项将作用于所有系列图元上。

{{ use: animate-state-animate(
  prefix = '##' + ${prefix},
  defaultDuration = 300,
  defaultEasing = 'linear',
  noPreset = true,
) }}

##${prefix} type='IAnimationConfig'(object)
完整的动画配置，系列的图元可以分别设置动画。请参考[教程文档-动画-复杂动画的配置与编排]。

{{ for: ${seriesMarks} as ${markName} }}

###${prefix} ${markName}(object|array)
${markName} 图元的动画配置。

{{ use: marks-animate(type = ${markName}, name = ${markName},prefix = '###' + ${prefix}) }}

{{ /for }}

#${prefix} animationDisappear(boolean|object)

图表退场动画。配置为 `false` 可以关闭该动画。

##${prefix} type='IStateAnimateSpec'(object)
简化的动画配置。配置项将作用于所有系列图元上。

{{ use: animate-state-animate(
prefix = '##' + ${prefix},
defaultDuration = 500,
defaultEasing = 'cubicIn',
noPreset = true,
) }}

##${prefix} type='IAnimationConfig'(object)
完整的动画配置，系列的图元可以分别设置动画。请参考[教程文档-动画-复杂动画的配置与编排]。

{{ for: ${seriesMarks} as ${markName} }}

###${prefix} ${markName}(object|array)
${markName} 图元的动画配置。

{{ use: marks-animate(type = ${markName}, name = ${markName},prefix = '###' + ${prefix}) }}

{{ /for }}

##${prefix} type='IStageAnimateSpec'(object)
舞台特效动画配置。提供多种炫酷的退场动画效果，包括粒子分解、扭曲变形、模糊效果、故障艺术、像素化、颜色效果和溶解效果等。

###${prefix} stage(object)
舞台动画配置。

####${prefix} type(string)
动画效果类型。可选值：

- `'particle'`: 粒子分解效果
- `'distortion'`: 扭曲变形效果
- `'gaussianBlur'`: 高斯模糊效果
- `'glitch'`: 故障艺术效果
- `'pixelation'`: 像素化效果
- `'grayscale'`: 颜色效果
- `'dissolve'`: 溶解效果

####${prefix} duration(number) = 2000
动画持续时间，单位毫秒。

####${prefix} easing(string) = 'linear'
动画缓动效果。支持的值有：'linear', 'quadIn', 'quadOut', 'quadInOut', 'cubicIn', 'cubicOut', 'cubicInOut', 'quartIn', 'quartOut', 'quartInOut', 'quintIn', 'quintOut', 'quintInOut', 'backIn', 'backOut', 'backInOut', 'circIn', 'circOut', 'circInOut', 'bounceOut', 'bounceIn', 'bounceInOut', 'elasticIn', 'elasticOut', 'elasticInOut'。

####${prefix} options(object)
具体效果配置参数，根据不同的 `type` 有不同的配置项。

{{ use: animate-stage-options( prefix = '####' + ${prefix} ) }}

{{ /for }}

#${prefix} animationState(boolean|object)

图元状态切换时的动画效果。自 `1.12.0` 版本后支持。

##${prefix} duration(number) = 300

图表动画时长。

##${prefix} easing(string) = 'easing'

动画缓动效果。默认内置效果类型有：'linear', 'quadIn', 'quadOut', 'quadInOut', 'quadInOut', 'cubicIn', 'cubicOut', 'cubicInOut', 'quartIn', 'quartOut', 'quartInOut', 'quintIn', 'quintOut', 'quintInOut', 'backIn', 'backOut', 'backInOut', 'circIn', 'circOut', 'circInOut', 'bounceOut', 'bounceIn', 'bounceInOut', 'elasticIn', 'elasticOut', 'elasticInOut'。
