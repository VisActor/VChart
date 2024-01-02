# Change Log - @visactor/vchart

This log was last generated on Fri, 29 Dec 2023 14:44:05 GMT and should not be manually modified.

## 1.8.3
Fri, 29 Dec 2023 14:44:05 GMT

### Updates

- fix: chart option.animation not work
- feat: add props `useSyncRender` to react-vchart, close #1685


- fix: fix error in strict mode of react-vchart, fix #1669


- feat: Supports the initialization parameter `disableTriggerEvent` to turn off the default interactive effect of the chart


- fix: error in chart level modification of media query action
- fix: dimension tooltip in the dual-dimension chart contains data of only one dimension, related #1841 
- fix: fix bug in layout when band axis has no domain


- fix: funnel clipIn animation has delay for marks which overflows the range of region in #1839
- fix: when marker label's padding is an object, it should work
- refactor: optimize the style configuration of marker
- fix: undefined globalThis in tt miniprogram, see #1854

## 1.8.2
Fri, 22 Dec 2023 12:49:18 GMT

### Updates

- fix: chart option.animation not work
- feat: Supports the initialization parameter `disableTriggerEvent` to turn off the default interactive effect of the chart


- fix: error in chart level modification of media query action

## 1.8.1
Thu, 21 Dec 2023 08:30:03 GMT

### Updates

- fix: improve the stability of spec transformer and media query
-  fix: `select.triggerOff: none` not work

## 1.8.0
Tue, 19 Dec 2023 12:04:29 GMT

### Updates

- feat: add getPoints api in funnel mark attribute context
- fix: fix the api: `getComponentsByKey` not work
- refactor: update datazoom and brush updatecallback, use event
- feat: vchart supports chart-level plugin, related #1784
- feat: new media query plugin to support self-adaptive charts, related #1413
- feat: support optimize config, and auto set disableCheckGraphicWidthOutRange to true
- fix: animation support for gauge pointer series, related #1699
- fix: fix issue with secondary dataflow, closed #1760
- perf: when visible is false, dont parse detail attrs


- feat: remove legacy theme for legends

## 1.7.5
Fri, 15 Dec 2023 08:36:30 GMT

### Updates

- fix(brush): brush release error after update spec. fix#1720
- fix: series should pick `morph` config in chart


- fix: fix type defination of vchart spec in #1486

## 1.7.4
Tue, 12 Dec 2023 07:55:54 GMT

### Updates

- feat: support interaction group in region


- fix: label style not update when change current theme in #1698

## 1.7.3
Wed, 06 Dec 2023 07:34:11 GMT

### Updates

- feat: marker supports `coordinatesOffset` for points adjusting
- feat: markLine supports x,y,y1 y,x,x1 and x,y,x1,y1 position
- feat: markPoint support xy position
-   feat: marker's position property support relative coordinate
- feat: marker's coordinate property supports callback
- fix: fix 3d bar chart with seriesField issue, closed #1646
- fix: fix 3d chart z axis not work noamally issue, closed #1668
- fix: clear old encode when update, fix #1630


- fix: fix the problem that track mark has multiple elements in gauge series, related #1643 
- fix: fix the problem that gaugePointer series doesn't support custom `innerRadius`, related #1644
- refactor: unify `getVRenderComponents` method in Component model
- fix: fix the type error of markArea
- feat: cartesion crosshair's rect width support callback, support #1567
- feat: polar crosshair supports default show
- fix: the outerBorder's color should be equal with labelBackground's fill by default
- fix: fix oneByOne loop animation
- fix: add `align` property for size legend, and fix the issue of the attribute assignment does not take effect, related #1553
- feat: support text omission position configuration `suffixPosition`
- feat: supports `pickStrokeBuffer` style attribute for extending the stroke picking range
- perf: only call `cloneDeepSpec()` when need



## 1.7.2
Wed, 29 Nov 2023 19:03:36 GMT

### Updates

- fix: clear old encode when update, fix #1630


- fix: fix the problem that track mark has multiple elements in gauge series, related #1643 
- fix: fix the problem that gaugePointer series doesn't support custom `innerRadius`, related #1644
- refactor: unify `getVRenderComponents` method in Component model

## 1.7.1
Tue, 28 Nov 2023 08:24:27 GMT

