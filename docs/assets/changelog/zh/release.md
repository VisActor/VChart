# v2.0.7

2025-11-03

🆕 New Features

@visactor/vchart: Support resize zoom chart plugin by @xuefei1313 in https://github.com/VisActor/VChart/pull/4241
@visactor/vchart: Register transform boxplot by @xile611 in https://github.com/VisActor/VChart/pull/4268
@visactor/vchart: Add translate-issues workflow configuration by @xuefei1313 in https://github.com/VisActor/VChart/pull/4264
@visactor/vchart: Add regression-lines in vchart-extension by @xile611 in https://github.com/VisActor/VChart/pull/4245
@visactor/vchart: Change vrender dependencies, see https://github.com/VisActor/VChart/pull/4224

🐛 Bug Fixes

@visactor/vchart: Fix crosshair not hide by @xile611 in https://github.com/VisActor/VChart/pull/4252
@visactor/vchart: Fix issue of layout by @xuefei1313 in https://github.com/VisActor/VChart/pull/4249
@visactor/vchart: Fix logistic regression line by @xile611 in https://github.com/VisActor/VChart/pull/4263
@visactor/vchart: Fix support regression line for grouped scatter by @xile611 in https://github.com/VisActor/VChart/pull/4248
@visactor/vchart: Fix check if stackData is empty by @kkxxkk2019 in https://github.com/VisActor/VChart/pull/4244
@visactor/vchart: Fix issue of waterfall stack total by @xuefei1313 in https://github.com/VisActor/VChart/pull/4243





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

