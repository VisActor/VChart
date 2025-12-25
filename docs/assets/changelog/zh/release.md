# v2.0.12

2025-12-25

**🆕 新增功能**

- **@visactor/vchart**: 极坐标轴（CircleAxis）支持 `autoLabelMaxWidth` 配置 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4357
- **@visactor/vchart**: 新增图表消失（Disappear）状态支持 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4341
- **@visactor/vchart**: 优化热力图（Heatmap）形状渲染逻辑 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4377
- **@visactor/vchart**: 优化地图（Map）zoom交互，增加 `zoomRate` 配置 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4373

**🐛 问题修复**

- **@visactor/vchart**: 修复坐标轴标题（Axes Title）的布局问题 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4371

**Full Changelog**: https://github.com/VisActor/VChart/compare/v2.0.11...v2.0.12

[更多详情请查看 v2.0.12](https://github.com/VisActor/VChart/releases/tag/v2.0.12)

# v2.0.11

2025-12-11

**🆕 新增功能**

- **@visactor/vchart**: 在 `initOption` 中支持 `componentShowContent` 配置 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4334
- **@visactor/vchart**: 增强箱形图（Boxplot）标签功能 by @xile611 in https://github.com/VisActor/VChart/pull/4346
- **@visactor/vchart**: 导出数据常量定义 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4339

**🐛 问题修复**

- **@visactor/vchart**: 修复存在内部偏移（inner offset）时的十字准星（crosshair）显示问题 by @xile611 in https://github.com/VisActor/VChart/pull/4340
- **@visactor/vchart**: 修复十字准星在特定内部偏移下的定位逻辑 (fix #4338) by @xile611 in https://github.com/VisActor/VChart/pull/4343
- **@visactor/vchart**: 修复箱形图异常值的颜色显示问题 by @xile611 in https://github.com/VisActor/VChart/pull/4347
- **@visactor/vchart**: 修复箱形图异常值的样式问题 by @xile611 in https://github.com/VisActor/VChart/pull/4350

**Full Changelog**: https://github.com/VisActor/VChart/compare/v2.0.10...v2.0.11

[more detail about v2.0.11](https://github.com/VisActor/VChart/releases/tag/v2.0.11)

# v2.0.10

2025-11-28

**🆕 新特性**

- **@visactor/vchart**: 箱型图 (Boxplot) 功能增强 by @xile611 in https://github.com/VisActor/VChart/pull/4323

**🐛 问题修复**

- **@visactor/vchart**: 升级 vrender 依赖以修复玫瑰图 (Rose Chart) 的问题 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4315
- **@visactor/vchart**: 升级 vrender 依赖以修复动画相关问题 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4325
- **@visactor/vchart**: 修复扩展标记 (Extension Mark) 的更新逻辑 by @xile611 in https://github.com/VisActor/VChart/pull/4318
- **@visactor/vchart**: 修复字体系列 (Font Family) 设置的问题 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4324
- **@visactor/vchart**: 修复 setDimensionIndex 方法的问题 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4291

**📖 文档更新**

- **@visactor/vchart**: 新增 K 线图 (Candlestick) 开发指南 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4310
- **@visactor/vchart**: 新增主题 (Theme) 开发指南 by @xuanhun in https://github.com/VisActor/VChart/pull/4322
- **@visactor/vchart**: 新增地图卷绕 (Map Rewind) 指南 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4326
- **@visactor/vchart**: 在指南中补充 3D 注册相关内容 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4312
- **@visactor/vchart**: 修正通用图表配置 labelLayout 的文档说明 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4316

[更多详情请查看 v2.0.10](https://github.com/VisActor/VChart/releases/tag/v2.0.10)

# v2.0.9

2025-11-18

**🆕 新特性**

- **@visactor/react-vchart**: 新增 registerChartResizeZoomPlugin 导出 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4286
- **@visactor/vchart**: 支持特效动画 by @purpose233 in https://github.com/VisActor/VChart/pull/4299
- **@visactor/vchart**: 增强 DataZoom 组件功能并修复相关问题 by @skie1997 in https://github.com/VisActor/VChart/pull/4065

**🐛 问题修复**

- **@visactor/vchart-extension**: 修复 vchart-extension 打包产物中包含额外版本的问题 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4277
- **@visactor/vchart**: 修复标线 (MarkLine) 自动范围计算的问题 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4290

**📖 文档更新**

- **@visactor/vchart**: 修复示例中 registerMorph 的错误 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4285
- **@visactor/vchart**: 新增 K 线图 (Candlestick) 示例 by @xuefei1313 in https://github.com/VisActor/VChart/pull/4297

[更多详情请查看 v2.0.9](https://github.com/VisActor/VChart/releases/tag/v2.0.9)

# v2.0.7

2025-11-03

**🆕 新增功能**

- **@visactor/vchart**：支持 resize zoom 图表插件，关联 [#4241](https://github.com/VisActor/VChart/pull/4241)
- **@visactor/vchart**：注册 boxplot transform，关联 [#4268](https://github.com/VisActor/VChart/pull/4268)
- **@visactor/vchart**：新增 translate-issues 工作流配置，关联 [#4264](https://github.com/VisActor/VChart/pull/4264)
- **@visactor/vchart**：在 vchart-extension 中新增回归线 (regression-lines)，关联 [#4245](https://github.com/VisActor/VChart/pull/4245)
- **@visactor/vchart**：变更 vrender 依赖项，关联 [#4224](https://github.com/VisActor/VChart/pull/4224)

**🐛 功能修复**

- **@visactor/vchart**：修复十字准星 (crosshair) 未隐藏的问题，修复 [#4252](https://github.com/VisActor/VChart/pull/4252)
- **@visactor/vchart**：修复布局 (layout) 的问题，修复 [#4249](https://github.com/VisActor/VChart/pull/4249)
- **@visactor/vchart**：修复逻辑回归线 (logistic regression line) 的问题，修复 [#4263](https://github.com/VisActor/VChart/pull/4263)
- **@visactor/vchart**：修复分组散点图 (grouped scatter) 的回归线支持问题，修复 [#4248](https://github.com/VisActor/VChart/pull/4248)
- **@visactor/vchart**：修复堆叠数据 (stackData) 为空时的检查问题，修复 [#4244](https://github.com/VisActor/VChart/pull/4244)
- **@visactor/vchart**：修复瀑布图堆叠总计 (waterfall stack total) 的问题，修复 [#4243](https://github.com/VisActor/VChart/pull/4243)

[更多详情请查看 v2.0.7](https://github.com/VisActor/VChart/releases/tag/v2.0.7)

# v2.0.6

2025-10-14

**🆕 新增功能**

- **@visactor/vchart**：`formatter` 新增计算功能，关联 [#4211](https://github.com/VisActor/VChart/pull/4211)
- **@visactor/vchart**：更新缺陷报告方法，关联 [#4221](https://github.com/VisActor/VChart/pull/4221)
- **@visactor/vchart**：升级 `vrender` 版本以修复动画问题，关联 [#4222](https://github.com/VisActor/VChart/pull/4222)
- **@visactor/vchart**：瀑布图新增 `waterfallType` 配置，关联 [#4220](https://github.com/VisActor/VChart/pull/4220)
- **@visactor/vchart**：变更 `vrender` 依赖项，关联 [#4224](https://github.com/VisActor/VChart/pull/4224)

**🐛 功能修复**

- **@visactor/vchart**：修复图例翻页器的问题，修复 [#4212](https://github.com/VisActor/VChart/pull/4212)
- **@visactor/vchart**：修复当系列没有数据时 `markline` 的报错问题，修复 [#4216](https://github.com/VisActor/VChart/pull/4216)

[更多详情请查看 v2.0.6](https://github.com/VisActor/VChart/releases/tag/v2.0.6)

# v2.0.5

2025-09-19

[更多详情请查看 v2.0.5](https://github.com/VisActor/VChart/releases/tag/v2.0.5)

# v2.0.2

2025-07-28

**🆕 新增功能**

- **@visactor/vchart**: add the afterClearRect hook of render

**Full Changelog**: https://github.com/VisActor/VChart/compare/v2.0.1...v2.0.2

[更多详情请查看 v2.0.2](https://github.com/VisActor/VChart/releases/tag/v2.0.2)

# v2.0.1

2025-07-24

**🆕 新增功能**

- **@visactor/vchart**：新增配置项以避免 `brush` 状态更新，关闭 [#4035](https://github.com/VisActor/VChart/issues/4035)
- **@visactor/vchart**：优化 `datazoom` 动画效果
- **@visactor/vchart**：新增 vrender 的 `afterClearScreen` 钩子

**🐛 功能修复**

- **@visactor/vchart**：修复 3D 图表网格问题
- **@visactor/vchart**：当 `sampling` 变更时，轴的 `tickData` 应同步更新，修复 [#4059](https://github.com/VisActor/VChart/issues/4059)
- **@visactor/vchart**：仅在需要时计算多层 `label` 项，修复 [#4056](https://github.com/VisActor/VChart/issues/4056)
- **@visactor/vchart**：修复 `remake` 时的 `resize` 错误及动画归一化 bug，修复 [#4070](https://github.com/VisActor/VChart/issues/4070)
- **@visactor/vchart**：修复飞书 block 相关问题，并在创建 vchart 时调用 setenv
- **@visactor/vchart**：修复 tooltip triggerOff 与 tooltip lock 的 bug
- **@visactor/vchart**：修复 `tooltip` 处理器为 `undefined` 时抛出异常的问题，修复 [#4044](https://github.com/VisActor/VChart/issues/4044)
- **@visactor/vchart**：修复 `tooltip.style.titleLabel` 的 `textAlign` 不生效问题，修复 [#4043](https://github.com/VisActor/VChart/issues/4043)

[更多详情请查看 v2.0.1](https://github.com/VisActor/VChart/releases/tag/v2.0.1)

