# v2.1.0

2026-06-23

**🆕 新增功能**

- **@visactor/vchart**: markLine expandDistancesupport callback. close#4568
- **@visactor/vchart**: 支持 function type for `maxRow` / `maxCol` of the discrete 图例, evaluated during layout against the 图例's allocated rect, so the row / column count can adapt the available space

**🐛 问题修复**

- **@visactor/vchart**: waterfall lead line 问题. fix#4580
- **@visactor/vchart**: preserve discrete 图例 filtering after updateSpec when `legends.data` is a callback （问题 #4566）
- **@visactor/vchart**: re-nice the cartesian 线性坐标轴 with the real plot-area length after layout when `tick.tickCount` is a function, so the length-based tick count and nice ceiling match the final plot area instead of the pre-layout chart viewRect
- **@visactor/vchart**: vchart relayout api not work 问题. fix#4537
- **@visactor/vchart**: label not follow when drag. fix#4547
- **@visactor/vchart**: prcoess render error. fix#4578

**🔨 维护与杂项**

- **@visactor/vchart**: 更新 changes for 009-fix-map-roam-pointer-drag: This plan fixes a map roam drag 问题 where mobile browsers lose stable vertical dragging after supportsTouchEvents is forced false
- **@visactor/vchart**: introduce scoped updateSpec effects make chart, component, series, data, layout, render, and animation update ranges explicit; local component updates such as marker exit, title text, 图例 appearance, axis appearance, mark style, field, label, animation, and layout-related series changes now avoid unnecessary chart remake/recompile paths when the existing chart model can be updated in place
- **@visactor/vchart**: align VChart with the VRender 1.1.0 app-scoped runtime, state resolver, and animation contracts while keeping standard VChart spec usage compatible; consolidate mark shared-state handling, glyph sub-graphic state isolation, word-cloud scaleIn initialization, and interaction-state behavior for Sankey, brush, 图例 textures, marker rich text, and circular progress tick masks

**Full Changelog**: https://github.com/VisActor/VChart/compare/v2.0.20...v2.1.0

[更多详情请查看 v2.1.0](https://github.com/VisActor/VChart/releases/tag/v2.1.0)
