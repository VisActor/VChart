{{ target: animate-state-animate }}

<!-- IStateAnimateSpec -->


{{ if: !${noPreset} }}

{{ var: presetType = ${preset} ?  ${preset} : 'string' }}
{{ var: defaultPresetType = ${defaultPreset} ?  ${defaultPreset} : 'fadeIn' }}
#${prefix} preset(${presetType}) = '${defaultPresetType}'

Preset animation effects.

{{ /if }}

#${prefix} duration(number) = ${defaultDuration}

Chart animation duration.

#${prefix} delay(number) = 0

The time to delay the start of the animation.

#${prefix} easing(string) = '${defaultEasing}'

Animation easing effect. Default built-in effect types include: 'linear', 'quadIn', 'quadOut', 'quadInOut', 'quadInOut', 'cubicIn', 'cubicOut', 'cubicInOut', 'quartIn', 'quartOut', 'quartInOut', 'quintIn', 'quintOut', 'quintInOut', 'backIn', 'backOut', 'backInOut', 'circIn', 'circOut', 'circInOut', 'bounceOut', 'bounceIn', 'bounceInOut', 'elasticIn', 'elasticOut', 'elasticInOut'.

{{ if: !${noOneByOne} }}
#${prefix} oneByOne(boolean) = false

Whether to execute in sequence.
{{ /if }}