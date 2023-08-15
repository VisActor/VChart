# Change Log - @visactor/lark-vchart

This log was last generated on Thu, 10 Aug 2023 05:23:25 GMT and should not be manually modified.

## 1.2.0
Thu, 10 Aug 2023 05:23:25 GMT

### Minor changes

- feat: supplement sync methods in vchart instance



### Patches

- feat: dimension tooltip supports linear axis


- perf(axis-tick): optimize the calculation times of axis ticks, optimize the discrete axis sampling algorithm


- perf(data): remove redundant data statistics calculations



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

### Patches

- chore: sync version
- feat: set default logger level to level error


- feat: modify function parameters to make it more user-friendly


- feat: support specified of scale in vchart


- feat(lark): support mouse event for lark
- fix: pickable shoule be false if label component is configured `interactive: false`


- fix(rangeColumn): The "label.visible" is not effect in RangeColumn Chart
- fix: add global-scale updateDomain on chart updateData


- fix: fix the freecanvasId for block-vchart lark-vchart and taro-vchart
- fix(react-vchart): rebind event to chart after chart is re-render, fix #68


- fix(mini-program): Ensure that dpr is updated in real time and release old charts in time
- fix: the issue that mode value does not exit in trigger config

