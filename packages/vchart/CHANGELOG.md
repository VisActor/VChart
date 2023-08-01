# Change Log - @visactor/vchart

This log was last generated on Tue, 01 Aug 2023 09:47:58 GMT and should not be manually modified.

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