### Updates

- fix: read dataview of extension-mark by `dataId`


- fix: fixed the issue where the layout size of the axis is incorrect when only domainLine is displayed


- fix: fix bug of changed spec when create series


- fix(pie): get center error. fix #1610
- fix: optimize the effect of `tooltip.enterable` that user's pointer can easily enter the tooltip, related #1598

## 1.7.0
Fri, 24 Nov 2023 09:43:25 GMT

### Updates

- feat: support `trimPadding` for band type axis, which used to remove the blank space at both ends of the aixs, closed #1174
- feat: custom mark support animation config
- feat: support customShape of mark


- feat: optimize auto mode of data-zoom, related #1416
- feature: supports registered function expression syntax, related #1187
- feat: enhance marker's position ability
- feat: mark area should support specify x x1 y and y1 both
- feat: add light-mobile and dark-mobile theme, related #1414
- fix: chart padding won't update when switching global theme
- feat: optmize performance of computing data
- feat: support none in component layoutType


- feat: support line/area label
- fix: fix spec modified unexpectedly in data model, details in #1514


- fix: update enableSegements implemention


- perf: dont need to call `attrTransform()` in compilable-mark


- perf: remove getStatisticsDomain()


- perf: dont call bounds calculate when user specify width/height of components
- refactor: refactor the inheritance structure of the chart module to make the layout system independent, details in #1428


- feat: no longer register mobile theme in vchart

## 1.6.7
Tue, 21 Nov 2023 11:02:31 GMT

_Version update only_

## 1.6.6
Fri, 17 Nov 2023 09:42:57 GMT

### Updates

- fix: fix chart screen remains when using updateSpecSync, details in #1421


- fix: is mouse click in empty region, the hover shape should reset, fixed #1538

## 1.6.5
Fri, 17 Nov 2023 05:56:10 GMT

### Updates

- fix: dimension click not effect after update spec. fix #1532
- feat: add `skipFunctionDiff` in react-vchart to skip difference of functions



## 1.6.4
Thu, 16 Nov 2023 06:35:43 GMT

### Updates

- fix: fixed the problem of unreasonable automatic indentation being triggered after modifying the axis range in datazoom


- fix: default realtime not effect in scrollbar and datazoom. fix#1462
- fix: filter mode error when roam in scrollbar and datazoom. fix #1460
- fix: fix `options` can not work in lark-vchart, wx-vchart and tt-vchart


- perf: optimize the dataflow of sankey



## 1.6.3
Fri, 10 Nov 2023 09:56:51 GMT

### Updates

- fix: fix the issue of update animation not work for line mark
- fix: update vgrammar to ~0.8.3  to fix the issue that, vrender should not auto render during renderAsync
-  fix: fix the error when quick release vchart during async render
- fix: tooltip value is forced to wrap when the user globally configures css overflow-warp, related #1446
- perf: optimize the encode performance of sankey



## 1.6.2
Wed, 08 Nov 2023 11:05:21 GMT

### Updates

- fix: tooltip value is forced to wrap when the user globally configures css overflow-warp, related #1446

## 1.6.1
Wed, 08 Nov 2023 05:29:48 GMT

### Updates

- feat: label formatMethod callback add context parmas to provide series object
- feat: add components `<Title />` and `<Indicator />` of react-vchart, close #1424


- fix: `centroidProperty` not work in map chart
- fix: fix incorrect legend filter result caused by animation in #1403
- fix: if layout item is invisible, do not participate in grid layout, related #1425
- fix(marker): aggregation return value infinity problem. fix#1380'

## 1.6.0
Fri, 03 Nov 2023 05:16:41 GMT

### Updates

- feat: add `updateElement` callback in tooltip spec to configure custom tooltip DOM elements based on the default tooltip handler, related #1338
- feat: enable exit animation while updating data
-  feat: support functional label.position config in line/area/scatter/bar series
- feat: load browser or node env code dynamically
- feat: support functional label.position config in line/area/scatter/bar series
- feat: dataScheme supports configuration by distinguishing series directions, related #1209
- feat: data sampling & point overlap. close #460
- fix: react-vchart mode not work
- fix: optimize the trigger of hover in non-browser env
- fix: if series mark is line, return stroke value when user want fill value, fixed #1388
- fix: fix the angle offset in rose dimension tooltip, related #1263
- perf: create Stack and calculate stack attributes when need



