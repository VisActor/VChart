# v1.13.4

2025-01-17


**🆕 New feature**

- **@visactor/vchart**: add wordCloudConfig in _wordCloudTransformOption()

**🐛 Bug fix**

- **@visactor/vchart**: fix error of tooltip about `showDelay`, fix [#3663](https://github.com/VisActor/VChart/issues/3663)
- **@visactor/vchart**: fix offset of tooltip, fix [#3666](https://github.com/VisActor/VChart/issues/3666)
- **@visactor/vchart**: fix bug of parse lineHeight of tooltip row, fix [#3643](https://github.com/VisActor/VChart/issues/3643)
- **@visactor/vchart**: axis break's scope calculate error, fix[#3656](https://github.com/VisActor/VChart/issues/3656)
- **@visactor/vchart**: fix the issue where map drag interaction cannot be terminated outside the canvas, [#3650](https://github.com/VisActor/VChart/issues/3650)
- **@visactor/vchart**: fix the issue where map drag interaction cannot be terminated outside the canvas.



[more detail about v1.13.4](https://github.com/VisActor/VChart/releases/tag/v1.13.4)

# v1.13.3

2025-01-08


**🆕 New feature**

- **@visactor/vchart**: add datum to params on axis-label event
- **@visactor/vchart**: wrap some hook in vgrammar

**🐛 Bug fix**

- **@visactor/vchart**: fix the issue of incorrect label display in 3D charts, [#3584](https://github.com/VisActor/VChart/issues/3584)
- **@visactor/vchart**: fix the issue of animation in 3d wordcloud not work
- **@visactor/vchart**: brush data will be undefined when mark is hovered. fix[#3623](https://github.com/VisActor/VChart/issues/3623)
- **@visactor/vchart**: fix style of dom tooltip when tooltip has customized child, fix [#3615](https://github.com/VisActor/VChart/issues/3615)
- **@visactor/vchart**: fix error update of dom tooltip when update theme, fix [#3619](https://github.com/VisActor/VChart/issues/3619)
- **@visactor/vchart**: fix position of html tooltip when confine is false, fix [#3632](https://github.com/VisActor/VChart/issues/3632)
- **@visactor/vchart**: fix the typographical error of dataset tutorial
- **@visactor/vchart**: compilier should add dpr to vrender
- **@visactor/vchart**: fix invisible region blocking mark events, [#3638](https://github.com/VisActor/VChart/issues/3638)
- **@visactor/vchart**: undefined points shoulde not show when dimension hover, fix [#3610](https://github.com/VisActor/VChart/issues/3610)
- **@visactor/vchart**: fix layout error of title component, fix [#3614](https://github.com/VisActor/VChart/issues/3614) 



[more detail about v1.13.3](https://github.com/VisActor/VChart/releases/tag/v1.13.3)

# v1.13.2

2024-12-24


**🆕 New feature**

- **@visactor/vchart**: add miss Series and Chart in react vchart, close [#3578](https://github.com/VisActor/VChart/issues/3578)
- **@visactor/vchart**: vchart support clickInterval params

**🐛 Bug fix**

- **@visactor/vchart**: support percentage state radius config in gauge segment mark, [#3459](https://github.com/VisActor/VChart/issues/3459)
- **@visactor/vchart**: media query should not throw error when has empty axis, related to [#3575](https://github.com/VisActor/VChart/issues/3575)
- **@visactor/vchart**: tooltip should not render empty column when `hasShape` of tooltip is `false`, related to [#3572](https://github.com/VisActor/VChart/issues/3572)
- **@visactor/vchart**: `othersLine` of tooltip can be hidden by `visible: false`, related to [#3572](https://github.com/VisActor/VChart/issues/3572)
- **@visactor/vchart**: fix position of tooltip, related to [#3590](https://github.com/VisActor/VChart/issues/3590)
- **@visactor/vchart**: page should not crash when `tickStep` is too small, fix  [#3591](https://github.com/VisActor/VChart/issues/3591)
- **@visactor/vchart**: fix updating of customized DOM when has interactive layer, fix  [#3587](https://github.com/VisActor/VChart/issues/3587) 
- **@visactor/vchart**: fix axis breaks when set `tickStep`, fix  [#3560](https://github.com/VisActor/VChart/issues/3560) 
 


[more detail about v1.13.2](https://github.com/VisActor/VChart/releases/tag/v1.13.2)

# v1.13.1

2024-12-17


**🆕 New feature**

- **@visactor/vchart**: add config `customFilter` to legend, support cutomized filter function, close [#3492](https://github.com/VisActor/VChart/issues/3492)
- **@visactor/vchart**: Area chart supports setting labels in the middle `'inside-middle'`, close [#3353](https://github.com/VisActor/VChart/issues/3353)

**🐛 Bug fix**

- **@visactor/vchart**: fix break of waterfall, fix [#3544](https://github.com/VisActor/VChart/issues/3544)
- **@visactor/vchart**: fix the bug of updateModelSpecSync can not set axis.tick.forceTickCount
- **@visactor/vchart**: fix filter of lock domain when field is array, related [#3469](https://github.com/VisActor/VChart/issues/3469)
- **@visactor/vchart**: fix size of datazoom when update, fix [#3521](https://github.com/VisActor/VChart/issues/3521)
- **@visactor/vchart**: html tooltip can reuse the dom content and fix the unneed animation
- **@visactor/vchart**: fix update of extensionMark when mark has `name`, fix [#3547](https://github.com/VisActor/VChart/issues/3547)
- **@visactor/vchart**: fix indicator when change visible to be false, fix [#3506](https://github.com/VisActor/VChart/issues/3506)
- **@visactor/vchart**: fix tooltip content when only has `valueFormatter` or `keyFormatter`
- **@visactor/vchart**: fix style of dom tooltip
- **vchart-extension**: series-break should keep align width axis break, related to [#3560](https://github.com/VisActor/VChart/issues/3560)
- **@visactor/vchart**: breaks should consider the `min` and `max` of axis, related to [#3560](https://github.com/VisActor/VChart/issues/3560)



[more detail about v1.13.1](https://github.com/VisActor/VChart/releases/tag/v1.13.1)

# v1.13.0

2024-12-06


**🆕 New feature**

- **@visactor/vchart**: add pictogram chart 
- **@visactor/vchart**: support auto generated scrollbar in sankey, close [#2838](https://github.com/VisActor/VChart/issues/2838) 
- **@visactor/vchart**: react vchart support event filter, close [#3461](https://github.com/VisActor/VChart/issues/3461)
- **@visactor/vchart**: tooltip key/content support config by field, close [#2576](https://github.com/VisActor/VChart/issues/2576)
- **@visactor/vchart**: support max height of tooltip, by percent value , close [#2675](https://github.com/VisActor/VChart/issues/2675)


**🐛 Refactor**


- **@visactor/vchart**: [Break Change] refactor the implement of html tooltip, fix [#3137](https://github.com/VisActor/VChart/issues/3137), close [#2924](https://github.com/VisActor/VChart/issues/2924), close [#2591](https://github.com/VisActor/VChart/issues/2591) 
- **@visactor/vchart**: [Break Change] support label overlap for inside arc labels by default


**⚡ Performance optimization**


- **@visactor/vchart**: [Break Change] vrender optimize the bounds of text, which will change the display of all text 



[more detail about v1.13.0](https://github.com/VisActor/VChart/releases/tag/v1.13.0)

# v1.12.15

2024-12-05


**🆕 New feature**

- **@visactor/vchart**: support `restorePosition` in position/bound label overlap strategy

**🐛 Bug fix**

- **@visactor/vchart**: optimize `shiftY` of label



[more detail about v1.12.15](https://github.com/VisActor/VChart/releases/tag/v1.12.15)

# v1.12.14

2024-12-05


**🆕 New feature**

- **@visactor/vchart**: support `autoRefreshDpr` in chart options
- **@visactor/vchart**: dataZoom can do filter when has `lockStatisticsByDomain`, close [#3469](https://github.com/VisActor/VChart/issues/3469)
- **@visactor/vchart**: add marker context to support the same color as series. close[#3437](https://github.com/VisActor/VChart/issues/3437)
- **@visactor/vchart**: update options `maxNodeHeight`, `maxLinkHeight` in sankey, close 3439
- **@visactor/vchart-extension**: add component `series-break`, close [#3450](https://github.com/VisActor/VChart/issues/3450)

**🐛 Bug fix**

- **@visactor/vchart**: upgrade scrollbar visible after layout. fix[#3452](https://github.com/VisActor/VChart/issues/3452)
- **@visactor/vchart**: fix `adjacency` in sankey, fix [#3460](https://github.com/VisActor/VChart/issues/3460)
- **@visactor/vchart**: not update layout when scrollbar domain is the same as before. fix[#3452](https://github.com/VisActor/VChart/issues/3452)
- **@visactor/vchart**: value in scale range should consider about whole range. fix[#3446](https://github.com/VisActor/VChart/issues/3446)
- **@visactor/vchart**:  when the `invalidType` of line is  `"link"`, line should be connected rightly. fix [#3436](https://github.com/VisActor/VChart/issues/3436), fix [#3238](https://github.com/VisActor/VChart/issues/3238) 
- **@visactor/vchart**:  richtext should work when set state, fix [#3465](https://github.com/VisActor/VChart/issues/3465) 



[more detail about v1.12.14](https://github.com/VisActor/VChart/releases/tag/v1.12.14)

# v1.12.13

2024-11-22


**🐛 Bug fix**

- **@visactor/vchart**: fix `groupKey` of boxplot series, fix [#3409](https://github.com/VisActor/VChart/issues/3409), related to [#2855](https://github.com/VisActor/VChart/issues/2855)
- **@visactor/vchart**: fix the issue where the length of the outerlabel line is incorrect when richtext, fix [#3441](https://github.com/VisActor/VChart/issues/3441)



[more detail about v1.12.13](https://github.com/VisActor/VChart/releases/tag/v1.12.13)

# v1.12.12

2024-11-18


**🐛 Bug fix**

- **@visactor/vchart**: fix: fix the issue where modifying area.visible through updateSpec does not take effect, related [#3393](https://github.com/VisActor/VChart/issues/3393)
- **@visactor/vchart**: fix incorrect rendering when changing `direction` via updateSpec in area chart, related [#3406](https://github.com/VisActor/VChart/issues/3406)
- **@visactor/vchart**: fix zIndex of background image, fix [#3403](https://github.com/VisActor/VChart/issues/3403)
- **@visactor/vchart**: fix error of tooltip when chart is released, fix [#3428](https://github.com/VisActor/VChart/issues/3428)

**⚡ Performance optimization**

- **@visactor/vchart**: optimize the effect of break data



[more detail about v1.12.12](https://github.com/VisActor/VChart/releases/tag/v1.12.12)

# v1.12.11

2024-11-13


**🆕 New feature**

- **@visactor/vchart**: support axis sync to the axis that has breaks
- **@visactor/vchart**: tooltip can support customized `trigger` and `triggerOff`

**🐛 Bug fix**

- **@visactor/vchart**: fix the issue where the axis breaks render incorrectly in some cases
- **@visactor/vchart**: fix `zIndex` of series, fix [#3395](https://github.com/VisActor/VChart/issues/3395)
- **@visactor/vchart**: fix layout of title when orient is "left" or "right", fix [#3401](https://github.com/VisActor/VChart/issues/3401)
- **@visactor/vchart**: fix the issue of custom svg string in tooltip shape, related [#3384](https://github.com/VisActor/VChart/issues/3384)
- **@visactor/vchart**: tooltip `enterable` should work when update, fix [#3405](https://github.com/VisActor/VChart/issues/3405)
- **@visactor/vchart**: fix tooltip position by `mode: pointer`, close [#3367](https://github.com/VisActor/VChart/issues/3367)
- **@visactor/vchart**: wordcloud should not throw error when `word.visible` is `false`, fix [#3378](https://github.com/VisActor/VChart/issues/3378)
- **@visactor/vchart**: fix the issue where the scrolling legend triggers map zooming under certain conditions, related [#3391](https://github.com/VisActor/VChart/issues/3391)



[more detail about v1.12.11](https://github.com/VisActor/VChart/releases/tag/v1.12.11)

# v1.12.10

2024-10-31

**🆕 New feature**

- **@visactor/vchart**: pie series support center of percent string

**🐛 Bug fix**

- **@visactor/vchart**: scroll not dispatch view update when axis is not display. fix[#3278](https://github.com/VisActor/VChart/issues/3278)
- **@visactor/vchart**: changes to `roam` via updateSpec do not take effect
- **@visactor/vchart**: fix the issue of symbolActiveMark visible setting
- **@visactor/vchart**: fix issue with chart background in harmony
- **@visactor/vchart**: fix event of angle axis in radarchart, fix [#3343](https://github.com/VisActor/VChart/issues/3343)
- **@visactor/vchart**: type issue of title theme
- **@visactor/vchart**: fix the issue of incorrect display of legend scrollbar in boundary scenarios

**🔨 Refactor**

- **@visactor/vchart**: optimize setter and getter about markConfig
- **@visactor/vchart**: Optimize the issue of excessive omission of head and tail labels when axis labels are rotated in Cartesian coordinate systems.
- **@visactor/vchart**: Optimize the automatic line wrapping effect of axis labels in Cartesian coordinate systems.

[more detail about v1.12.10](https://github.com/VisActor/VChart/releases/tag/v1.12.10)

# v1.12.9

2024-10-25


**🆕 New feature**

- **@visactor/vchart**: support tooltip for overlapped points, close [#3224](https://github.com/VisActor/VChart/issues/3224)

**🐛 Bug fix**

- **@visactor/vchart**: fixed the issue where map labels do not scale accordingly after updateSpec.
- **@visactor/vchart**: all the SeriesData should call `compileData()`, fix [#3322](https://github.com/VisActor/VChart/issues/3322)
- **@visactor/vchart**: clear throttle timer when out, fix [#3326](https://github.com/VisActor/VChart/issues/3326)
- **@visactor/vchart**: fix `tooltipHide` event when handler is empty
- **@visactor/vchart**: tooltip data should has `datum` in each line
- **@visactor/vchart**: Fixed the issue of label component misalignment in specific situations
- **@visactor/vchart**: Fixed the issue of partial blank areas in charts during resizing when dpr is not an integer, fix [#3255](https://github.com/VisActor/VChart/issues/3355)


[more detail about v1.12.9](https://github.com/VisActor/VChart/releases/tag/v1.12.9)

# v1.12.8

2024-10-15


**🆕 New feature**

- **@visactor/vchart**: support `firstVisible` of axis label, close [#3200](https://github.com/VisActor/VChart/issues/3200)
- **@visactor/vchart**: support `roam.blank` to enable dragging from blank area of region in map chart
- **@visactor/vchart**: optimize data empty condition
 **@visactor/vchart**: Label component text style supports `wordBreak: "keep-all"`

**🐛 Bug fix**

- **@visactor/vchart**: chart should `remake` when visible of axis change, fix [#3287](https://github.com/VisActor/VChart/issues/3287)
- **@visactor/vchart**: fix visible change of label, fix [#3277](https://github.com/VisActor/VChart/issues/3277)
- **@visactor/vchart**: custom theme by chartType cannot work in initial options, [#3285](https://github.com/VisActor/VChart/issues/3285)
- **@visactor/vchart**: fix issue of `html` and `dom` not work correctly in label
- **@visactor/vchart**: axis line on zero should consider the bindAxis's inverse, fixed[#3306](https://github.com/VisActor/VChart/issues/3306)
- **react-vchart**: register labels by default in circlePacking, sankey, sunburst, treemap, venn, fix [#3148](https://github.com/VisActor/VChart/issues/3148)
- **@visactor/vchart**: Fix the issue where `item.label.space` and `pager.space` are not effective in discrete legends

**🔨 Refactor**

- **@visactor/vchart**: refactor implement of `enterable` in tooltip component


[more detail about v1.12.8](https://github.com/VisActor/VChart/releases/tag/v1.12.8)

# v1.12.7

2024-09-29


**🆕 New feature**

- **@visactor/vchart**: feat: support `minLength` in funnel outerlabel line
- **react-vchart**: support `morphConfig` of react-vchart, close [#3219](https://github.com/VisActor/VChart/issues/3219)

**🐛 Bug fix**

- **@visactor/vchart**: fix error of `updateSpec` when data changed, fix [#3261](https://github.com/VisActor/VChart/issues/3261)
- **@visactor/vchart**: color of linear progress track in dark mode
- **@visactor/vchart**: datazoom state field and value field is incomplete problem. fix[#3199](https://github.com/VisActor/VChart/issues/3199)
- **@visactor/vchart**: fix title of axis when the bounds is empty, fix [#3265](https://github.com/VisActor/VChart/issues/3265)
- **@visactor/vchart**: fix media-query when `updateSpec`
- **@visactor/vchart**: fix updateSpec when add attributes `width`, `height` to `spec`



[more detail about v1.12.7](https://github.com/VisActor/VChart/releases/tag/v1.12.7)

# v1.12.6

2024-09-23

**🆕 New Features**

- **@visactor/vchart**: Added lifecycle hooks, `afterCreateVChart`, `beforeInitializeChart`, `afterInitializeChart`
- **@visactor/vchart**: Polar coordinate angle axis supports configurations like `autoLimit`, `autoWrap`, `autoHide`, etc.

**🐛 Bug Fixes**

- **@visactor/vchart**: Allow adding `indicator` components in polar charts
- **@visactor/vchart**: Fix the default value issue of `position` in the `label` component, fix [#3242](https://github.com/VisActor/VChart/issues/3242)
- **@visactor/vchart**: Fix type error, change `type` in `PointerMarkSpec` to an optional type, fix [#3227](https://github.com/VisActor/VChart/issues/3227)
- **@visactor/vchart**: Use `throttle` for throttling when triggering `resize`
- **@visactor/vchart**: Fix the chart update type to be `reCompile` instead of `remake` when updating `label` configurations
- **@visactor/vchart**: Fix the issue where `customMark` does not support `markName` event filters
- **@visactor/vchart**: Fix the issue of incorrect animation triggering during radar chart updates, fix [#3228](https://github.com/VisActor/VChart/issues/3228)

[more detail about v1.12.6](https://github.com/VisActor/VChart/releases/tag/v1.12.6)

# v1.12.5

2024-09-23

**🆕 New Features**

- **@visactor/vchart**: extension mark and customized mark support `markName` event filter

**🐛 Bug Fixes**

- **@visactor/vchart**: optimize first axis label autolimit effect of cartesian chart
- **@visactor/vchart**: `animationUpdate` should also control labels animation
- **@visactor/vchart**: fix default value of circular-progress, fix [#2683](https://github.com/VisActor/VChart/issues/2683)
- **@visactor/vchart**: fix display of radar-chart when has negative radius
- **@visactor/vchart**: `word.style.fontWeight` should change the style of text in wordcloud, fix [#3212](https://github.com/VisActor/VChart/issues/3212)

**🔨 Refactor**

- **@visactor/vchart**: simplify `getSpecInfo`

[more detail about v1.12.5](https://github.com/VisActor/VChart/releases/tag/v1.12.5)


# v1.12.4

2024-09-09


**🆕 New feature**

- **@visactor/vchart**: support axis break
- **@visactor/vchart**: stackCornerRadius support callback. feat[#3164](https://github.com/VisActor/VChart/issues/3164)
- **@visactor/vchart**: add `crossNodeAlign` to sankey

**🐛 Bug fix**

- **@visactor/vchart**: bind first axis to series but not last. fix[#3139](https://github.com/VisActor/VChart/issues/3139)
- **@visactor/vchart**: crosshair won't update when switch theme
- **@visactor/vchart**: wordcloud text overlap. fix[#3177](https://github.com/VisActor/VChart/issues/3177)
- **@visactor/vchart**: fix zIndex of label in pie-chart

**🔧 Configuration releated**

- **@visactor/vchart**: clear state when updateSpec. fix[#3162](https://github.com/VisActor/VChart/issues/3162)



[more detail about v1.12.4](https://github.com/VisActor/VChart/releases/tag/v1.12.4)

# v1.12.3

2024-09-05


**🐛 Bug fix**

- **@visactor/vchart**: cannot disable label update animation by `option.animation:false`



[more detail about v1.12.3](https://github.com/VisActor/VChart/releases/tag/v1.12.3)

# v1.12.2

2024-09-05


**🆕 New feature**

- **brush**: add config to control zoom when brush empty data. close[#2934](https://github.com/VisActor/VChart/issues/2934)
- **@visactor/vchart**: support 'inside-center' label position in pie chart

**🐛 Bug fix**

- **@visactor/vchart**: rangeMode of scrollbar not work. fix[#3147](https://github.com/VisActor/VChart/issues/3147)
- **@visactor/vchart**: fix error of `barWidth`, `barMinWidth`, `barMaxWidth` when value is null
- **@visactor/vchart**: x brush filter not work. fix[#3111](https://github.com/VisActor/VChart/issues/3111)
- **@visactor/vchart**: indicator stop tooltip interactive. fix[#3123](https://github.com/VisActor/VChart/issues/3123)
- **@visactor/vchart**: fix error of `getCenter` when layoutRadius is a customized function in radar
- **@visactor/vchart**: media query causes incorrect render result, [#3102](https://github.com/VisActor/VChart/issues/3102)
- **@visactor/vchart**: normal animation not work since v1.12.0
- **@visactor/vchart**: sankey scale update not work
- **@visactor/vchart**: fix error of sankey when some customized mark has name "node"
- **@visactor/vchart**: fix dimension value of tooltip when has innerOffset, fix [#2923](https://github.com/VisActor/VChart/issues/2923)
- **@visactor/vchart**: vchart should not throw error when the values of series data is empty, fix [#3082](https://github.com/VisActor/VChart/issues/3082)
- **@visactor/vchart**: fix error of `updateSpec` when array change
- **@visactor/vchart**: wordcloud fill not update after updateSpec. fix[#3122](https://github.com/VisActor/VChart/issues/3122)
- **@visactor/vchart**: wordcloud scale update not work. fix[#3129](https://github.com/VisActor/VChart/issues/3129)

**🔨 Refactor**

- **@visactor/vchart**: refactor the parser of tooltip pattern

**📖 Site / documentation update**

- **@visactor/vchart**: fix issue of treemap.label not shown in option pages, fix [#2562](https://github.com/VisActor/VChart/issues/2562)
- **@visactor/vchart**: update docs about circular progress, close [#2987](https://github.com/VisActor/VChart/issues/2987)



[more detail about v1.12.2](https://github.com/VisActor/VChart/releases/tag/v1.12.2)

# v1.12.1

2024-08-21


**🐛 Bug fix**

- **@visactor/vchart**: x brush filter not work. fix [#3111](https://github.com/VisActor/VChart/issues/3111)
- **@visactor/vchart**: fix error of `getCenter` when layoutRadius is a customized function in radar
- **@visactor/vchart**: media query causes incorrect render result, [#3102](https://github.com/VisActor/VChart/issues/3102)
- **@visactor/vchart**: vchart should not throw error when the values of series data is empty, fix [#3082](https://github.com/VisActor/VChart/issues/3082)



[more detail about v1.12.1](https://github.com/VisActor/VChart/releases/tag/v1.12.1)

# v1.12.0

2024-08-16


**🆕 New feature**

  - **@visactor/vchart**: marker's `coordinates` and `positions` property support callback
  - **@visactor/vchart**: support `animationState` config
  - **@visactor/vchart**: show evenly divided pie chart with `showAllZero`
  - **@visactor/vchart**: enable `supportNegative` option to treat negative values as absolute values
  - **@visactor/vchart**: support theme config by chart type
  - **@visactor/vchart**: support text shape of word-cloud
  - **@visactor/vchart**: add new chart mosaic chart 
  - **@visactor/vchart**: support customized tick function of linear axis
  - **@visactor/vchart**: add emptyPlaceholder and emptyCircle for pie chart

  ## 🐛 fix 
  - **@visactor/vchart**: y-axis is reverted after brush zoomin. fix [#3089](https://github.com/VisActor/VChart/issues/3089)
  - **@visactor/vchart**: mark-point position type error fix
  ## 🔨 refactor 
  - **@visactor/vchart**: refactor the graphics in linear-progress chart
  - **@visactor/vchart**: use label component to refactor sankey label
  - **@visactor/vchart**: stack can be required by need
  ## 🔖 other 
  - **@visactor/vchart**: sequence support bottom axes. fix [#2927](https://github.com/VisActor/VChart/issues/2927) 



[more detail about v1.12.0](https://github.com/VisActor/VChart/releases/tag/v1.12.0)

# v1.11.12

2024-08-15


**🆕 New feature**

- **@visactor/vchart**: support `layoutRadius` of pie

**🐛 Bug fix**

- **@visactor/vchart**: fix params of tickCount in linear-axis-mixin,  fix [#3053](https://github.com/VisActor/VChart/issues/3053)
- **@visactor/vchart**: fix `padding` of region not work
- **@visactor/vchart**: brush error after legend filter. fix[#3061](https://github.com/VisActor/VChart/issues/3061)
- **@visactor/vchart**: fix funnel chart color bug with different category and series fields
- **@visactor/vchart**: fix issue with harmony event
- **@visactor/vchart**: fix type error of react vchart, fix [#3065](https://github.com/VisActor/VChart/issues/3065)
- **@visactor/vchart**: tooltip should show when chart has multiple regions
- **@visactor/vchart**: fix the issue background of chart not updated, fix [#3054](https://github.com/VisActor/VChart/issues/3054)
- **@visactor/vchart**: fix the update of `startAngle` and `endAngle` in pie chart, fix [#3059](https://github.com/VisActor/VChart/issues/3059)
- **@visactor/vchart**: fix switch `visible` of legend, fix [#3060](https://github.com/VisActor/VChart/issues/3060)



[more detail about v1.11.12](https://github.com/VisActor/VChart/releases/tag/v1.11.12)

# v1.11.11

2024-08-06


**🆕 New feature**

- **@visactor/vchart**: label line support custom path. close[#3000](https://github.com/VisActor/VChart/issues/3000)
- **@visactor/vchart**: upgrade vrender to 0.19.20, to support `catmullRom` and `catmullRomClosed` curveType, related [#2610](https://github.com/VisActor/VChart/issues/2610)

**🐛 Bug fix**

- **@visactor/vchart**: fix crosshair of histogram, fix [#2826](https://github.com/VisActor/VChart/issues/2826)
- **@visactor/vchart**: use `vglobal.getElementById` to replace `document.getElementById`
- **@visactor/vchart**: liquid gradient not work after reverse
- **@visactor/vchart**: add group mark to fix gradient color bug of liquid and add rect shape to fix rect symbol padding bug
- **@visactor/vchart**: fix `lockAfterClick` of tooltip, related [#1574](https://github.com/VisActor/VChart/issues/1574)
- **@visactor/vchart**:  prevent trigger original event in panEnd composite event [#2931](https://github.com/VisActor/VChart/issues/2931)
- **@visactor/vchart**: charts should not stack when only specify `stackValue` but `stack` is false, fix [#3005](https://github.com/VisActor/VChart/issues/3005)
- **@visactor/vchart**: `updateData` incorrect with datazoom, related [#3041](https://github.com/VisActor/VChart/issues/3041)
- **@visactor/vchart**: fix issue of `updateSpec` when visible of grid in axis change, fix [#3004](https://github.com/VisActor/VChart/issues/3004)
- **@visactor/vchart**: fix fontFamily when update theme, fix [#3028](https://github.com/VisActor/VChart/issues/3028)

**🔖 other**

- **@visactor/vchart**: fix:curveType `monotone` in seriesStyle not work



[more detail about v1.11.11](https://github.com/VisActor/VChart/releases/tag/v1.11.11)

# v1.11.10

2024-07-24


**🆕 New feature**

- **@visactor/vchart**: liquid support reverse and target mark. close [#2977](https://github.com/VisActor/VChart/issues/2977)  & close [#2978](https://github.com/VisActor/VChart/issues/2978) 
- **@visactor/vchart**: add `totalScale` params in geo zoom event
- **@visactor/vchart**: support `geoZoomByIndex`/`geoZoomById` API, close [#2925](https://github.com/VisActor/VChart/issues/2925) 
- **@visactor/vchart**: marker label background support  custom path. close [#2959](https://github.com/VisActor/VChart/issues/2959)

**🐛 Bug fix**

- **@visactor/vchart**: prevent issue with ios bug while pointEvent is configed 
- **@visactor/vchart**: liquid gradient not work after reverse
- **@visactor/vchart**: prevent trigger original event in zoomEnd composite event [#2931](https://github.com/VisActor/VChart/issues/2931)
- **@visactor/vchart**: fix error of setDimentionIndex when dimension axis is linear

**🔧 Configuration releated**

- **@visactor/vchart**: update rollup.config.js to fix es5/index.js, fix [#2971](https://github.com/VisActor/VChart/issues/2971)



[more detail about v1.11.10](https://github.com/VisActor/VChart/releases/tag/v1.11.10)

# v1.11.9

2024-07-17


**🆕 New feature**


* @visactor/vchart: tooltip theme support transition duration


**🐛 Bug fix**


* @visactor/vchart: fix statistics confict of linear and discrete field, close [#2926](https://github.com/VisActor/VChart/issues/2926) 
* @visactor/vchart: fix theme error of update spec
* @visactor/vchart: fix update of label when udpate spec
* @visactor/vchart: fix bug of polar point update aniamtion
* @visactor/vchart: react attributes should support react 17
* @visactor/vchart: fix height of link when set `minNodeHeight` of sankey



[more detail about v1.11.9](https://github.com/VisActor/VChart/releases/tag/v1.11.9)

# v1.11.7

2024-07-06


**🆕 New feature**
# v1.11.7

2024-07-06


**🆕 New feature**

- **@visactor/vchart**: support configuring callback function in indicator text style attributes, [#2540](https://github.com/VisActor/VChart/issues/2540)
- **@visactor/vchart**: add options `hideTimer` in toolti, to hide tooltip by timer
- **@visactor/vchart**: support `updateIndicatorDataById`/`updateIndicatorDataByIndex` API, related [#2776](https://github.com/VisActor/VChart/issues/2776)
- **@visactor/vchart**: add `userUpdateOptions` to let user specify update type of charts, fix some animation bug

**🐛 Bug fix**

- **barbackground**: datakey is undefined when set custom datakey fix [#2908](https://github.com/VisActor/VChart/issues/2908)
- **@visactor/vchart**: fix the issue where `barMaxWidth` does not work when `barWidth` is configured, [#2885](https://github.com/VisActor/VChart/issues/2885)`
- **@visactor/vchart**: line/area clip animation by incorrect direction
- **crosshair**: fix bug of crosshair position when legend filter data. fix [#2905](https://github.com/VisActor/VChart/issues/2905)
- **@visactor/vchart**: fix polar animation logic for radar charts
- **@visactor/vchart**: type define fix

[more detail about v1.11.7](https://github.com/VisActor/VChart/releases/tag/v1.11.7)

# v1.11.6

2024-06-27


**🐛 功能修复**

- **@visactor/vchart**: 修复图表背景不支持渐变色配置的问题
- **animation**: 修复玫瑰图重复更新，动画bug，关闭[#2856](https://github.com/VisActor/VChart/issues/2856)
- **@visactor/vchart**:修复类型定义 `ITooltipTheme`, 关闭 [#2850](https://github.com/VisActor/VChart/issues/2850)
- **@visactor/vchart**: 修复`updateSpec`时，更新动画没有触发的问题 [#2835](https://github.com/VisActor/VChart/issues/2835) [#2836](https://github.com/VisActor/VChart/issues/2836)



[更多详情请查看 v1.11.6](https://github.com/VisActor/VChart/releases/tag/v1.11.6)

# v1.11.5

2024-06-21


**🆕 New feature**

- **@visactor/vchart**: add option `style.align` of Tooltip, support RTL tooltip
- 

**🐛 Bug fix**

  - **@visactor/vchart**: optimize discrete legend pager color in dark theme, related [#2654](https://github.com/VisActor/VChart/issues/2654)
  - **@visactor/vchart**: fix the issue issue with stacked waterfall charts where positive and negative values were not stacked separately when there were both positive and negative values in the same stack, fix [#2212](https://github.com/VisActor/VChart/issues/2212)





[more detail about v1.11.5](https://github.com/VisActor/VChart/releases/tag/v1.11.5)

# 1.11.4

## 🐛 fix 
  - **@visactor/vchart**: fix bug of `updateSpec` when has `scales`, close #2744
  - **@visactor/vchart**: gauge chart might throw error when the value is close to its maximum, fix #2783
  - **@visactor/vchart**: fix the behavior of the gauge pointer when it exceeds the axis range, fix #2780
  - **@visactor/vchart**: normal animation not work when appear animation is disabled, fix #2807
  - **@visactor/vchart**: upgrade vrender to 0.19.10, vgrammar to 0.13.9

# 1.11.3
## 🆕 feat
@visactor/vchart: add option showBackgroundChart of DataZoom

## 🐛 fix
@visactor/vchart: bar chart should work normally when x-axis is linear, fix #2758
@visactor/vchart: fix issue of continuous legend filter in treemap
@visactor/vchart: fixed the issue that the newly added component type could not take effect when updateSpec
@visactor/vchart: fixed setSelected of sankey chart, fix #2757 , fix #2765


# 1.11.2
- 正式版发布
- @visactor/vchart: fix the bug that animationThreshold not work, close #2745
- @visactor/vchart: fix the issue of update animation in area chart is not work
- common: bar series support auto band size in common chart. fix#2704
- @visactor/vchart: corsshair should hide when pointer out view, fix #2726
- @visactor/vchart: close animation cause by datazoom/scrollbar
- @visactor/vchart: `type-step` markLine's label should consider the refX/refY/dx/dy set by user, fixed#2739
- react-vchart: fix the issue of <Axis /> that the props id not work
- @visactor/vchart: polarAxis.grid.smooth not work in theme configuratio
  🔧 chore
- @visactor/vchart: when build es5 , targets of @babel/preset-env should be defaults, fix #2702

# 1.11.0-alpha.3
- 更新README

# 1.11.0-alpha.2
- VChart组件支持InitOptions参数

# 1.11.0-alpha.1
- VChart支持HarmonyOS的StageTS架构
