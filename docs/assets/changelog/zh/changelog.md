# v1.8.2-alpha.0

2023-12-22

**其他**
* @visactor/vchart: improve the stability of spec transformer and media query
* @visactor/vchart: select.triggerOff: none not work



[more detail about v1.8.2-alpha.0](https://github.com/VisActor/VChart/releases/tag/v1.8.2-alpha.0)

# v1.8.1

2023-12-21

**其他**
- **@visactor/vchart**: improve the stability of spec transformer and media query
- **@visactor/vchart**: `select.triggerOff: none` not work

[more detail about v1.8.1](https://github.com/VisActor/VChart/releases/tag/v1.8.1)

# v1.8.0

2023-12-19

**其他**
- **@visactor/vchart**: add getPoints api in funnel mark attribute context
- **@visactor/vchart**: vchart supports chart-level plugin, related #1784
- **@visactor/vchart**: new media query plugin to support self-adaptive charts, related #1413
- **@visactor/vchart**: support optimize config, and auto set disableCheckGraphicWidthOutRange to true
- **@visactor/vchart**: remove legacy theme for legends
**其他**
- **@visactor/vchart**: fix the api: `getComponentsByKey` not work
- **@visactor/vchart**: animation support for gauge pointer series, related #1699
- **@visactor/vchart**: fix issue with secondary dataflow, closed #1760
**其他**
- **@visactor/vchart**: update datazoom and brush updatecallback, use event
**其他**
- **@visactor/vchart**: when visible is false, dont parse detail attrs



[more detail about v1.8.0](https://github.com/VisActor/VChart/releases/tag/v1.8.0)

# v1.7.5

2023-12-15

**其他**
- **brush**: brush release error after update spec. fix#1720
- **@visactor/vchart**: series should pick `morph` config in chart
- **@visactor/vchart**: fix type defination of vchart spec in #1486



[more detail about v1.7.5](https://github.com/VisActor/VChart/releases/tag/v1.7.5)

# v1.7.4

2023-12-12

**其他**
- **@visactor/vchart**: support interaction group in region
**其他**
- **@visactor/vchart**: label style not update when change current theme in #1698



[more detail about v1.7.4](https://github.com/VisActor/VChart/releases/tag/v1.7.4)

# v1.7.3

2023-12-06

**其他**
- **@visactor/vchart**: marker supports `coordinatesOffset` for points adjusting
- **@visactor/vchart**: markLine supports x,y,y1 y,x,x1 and x,y,x1,y1 position
- **@visactor/vchart**: markPoint support xy position
- **@visactor/vchart**: marker's position property support relative coordinate
- **@visactor/vchart**: marker's coordinate property supports callback
- **@visactor/vchart**: cartesion crosshair's rect width support callback, support #1567
- **@visactor/vchart**: polar crosshair supports default show
- **@visactor/vchart**: support text omission position configuration `suffixPosition`
- **@visactor/vchart**: supports `pickStrokeBuffer` style attribute for extending the stroke picking range
**其他**
- **@visactor/vchart**: fix 3d bar chart with seriesField issue, closed #1646
- **@visactor/vchart**: fix 3d chart z axis not work noamally issue, closed #1668
- **@visactor/vchart**: clear old encode when update, fix #1630
- **@visactor/vchart**: fix the problem that track mark has multiple elements in gauge series, related #1643
- **@visactor/vchart**: fix the problem that gaugePointer series doesn't support custom `innerRadius`, related #1644
- **@visactor/vchart**: fix the type error of markArea
- **@visactor/vchart**: the outerBorder's color should be equal with labelBackground's fill by default
- **@visactor/vchart**: fix oneByOne loop animation
- **@visactor/vchart**: add `align` property for size legend, and fix the issue of the attribute assignment does not take effect, related #1553
**其他**
- **@visactor/vchart**: unify `getVRenderComponents` method in Component model
**其他**
- **@visactor/vchart**: only call `cloneDeepSpec()` when need

[more detail about v1.7.3](https://github.com/VisActor/VChart/releases/tag/v1.7.3)

# v1.7.2

2023-11-30

**其他**
- **@visactor/vchart**: clear old encode when update, fix #1630
- **@visactor/vchart**: fix the problem that track mark has multiple elements in gauge series, related #1643
- **@visactor/vchart**: fix the problem that gaugePointer series doesn't support custom `innerRadius`, related #1644
**其他**
- **@visactor/vchart**: unify `getVRenderComponents` method in Component model

[more detail about v1.7.2](https://github.com/VisActor/VChart/releases/tag/v1.7.2)

# v1.7.1

2023-11-30

**其他**
- **@visactor/vchart**: read dataview of extension-mark by `dataId`
- **@visactor/vchart**: fixed the issue where the layout size of the axis is incorrect when only domainLine is displayed
- **@visactor/vchart**: fix bug of changed spec when create series
- **pie**: get center error. fix #1610
- **@visactor/vchart**: optimize the effect of `tooltip.enterable` that user's pointer can easily enter the tooltip, related #1598

[more detail about v1.7.1](https://github.com/VisActor/VChart/releases/tag/v1.7.1)

# v1.7.0

2023-11-24

**其他**
- **@visactor/vchart**: support `trimPadding` for band type axis, which used to remove the blank space at both ends of the aixs, closed #1174
- **@visactor/vchart**: custom mark support animation config
- **@visactor/vchart**: support customShape of mark
- **@visactor/vchart**: optimize auto mode of data-zoom, related #1416
- **@visactor/vchart**: enhance marker's position ability
- **@visactor/vchart**: mark area should support specify x x1 y and y1 both
- **@visactor/vchart**: add light-mobile and dark-mobile theme, related #1414
- **@visactor/vchart**: optmize performance of computing data
- **@visactor/vchart**: support none in component layoutType
- **@visactor/vchart**: support line/area label
- **@visactor/vchart**: no longer register mobile theme in vchart
- **@visactor/vchart**: feature: supports registered function expression syntax, related #1187
**其他**
- **@visactor/vchart**: chart padding won't update when switching global theme
- **@visactor/vchart**: fix spec modified unexpectedly in data model, details in #1514
- **@visactor/vchart**: update enableSegements implemention
**其他**
- **@visactor/vchart**: refactor the inheritance structure of the chart module to make the layout system independent, details in #1428
**其他**
- **@visactor/vchart**: dont need to call `attrTransform()` in compilable-mark
- **@visactor/vchart**: remove getStatisticsDomain()
- **@visactor/vchart**: dont call bounds calculate when user specify width/height of components




[more detail about v1.7.0](https://github.com/VisActor/VChart/releases/tag/v1.7.0)

# v1.6.7

2023-11-21

**其他**
- **@visactor/wx-vchart**:  fixed package delivery error issue, fixed #1570 , PR in #1571 

[more detail about v1.6.7](https://github.com/VisActor/VChart/releases/tag/v1.6.7)

# v1.6.6

2023-11-21

**其他**
- **@visactor/vchart**: fix chart screen remains when using updateSpecSync, details in #1421
- **@visactor/vchart**: is mouse click in empty region, the hover shape should reset, fixed #1538



[more detail about v1.6.6](https://github.com/VisActor/VChart/releases/tag/v1.6.6)

# v1.6.5

2023-11-17

**其他**
- **@visactor/vchart**: add `skipFunctionDiff` in react-vchart to skip difference of functions
**其他**
- **@visactor/vchart**: dimension click not effect after update spec. fix #1532



[more detail about v1.6.5](https://github.com/VisActor/VChart/releases/tag/v1.6.5)

# v1.6.4

2023-11-16


**其他**
- **@visactor/vchart**: fixed the problem of unreasonable automatic indentation being triggered after modifying the axis range in datazoom
- **@visactor/vchart**: default realtime not effect in scrollbar and datazoom. fix #1462
- **@visactor/vchart**: filter mode error when roam in scrollbar and datazoom. fix #1460
- **@visactor/lark-vchart**: fix `options` can not work in lark-vchart, wx-vchart
- **@visactor/wx-vchart**: fix `options` can not work in lark-vchart, wx-vchart
- **@visactor/vchart**: `legendItemHover` and `legendItemUnHover` should trigger once, https://github.com/VisActor/VRender/pull/678
**其他**
- **@visactor/vchart**: optimize the dataflow of sankey




[more detail about v1.6.4](https://github.com/VisActor/VChart/releases/tag/v1.6.4)

# v1.6.3

2023-11-10

**其他**
- **@visactor/vchart**: fix the issue of update animation not work for line mark
- **@visactor/vchart**: update vgrammar to ~0.8.3  to fix the issue that, vrender should not auto render during renderAsync
- **@visactor/vchart**: fix the error when quick release vchart during async render
- **@visactor/vchart**: tooltip value is forced to wrap when the user globally configures css overflow-warp, related #1446
- **@visactor/vchart**: fix: svg model's id should be uniq, fixed #1422, #1442
- **@visactor/vchart**: fix: empty string should not be a valid number, fix #1463
**其他**
- **@visactor/vchart**: optimize the encode performance of sankey



[more detail about v1.6.3](https://github.com/VisActor/VChart/releases/tag/v1.6.3)

# v1.6.2

2023-11-08

**其他**
- **@visactor/vchart**: tooltip value is forced to wrap when the user globally configures css overflow-warp, related #1446

[more detail about v1.6.2](https://github.com/VisActor/VChart/releases/tag/v1.6.2)

# v1.6.1

2023-11-08

**其他**
- **@visactor/vchart**: label formatMethod callback add context parmas to provide series object
- **@visactor/vchart**: add components `<Title />` and `<Indicator />` of react-vchart, close #1424
**其他**
- **@visactor/vchart**: `centroidProperty` not work in map chart
- **@visactor/vchart**: fix incorrect legend filter result caused by animation in #1403
- **@visactor/vchart**: if layout item is invisible, do not participate in grid layout, related #1425
- **@visactor/vchart**: aggregation return value infinity problem. fix#1380'



[more detail about v1.6.1](https://github.com/VisActor/VChart/releases/tag/v1.6.1)

# v1.6.0

2023-11-03

**其他**
- **@visactor/vchart**: add bar background mark for bar-like series, related #1154
- **@visactor/vchart**: add `updateElement` callback in tooltip spec to configure custom tooltip DOM elements based on the default tooltip handler, related #1338
- **@visactor/vchart**: enable exit animation while updating data
- **@visactor/vchart**: support functional label.position config in line/area/scatter/bar series
- **@visactor/vchart**: load browser or node env code dynamically
- **@visactor/vchart**: dataScheme supports configuration by distinguishing series directions, related #1209
- **@visactor/vchart**: data sampling & point overlap. close #460
- **@visactor/taro-vchart**:  support weapp
**其他**
- **@visactor/vchart**: react-vchart mode not work
- **@visactor/vchart**: optimize the trigger of hover in non-browser env
- **@visactor/vchart**: if series mark is line, return stroke value when user want fill value, fixed #1388
- **@visactor/vchart**: fix the angle offset in rose dimension tooltip, related #1263
**其他**
- **@visactor/vchart**: create Stack and calculate stack attributes when need



[more detail about v1.6.0](https://github.com/VisActor/VChart/releases/tag/v1.6.0)

# v1.5.4

2023-10-30


**其他**
- **@visactor/vchart**: unexpected funnel transform ratio label, see #1348
- **@visactor/vchart**: tooltip value label clipped on lark mini app, related #1346

[more detail about v1.5.4](https://github.com/VisActor/VChart/releases/tag/v1.5.4)

# v1.5.3

2023-10-27

**其他**
- **@visactor/vchart**: support the exportCanvas api of vchart
**其他**
- **@visactor/vchart**: sankey chart downstream highlight, related #1269
- **@visactor/vchart**: slove first select not effect problem. fix #1129
- **@visactor/vchart**: new layout method for circle axis label, related #1123
- **@visactor/vchart**: change default zIndex of axis in gauge chart, related #1122
- **@visactor/vchart**: datazoom location error when resize. fix #520
- **@visactor/vchart**: slove event off error after release
- **@visactor/vchart**: fix the issue where invalidType of scatter chart checks x and y at the same time
- **@visactor/vchart**: fix the issue in markline as min/max aggr result is not correct, see #1261
- **@visactor/vchart**: fix: fix the issue that the map tooltip title does not display the name from nameMap, see #1260
- **@visactor/vchart**: sankey supports string value
- **@visactor/vchart**: fix the issue of crosshair can not trigger in weapp, fixed #1322



[more detail about v1.5.3](https://github.com/VisActor/VChart/releases/tag/v1.5.3)

# v1.5.2

2023-10-24

**其他**
- **@visactor/vchart**: support the exportCanvas api of vchart
**其他**
- **@visactor/vchart**: new layout method for circle axis label, related #1123
- **@visactor/vchart**: change default zIndex of axis in gauge chart, related #1122
- **@visactor/vchart**: datazoom location error when resize. fix #520
- **@visactor/vchart**: fix the issue in markline as min/max aggr result is not correct, see #1261
- **@visactor/vchart**: fix: fix the issue that the map tooltip title does not display the name from nameMap, see #1260



[more detail about v1.5.2](https://github.com/VisActor/VChart/releases/tag/v1.5.2)

# v1.5.1

2023-10-20

**其他**
- **@visactor/vchart**: support correlation Chart 
- **@visactor/vchart**: add getGraphicBounds api in layoutItem to support get graphic size
- **@visactor/vchart**: optimize the autoindent logic in layout to ensure padding effect is correct
- **@visactor/vchart**: support `centroidProperty` in map series
- **@visactor/vchart**: scrollbar enhance zoom & drag & scroll. close #965
- **@visactor/vchart**: datazoom enhance zoomLock & span config. close #1082
- **@visactor/vchart**: supply the attributeContext params for customMark's attribute callback
- **@visactor/vchart**: provide afterLayout event to support users to modify layout effects
- **@visactor/vchart**: provide datum in the params of `updateContent` callback of tooltip, related #1244
- **@visactor/vchart**: add the default theme (light, dark) of markLine, markArea and funnel series
- **@visactor/vchart**: support load environment code on demand
**其他**
- **@visactor/vchart**: optimized the display of `padAngle` in the gauge series and changed the unit of `padAngle` to angle, related #1215
- **@visactor/vchart**: link 'adjacency' interaction highlighting effect of Sankey Chart is wrong, #1121
- **@visactor/vchart**: fix the issue of boxplot outlier animation will throw error
- **@visactor/vchart**: fix the duplicate event registration in scrollbar, fixed#1241
**其他**
- **@visactor/vchart**: add register function for chart/series/component to collect side effect code
- **@visactor/vchart**: add register function for animation



[more detail about v1.5.1](https://github.com/VisActor/VChart/releases/tag/v1.5.1)

# v1.4.3

2023-10-17

**其他**
- **@visactor/vchart**: brush state proxy to state spec
**其他**
- **@visactor/vchart**: fix when the legend item only has stroke it cannot be consistent with the graphic color, details in #1147



[more detail about v1.4.3](https://github.com/VisActor/VChart/releases/tag/v1.4.3)

# v1.4.2

2023-10-12

**其他**
- **@visactor/vchart**: gauge series supports label component, related #1039
- **@visactor/vchart**: add static tools in `VChart.Utils`
- **@visactor/vchart**: supports afterResize and afterRender events
- **@visactor/vchart**: add new config `autoWidth` to the tooltip label style, related #688
**其他**
- **@visactor/vchart**: `tooltipRelease` event may be invalid when being released by VTable
- **@visactor/vchart**: select error when setting brush. fix #1129
- **@visactor/vchart**: optimize the default performance of the long tooltip title, related #688
- **@visactor/vchart**: if `markLine` is empty like `{}` or `[]`, it should not create marker component
- **@visactor/vchart**: fix the issue when use `positions` to create marker component, fixed #1084
- **@visactor/vchart**: auto visible with linear axis. fix #1118



[more detail about v1.4.2](https://github.com/VisActor/VChart/releases/tag/v1.4.2)

# v1.4.1

2023-09-27

**其他**
- **@visactor/vchart**: optimize updateSpec to avoid additional theme updates
**其他**
- **@visactor/vchart**: fix updateViewBox api will fail after resize
- **datazoom**: fix bounds error when there is no preview chart. fix #1050
- **@visactor/vchart**: the rose chart's first sector's startAngle should start from polar coordinate's startAngle, fix #900
- **@visactor/vchart**: fix `theme.fontFamily` can not work
- **@visactor/vchart**: fix the problem that updateFullData cannot update data in series



[more detail about v1.4.1](https://github.com/VisActor/VChart/releases/tag/v1.4.1)

# v1.4.0

2023-09-25

**其他**
- **@visactor/vchart**: add scrollbar layout spec to sequence. close #792
- **@visactor/vchart**: linear axis support `tooltipFilterRange` to configure the relative data range of dimension tooltip, related #933
- **@visactor/vchart**: add vchart to context in params of mark function style
- **@visactor/vchart**: add default dark theme for scrollBar
- **@visactor/vchart**: add configure items `bandSize`, `maxBandSize`, `minBandSize` to the spec of band axis, related #263
- **@visactor/vchart**: support `barMinHeight` for bar series, relate #722
- **@visactor/vchart**: enhance default wordcloud appear animation, details in #675
- **@visactor/vchart**: tick mask support for polar progress-like charts, related #596
- **@visactor/vchart**: pie label line support smooth
- **@visactor/vchart**: support custom callback for tickCount, see #951
- **@visactor/vchart**: support `label.confine` for markLine and markPoint to auto adjust label's position, relate https://github.com/VisActor/VChart/issues/699
- **@visactor/vchart**: support `minAngle` for pie chart, relate #738
- **@visactor/vchart**: disable label animation as default in map series
- **@visactor/vchart**: increase chart stacking capabilities, provide stackValue to support independent stacking of multiple series
- **@visactor/vchart**: increase chart stacking capabilities, provide stackInverse support for stacking in reverse order
- **@visactor/vchart**: support `scaleCenter` attribute for mark, see #781
- **@visactor/vchart**: provide updateModelSpec api, so that users can update the configuration of a chart module individually
- **@visactor/vchart**: supports deleting all events of the corresponding type without passing through the handler when calling off
- **@visactor/vchart**: tooltip supports custom shape type, related #496
- **@visactor/vchart**: tooltip supports custom `spaceRow` for each line, related #949
- **@visactor/vchart**: tooltip supports custom fixed position relative to the cursor, related #541
- **@visactor/vchart**: fix issue about updateSpec not work with only data change, details in #912
- **@visactor/vchart**: support wx env
- **@visactor/vchart**: remove compatibility code of threshold
- **@visactor/vchart**: access label in map series
**其他**
- **@visactor/vchart**: when stack is false and no `fieldX2` or `fieldY2`, `dataToPositionX1` and `dataToPositionY1` should use 0, close #647
- **@visactor/vchart**: label stroke should follow default color when stroke is set to null, detail see #985
- **@visactor/vchart**: `offsetX` and `offsetY` can not work in mark component
- **@visactor/vchart**: sankey chart support color config'
- **@visactor/vchart**: style not effect when set mark hover. fix #976
- **@visactor/vchart**: tooltipHide event may be inavailable when the computer runs slow
- **@visactor/vchart**: chart pass-through serDataByAxis config to series
- **@visactor/vchart**: when call updateSpec, the prev scrollbar had not been clear, relate #1044
- **@visactor/vchart**: add protect for this._spec, fixed #1045
- **@visactor/vchart**: fix the issue of `seriesId` does not work in legends, closed #910
- **@visactor/vchart**: state scale domain error when domain is locked. fix #629
- **@visactor/vchart**: fix unoff event when passing through handler
- **@visactor/vchart**: fix userEvent is added multiple times
- **@visactor/vchart**: line and area mark should set closePath default, fix #654
- **@visactor/vchart**: fix the issue of radar area's invalidType not work, fixed #867
- **@visactor/vchart**: fix invalidType not working after invoking updataDataSync, details in #1057
- **@visactor/vchart**: marker don not render after updateData. fix #882
- **@visactor/vchart**: fix the issue of markLine symbol.size not work
- **@visactor/vchart**: optimize the layout of normal-inline, fixed #989
- **@visactor/vchart**: do the product of this._spec, fixed #1062
- **@visactor/vchart**: fix the issue of progress layout in multi-region
- **@visactor/vchart**: render error when dot and link data is empty. fix #1019
- **@visactor/vchart**: fontsize renge not effect with no value field. fix #522
- **@visactor/vchart**: lock crosshair label to uninteractive, because it will affect axis label's event pick
- **@visactor/vchart**: fix the issue of reading onError of null option in #915
**其他**
- **@visactor/vchart**: split the updateSpec of life cycle to spec transform & compare
- **@visactor/vchart**: remove unused code, and transform ticks transform to vutils-extension
- **@visactor/vchart**: unify the clear of component
- **@visactor/vchart**: seperate grid from axis for better layer control
- **@visactor/vchart**: use @visctor/vgrammar-core to replace @visctor/vgrammar



[more detail about v1.4.0](https://github.com/VisActor/VChart/releases/tag/v1.4.0)

# v1.3.4

2023-09-20

**其他**
- **@visactor/vchart**: circularProgress chart may throw error when executing `updateSpec`, related #994
- **@visactor/vchart**: the theme in spec does not update correctly when executing `updateSpec`, related #996
- **@visactor/vchart**: `track` in spec is not working in circularProgress charts, related #600
- **@visactor/vchart**: fix the error triggered by chart updateSpec, fixed #988, #1002
- **@visactor/vchart**: fix the issue of player component updateSpec, fixed #967



[more detail about v1.3.4](https://github.com/VisActor/VChart/releases/tag/v1.3.4)

# v1.3.3

2023-09-18

**其他**
- **@visactor/vchart**: fix the issue of player component updateSpec, fixed #967



[more detail about v1.3.3](https://github.com/VisActor/VChart/releases/tag/v1.3.3)

# v1.3.2

2023-09-14

**其他**
- **@visactor/vchart**: the setDimensionIndex api supports deselecting ability by passing in null
- **@visactor/vchart**: use precision calculations in waterfall charts to avoid unexpected values for labels, details in #721
- **@visactor/vchart**: interactive default config.
**其他**
- **@visactor/vchart**: log scale has no result about zero when bar stack has a zero baseline value. fix #634
- **@visactor/vchart**: fix the user event listener becomes invalid after updateSpec
- **@visactor/vchart**: fix bug of series mark static style are not updated when updateSpec
- **@visactor/vchart**: fix bug data fields are not updated when updateSpec, details in #829
- **@visactor/vchart**: fix the issue of animation config not work in common chart, related #814
**其他**
- **@visactor/vchart**: optimize the performance of dimension-statistics
- **@visactor/vchart**: only calculate dimensionTree when need



[more detail about v1.3.2](https://github.com/VisActor/VChart/releases/tag/v1.3.2)

# v1.3.1

2023-09-05

**其他**
- **@visactor/vchart**: `lineHeight` supports string proportional values, related #744
- **@visactor/vchart**: upgrade vdataset for clone source data when call updateData
**其他**
- **@visactor/vchart**: move \'SeriesMarkNameEnum\' to single file, solve the issue of codesandbox can not work, it looks like an error in the Codesandbox' bundler, see https://github.com/codesandbox/codesandbox-client/issues/6435
- **@visactor/vchart**: fix sortDataByAxis not work after updateData
- **@visactor/vchart**: fix the issue of legend does not update after updateData, fix #769
- **@visactor/vchart**: fix the issue of legend's maxHeight not work
- **@visactor/vchart**: the issue of pie chart with null value, fixed https://github.com/VisActor/VChart/issues/748
- **@visactor/vchart**: fix the problem that the pie chart draws a full circle when the data is all 0, because the endAngle of the last piece of data is forced to configure the endAngle of polar coordinates
- **@visactor/vchart**: fix the issue of `seriesIndex` not work in discrete legend, see #732

[more detail about v1.3.1](https://github.com/VisActor/VChart/releases/tag/v1.3.1)