## 1.5.4
Mon, 30 Oct 2023 06:09:01 GMT

### Updates

- feat: add bar background mark for bar-like series, related #1154
- fix: unexpected funnel transform ratio label, see #1348
- fix: tooltip value label clipped on lark mini app, related #1346

## 1.5.3
Fri, 27 Oct 2023 06:56:41 GMT

### Updates

- feat: support the exportCanvas api of vchart


- fix: sankey chart downstream highlight, related #1269
- fix(brush): slove first select not effect problem. fix #1129
- fix: new layout method for circle axis label, related #1123
- fix: change default zIndex of axis in gauge chart, related #1122
- fix(datazoom): datazoom location error when resize. fix #520
- fix: slove event off error after release
- fix: fix the issue where invalidType of scatter chart checks x and y at the same time


- fix: fix the issue in markline as min/max aggr result is not correct, see #1261
- fix: fix: fix the issue that the map tooltip title does not display the name from nameMap, see #1260
- fix: sankey supports string value
- fix: fix the issue of crosshair can not trigger in weapp, fixed #1322

## 1.5.2
Tue, 24 Oct 2023 01:48:10 GMT

### Updates

- feat: support the exportCanvas api of vchart


- fix: new layout method for circle axis label, related #1123
- fix: change default zIndex of axis in gauge chart, related #1122
- fix(datazoom): datazoom location error when resize. fix #520
- fix: fix the issue in markline as min/max aggr result is not correct, see #1261
- fix: fix: fix the issue that the map tooltip title does not display the name from nameMap, see #1260

## 1.5.1
Fri, 20 Oct 2023 07:22:00 GMT

### Updates

- feat: add getGraphicBounds api in layoutItem to support get graphic size


- fix: optimized the display of `padAngle` in the gauge series and changed the unit of `padAngle` to angle, related #1215
- feat: optimize the autoindent logic in layout to ensure padding effect is correct


- feat: support `centroidProperty` in map series
- feat: scrollbar enhance zoom & drag & scroll. close #965
- feat: datazoom enhance zoomLock & span config. close #1082
- feat: supply the attributeContext params for customMark's attribute callback
- feat: provide afterLayout event to support users to modify layout effects


- feat: provide datum in the params of `updateContent` callback of tooltip, related #1244
- fix: link 'adjacency' interaction highlighting effect of Sankey Chart is wrong, #1121
- fix: fix the issue of boxplot outlier animation will throw error
- feat: add the default theme (light, dark) of markLine, markArea and funnel series
- fix: fix the duplicate event registration in scrollbar, fixed#1241
- feat: support load environment code on demand
- refactor: add register function for chart/series/component to collect side effect code
- refactor: add register function for animation

## 1.4.3
Tue, 17 Oct 2023 04:00:20 GMT

### Updates

- feat: brush state proxy to state spec
- fix: fix when the legend item only has stroke it cannot be consistent with the graphic color, details in #1147



## 1.4.2
Thu, 12 Oct 2023 11:39:35 GMT

### Updates

- feat: gauge series supports label component, related #1039
- feat: add static tools in `VChart.Utils`
- fix: `tooltipRelease` event may be invalid when being released by VTable
- feat: supports afterResize and afterRender events


- fix(brush): select error when setting brush. fix #1129
- fix: optimize the default performance of the long tooltip title, related #688
- feat: add new config `autoWidth` to the tooltip label style, related #688
- fix: if `markLine` is empty like `{}` or `[]`, it should not create marker component
- fix: fix the issue when use `positions` to create marker component, fixed #1084
- fix(scrollbar): auto visible with linear axis. fix #1118

## 1.4.1
Wed, 27 Sep 2023 07:53:38 GMT

### Updates

- fix: fix updateViewBox api will fail after resize


- feat: optimize updateSpec to avoid additional theme updates


- fix(datazoom): fix bounds error when there is no preview chart. fix #1050
- fix: the rose chart's first sector's startAngle should start from polar coordinate's startAngle, fix #900
- fix: fix `theme.fontFamily` can not work
- fix: fix the problem that updateFullData cannot update data in series



## 1.4.0
Mon, 25 Sep 2023 10:49:42 GMT

