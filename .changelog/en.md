# v2.0.20

2026-03-26

**🐛 Bug Fixes**

- **@visactor/vchart**: fix theme config of spec and option
- **@visactor/vchart**: datazoom update domain after data change. fix#4186

**🔨 Chores**

- **@visactor/vchart**: update changes for 008-fix-size-legend-handler-text: Allow size legend handlerText.style to accept function-based values in the same way other legend style hooks already do, and add regression coverage proving the style callback is preserved through continuous legend attribute transformation.
- **@visactor/vchart**: update changes for 009-fix-heatmap-scrollbar-axis-direction: Align ScrollBar with DataZoom by using the shared reverse-axis detection when converting scrollbar state percentages back into domain values.
- **@visactor/vchart**: update changes for 009-fix-issue-of-mark-state-when-updateSpec: Fix an issue where mark states were not properly cleared when updateSpec was called, causing incorrect state persistence.
- **@visactor/vchart**: update changes for 010-hide-empty-axes: Add an opt-in hideWhenEmpty axis option for cartesian axes.
- **@visactor/vchart**: update changes for 009-fix-issue-of-mark-state-when-updateSpec: Fix an issue where mark states were not properly cleared when updateSpec was called, causing incorrect state persistence.
- **@visactor/vchart**: upgrade vutils, vdataset, vscale, vlayouts to ~1.0.23

**Full Changelog**: https://github.com/VisActor/VChart/compare/v2.0.19...v2.0.20

[more detail about v2.0.20](https://github.com/VisActor/VChart/releases/tag/v2.0.20)
