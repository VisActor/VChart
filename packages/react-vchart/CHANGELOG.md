# Change Log - @visactor/react-vchart

This log was last generated on Thu, 03 Aug 2023 10:32:10 GMT and should not be manually modified.

## 1.1.3
Thu, 03 Aug 2023 10:32:10 GMT

### Patches

- fix: fix the issue of sankeyChart sourceFiled and targetFiled not working, closed #341
- fix: fix the issue of SankeyChart can't render, when unset nodeAlign, closed #343

## 1.1.2
Tue, 01 Aug 2023 09:47:58 GMT

_Version update only_

## 1.1.1
Fri, 28 Jul 2023 08:52:08 GMT

_Version update only_

## 1.1.0
Wed, 26 Jul 2023 03:18:52 GMT

### Minor changes

- feat: optimize tooltip performance

### Patches

- chore: sync version
- add bandwidth attribute to context that in mark function call
- support zeroAlign & tick align in two axes
- support discrete legend bind scale
- feat: set default logger level to level error


- feat: modify function parameters to make it more user-friendly


- feat: support specified of scale in vchart


- fix: pickable shoule be false if label component is configured `interactive: false`


- fix region getSeries bug when option.userId = []
- fix: add global-scale updateDomain on chart updateData


- fix barWidth not work in bar chart
- fix(react-vchart): rebind event to chart after chart is re-render, fix #68


- fix: the issue that mode value does not exit in trigger config
- fix(react-vchart): fix type of event handlers, series, charts and components
-     feat: add customized events of <Brush/> and other components

## 1.0.0
Tue, 20 Jun 2023 11:35:37 GMT

### Breaking changes

- chore: release major version