### Patches

- feat: access label in map series
- fix: fix the issue of reading onError of null option in #915

### Updates

- feat(sequence): add scrollbar layout spec to sequence. close #792
- feat: linear axis support `tooltipFilterRange` to configure the relative data range of dimension tooltip, related #933
- feat: add vchart to context in params of mark function style


- feat: add default dark theme for scrollBar
- feat: add configure items `bandSize`, `maxBandSize`, `minBandSize` to the spec of band axis, related #263
- feat: support `barMinHeight` for bar series, relate #722
- fix: when stack is false and no `fieldX2` or `fieldY2`, `dataToPositionX1` and `dataToPositionY1` should use 0, close #647
- feat: enhance default wordcloud appear animation, details in #675
- feat: tick mask support for polar progress-like charts, related #596
- fix: label stroke should follow default color when stroke is set to null, detail see #985
- feat: pie label line support smooth
- refactor: split the updateSpec of life cycle to spec transform & compare


- feat(axis): support custom callback for tickCount, see #951
- feat: support `label.confine` for markLine and markPoint to auto adjust label's position, relate https://github.com/VisActor/VChart/issues/699
- fix: `offsetX` and `offsetY` can not work in mark component
- feat: support `minAngle` for pie chart, relate #738
- feat: disable label animation as default in map series 
- fix: sankey chart support color config'
- feat: increase chart stacking capabilities, provide stackValue to support independent stacking of multiple series


- feat: increase chart stacking capabilities, provide stackInverse support for stacking in reverse order


- feat: support `scaleCenter` attribute for mark, see #781
- feat: provide updateModelSpec api, so that users can update the configuration of a chart module individually


- feat: supports deleting all events of the corresponding type without passing through the handler when calling off


- feat: tooltip supports custom shape type, related #496
- feat: tooltip supports custom `spaceRow` for each line, related #949
- feat: tooltip supports custom fixed position relative to the cursor, related #541
- feat: fix issue about updateSpec not work with only data change, details in #912


- refactor: remove unused code, and transform ticks transform to vutils-extension
- feat: support wx env
- fix(brush): style not effect when set mark hover. fix #976
- fix: tooltipHide event may be inavailable when the computer runs slow
- fix: chart pass-through serDataByAxis config to series


- fix: when call updateSpec, the prev scrollbar had not been clear, relate #1044
- fix: add protect for this._spec, fixed #1045
- fix: fix the issue of `seriesId` does not work in legends, closed #910
- fix(datazoom): state scale domain error when domain is locked. fix #629
- fix: fix unoff event when passing through handler


- fix: fix userEvent is added multiple times


- fix: line and area mark should set closePath default, fix #654
- fix: fix the issue of radar area's invalidType not work, fixed #867
- fix: fix invalidType not working after invoking updataDataSync, details in #1057


- fix(marker): marker don not render after updateData. fix #882
- fix: fix the issue of markLine symbol.size not work
- fix: optimize the layout of normal-inline, fixed #989
- refactor: unify the clear of component
- fix: do the product of this._spec, fixed #1062
- fix: fix the issue of progress layout in multi-region
- fix(sequence): render error when dot and link data is empty. fix #1019
- feat: remove compatibility code of threshold


- fix(wordcloud): fontsize renge not effect with no value field. fix #522
- refactor: seperate grid from axis for better layer control
- fix: lock crosshair label to uninteractive, because it will affect axis label's event pick
- refactor: use @visctor/vgrammar-core to replace @visctor/vgrammar


- feat: support wx env

## 1.3.4
Wed, 20 Sep 2023 05:42:12 GMT

### Updates

- fix: circularProgress chart may throw error when executing `updateSpec`, related #994
- fix: the theme in spec does not update correctly when executing `updateSpec`, related #996
- fix: `track` in spec is not working in circularProgress charts, related #600
- fix: fix the error triggered by chart updateSpec, fixed #988, #1002
- fix: fix the issue of player component updateSpec, fixed #967

## 1.3.3
Mon, 18 Sep 2023 03:27:40 GMT

### Updates

- fix: fix the issue of player component updateSpec, fixed #967

## 1.3.2
Thu, 14 Sep 2023 12:36:21 GMT

### Patches

- fix: fix the issue of animation config not work in common chart, related #814

