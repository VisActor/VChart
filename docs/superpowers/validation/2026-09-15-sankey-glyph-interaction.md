# 桑基图 Glyph 交互修复验收

## 结果与接入条件

原始完整 case 的点击比例高亮、hover 描边、连续切换和取消恢复已通过真实鼠标验证。VRender 与 VChart 都需要修复；只更新 VRender 仍不会重新编码前景/背景路径。

**正式接入尚待 VRender 修复包发布。VChart 不能单独合入后继续使用锁定的 1.1.8。** 本轮不发布包，也未把本地 tarball 地址提交到 Rush 配置。发布后须将五个 VRender 依赖的最低版本及锁文件更新到包含修复的实际版本，再进行安装验证。

- 分支：两仓库均为 `codex/fix-sankey-glyph-state`。
- 执行基线：VChart `702ecbb49`、VRender `69d82c11b`；实际旧包为 1.1.8。
- VRender 提交：`c828aff84`（统一状态解析）、`775a4a4d6`（派生同步和动画中断）、`880cc3c8d`（子图形 paint 分类）。
- 联调产物：从 `880cc3c8d` 构建的五个本地 1.1.9 tarball；**此版本号仅表示本地源码版本，不表示发布包已包含修复。**
- VChart 与五个包解析出的 core realpath 完全相同。校验和、版本、路径及逐次性能数据见 [原始验收数据](sankey-glyph-results-20260915.json)。
- 原 case：[64ed94bed4858ce3fbd85afa](https://bugserver.cn.goofy.app/case?product=chartspace4&fileid=64ed94bed4858ce3fbd85afa)。

## 根因与修改

1. Glyph 旧状态实现绕过统一静态真值和恢复流程。保留旧公开输入与排序语义，适配到现有状态引擎。
2. VChart 在属性提交前编码，状态/动画提交没有完整经过该路径。改为在最终属性提交后编码；context 就绪后初始化，静默写入仍同步必要几何。
3. 子图形属性对象在状态切换时会替换。维护宿主继承绑定，并按输出来源撤销 own keys，恢复当前较低优先级贡献。
4. runtime ratio 进入 Group 共享 resolver，按实际 graphic 读取。同状态刷新只提交一次。
5. 中断状态动画时，不再隐式执行公开 `stop('end')` 的静态终值提交，避免污染 base；显式 stop API 保持原语义。

## 功能验证

| 检查 | 结果 |
| --- | --- |
| 修复前 core 回归 | 4 项失败，涉及新增键删除、动态刷新、顺序及标准 Group 输入 |
| 旧依赖原 case | ratio 改变但前景仍全宽、背景为空；清空后 ratio/backgroundStyle 与 1 条 hover 描边残留 |
| 只修 VRender | ratio 正确，但实际前景仍全宽、背景为空 |
| 完整修复，水平 A → B | 前景两端均为 18px → 123px，背景全宽 142px，符合 15/115 → 100/115 的取整结果 |
| 完整修复，纵向 A → B | 前景两端均为 34px → 228px，背景全宽 262px |
| 点击空白 | 所有链接状态清空、描边残留为 0，ratio/backgroundStyle 消失、前景全宽、背景为空 |
| 节点 hover / 移出 | A 填充 red → 原始 #1664FF |
| hover 触发关联 / 移出 | 比例正确，并恢复全宽 |
| adjacency | 当前链接 selected，其余链接按配置 blur |

浏览器结构输出保存在验收数据中；截图已在本次任务中展示。最终浏览器构建标识为 `glyph-fix-880cc3c8d`。没有修改或保存远端 case。

## 自动检查

- VRender core：28 suites / **188 tests 通过**。
- VRender animate：**46 tests 通过**，包含真实 ManualTicker 的 Glyph 中间帧、取消及中断恢复。
- VRender 公开状态入口：**9 tests 通过**。
- VChart：5 suites / **20 tests 通过**；包括两个方向的实际路径端点、0/1、不同 Glyph 的 ratio、同状态刷新、输出键撤销、boxPlot/ripple/liquid、data/spec 更新、图元复用及渐进创建。
- core / animate / vrender / vchart 的 `tsc --noEmit` 通过。
- `rush build -t @visactor/vrender` 通过；VChart 浏览器 bundle 构建通过。
- 改动源码 ESLint 无 error（有 124 条 warning，主要是 any 类型及重复 import），Prettier 和两仓库 `git diff --check` 通过。

命令和测试入口沿用 [执行计划](../plans/2026-09-15-sankey-glyph-interaction.md#task-5跨仓库接入原-case-与性能验收)。本轮没有修改 React 绑定；未扩展 React 测试矩阵。

## 性能与成本

同一台机器、同一浏览器 Chromium 152、本地非压缩构建；预热 2 次、记录 7 次。每个 Glyph 使用独立属性对象，10k Glyph 对应 20k 子路径。统计仅在基准中包装方法，没有加入生产代码。表中为毫秒，中位数 [最小–最大]。

### 10k Glyph

| 操作 | 旧 VChart + VRender 1.1.8 | 完整修复 |
| --- | --- | --- |
| 创建 | 43.0 [42.0–46.0] | 40.0 [39.2–54.9] |
| 全量几何更新 | 17.9 [15.2–19.5] | 24.5 [19.7–31.5] |
| 基础颜色更新 | 13.6 [13.3–14.5] | 10.3 [9.3–12.8] |
| 首次 hover | 16.4 [14.2–18.0] | 22.0 [20.4–24.9] |
| 重复 hover | 14.0 [13.0–15.2] | 22.4 [19.6–24.2] |
| 重复 hover 清空 | 13.5 [12.8–14.8] | 17.1 [15.1–18.5] |
| 同状态 ratio 改变 | 25.4 [24.6–26.2] | 49.3 [45.2–56.2] |
| 相同 ratio 刷新 | 24.1 [23.3–24.6] | 10.8 [10.7–12.9] |
| 释放 | 1.0 [0.6–1.3] | 10.4 [8.2–11.2] |

固定 10k 图元的完整状态扫描有明确额外成本，不能宣称所有路径都变快：

- 几何更新约增加 6.6ms。新路径维护来源输出键、撤销与属性分类，实际子图形写入由 20k 降为 10k；这项属性维护成本仍存在。已避免处理不变输出和为未变化子路径分配 patch。
- hover 通过统一状态引擎及静态真值提交；重复 hover 仍比旧实现慢。旧实现的清空会留下样式，因此旧流程不能作为等价正确行为的性能目标。
- ratio 改变现在真正计算并写入 10k 条前景路径；旧流程没有执行这些必要工作，不应把两者耗时直接当作性能回退比例。
- release 现在同时释放 20k 子图形、解绑原型与编码器；旧 Glyph release 没有完成同等清理。
- 以上是全量 10k 图元操作的实际代价，后续大规模 Glyph 优化应保留本次恢复和删除契约。这里不作 60FPS 保证。

调用次数（一次扫描全部 10k Glyph）：

| 操作 | 重编译 | resolver | 位置编码 | 通道编码 | 子图形提交 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 纯色 hover | 0 | 0 | 0 | 0 | 0 |
| 初次 selected | 0 | 10000 | 10000 | 10000 | 20000 |
| ratio 改变 | 0 | 10000 | 10000 | 0 | 10000 |
| 相同 ratio 刷新 | 0 | 10000 | 0 | 0 | 0 |

### 标准页面

复用仓库 `render-performance.ts` 中的 scatter-10k 和 120 charts 场景，后者补测 `updateSpecSync` 改宽度。先 baseline→fixed，再 fixed→baseline；下表为第二轮，第一轮原始数据也已保留。

| 场景 / 阶段 | 基线 | 修复 |
| --- | --- | --- |
| scatter-10k / createMs | 0.8 [0.7–1.0] | 0.8 [0.6–0.8] |
| scatter-10k / renderMs | 38.6 [35.3–45.4] | 39.0 [35.1–41.3] |
| scatter-10k / releaseMs | 2.8 [2.3–3.9] | 2.2 [1.8–2.8] |
| multi-chart-grid / createMs | 52.6 [31.9–78.9] | 52.2 [31.3–77.0] |
| multi-chart-grid / renderMs | 50.7 [48.3–65.8] | 49.7 [48.1–53.2] |
| multi-chart-grid / updateMs | 60.3 [58.7–66.1] | 60.6 [55.0–65.4] |
| multi-chart-grid / releaseMs | 4.1 [3.9–5.6] | 4.4 [3.9–5.1] |

两轮普通图表页面的耗时范围有重叠，反转测量顺序后没有稳定退化信号；不能将第一轮约数毫秒差异解释为确定的收益或损失。上述结论仅覆盖这台机器和这些场景。

## 本地复查与清理

- 临时构建、日志、浏览器验证页和基准脚本位于 `/tmp/vrender-glyph-fix`；tarball 位于其 `r3` 子目录。
- 当前本地 node_modules 保留已验证的 tarball，便于继续审查。仓库中的临时 overrides / 锁文件变更已恢复；再次执行 Rush install/update 会按正式依赖恢复安装，发布接入前不能据此声称修复包已正式可用。
- 复查本地联调时，临时将五个 `globalOverrides` 统一指向 `r3` 中的 tarball，运行 `rush update`，再运行计划列出的测试；不要只替换顶层 core。正式接入时移除临时覆盖并使用实际发布版本。
