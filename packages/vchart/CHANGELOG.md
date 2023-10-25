# Change Log - @visactor/vchart

This log was last generated on Wed, 25 Oct 2023 06:08:07 GMT and should not be manually modified.

## 1.2.4
Wed, 25 Oct 2023 06:08:07 GMT

_Version update only_

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