### Updates

- feat: the setDimensionIndex api supports deselecting ability by passing in null


- feat: use precision calculations in waterfall charts to avoid unexpected values for labels, details in #721


- fix(log-axis): log scale has no result about zero when bar stack has a zero baseline value. fix #634
- fix: fix the user event listener becomes invalid after updateSpec


- fix: fix bug of series mark static style are not updated when updateSpec


- fix: fix bug data fields are not updated when updateSpec, details in #829


- feat(scrollBar): interactive default config.
- perf: optimize the performance of dimension-statistics


- perf: only calculate dimensionTree when need



## 1.3.1
Tue, 05 Sep 2023 11:24:47 GMT

### Patches

- fix: fix the issue of `seriesIndex` not work in discrete legend, see #732 

### Updates

- feat: `lineHeight` supports string proportional values, related #744
- fix: move \'SeriesMarkNameEnum\' to single file, solve the issue of codesandbox can not work, it looks like an error in the Codesandbox' bundler, see https://github.com/codesandbox/codesandbox-client/issues/6435
- feat: upgrade vdataset for clone source data when call updateData


- fix: fix sortDataByAxis not work after updateData


- fix: fix the issue of legend does not update after updateData, fix #769
- fix: fix the issue of legend's maxHeight not work
- fix: the issue of pie chart with null value, fixed https://github.com/VisActor/VChart/issues/748
- fix: fix the problem that the pie chart draws a full circle when the data is all 0, because the endAngle of the last piece of data is forced to configure the endAngle of polar coordinates

## 1.3.0
Thu, 31 Aug 2023 12:30:59 GMT

### Minor changes

- feat: add `clone` property in `data.parse` to control whether clone the user data
- feat: cartesian axis label support `containerAlign`, relate #380
- feat: tooltip support configure single content line style, related #338
- feat: support total label in stack charts. see #110

### Patches

- feat(invalidType): use the vrender function to realize the break and link of invalidType


- feat: added updateFullData api to allow users to update fields at the same time when updating data, details in #478


- feat: `innerBorder`/`outerBorder` supports the same configuration way as other graphic attributes.
- refactor: access arc label component in pie chart
- feat: add `getRegion()` and `getCenter()` method in _markAttributeContext for `extensionMark`
- feat: new method `pauseAnimation()`, `resumeAnimation()` and `stopAnimation()` which support pausing, resuming and stopping all animation via vchart instance, related #534
- feat: linear axis support `noDecimals` in tick configuration, see #396
- feat: label support dataFilter and custom layout
- feat: new builtin dark theme, related #294
- fix: improve the priority of markByName and mark in theme, related #418
- fix: dimension_hover resets the state when the mouse leaves the chart, related #513
- refactor(area): remove line mark of area-series, merge style into area mark

### Updates

- feat: support label component event in #614
- feat: support configuration of sortDataByAxis for sort series data with axis, details in #644


- feat: new component spec item `noOuterPadding` to hide the outer side of padding, related #663
- fix: dataZoom error when switching theme
- feat: add new property `theme` to vchart init option to configure custom theme without modifying spec, related #689
- feat: add `bandField` and `linearField` as common settings to crosshair's theme, related #698
- feat: enhance dataToPosition in common geo series for #567
- fix: SankeyChart legends not working, fix the bug #345
- feat: geo coordinate component support invert and getScale API
- feat: indicator offsetY support radius
- feat: supplement the callback parameters of discrete legend custom `data` to support obtaining scales, relate #667
- fix: fix the problem that selected clear not work after event filter check for mark


- fix(brush): brush callback not update when updateSpec. fix #672
- fix(brush): highlight was not correct beacasue of same key
- fix(dataZoom): when open roam and set dataZoom invisible, the interaction does not work as expected. fix #611
- feat: optimize the logic of updateSpec to ensure that chart series and components can be updated normally, details in #692


- fix: fix the issue where updateSpec not work when data.id is missing in spec, see #535
- fix: if only `level` is configured in the event filter parameter but `type` is not configured, then as long as the `level` is matched, it will be triggered, relate #623
- refactor: sink the axis label's flush logic to the vrender-component, relate #651
- fix: fix the infinite loop problem caused by arc adjustment, fixed #680
- fix: map label support formatMethod
- fix(marker): add config to control clip mode about marker. fix #181
- fix: fix the issue where bar charts do not stack when percent is set to false, see#557
- fix: fix the problem that the title component clear incompletely.
- perf: dont trigger resize of vgrammar view when initialize chart


