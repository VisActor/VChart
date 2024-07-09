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
