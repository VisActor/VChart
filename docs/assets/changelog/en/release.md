# v1.9.6

2024-03-11


**🆕 New feature**

- **@visactor/vchart**: support dataKey in CustomMark and ExtensionMark
- **@visactor/vchart**: support mulity data in waterfal total dimensions

**🐛 Bug fix**

- **@visactor/vchart**: `animationAppear: false` not work
- **@visactor/vchart**: fix bug that throws error when setting mark style to invlaid value
- **@visactor/vchart**: fix the issue of duplicate event registration, fixed [#2336](https://github.com/VisActor/VChart/issues/2336)
- **@visactor/vchart**: fixed the issue of being unable to listen to label and totalLabel component events on vchart, `vchart.on('click', { level: 'model', type: 'label' })`
- **@visactor/vchart**: optimize totoal label position when axis is inversed
- **@visactor/vchart**: upgrade vrender to 0.17.27, vgrammar to 0.11.15
- **scrollbar**: click stopped by zoomable. fix[#2333](https://github.com/VisActor/VChart/issues/2333)



[more detail about v1.9.6](https://github.com/VisActor/VChart/releases/tag/v1.9.6)

# v1.9.5

2024-03-04


**🆕 New feature**

- **@visactor/vchart**: support dataKey in CustomMark and ExtensionMark
- **@visactor/vchart**: support mulity data in waterfal total dimensions

**🐛 Bug fix**

- **@visactor/vchart**: `animationAppear: false` not work
- **@visactor/vchart**: optimize totoal label position when axis is inversed



[more detail about v1.9.5](https://github.com/VisActor/VChart/releases/tag/v1.9.5)

# v1.9.3

2024-02-07


**🆕 New feature**

- **@visactor/vchart**: supply pie percent data as `data._percent_`

**🐛 Bug fix**

- **@visactor/vchart**: axis zero not work beacause of collect data. fix[#2226](https://github.com/VisActor/VChart/issues/2226)
- **@visactor/vchart**: marker area xy layout needs to deal with the problem of empty coordinate points
- **player**: default attr leades to layout error. fix[#241](https://github.com/VisActor/VChart/issues/241)
- **@visactor/vchart**: wordcloud support rect shape. fix[#2220](https://github.com/VisActor/VChart/issues/2220)

[more detail about v1.9.3](https://github.com/VisActor/VChart/releases/tag/v1.9.3)

# v1.9.2

2024-02-05


**🐛 Bug fix**

- **@visactor/vchart**: bar label issue when position is 'inside-bottom' or 'inside-top'
- **@visactor/vchart**: in block-vchart demo, the `dpr` acquisition method is wrong and needs to be obtained in real time
- **@visactor/vchart**: series can read `direction` from chart spec, releated to [#2181](https://github.com/VisActor/VChart/issues/2181)
- **@visactor/vchart**: dataZoom min and max span does not effect, related [#2195](https://github.com/VisActor/VChart/issues/2195)
- **@visactor/vchart**: fix the problem that multi-layer axis labels are not displayed after closing  tail labels, related [#2179](https://github.com/VisActor/VChart/issues/2179)
- **@visactor/vchart**: fix polar animation interpolation
- **@visactor/react-vchart**: fix the error when `onClick` of `<VChart />` is null, close [#2186](https://github.com/VisActor/VChart/issues/2186)
- **@visactor/vchart**: charts should not stack toggle when series has same type but differernt axes, related [#2210](https://github.com/VisActor/VChart/issues/2210)
- **@visactor/vchart**: there is some offset in the position of the dom tooltip shape, related [#2188](https://github.com/VisActor/VChart/issues/2188)

**🔧 Configuration releated**

- **@visactor/vchart**: add react-lynx doc

[more detail about v1.9.2](https://github.com/VisActor/VChart/releases/tag/v1.9.2)

# v1.9.1

2024-01-31


**🐛 Bug fix**

- **@visactor/vchart**: custom mark should run after all the series marks, fix [#2156](https://github.com/VisActor/VChart/issues/2156)
- **@visactor/vchart**: interactions should be closed by `option.disableTriggerEvent`
- **@visactor/vchart**: in the case of multiple band axes in a chart, the same datum corresponds to multiple rows of dimension tooltip content, related [#2148](https://github.com/VisActor/VChart/issues/2148)
- **@visactor/vchart**: fix error of vchart in strict-mode
- **@visactor/vchart**: fix the zero-align of axes, fix [#2167](https://github.com/VisActor/VChart/issues/2167)



[more detail about v1.9.1](https://github.com/VisActor/VChart/releases/tag/v1.9.1)

# v1.9.0

2024-01-26


**🆕 New feature**

- **@visactor/vchart**: axis supports `hasDimensionTooltip` for force specification of dimension tooltip, related [#1678](https://github.com/VisActor/VChart/issues/1678)
- **@visactor/vchart**: `triggerOff` of crosshair support number to close crosshair by setTimeout, fix [#1676](https://github.com/VisActor/VChart/issues/1676)
- **@visactor/vchart**: the `barBackground` mark in the bar chart supports `fieldLevel` config to indicate whether the `barBackground` mark is displayed at the group level and at which level it is displayed, related [#1601](https://github.com/VisActor/VChart/issues/1601)
- **@visactor/vchart**: histogram chart supports bar background, related [#1979](https://github.com/VisActor/VChart/issues/1979)
- **@visactor/vchart**: support fitStrategy for indicator
- **liquid**: liquid chart. close[#1158](https://github.com/VisActor/VChart/issues/1158)
- **@visactor/vchart**: band type axis supports multi-layer axis label display
- **@visactor/vchart**: support separately configuring interactive for line/area mark in area chart, see [#1592](https://github.com/VisActor/VChart/issues/1592)
- **@visactor/vchart**: support `stateSort` of mark, fix [#2003](https://github.com/VisActor/VChart/issues/2003)
- **@visactor/vchart**: support customized vrender component in extensionMark
- **@visactor/vchart**: split tooltip handler into plugins for on-demand importing, related [#1397](https://github.com/VisActor/VChart/issues/1397)

**🐛 Bug fix**

- **@visactor/vchart**: fix the bug of crosshair trigger when hover and click are both configed, fix [#1574](https://github.com/VisActor/VChart/issues/1574)
- **@visactor/vchart**: tooltip supports content area scrolling, related [#2001](https://github.com/VisActor/VChart/issues/2001)
- **@visactor/vchart**: remove label line height in default themes, related [#1983](https://github.com/VisActor/VChart/issues/1983)
- **@visactor/vchart**: fix the issue where tooltip content callbacks may not be effective in certain situations, related [#1943](https://github.com/VisActor/VChart/issues/1943)

**🔨 Refactor**

- **@visactor/vchart**: deprecated `useSyncRender` in react-vchart



[more detail about v1.9.0](https://github.com/VisActor/VChart/releases/tag/v1.9.0)

# v1.8.10

2024-01-25


**🆕 New feature**

- **@visactor/vchart**: support innerOffset in vchart cartesian axis

**🐛 Bug fix**

- **@visactor/vchart**: fix issue of continous color scale, close [#2131](https://github.com/VisActor/VChart/issues/2131)
- **@visactor/vchart**: dont return min,max of empty data, fix [#1711](https://github.com/VisActor/VChart/issues/1711)
- **@visactor/vchart**: fixed polar coordinate relative axis tickValues acquisition error problem, fixed[#2117](https://github.com/VisActor/VChart/issues/2117)
- **@visactor/vchart**: fix the issue mark line is not filter by legend, close [#2127](https://github.com/VisActor/VChart/issues/2127)
- **@visactor/vchart**: sequence chart region bind error. fix[#2115](https://github.com/VisActor/VChart/issues/2115)
- **@visactor/vchart**: star shapes on dom tooltip do not display correctly, related [#1905](https://github.com/VisActor/VChart/issues/1905)
- **@visactor/vchart**: treemap drill event error
- **@visactor/vchart**: treemap drill error when turn off the animation



[more detail about v1.8.10](https://github.com/VisActor/VChart/releases/tag/v1.8.10)

# v1.8.9

2024-01-23


**🆕 New feature**

- **@visactor/vchart**: support supportsTouchEvents and supportsPointerEvents config
- **@visactor/vchart**: support `alignSelf` of layout `normal-inline` elements, fix [#2072](https://github.com/VisActor/VChart/issues/2072)
- **@visactor/vchart**: upgrade vrender

**🐛 Bug fix**

- **@visactor/vchart**: fix bug of crosshair timer, fix [#2088](https://github.com/VisActor/VChart/issues/2088)
- **@visactor/vchart**: fix the bugs of axis's onZero property, fixed [#2098](https://github.com/VisActor/VChart/issues/2098),[#2099](https://github.com/VisActor/VChart/issues/2099)
- **@visactor/vchart**: update animation should exludes `defined` channel



[more detail about v1.8.9](https://github.com/VisActor/VChart/releases/tag/v1.8.9)

# v1.8.8

2024-01-19


**🆕 New feature**

- **@visactor/vchart**: enhance scroll effect, closed [#2037](https://github.com/VisActor/VChart/issues/2037)
- **@visactor/vchart**: upgrade @visactor/vrender-core to locked 0.17.14
- **@visactor/vchart**: sankey chart supports disableTriggerEvent configuration
- **@visactor/vchart**: support new layout type region-relative-overlap

**🐛 Bug fix**

- **@visactor/vchart**: `area.interactive` in area series spec is not available, related [#2030](https://github.com/VisActor/VChart/issues/2030)
- **@visactor/vchart**: fix sortDataByAxis not work after datazoom changed axis
- **@visactor/vchart**: crosshair should show when `trimPadding` of axis is true, fix [#2054](https://github.com/VisActor/VChart/issues/2054)
- **@visactor/vchart**: calculate layer transform for dimension tooltip
- **@visactor/vchart**: fixed the issue where activePoint does not take effect when the visible configuration of line chart point is false
- **@visactor/vchart**: different effect when configuring label.overlap:true in [#1956](https://github.com/VisActor/VChart/issues/1956)
- **@visactor/vchart**: label position incorrect with region indent
- **scroll**: event error in lynx env. fix[#2041](https://github.com/VisActor/VChart/issues/2041)
- **@visactor/vchart**: map scale ratio not correct after updateSpec or resize
- **@visactor/vchart**: fix the bug of nice when tickCount is a function, fix [#2050](https://github.com/VisActor/VChart/issues/2050)

[more detail about v1.8.8](https://github.com/VisActor/VChart/releases/tag/v1.8.8)

# v1.8.7

2024-01-11

**🆕 New feature**

- **markPoint**: mark point support item content confine. fix [#1573](https://github.com/VisActor/VChart/issues/1573)
- **@visactor/vchart**: support indent in region layout

**🐛 Bug fix**

- **@visactor/vchart**: mark tooltip not work in rangeColumn chart, closes [#1959](https://github.com/VisActor/VChart/issues/1959)
- **brush**: hover not effect when draw a small brush. fix[#1985](https://github.com/VisActor/VChart/issues/1985)
- **@visactor/vchart**: fix the problem that indent.top cannot take effect normally
- **@visactor/vchart**: the crosshair should only be triggered when the point is in some x-axis and y-axis, fix [#1954](https://github.com/VisActor/VChart/issues/1954)
- **@visactor/vchart**: fixed the issue where legend filtering fails after customizing data for discrete legends, fixed [#1994](https://github.com/VisActor/VChart/issues/1994)
- **@visactor/vchart**: range column chart's `barMinHeight` property does not take effect, closed[#1999](https://github.com/VisActor/VChart/issues/1999)
- **@visactor/vchart**: tooltip value is stacked in stacked radar charts, related [#450](https://github.com/VisActor/VChart/issues/450)
- **@visactor/vchart**: fix the onebyone symbol animation order, closes [#1932](https://github.com/VisActor/VChart/issues/1932)

[more detail about v1.8.7](https://github.com/VisActor/VChart/releases/tag/v1.8.7)

# v1.8.5

2024-01-04

**🆕 New feature**

- **@visactor/vchart**: add zAxis theme and set label space to 0, closed [#149](https://github.com/VisActor/VChart/issues/149)

**🐛 Bug fix**

- **@visactor/vchart**: compute layer translate for crosshair
- **@visactor/vchart**: optimize funnel clip animation without extensionMarks
- **@visactor/vchart**: fix the hover state of multiple series, close [#1899](https://github.com/VisActor/VChart/issues/1899)
- **@visactor/vchart**: waterfall.label not work in [#1897](https://github.com/VisActor/VChart/issues/1897)

[more detail about v1.8.5](https://github.com/VisActor/VChart/releases/tag/v1.8.5)

# v1.8.4

2024-01-02

**🐛 Bug fix**

- **@visactor/vchart**: add media query spec interface to default chart spec
- **@visactor/vchart**: fix the bug of extension mark when no valid animation, fix [#1877](https://github.com/VisActor/VChart/issues/1877)

[more detail about v1.8.4](https://github.com/VisActor/VChart/releases/tag/v1.8.4)

# v1.8.3

2024-01-02

**🆕 New feature**

- **@visactor/vchart**: add props `useSyncRender` to react-vchart, close [#1685](https://github.com/VisActor/VChart/issues/1685)
- **@visactor/vchart**: Supports the initialization parameter `disableTriggerEvent` to turn off the default interactive effect of the chart

**🐛 Bug fix**

- **@visactor/vchart**: chart option.animation not work
- **@visactor/vchart**: fix error in strict mode of react-vchart, fix [#1669](https://github.com/VisActor/VChart/issues/1669)
- **@visactor/vchart**: error in chart level modification of media query action
- **@visactor/vchart**: dimension tooltip in the dual-dimension chart contains data of only one dimension, related [#1841](https://github.com/VisActor/VChart/issues/1841)
- **@visactor/vchart**: fix bug in layout when band axis has no domain
- **@visactor/vchart**: funnel clipIn animation has delay for marks which overflows the range of region in [#1839](https://github.com/VisActor/VChart/issues/1839)
- **@visactor/vchart**: when marker label's padding is an object, it should work
- **@visactor/vchart**: undefined globalThis in tt miniprogram, see [#1854](https://github.com/VisActor/VChart/issues/1854)
  **🔨 Refactor**
- **@visactor/vchart**: optimize the style configuration of marker

[more detail about v1.8.3](https://github.com/VisActor/VChart/releases/tag/v1.8.3)

# v1.8.2

2023-12-22

**🆕 feat**

- **@visactor/vchart**: Supports the initialization parameter `disableTriggerEvent` to turn off the default interactive effect of the chart

**🐛 fix**

- **@visactor/vchart**: Config `animation` in the chart option doesn't work
- **@visactor/vchart**: Error in chart level modification of media query action

[more detail about v1.8.2](https://github.com/VisActor/VChart/releases/tag/v1.8.2)

# v1.8.1

2023-12-21

**🐛 fix**

- **@visactor/vchart**: improve the stability of spec transformer and media query
- **@visactor/vchart**: `select.triggerOff: none` not work

[more detail about v1.8.1](https://github.com/VisActor/VChart/releases/tag/v1.8.1)

# v1.8.0

2023-12-19

**🆕 feat**

- **@visactor/vchart**: add getPoints api in funnel mark attribute context
- **@visactor/vchart**: vchart supports chart-level plugin, related [#1784](https://github.com/VisActor/VChart/issues/1784)
- **@visactor/vchart**: new media query plugin to support self-adaptive charts, related [#1413](https://github.com/VisActor/VChart/issues/1413)
- **@visactor/vchart**: support optimize config, and auto set disableCheckGraphicWidthOutRange to true
- **@visactor/vchart**: remove legacy theme for legends

**🐛 fix**

- **@visactor/vchart**: fix the api: `getComponentsByKey` not work
- **@visactor/vchart**: animation support for gauge pointer series, related [#1699](https://github.com/VisActor/VChart/issues/1699)
- **@visactor/vchart**: fix issue with secondary dataflow, closed [#1760](https://github.com/VisActor/VChart/issues/1760)

**🔨 refactor**

- **@visactor/vchart**: update datazoom and brush updatecallback, use event

**⚡ perf**

- **@visactor/vchart**: when visible is false, dont parse detail attrs

[more detail about v1.8.0](https://github.com/VisActor/VChart/releases/tag/v1.8.0)

# v1.7.5

2023-12-15

**🐛 fix**

- **brush**: brush release error after update spec. fix[#1720](https://github.com/VisActor/VChart/issues/1720)
- **@visactor/vchart**: series should pick `morph` config in chart
- **@visactor/vchart**: fix type defination of vchart spec in [#1486](https://github.com/VisActor/VChart/issues/1486)

[more detail about v1.7.5](https://github.com/VisActor/VChart/releases/tag/v1.7.5)

# v1.7.4

2023-12-12

**🆕 feat**

- **@visactor/vchart**: support interaction group in region

**🐛 fix**

- **@visactor/vchart**: label style not update when change current theme in [#1698](https://github.com/VisActor/VChart/issues/1698)

[more detail about v1.7.4](https://github.com/VisActor/VChart/releases/tag/v1.7.4)

# v1.7.3

2023-12-06

**🆕 feat**

- **@visactor/vchart**: marker supports `coordinatesOffset` for points adjusting
- **@visactor/vchart**: markLine supports x,y,y1 y,x,x1 and x,y,x1,y1 position
- **@visactor/vchart**: markPoint support xy position
- **@visactor/vchart**: marker's position property support relative coordinate
- **@visactor/vchart**: marker's coordinate property supports callback
- **@visactor/vchart**: cartesion crosshair's rect width support callback, support [#1567](https://github.com/VisActor/VChart/issues/1567)
- **@visactor/vchart**: polar crosshair supports default show
- **@visactor/vchart**: support text omission position configuration `suffixPosition`
- **@visactor/vchart**: supports `pickStrokeBuffer` style attribute for extending the stroke picking range

**🐛 fix**

- **@visactor/vchart**: fix 3d bar chart with seriesField issue, closed [#1646](https://github.com/VisActor/VChart/issues/1646)
- **@visactor/vchart**: fix 3d chart z axis not work noamally issue, closed [#1668](https://github.com/VisActor/VChart/issues/1668)
- **@visactor/vchart**: clear old encode when update, fix [#1630](https://github.com/VisActor/VChart/issues/1630)
- **@visactor/vchart**: fix the problem that track mark has multiple elements in gauge series, related [#1643](https://github.com/VisActor/VChart/issues/1643)
- **@visactor/vchart**: fix the problem that gaugePointer series doesn't support custom `innerRadius`, related [#1644](https://github.com/VisActor/VChart/issues/1644)
- **@visactor/vchart**: fix the type error of markArea
- **@visactor/vchart**: the outerBorder's color should be equal with labelBackground's fill by default
- **@visactor/vchart**: fix oneByOne loop animation
- **@visactor/vchart**: add `align` property for size legend, and fix the issue of the attribute assignment does not take effect, related [#1553](https://github.com/VisActor/VChart/issues/1553)

**🔨 refactor**

- **@visactor/vchart**: unify `getVRenderComponents` method in Component model

**⚡ perf**

- **@visactor/vchart**: only call `cloneDeepSpec()` when need

[more detail about v1.7.3](https://github.com/VisActor/VChart/releases/tag/v1.7.3)

# v1.7.2

2023-11-30

**🐛 fix**

- **@visactor/vchart**: clear old encode when update, fix [#1630](https://github.com/VisActor/VChart/issues/1630)
- **@visactor/vchart**: fix the problem that track mark has multiple elements in gauge series, related [#1643](https://github.com/VisActor/VChart/issues/1643)
- **@visactor/vchart**: fix the problem that gaugePointer series doesn't support custom `innerRadius`, related [#1644](https://github.com/VisActor/VChart/issues/1644)

**🔨 refactor**

- **@visactor/vchart**: unify `getVRenderComponents` method in Component model

[more detail about v1.7.2](https://github.com/VisActor/VChart/releases/tag/v1.7.2)

# v1.7.1

2023-11-30

**🐛 fix**

- **@visactor/vchart**: read dataview of extension-mark by `dataId`
- **@visactor/vchart**: fixed the issue where the layout size of the axis is incorrect when only domainLine is displayed
- **@visactor/vchart**: fix bug of changed spec when create series
- **pie**: get center error. fix [#1610](https://github.com/VisActor/VChart/issues/1610)
- **@visactor/vchart**: optimize the effect of `tooltip.enterable` that user's pointer can easily enter the tooltip, related [#1598](https://github.com/VisActor/VChart/issues/1598)

[more detail about v1.7.1](https://github.com/VisActor/VChart/releases/tag/v1.7.1)

# v1.7.0

2023-11-24

**🆕 feat**

- **@visactor/vchart**: support `trimPadding` for band type axis, which used to remove the blank space at both ends of the aixs, closed [#1174](https://github.com/VisActor/VChart/issues/1174)
- **@visactor/vchart**: custom mark support animation config
- **@visactor/vchart**: support customShape of mark
- **@visactor/vchart**: optimize auto mode of data-zoom, related [#1416](https://github.com/VisActor/VChart/issues/1416)
- **@visactor/vchart**: enhance marker's position ability
- **@visactor/vchart**: mark area should support specify x x1 y and y1 both
- **@visactor/vchart**: add light-mobile and dark-mobile theme, related [#1414](https://github.com/VisActor/VChart/issues/1414)
- **@visactor/vchart**: optmize performance of computing data
- **@visactor/vchart**: support none in component layoutType
- **@visactor/vchart**: support line/area label
- **@visactor/vchart**: no longer register mobile theme in vchart
- **@visactor/vchart**: feature: supports registered function expression syntax, related [#1187](https://github.com/VisActor/VChart/issues/1187)

**🐛 fix**

- **@visactor/vchart**: chart padding won't update when switching global theme
- **@visactor/vchart**: fix spec modified unexpectedly in data model, details in [#1514](https://github.com/VisActor/VChart/issues/1514)
- **@visactor/vchart**: update enableSegements implemention

**🔨 refactor**

- **@visactor/vchart**: refactor the inheritance structure of the chart module to make the layout system independent, details in [#1428](https://github.com/VisActor/VChart/issues/1428)

**⚡ perf**

- **@visactor/vchart**: dont need to call `attrTransform()` in compilable-mark
- **@visactor/vchart**: remove getStatisticsDomain()
- **@visactor/vchart**: dont call bounds calculate when user specify width/height of components

[more detail about v1.7.0](https://github.com/VisActor/VChart/releases/tag/v1.7.0)

# v1.6.7

2023-11-21

**🐛 fix**

- **@visactor/wx-vchart**: fixed package delivery error issue, fixed [#1570](https://github.com/VisActor/VChart/issues/1570) , PR in [#1571](https://github.com/VisActor/VChart/pull/1571)

[more detail about v1.6.7](https://github.com/VisActor/VChart/releases/tag/v1.6.7)

# v1.6.6

2023-11-21

**🐛 fix**

- **@visactor/vchart**: fix chart screen remains when using updateSpecSync, details in [#1421](https://github.com/VisActor/VChart/issues/1421)
- **@visactor/vchart**: is mouse click in empty region, the hover shape should reset, fixed [#1538](https://github.com/VisActor/VChart/issues/1538)

[more detail about v1.6.6](https://github.com/VisActor/VChart/releases/tag/v1.6.6)

# v1.6.5

2023-11-17

**🆕 feat**

- **@visactor/vchart**: add `skipFunctionDiff` in react-vchart to skip difference of functions

**🐛 fix**

- **@visactor/vchart**: dimension click not effect after update spec. fix [#1532](https://github.com/VisActor/VChart/issues/1532)

[more detail about v1.6.5](https://github.com/VisActor/VChart/releases/tag/v1.6.5)

# v1.6.4

2023-11-16

**🐛 fix**

- **@visactor/vchart**: fixed the problem of unreasonable automatic indentation being triggered after modifying the axis range in datazoom
- **@visactor/vchart**: default realtime not effect in scrollbar and datazoom. fix [#1462](https://github.com/VisActor/VChart/issues/1462)
- **@visactor/vchart**: filter mode error when roam in scrollbar and datazoom. fix [#1460](https://github.com/VisActor/VChart/issues/1460)
- **@visactor/lark-vchart**: fix `options` can not work in lark-vchart, wx-vchart
- **@visactor/wx-vchart**: fix `options` can not work in lark-vchart, wx-vchart
- **@visactor/vchart**: `legendItemHover` and `legendItemUnHover` should trigger once, https://github.com/VisActor/VRender/pull/678

**⚡ perf**

- **@visactor/vchart**: optimize the dataflow of sankey

[more detail about v1.6.4](https://github.com/VisActor/VChart/releases/tag/v1.6.4)

# v1.6.3

2023-11-10

**🐛 fix**

- **@visactor/vchart**: fix the issue of update animation not work for line mark
- **@visactor/vchart**: update vgrammar to ~0.8.3 to fix the issue that, vrender should not auto render during renderAsync
- **@visactor/vchart**: fix the error when quick release vchart during async render
- **@visactor/vchart**: tooltip value is forced to wrap when the user globally configures css overflow-warp, related [#1446](https://github.com/VisActor/VChart/issues/1446)
- **@visactor/vchart**: fix: svg model's id should be uniq, fixed [#1422](https://github.com/VisActor/VChart/issues/1422), [#1442](https://github.com/VisActor/VChart/issues/1442)
- **@visactor/vchart**: fix: empty string should not be a valid number, fix [#1463](https://github.com/VisActor/VChart/issues/1463)

**⚡ perf**

- **@visactor/vchart**: optimize the encode performance of sankey

[more detail about v1.6.3](https://github.com/VisActor/VChart/releases/tag/v1.6.3)

# v1.6.2

2023-11-08

**🐛 fix**

- **@visactor/vchart**: tooltip value is forced to wrap when the user globally configures css overflow-warp, related [#1446](https://github.com/VisActor/VChart/issues/1446)

[more detail about v1.6.2](https://github.com/VisActor/VChart/releases/tag/v1.6.2)

# v1.6.1

2023-11-08

**🆕 feat**

- **@visactor/vchart**: label formatMethod callback add context parmas to provide series object
- **@visactor/vchart**: add components `<Title />` and `<Indicator />` of react-vchart, close [#1424](https://github.com/VisActor/VChart/issues/1424)

**🐛 fix**

- **@visactor/vchart**: `centroidProperty` not work in map chart
- **@visactor/vchart**: fix incorrect legend filter result caused by animation in [#1403](https://github.com/VisActor/VChart/issues/1403)
- **@visactor/vchart**: if layout item is invisible, do not participate in grid layout, related [#1425](https://github.com/VisActor/VChart/issues/1425)
- **@visactor/vchart**: aggregation return value infinity problem. fix[#1380](https://github.com/VisActor/VChart/issues/1380)'

[more detail about v1.6.1](https://github.com/VisActor/VChart/releases/tag/v1.6.1)

# v1.6.0

2023-11-03

**🆕 feat**

- **@visactor/vchart**: add bar background mark for bar-like series, related [#1154](https://github.com/VisActor/VChart/issues/1154)
- **@visactor/vchart**: add `updateElement` callback in tooltip spec to configure custom tooltip DOM elements based on the default tooltip handler, related [#1338](https://github.com/VisActor/VChart/issues/1338)
- **@visactor/vchart**: enable exit animation while updating data
- **@visactor/vchart**: support functional label.position config in line/area/scatter/bar series
- **@visactor/vchart**: load browser or node env code dynamically
- **@visactor/vchart**: dataScheme supports configuration by distinguishing series directions, related [#1209](https://github.com/VisActor/VChart/issues/1209)
- **@visactor/vchart**: data sampling & point overlap. close [#460](https://github.com/VisActor/VChart/issues/460)
- **@visactor/taro-vchart**: support weapp

**🐛 fix**

- **@visactor/vchart**: react-vchart mode not work
- **@visactor/vchart**: optimize the trigger of hover in non-browser env
- **@visactor/vchart**: if series mark is line, return stroke value when user want fill value, fixed [#1388](https://github.com/VisActor/VChart/issues/1388)
- **@visactor/vchart**: fix the angle offset in rose dimension tooltip, related [#1263](https://github.com/VisActor/VChart/issues/1263)

**⚡ perf**

- **@visactor/vchart**: create Stack and calculate stack attributes when need

[more detail about v1.6.0](https://github.com/VisActor/VChart/releases/tag/v1.6.0)

# v1.5.4

2023-10-30

**🐛 fix**

- **@visactor/vchart**: unexpected funnel transform ratio label, see [#1348](https://github.com/VisActor/VChart/issues/1348)
- **@visactor/vchart**: tooltip value label clipped on lark mini app, related [#1346](https://github.com/VisActor/VChart/issues/1346)

[more detail about v1.5.4](https://github.com/VisActor/VChart/releases/tag/v1.5.4)

# v1.5.3

2023-10-27

**🆕 feat**

- **@visactor/vchart**: support the exportCanvas api of vchart

**🐛 fix**

- **@visactor/vchart**: sankey chart downstream highlight, related [#1269](https://github.com/VisActor/VChart/issues/1269)
- **@visactor/vchart**: slove first select not effect problem. fix [#1129](https://github.com/VisActor/VChart/issues/1129)
- **@visactor/vchart**: new layout method for circle axis label, related [#1123](https://github.com/VisActor/VChart/issues/1123)
- **@visactor/vchart**: change default zIndex of axis in gauge chart, related [#1122](https://github.com/VisActor/VChart/issues/1122)
- **@visactor/vchart**: datazoom location error when resize. fix [#520](https://github.com/VisActor/VChart/issues/520)
- **@visactor/vchart**: slove event off error after release
- **@visactor/vchart**: fix the issue where invalidType of scatter chart checks x and y at the same time
- **@visactor/vchart**: fix the issue in markline as min/max aggr result is not correct, see [#1261](https://github.com/VisActor/VChart/issues/1261)
- **@visactor/vchart**: fix: fix the issue that the map tooltip title does not display the name from nameMap, see [#1260](https://github.com/VisActor/VChart/issues/1260)
- **@visactor/vchart**: sankey supports string value
- **@visactor/vchart**: fix the issue of crosshair can not trigger in weapp, fixed [#1322](https://github.com/VisActor/VChart/issues/1322)

[more detail about v1.5.3](https://github.com/VisActor/VChart/releases/tag/v1.5.3)

# v1.5.2

2023-10-24

**🆕 feat**

- **@visactor/vchart**: support the exportCanvas api of vchart

**🐛 fix**

- **@visactor/vchart**: new layout method for circle axis label, related [#1123](https://github.com/VisActor/VChart/issues/1123)
- **@visactor/vchart**: change default zIndex of axis in gauge chart, related [#1122](https://github.com/VisActor/VChart/issues/1122)
- **@visactor/vchart**: datazoom location error when resize. fix [#520](https://github.com/VisActor/VChart/issues/520)
- **@visactor/vchart**: fix the issue in markline as min/max aggr result is not correct, see [#1261](https://github.com/VisActor/VChart/issues/1261)
- **@visactor/vchart**: fix: fix the issue that the map tooltip title does not display the name from nameMap, see [#1260](https://github.com/VisActor/VChart/issues/1260)

[more detail about v1.5.2](https://github.com/VisActor/VChart/releases/tag/v1.5.2)

# v1.5.1

2023-10-20

**🆕 feat**

- **@visactor/vchart**: support correlation Chart
- **@visactor/vchart**: add getGraphicBounds api in layoutItem to support get graphic size
- **@visactor/vchart**: optimize the autoindent logic in layout to ensure padding effect is correct
- **@visactor/vchart**: support `centroidProperty` in map series
- **@visactor/vchart**: scrollbar enhance zoom & drag & scroll. close [#965](https://github.com/VisActor/VChart/issues/965)
- **@visactor/vchart**: datazoom enhance zoomLock & span config. close [#1082](https://github.com/VisActor/VChart/issues/1082)
- **@visactor/vchart**: supply the attributeContext params for customMark's attribute callback
- **@visactor/vchart**: provide afterLayout event to support users to modify layout effects
- **@visactor/vchart**: provide datum in the params of `updateContent` callback of tooltip, related [#1244](https://github.com/VisActor/VChart/issues/1244)
- **@visactor/vchart**: add the default theme (light, dark) of markLine, markArea and funnel series
- **@visactor/vchart**: support load environment code on demand

**🐛 fix**

- **@visactor/vchart**: optimized the display of `padAngle` in the gauge series and changed the unit of `padAngle` to angle, related [#1215](https://github.com/VisActor/VChart/issues/1215)
- **@visactor/vchart**: link 'adjacency' interaction highlighting effect of Sankey Chart is wrong, [#1121](https://github.com/VisActor/VChart/issues/1121)
- **@visactor/vchart**: fix the issue of boxplot outlier animation will throw error
- **@visactor/vchart**: fix the duplicate event registration in scrollbar, fixed[#1241](https://github.com/VisActor/VChart/issues/1241)

**🔨 refactor**

- **@visactor/vchart**: add register function for chart/series/component to collect side effect code
- **@visactor/vchart**: add register function for animation

[more detail about v1.5.1](https://github.com/VisActor/VChart/releases/tag/v1.5.1)

# v1.4.3

2023-10-17

**🆕 feat**

- **@visactor/vchart**: brush state proxy to state spec

**🐛 fix**

- **@visactor/vchart**: fix when the legend item only has stroke it cannot be consistent with the graphic color, details in [#1147](https://github.com/VisActor/VChart/issues/1147)

[more detail about v1.4.3](https://github.com/VisActor/VChart/releases/tag/v1.4.3)

# v1.4.2

2023-10-12

**🆕 feat**

- **@visactor/vchart**: gauge series supports label component, related [#1039](https://github.com/VisActor/VChart/issues/1039)
- **@visactor/vchart**: add static tools in `VChart.Utils`
- **@visactor/vchart**: supports afterResize and afterRender events
- **@visactor/vchart**: add new config `autoWidth` to the tooltip label style, related [#688](https://github.com/VisActor/VChart/issues/688)

**🐛 fix**

- **@visactor/vchart**: `tooltipRelease` event may be invalid when being released by VTable
- **@visactor/vchart**: select error when setting brush. fix [#1129](https://github.com/VisActor/VChart/issues/1129)
- **@visactor/vchart**: optimize the default performance of the long tooltip title, related [#688](https://github.com/VisActor/VChart/issues/688)
- **@visactor/vchart**: if `markLine` is empty like `{}` or `[]`, it should not create marker component
- **@visactor/vchart**: fix the issue when use `positions` to create marker component, fixed [#1084](https://github.com/VisActor/VChart/issues/1084)
- **@visactor/vchart**: auto visible with linear axis. fix [#1118](https://github.com/VisActor/VChart/issues/1118)

[more detail about v1.4.2](https://github.com/VisActor/VChart/releases/tag/v1.4.2)

# v1.4.1

2023-09-27

**🆕 feat**

- **@visactor/vchart**: optimize updateSpec to avoid additional theme updates

**🐛 fix**

- **@visactor/vchart**: fix updateViewBox api will fail after resize
- **datazoom**: fix bounds error when there is no preview chart. fix [#1050](https://github.com/VisActor/VChart/issues/1050)
- **@visactor/vchart**: the rose chart's first sector's startAngle should start from polar coordinate's startAngle, fix [#900](https://github.com/VisActor/VChart/issues/900)
- **@visactor/vchart**: fix `theme.fontFamily` can not work
- **@visactor/vchart**: fix the problem that updateFullData cannot update data in series

[more detail about v1.4.1](https://github.com/VisActor/VChart/releases/tag/v1.4.1)

# v1.4.0

2023-09-25

**🆕 feat**

- **@visactor/vchart**: add scrollbar layout spec to sequence. close [#792](https://github.com/VisActor/VChart/issues/792)
- **@visactor/vchart**: linear axis support `tooltipFilterRange` to configure the relative data range of dimension tooltip, related [#933](https://github.com/VisActor/VChart/issues/933)
- **@visactor/vchart**: add vchart to context in params of mark function style
- **@visactor/vchart**: add default dark theme for scrollBar
- **@visactor/vchart**: add configure items `bandSize`, `maxBandSize`, `minBandSize` to the spec of band axis, related [#263](https://github.com/VisActor/VChart/issues/263)
- **@visactor/vchart**: support `barMinHeight` for bar series, relate [#722](https://github.com/VisActor/VChart/issues/722)
- **@visactor/vchart**: enhance default wordcloud appear animation, details in [#675](https://github.com/VisActor/VChart/issues/675)
- **@visactor/vchart**: tick mask support for polar progress-like charts, related [#596](https://github.com/VisActor/VChart/issues/596)
- **@visactor/vchart**: pie label line support smooth
- **@visactor/vchart**: support custom callback for tickCount, see [#951](https://github.com/VisActor/VChart/issues/951)
- **@visactor/vchart**: support `label.confine` for markLine and markPoint to auto adjust label's position, relate https://github.com/VisActor/VChart/issues/699
- **@visactor/vchart**: support `minAngle` for pie chart, relate [#738](https://github.com/VisActor/VChart/issues/738)
- **@visactor/vchart**: disable label animation as default in map series
- **@visactor/vchart**: increase chart stacking capabilities, provide stackValue to support independent stacking of multiple series
- **@visactor/vchart**: increase chart stacking capabilities, provide stackInverse support for stacking in reverse order
- **@visactor/vchart**: support `scaleCenter` attribute for mark, see [#781](https://github.com/VisActor/VChart/issues/781)
- **@visactor/vchart**: provide updateModelSpec api, so that users can update the configuration of a chart module individually
- **@visactor/vchart**: supports deleting all events of the corresponding type without passing through the handler when calling off
- **@visactor/vchart**: tooltip supports custom shape type, related [#496](https://github.com/VisActor/VChart/issues/496)
- **@visactor/vchart**: tooltip supports custom `spaceRow` for each line, related [#949](https://github.com/VisActor/VChart/issues/949)
- **@visactor/vchart**: tooltip supports custom fixed position relative to the cursor, related [#541](https://github.com/VisActor/VChart/issues/541)
- **@visactor/vchart**: fix issue about updateSpec not work with only data change, details in [#912](https://github.com/VisActor/VChart/issues/912)
- **@visactor/vchart**: support wx env
- **@visactor/vchart**: remove compatibility code of threshold
- **@visactor/vchart**: access label in map series

**🐛 fix**

- **@visactor/vchart**: when stack is false and no `fieldX2` or `fieldY2`, `dataToPositionX1` and `dataToPositionY1` should use 0, close [#647](https://github.com/VisActor/VChart/issues/647)
- **@visactor/vchart**: label stroke should follow default color when stroke is set to null, detail see [#985](https://github.com/VisActor/VChart/issues/985)
- **@visactor/vchart**: `offsetX` and `offsetY` can not work in mark component
- **@visactor/vchart**: sankey chart support color config'
- **@visactor/vchart**: style not effect when set mark hover. fix [#976](https://github.com/VisActor/VChart/issues/976)
- **@visactor/vchart**: tooltipHide event may be inavailable when the computer runs slow
- **@visactor/vchart**: chart pass-through serDataByAxis config to series
- **@visactor/vchart**: when call updateSpec, the prev scrollbar had not been clear, relate [#1044](https://github.com/VisActor/VChart/issues/1044)
- **@visactor/vchart**: add protect for this.\_spec, fixed [#1045](https://github.com/VisActor/VChart/issues/1045)
- **@visactor/vchart**: fix the issue of `seriesId` does not work in legends, closed [#910](https://github.com/VisActor/VChart/issues/910)
- **@visactor/vchart**: state scale domain error when domain is locked. fix [#629](https://github.com/VisActor/VChart/issues/629)
- **@visactor/vchart**: fix unoff event when passing through handler
- **@visactor/vchart**: fix userEvent is added multiple times
- **@visactor/vchart**: line and area mark should set closePath default, fix [#654](https://github.com/VisActor/VChart/issues/654)
- **@visactor/vchart**: fix the issue of radar area's invalidType not work, fixed [#867](https://github.com/VisActor/VChart/issues/867)
- **@visactor/vchart**: fix invalidType not working after invoking updataDataSync, details in [#1057](https://github.com/VisActor/VChart/issues/1057)
- **@visactor/vchart**: marker don not render after updateData. fix [#882](https://github.com/VisActor/VChart/issues/882)
- **@visactor/vchart**: fix the issue of markLine symbol.size not work
- **@visactor/vchart**: optimize the layout of normal-inline, fixed [#989](https://github.com/VisActor/VChart/issues/989)
- **@visactor/vchart**: do the product of this.\_spec, fixed [#1062](https://github.com/VisActor/VChart/issues/1062)
- **@visactor/vchart**: fix the issue of progress layout in multi-region
- **@visactor/vchart**: render error when dot and link data is empty. fix [#1019](https://github.com/VisActor/VChart/issues/1019)
- **@visactor/vchart**: fontsize renge not effect with no value field. fix [#522](https://github.com/VisActor/VChart/issues/522)
- **@visactor/vchart**: lock crosshair label to uninteractive, because it will affect axis label's event pick
- **@visactor/vchart**: fix the issue of reading onError of null option in [#915](https://github.com/VisActor/VChart/issues/915)
  **🔨 refactor**
- **@visactor/vchart**: split the updateSpec of life cycle to spec transform & compare
- **@visactor/vchart**: remove unused code, and transform ticks transform to vutils-extension
- **@visactor/vchart**: unify the clear of component
- **@visactor/vchart**: seperate grid from axis for better layer control
- **@visactor/vchart**: use @visctor/vgrammar-core to replace @visctor/vgrammar

[more detail about v1.4.0](https://github.com/VisActor/VChart/releases/tag/v1.4.0)

# v1.3.4

2023-09-20

**🐛 fix**

- **@visactor/vchart**: circularProgress chart may throw error when executing `updateSpec`, related [#994](https://github.com/VisActor/VChart/issues/994)
- **@visactor/vchart**: the theme in spec does not update correctly when executing `updateSpec`, related [#996](https://github.com/VisActor/VChart/issues/996)
- **@visactor/vchart**: `track` in spec is not working in circularProgress charts, related [#600](https://github.com/VisActor/VChart/issues/600)
- **@visactor/vchart**: fix the error triggered by chart updateSpec, fixed [#988](https://github.com/VisActor/VChart/issues/988), [#1002](https://github.com/VisActor/VChart/issues/1002)
- **@visactor/vchart**: fix the issue of player component updateSpec, fixed [#967](https://github.com/VisActor/VChart/issues/967)

[more detail about v1.3.4](https://github.com/VisActor/VChart/releases/tag/v1.3.4)

# v1.3.3

2023-09-18

**🐛 fix**

- **@visactor/vchart**: fix the issue of player component updateSpec, fixed [#967](https://github.com/VisActor/VChart/issues/967)

[more detail about v1.3.3](https://github.com/VisActor/VChart/releases/tag/v1.3.3)

# v1.3.2

2023-09-14

**🆕 feat**

- **@visactor/vchart**: the setDimensionIndex api supports deselecting ability by passing in null
- **@visactor/vchart**: use precision calculations in waterfall charts to avoid unexpected values for labels, details in [#721](https://github.com/VisActor/VChart/issues/721)
- **@visactor/vchart**: interactive default config.

**🐛 fix**

- **@visactor/vchart**: log scale has no result about zero when bar stack has a zero baseline value. fix [#634](https://github.com/VisActor/VChart/issues/634)
- **@visactor/vchart**: fix the user event listener becomes invalid after updateSpec
- **@visactor/vchart**: fix bug of series mark static style are not updated when updateSpec
- **@visactor/vchart**: fix bug data fields are not updated when updateSpec, details in [#829](https://github.com/VisActor/VChart/issues/829)
- **@visactor/vchart**: fix the issue of animation config not work in common chart, related [#814](https://github.com/VisActor/VChart/issues/814)

**⚡ perf**

- **@visactor/vchart**: optimize the performance of dimension-statistics
- **@visactor/vchart**: only calculate dimensionTree when need

[more detail about v1.3.2](https://github.com/VisActor/VChart/releases/tag/v1.3.2)

# v1.3.1

2023-09-05

**🆕 feat**

- **@visactor/vchart**: `lineHeight` supports string proportional values, related [#744](https://github.com/VisActor/VChart/issues/744)
- **@visactor/vchart**: upgrade vdataset for clone source data when call updateData

**🐛 fix**

- **@visactor/vchart**: move \'SeriesMarkNameEnum\' to single file, solve the issue of codesandbox can not work, it looks like an error in the Codesandbox' bundler, see https://github.com/codesandbox/codesandbox-client/issues/6435
- **@visactor/vchart**: fix sortDataByAxis not work after updateData
- **@visactor/vchart**: fix the issue of legend does not update after updateData, fix [#769](https://github.com/VisActor/VChart/issues/769)
- **@visactor/vchart**: fix the issue of legend's maxHeight not work
- **@visactor/vchart**: the issue of pie chart with null value, fixed https://github.com/VisActor/VChart/issues/748
- **@visactor/vchart**: fix the problem that the pie chart draws a full circle when the data is all 0, because the endAngle of the last piece of data is forced to configure the endAngle of polar coordinates
- **@visactor/vchart**: fix the issue of `seriesIndex` not work in discrete legend, see [#732](https://github.com/VisActor/VChart/issues/732)

[more detail about v1.3.1](https://github.com/VisActor/VChart/releases/tag/v1.3.1)
