# v2.1.0

2026-06-23

**🆕 New Features**

- **@visactor/vchart**: markLine expandDistancesupport callback. close#4568
- **@visactor/vchart**: support function type for `maxRow` / `maxCol` of the discrete legend, evaluated during layout against the legend's allocated rect, so the row / column count can adapt to the available space

**🐛 Bug Fixes**

- **@visactor/vchart**: waterfall lead line bug. fix#4580
- **@visactor/vchart**: preserve discrete legend filtering after updateSpec when `legends.data` is a callback (Issue #4566)
- **@visactor/vchart**: re-nice the cartesian linear axis with the real plot-area length after layout when `tick.tickCount` is a function, so the length-based tick count and nice ceiling match the final plot area instead of the pre-layout chart viewRect
- **@visactor/vchart**: vchart relayout api not work bug. fix#4537
- **@visactor/vchart**: label not follow when drag. fix#4547
- **@visactor/vchart**: prcoess render error. fix#4578

**🔨 Chores**

- **@visactor/vchart**: update changes for 009-fix-map-roam-pointer-drag: This plan fixes a map roam drag bug where mobile browsers lose stable vertical dragging after supportsTouchEvents is forced to false
- **@visactor/vchart**: introduce scoped updateSpec effects to make chart, component, series, data, layout, render, and animation update ranges explicit; local component updates such as marker exit, title text, legend appearance, axis appearance, mark style, field, label, animation, and layout-related series changes now avoid unnecessary chart remake/recompile paths when the existing chart model can be updated in place
- **@visactor/vchart**: align VChart with the VRender 1.1.0 app-scoped runtime, state resolver, and animation contracts while keeping standard VChart spec usage compatible; consolidate mark shared-state handling, glyph sub-graphic state isolation, word-cloud scaleIn initialization, and interaction-state behavior for Sankey, brush, legend textures, marker rich text, and circular progress tick masks

**Full Changelog**: https://github.com/VisActor/VChart/compare/v2.0.20...v2.1.0

[more detail about v2.1.0](https://github.com/VisActor/VChart/releases/tag/v2.1.0)
