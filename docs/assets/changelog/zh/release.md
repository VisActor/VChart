# v2.0.9

2025-11-18


**🆕 New Features**


* @visactor/react-vchart: Add export for registerChartResizeZoomPlugin by @xuefei1313 in https://github.com/VisActor/VChart/pull/4286
* @visactor/vchart: Support effect animation by @purpose233 in https://github.com/VisActor/VChart/pull/4299
* @visactor/vchart: Enhance datazoom and fix bugs by @skie1997 in https://github.com/VisActor/VChart/pull/4065


**🐛 Bug Fixes**


* @visactor/vchart-extension: Fix the vchart-extension packaged artifacts contained an extra version by @xuefei1313 in https://github.com/VisActor/VChart/pull/4277
* @visactor/vchart: Fix markline auto range by @xuefei1313 in https://github.com/VisActor/VChart/pull/4290


**📖 Documentation**


* @visactor/vchart: Fix registerMorph error in example by @xuefei1313 in https://github.com/VisActor/VChart/pull/4285
* @visactor/vchart: Add candlestick demo by @xuefei1313 in https://github.com/VisActor/VChart/pull/4297

**Full Changelog**: https://github.com/VisActor/VChart/compare/v2.0.7...v2.0.9

[更多详情请查看 v2.0.9](https://github.com/VisActor/VChart/releases/tag/v2.0.9)

# v2.0.7

2025-11-03

**🆕 新增功能**

* **@visactor/vchart**：支持 resize zoom 图表插件，关联 [#4241](https://github.com/VisActor/VChart/pull/4241)
* **@visactor/vchart**：注册 boxplot transform，关联 [#4268](https://github.com/VisActor/VChart/pull/4268)
* **@visactor/vchart**：新增 translate-issues 工作流配置，关联 [#4264](https://github.com/VisActor/VChart/pull/4264)
* **@visactor/vchart**：在 vchart-extension 中新增回归线 (regression-lines)，关联 [#4245](https://github.com/VisActor/VChart/pull/4245)
* **@visactor/vchart**：变更 vrender 依赖项，关联 [#4224](https://github.com/VisActor/VChart/pull/4224)

**🐛 功能修复**

* **@visactor/vchart**：修复十字准星 (crosshair) 未隐藏的问题，修复 [#4252](https://github.com/VisActor/VChart/pull/4252)
* **@visactor/vchart**：修复布局 (layout) 的问题，修复 [#4249](https://github.com/VisActor/VChart/pull/4249)
* **@visactor/vchart**：修复逻辑回归线 (logistic regression line) 的问题，修复 [#4263](https://github.com/VisActor/VChart/pull/4263)
* **@visactor/vchart**：修复分组散点图 (grouped scatter) 的回归线支持问题，修复 [#4248](https://github.com/VisActor/VChart/pull/4248)
* **@visactor/vchart**：修复堆叠数据 (stackData) 为空时的检查问题，修复 [#4244](https://github.com/VisActor/VChart/pull/4244)
* **@visactor/vchart**：修复瀑布图堆叠总计 (waterfall stack total) 的问题，修复 [#4243](https://github.com/VisActor/VChart/pull/4243)

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


