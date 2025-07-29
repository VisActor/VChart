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
