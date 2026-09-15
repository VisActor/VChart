# DataZoom 预览回归最小修复计划与验证记录

## 目标与范围

消除分类 X 轴、数值 Y 轴图表中竖向 DataZoom 的多余预览线，同时保留 #4186 的数据更新修复。

- 运行时代码只恢复 `_createOrUpdateComponent` 的比例尺有效性检查，复用 `_isScaleValid`。
- 保留 `_handleDataCollectionChange` 中的 `_initAfterLayout()`，使更新后使用新的 domain/range。
- 使用纯 VChart 代码验证 #4186；保留原 spec、数据、更新顺序和包装层转发的动画参数，无需 React 环境。
- 不修改依赖、公共 API、数据统计或 VRender 绘制逻辑。

## 根因

[原 case](https://bugserver.cn.goofy.app/case?product=chartspace4&fileid=6503dac997ee1ad37a86235a) 的竖向预览 value domain 为 `[0, 0]`，所有点落在滑轨中间。

[提交 2533b828e](https://github.com/VisActor/VChart/commit/2533b828e8b086db006b3c1ebbb6a88b4dcc9903) 为解决 [#4186](https://github.com/VisActor/VChart/issues/4186) 增加了 domain 刷新，但同时删除 `_isScaleValid(xScale) && _isScaleValid(yScale)`，使退化预览也被绘制。[#4527](https://github.com/VisActor/VChart/pull/4527) 未新增对应测试。

## 执行清单

- [x] 在修改运行时代码前，建立 #4186 历史故障构建失败、修复构建通过的对照。
- [x] 添加组件测试，确认恢复判断前的三个用例均在“预览应隐藏”的断言失败。
- [x] 恢复原有预览条件，保留 domain 刷新。
- [x] 添加 #4186 的动画中断回归测试，检查实际场景树。
- [x] 完成定向 Jest、ESLint、TypeScript 和两类浏览器验收。
- [x] 添加 patch 变更记录并检查最终差异。

## #4186 历史对照

固定初始单条 `华北区 / 其他自然线索量 / 333`，更新为原 issue 的六个地区、六组系列及零值记录。测试 fixture 保存在 `packages/vchart/__tests__/unit/animation/manual-ticker.test.ts`。

1. 渲染初始图表，用 ManualTicker 推进至 2000ms。
2. 调用 `updateSpecSync(spec, undefined, { morph: false, enableExitAnimation: false })`。
3. 每隔 20ms 依次设置范围 `[0, 0.7]`、`[0.2, 0.8]`、`[0.3, 0.9]`、`[0.1, 0.7]`。
4. 每次通过 DataZoom 的 `setStartAndEnd` 更新后调用 `chart.renderSync()`，确保同步测试实际执行过滤后的渲染。
5. 动画结束后，遍历整个场景树，将柱图元的数据、数量和几何位置与静态参考图比较。
6. 恢复 `[0, 1]`，再次比较。部分范围应有 30 个柱图元，完整范围应有 36 个。

| VChart 构建 | VRender core/components/animate | 部分范围 | 恢复完整范围 |
| --- | --- | --- | --- |
| `784a405c34265a77f49dd987bc73cc3cdfa0aec1`，即 `2533b828e^` | `1.0.41` | 失败：6 / 预期 30 | 失败：6 / 预期 36 |
| `f49734a6e`，#4527 合入后 | `1.0.44` | 通过：30，数据和几何一致 | 通过：36，数据和几何一致 |
| `6feedc40a` 加本次修复 | `1.1.8` | 通过：30，数据和几何一致 | 通过：36，数据和几何一致 |

两个历史构建各自使用对应提交锁文件中的生产依赖闭包和原始 integrity，通过 `pnpm install --frozen-lockfile --ignore-scripts` 安装；未使用当前依赖替代历史依赖。

历史失败时 DataZoom 的 state domain 仍只有 `华北区`，缩放后错误地只保留这个地区；合入 #4527 后及本次修复后均包含六个地区。截图也确认旧构建只剩单个地区，修复后的图表恢复正常。

早期候选测试仅调用缩放、未执行同步渲染，不能有效验证最终图元；已修正。最终测试锁定错误过滤和最终场景树差异，不将未观察到的其他动画问题归因于本次修复。

## 测试覆盖与检查结果

新增组件测试覆盖：

- 竖向退化预览隐藏，横向正常预览保持可见。
- `updateSpecSync` 和 `updateDataSync` 从单条数据更新为多条后，预览恢复且坐标有限。
- 更新后可缩放过滤，并可恢复完整数据范围。

在 `packages/vchart` 执行，均通过：

```sh
./node_modules/.bin/jest __tests__/unit/component/data-zoom __tests__/unit/core/update-effects.test.ts __tests__/unit/animation/manual-ticker.test.ts --runInBand
./node_modules/.bin/eslint src/component/data-zoom/data-zoom/data-zoom.ts __tests__/unit/component/data-zoom/data-zoom.test.ts __tests__/unit/animation/manual-ticker.test.ts --quiet
./node_modules/.bin/tsc --noEmit --project tsconfig.json
```

Jest 共 **4 个测试套件、145 个测试通过**。`git diff --check` 通过。提交钩子的 ESLint、Prettier 和 commitlint 均通过。Prettier 同时统一了源文件原有的三处格式差异（嵌套三元表达式缩进及括号），不改变行为。原 bugserver case 的浏览器对照确认：Y 轴 DataZoom 的额外预览线消失，底部预览保持一致。#4186 的同一历史验证页面加载本次修复后，部分范围和完整范围均通过。

## 交付文件

- `packages/vchart/src/component/data-zoom/data-zoom/data-zoom.ts`：恢复预览条件。
- `packages/vchart/__tests__/unit/component/data-zoom/data-zoom.test.ts`：静态和更新回归。
- `packages/vchart/__tests__/unit/animation/manual-ticker.test.ts`：#4186 场景树回归。
- `common/changes/@visactor/vchart/fix-datazoom-degenerate-preview_2026-09-15.json`：中文 patch 说明。

提交信息：`fix(datazoom): skip previews with degenerate scales`。
