{{ target: animate-animation }}

<!-- Animation Configuration -->

#${prefix} animationAppear(boolean|object)

Entrance animation configuration. Setting it to `false` disables the entrance animation.

##${prefix} type='IStateAnimateSpec'(object)
Simplified animation configuration. Configuration items will be applied to all series marks.

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
Complete animation configuration, and the marks of the series can be set with animations separately. Please refer to [Tutorials-Animation-Configuration and Arrangement of Complex Animations].

{{ for: ${seriesMarks} as ${markName} }}

###${prefix} ${markName}(object|array)
${markName} mark animation config.

{{ use: marks-animate(type = ${markName}, name = ${markName},prefix = '###' + ${prefix}) }}

{{ /for }}

#${prefix} animationEnter(boolean|object)

Animation configuration for newly added graphic elements when data is updated. Setting it to `false` disables this animation.

##${prefix} type='IStateAnimateSpec'(object)
Simplified animation configuration. Configuration items will be applied to all series marks.

{{ use: animate-state-animate(
  prefix = '##' + ${prefix},
  defaultDuration = 300,
  defaultEasing = 'linear',
  noPreset = true,
) }}

##${prefix} type='IAnimationConfig'(object)
Complete animation configuration, and the marks of the series can be set with animations separately. Please refer to [Tutorials-Animation-Configuration and Arrangement of Complex Animations].

{{ for: ${seriesMarks} as ${markName} }}

###${prefix} ${markName}(object|array)
${markName} mark animation config.

{{ use: marks-animate(type = ${markName}, name = ${markName},prefix = '###' + ${prefix}) }}

{{ /for }}

#${prefix} animationUpdate(boolean|object)

Animation configuration for graphic elements update when data is updated. Setting it to `false` disables this animation.

##${prefix} type='IStateAnimateSpec'(object)
Simplified animation configuration. Configuration items will be applied to all series marks.

{{ use: animate-state-animate(
  prefix = '##' + ${prefix},
  defaultDuration = 300,
  defaultEasing = 'linear',
  noPreset = true,
) }}

##${prefix} type='IAnimationConfig'(object)
Complete animation configuration, and the marks of the series can be set with animations separately. Please refer to [Tutorials-Animation-Configuration and Arrangement of Complex Animations].

{{ for: ${seriesMarks} as ${markName} }}

###${prefix} ${markName}(object|array)
${markName} mark animation config.

{{ use: marks-animate(type = ${markName}, name = ${markName},prefix = '###' + ${prefix}) }}

{{ /for }}

#${prefix} animationExit(boolean|object)

Animation configuration for exit graphic elements when data is updated. Setting it to `false` disables this animation.

##${prefix} type='IStateAnimateSpec'(object)
Simplified animation configuration. Configuration items will be applied to all series marks.

{{ use: animate-state-animate(
  prefix = '##' + ${prefix},
  defaultDuration = 300,
  defaultEasing = 'linear',
  noPreset = true,
) }}

##${prefix} type='IAnimationConfig'(object)
Complete animation configuration, and the marks of the series can be set with animations separately. Please refer to [Tutorials-Animation-Configuration and Arrangement of Complex Animations].

{{ for: ${seriesMarks} as ${markName} }}

###${prefix} ${markName}(object|array)
${markName} mark animation config.

{{ use: marks-animate(type = ${markName}, name = ${markName},prefix = '###' + ${prefix}) }}

{{ /for }}

#${prefix} animationDisappear(boolean|object)

Chart exit animation configuration. Setting it to `false` disables this animation.

##${prefix} type='IStateAnimateSpec'(object)
Simplified animation configuration. Configuration items will be applied to all series marks.

{{ use: animate-state-animate(
  prefix = '##' + ${prefix},
  defaultDuration = 500,
  defaultEasing = 'cubicIn',
  noPreset = true,
) }}

##${prefix} type='IAnimationConfig'(object)
Complete animation configuration, and the marks of the series can be set with animations separately. Please refer to [Tutorials-Animation-Configuration and Arrangement of Complex Animations].

{{ for: ${seriesMarks} as ${markName} }}

###${prefix} ${markName}(object|array)
${markName} mark animation config.

{{ use: marks-animate(type = ${markName}, name = ${markName},prefix = '###' + ${prefix}) }}

{{ /for }}
