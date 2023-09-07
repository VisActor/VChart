{{ target: animate-state-animate }}

<!-- IStateAnimateSpec -->


{{ if: !${noPreset} }}

{{ var: presetType = ${preset} ?  ${preset} : 'string' }}
{{ var: defaultPresetType = ${defaultPreset} ?  ${defaultPreset} : 'fadeIn' }}
#${prefix} preset(${presetType}) = '${defaultPresetType}'

预设动画效果。

{{ /if }}

#${prefix} duration(number) = ${defaultDuration}

图表动画时长。

#${prefix} delay(number) = 0

动画延迟开始的时长。

#${prefix} easing(string) = '${defaultEasing}'

动画缓动效果。默认内置效果类型有：'linear', 'quadIn', 'quadOut', 'quadInOut', 'quadInOut', 'cubicIn', 'cubicOut', 'cubicInOut', 'quartIn', 'quartOut', 'quartInOut', 'quintIn', 'quintOut', 'quintInOut', 'backIn', 'backOut', 'backInOut', 'circIn', 'circOut', 'circInOut', 'bounceOut', 'bounceIn', 'bounceInOut', 'elasticIn', 'elasticOut', 'elasticInOut'。

{{ if: !${noOneByOne} }}
#${prefix} oneByOne(boolean) = false

是否轮流执行。
{{ /if }}