- perf: dont create processor and tooltipHandler when create tooltip, create them when use them



## 1.2.3
Thu, 24 Aug 2023 07:23:56 GMT

### Patches

- fix: background will not update when spec or theme updating, related #545
- fix: tooltip shape style incorrect when configure custom key/value, related #336
- fix: when chart size is very small, the size assigned to title may be negative, which needs to be fault-tolerant, otherwise it will easily cause the page to freeze, closed #546
- feat(active): add active point for line & area series to optimization the performance of user interactive



### Updates

- fix: niceDomain should only works for linear scale, fixed #528
- fix: fix the issue of the chart's size is not correctly when updateSpec in lark block env, closed #566
- fix: handle the scenarios of with the same range in continuous legend, fixed #579
- fix: error when configuring `tooltip.parentElement` with a HTMLElement object, related #641
- fix: error when mouse hovering during updateSpec executing
- fix(wordCloud): fix position error of wordCloud chart. fix #521, fix #533
- fix: error when mouse hovering during `updateSpec()` executing.

## 1.2.2
Thu, 17 Aug 2023 02:45:43 GMT

### Patches

- fix: background will not update when spec or theme updating, related #545
- fix: tooltip shape style incorrect when configure custom key/value, related #336
- fix: when chart size is very small, the size assigned to title may be negative, which needs to be fault-tolerant, otherwise it will easily cause the page to freeze, closed #546
- feat(active): add active point for line & area series to optimization the performance of user interactive



## 1.2.1
Tue, 15 Aug 2023 07:25:04 GMT

### Patches

- build: add es5 build product
- feat: the api updateViewBox adds the relayout parameter, which supports not redrawing the chart immediately after updateViewbox, details in #497


- fix(axis-layout): fix the problem that the axis-component cannot take effect after configuring minWidth and maxWidth, details are in #379


- fix(axis-layout): fix the issue of axis move slighty when manual legend filtering, details are in #426


- fix: fix the issue about when axis.label is autoLimit, the chart layout can not work as expect after resize, details in #429


- fix: fix appear animation state fixed #327
- fix: cloneDeep user data, because we should not modify user data
- fix: fix the resize problem in progress chart, fixed #502
- fix: if the size of region is invalid, ignore the wordcloud layout, fixed #506, #410

## 1.2.0
Thu, 10 Aug 2023 05:23:25 GMT

### Minor changes

