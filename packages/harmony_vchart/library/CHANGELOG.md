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
