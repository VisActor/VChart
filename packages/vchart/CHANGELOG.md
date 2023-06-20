# Change Log - @visactor/vchart

This log was last generated on Tue, 20 Jun 2023 11:35:37 GMT and should not be manually modified.

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