- feat(logAxis): support axis of type = 'log'. close #392
- feat(vchart): spilt 'finished' event into 'renderFinished' and 'animationEnd' event
- feat: support `barGapInGroup` for bar series and rangeColumn series, used to set the spacing between bars within a group, relate #328
- feat: support \`seriesMark\` for area, line and radar series, which can used to set series main mark, closed #330
- feat: extended data structures supported by sankey chart

### Patches

- feat: support `dataFilter` for axis label and axis tick
- fix: optimize the type definition related to padding on the bandAxis, and it only takes effect on the first layer of scale
- feat: dimension tooltip supports linear axis


- feat: filling full data to map mark data in #420 
- feat(background): support background of chart & series
- feat(onError): support configuration of onerror in chart instance initoption
- feat: supplement sync methods in vchart instance


- feat: support dimension tooltip for time axis, related #437
- feat: add tooltipShow event and tooltipHide event for vchart, related #337
- feat: add attribute dimensionInfo in tooltip handler event params when activeType is mark. related #475
- feat: add a new event type tooltipRelease. related #427
- fix: set the correct return type of `getLegendDataById` and `getLegendDataByIndex`, closed #472
- fix: the non-stack radar area should start from the minimum of radius axis, not o, fix #370
- fix: bar label does not show in the expected position when axis is inversed, fix #378
- fix: fix the issue of the title color configured on the theme does not take effect, fixed #408"
- fix: fix the issue that updateSpec of pie chart causes innerRadius/outerRadius to be incorrect when hovering in #435
- fix: fix the issue of y axis's title can not auto ellipsis, fixed #443, #417
- fix: fix the issue of axis label flush config disable when axis inverse is true, fixed #449
- fix: startAngle and endAngle of polar axis will be reset when executing updateSpec, related #332
- fix: solve the issue that tooltip content is out of bounds in some uncommon case, related #397
- perf(data): add animationThreshold configuration to support automatically close animationa when the amount of data is large
- perf(axis-tick): optimize the calculation times of axis ticks, optimize the discrete axis sampling algorithm


- perf(data): remove redundant data statistics calculations


- perf(stack): use 0 to replace Number.epsilon in stack operation closed #350

### Updates

- feat(logAxis): support axis of type = 'log'. close #392
- feat(logAxis): support axis of type = 'log'. close #392
- feat(logAxis): support axis of type = 'log'. close #392
- feat(logAxis): support axis of type = 'log'. close #392
- feat(marker): marker support formatMethod. fix #288, fix #298
- fix(brush): fix mark can not resume to unselected state when click blank space. fix #307
- fix(brush): fix brush interactive range cannot update when chart is resize. fix #194
- fix(wordCloud): fix wordCloud size error probelm. fix #400, fix #260

## 1.1.3
Thu, 03 Aug 2023 10:32:10 GMT

### Patches

- fix: fix the issue of sankeyChart sourceFiled and targetFiled not working, closed #341
- fix: fix the issue of SankeyChart can't render, when unset nodeAlign, closed #343
- fix: if series.getSeriesField() return undefined, use `DEFAULT_DATA_SERIES_FIELD` to ensure legend data filter, fixed #337"
- fix: fixing the issue where `updateSpec` does not have an effect on map type in #401
- fix: fixing the exception thrown when updating the map updateSpec
- fix: fix bar style could not work in waterfall chart



### Updates

- fix(dataZoom): fix backgroundChart data mapping problem. fix #306 fix #309
- fix(dataZoom): start and end cannot be setted correctly because of judging of data value. fix #334
- fix(wordCloud): word-cloud updateSpec not work as expected. fixed #302

## 1.1.2
Tue, 01 Aug 2023 09:47:58 GMT

### Patches

- feat: geo-coordinate support zoom api
- fix(pie): fix the issue of pie mark's \`key\` value duplication causes drawing error, closed #321
- fix: fix the issue where linearAxis.expand does not work when there are identical data values in #358
- fix: fix the issue of geo source lost
- fix(label): fix the issue that the update of label visible fails to take effect with updateSpec, closed #304
- fix(axis): fix the issue when the min and max of the axes are the same, closed #355

## 1.1.1
Fri, 28 Jul 2023 08:52:08 GMT

### Patches

- feat(logger): support static api `getLogger` in vchart class
- fix(vchart): fix the problem of default logLevel not sync to vgrammar
- fix(map): fix the issue that some map data cannot be drawn
- fix(map): fix the issue of misalignment of the map after interaction with legend
- fix(indicator): add `specKey` for Indicator to fix the issue that the indicator text does not display after the update, close#251
- fix(map): fix the issue that defaultFillColor does not work in map

## 1.1.0
Wed, 26 Jul 2023 03:18:52 GMT

### Minor changes

- support zeroAlign & tick align in two axes
- tooltip supports setting based on mark type and adaptive key
- sync maxLineCount api of 3.x version.
- feat: tooltip supports multiline config

### Patches

- chore: sync version
- chore: remove __DEV__
- fix the issue that mark dimension_hover state causes error when mark visible is false
- add bandwidth attribute to context that in mark function call
- support discrete legend bind scale
- feat: set default logger level to level error


- feat(axis): axis adds `sampling` property, which is used to control whether to enable the axis sampling logic, which is enabled by default
- feat(axis): add anti-overlapping logic for cartesian axis labels
- feat(axis): support \`dataFilter\` property for axis label and tick for data filter
- fix: unified borderRadius to cornerRadius
- fix: not support cornerRadiusXXX anymore, use cornerRadius
- feat: axis's label, tick's state style supports function
- feat: discrete legend's item's style and state style supports function
- feat: add a new api `convertDatumToPosition` for vchart, used for converting data to coordinate position
- feat: add `convertValueToPosition` api for vchart
- feat: modify function parameters to make it more user-friendly


- modify api setDimensionIndex  parameters to make it more user-friendly
- feat(image): support image-mark & add background attribute to fill-mark
- feat: support specified of scale in vchart


- support setDimensionIndex api for vchart
- feat: new config of global unique tooltip
- feat: add 'normal-inline' layoutType
- feat(axis): band type axis support domain property
- feat: add export folder unified export entry
- fix: cartesianAxis and polarAxis are abstract class, should not be imported by users
- refactor: series auto install mark
- refactor: chart auto install series
- feat: add default crosshair config for some cartesian charts
- feat: spec.theme can be a string, which means a registered theme name
- fix the issue that tooltip don't hide when the pointer taps the blank area in mobile mode
- optimize tooltip performance
- feat: optimize tooltip performance
- support unity dimension tooltip of several different series
- optimize tooltip style performance
- fix the default shape config when tooltip pattern has been set to a custom callback
- feat(map): support rewind geojson data
- feat: support poptip for ellipsis text
- feat(vchart): add poptip theme configuration
- fix: remove deprecated maxWidth/minWidth api in tooltip
- fix: pickable shoule be false if label component is configured `interactive: false`


- fix region getSeries bug when option.userId = []
- fix: change mark default stroke color to the series color
- fix discrete legend data sorted by js object attribute order
- fix(global-scale): Correctly update global-scale when updateSpec
- fix: typed chart cannot enable progressive render
- fix: add global-scale updateDomain on chart updateData


- fix(global-scale): add global-scale updateDomain on chart updateData
- fix(data): add miss params of data.parse in chart updateData
- fix barWidth not work in bar chart
- fix: the `type` should be a string
- fix: add isReleased tag for compiler to stop the render after chart's release
- fix(type): add more public methods for IAxis interface
- fix(event): fix the issue that markName filter can not work in event query
- fix(react-vchart): rebind event to chart after chart is re-render, fix #68


- fix: compact the globalThis in non-browser env
- fix: fix the bug in line chart when the xField and yField fields are the same, fixed#108
- fix: the issue that mode value does not exit in trigger config
- fix: delegated events on component models should not participate in bubbling
- feat: delegate the events on marker component
- fix: fix the issue that fieldX2 does not involved in statistics. closed#254
- feat: set default crosshair configuration for radar and rose chart
- fix: fix the bug that linear axis can not show crosshair
- fix: the issue where the legend component is hidden but still affect the layout calculation
- fix: symbol center label not work
- fix(label): pickable shoule be false if label component is configured `interactive: false`
- fix the layoutOffsetX|Y not work in normal items
- fix: line mark has a different easing in update animation causes strange animation effect
- fix: `channel` config not work in animation 
- No longer requires to hold down the Ctrl key for zoom interaction & fix zoomLimit bug
- fix: default tooltip handler needs to adapt to the scale property
- fix(vchart): export IRegionSpec from VChart
- fix(waterfall-position): fix the mistake of compute totalPosition in waterfall-series 
- fix: compact window variable for non-browser env
- fix: compact window variable for non-browser env

### Updates

- feat(marker): markline support autoRange and marker performance enhance
- feat(brush): add operate type about 'brushStart' | 'brushEnd' and export element data of inBrush and outOfBrush
- feat(marker): support interactive
- fix(component): upgrade some spec
- fix(dataZoom): fix bug of datazoom not clear when updateSpec and mark disappear when xField is array
- fix(dataZoom): preview compute and theme config
- fix(wordCloud): angle config not effect
- fix(wordCloud): text clip when layoutmode is fast
- fix(wordCloud): get padding from chartInstance padding

## 1.0.0
Tue, 20 Jun 2023 11:35:37 GMT

### Breaking changes

- chore: release major version

### Patches

- fix the bug of 3d pie label link
- fix the bug of 3d scatter in common chart
- fix the bug of z axis in layout stage
- when set legends's `visible` to false, the legend component should still needs to be instantiated, just not to create vrender components
- if layout model is hidden, igonre the size setting
- wordCloud text should not set default fontSize
- if legend'shape has same value of stroke and fill, then skip stroke
- Change `renderAsync()` to `renderSync()` in `compiler.reRenderAsync()`

### Updates

- reconfig dataZoom color theme
- refactor(marker): optimize performance
- release 0.0.1-alpha.0

