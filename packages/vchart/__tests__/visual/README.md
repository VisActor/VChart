# 本地视觉回归测试工具（Linux 待验收）

工具的结构和设计取舍见 [设计稿](./DESIGN.md)。规范化实现已接入；macOS 验收结果见文末，Linux 仍需独立验收。

使用同一批精简用例，在本机分别运行当前工作区与官方 `VisActor/VChart` 的 develop 构建，生成截图和差异报告。无需内网 BugServer 或访问凭证。图片差异表示需要检查，不等同于缺陷；两侧共同存在的错误仍需其他测试发现。

## 准备

使用 Node.js 22。工具面向 macOS 14+ 和 Ubuntu 22.04/24.04；Linux 必须有 Chromium 所需系统库。先在仓库根目录完成依赖安装：

```sh
node common/scripts/install-run-rush.js install --ignore-hooks
```

安装与锁文件对应的 Chromium：

```sh
# macOS
node packages/vchart/node_modules/@playwright/test/cli.js install chromium --no-remove

# Linux：系统依赖安装可能需要管理员权限
node packages/vchart/node_modules/@playwright/test/cli.js install --with-deps chromium --no-remove
```

Rush 安装还需要项目现有的 node-canvas 编译依赖；按仓库贡献指南准备。截图命令本身不安装系统软件、不启动 Docker。

## 使用

在仓库根目录运行：

```sh
node packages/vchart/scripts/visual-test.mjs
node packages/vchart/scripts/visual-test.mjs --baseline <完整的40位commit-sha>
node packages/vchart/scripts/visual-test.mjs --dir components
node packages/vchart/scripts/visual-test.mjs --dir components/label
node packages/vchart/scripts/visual-test.mjs --case pie-label
node packages/vchart/scripts/visual-test.mjs --self-compare
node packages/vchart/scripts/visual-test.mjs --list
node packages/vchart/scripts/visual-test.mjs --check
```

不传选择参数运行全部本地 case；`--dir` 递归运行 cases 内的一个目录，`--case` 按 ID 运行一个用例。目录和 ID 互斥，不根据源码改动自动追加测试。目录使用小写字母、数字、连字符和 `/`，例如 `components/label`；不接受绝对路径、`..`、glob、空路径或重复 `--dir`。不存在或没有已登记 case 的目录返回 `2`，不会回退为全量。

三种范围均可搭配 `--baseline <sha>` 或 `--self-compare`（两者互斥）。目录只表示用例归属，选择哪些测试由开发者或 Agent 判断；参见 [用例目录导航](./cases/README.md)。目录模式减少截图与交互数量，本地构建仍每次执行。

`--list` 独立列出用例元数据，不需要浏览器。`--check` 独立检查 Node、Git、当前依赖和 Chromium 实际启动，检查后关闭浏览器；不自动安装、不构建、不截图。预检日志位于 `.vchart-visual/preflight.log`。帮助不要求先安装 Playwright。

包目录内也可使用 `rushx test:visual`。`--help` 列出选项；不存在更新永久基线或接受差异的命令。

- 默认每次从官方仓库获取 develop，并固定本次 SHA；fork 的 `origin` 不影响基线选择。断网或拉取失败会报错，缓存不会冒充最新版本。
- 指定 SHA 仍从官方仓库获取该提交；用于复现已知基线。首期不支持任意仓库或共同祖先自动选择。
- 当前工作区包含未提交修改，每次重新构建；构建过程中源码发生变化会要求重跑。
- 基线按自己的锁文件独立安装和构建。只缓存最近一次成功的基线构建，每次重新截图；缓存失效由 SHA、锁文件、Node、系统架构和构建配方决定；报告样式修改不使缓存失效，内容损坏会重建。
- 自比较只构建本地一次，在两套隔离 context 中执行；它验证测试确定性，不能证明图表结果正确。

退出码：`0` 无差异；`1` 有视觉差异；`2` 参数、构建、执行、资源、超时、缺图或清理错误。多个问题同时出现时执行错误优先。

## 报告与清理

命令输出 `.vchart-visual/runs/<run-id>/index.html`，浏览器直接打开即可离线查看，无需启动报告服务：

- 每个用例展示 **基线 / 本地 / 差异** 三列图片，点击图片打开原始分辨率；通过用例的差异列显示“无视觉差异”。
- 显示本次范围、选中/总量及范围复现命令；未选用例不计为通过或未完成。汇总通过、视觉差异、执行错误、未完成数量；默认展示问题用例，可按状态和用例筛选。
- 展示用例目的、实际用例源码行号、冻结用例链接、阶段诊断和单用例复现命令。指定基线 SHA 固定，但复现本地结果仍需要相同工作区修改。
- 缺图明确显示“未生成或缺失”；已完成截图的结果丢失必要图片时，汇总升级为执行错误，CLI 返回 `2`。
- 分享报告时复制整个运行目录，保留相对目录结构；单独复制 HTML 不包含图片。页面不请求外网。

同一次运行同时生成 `agent-summary.md` 和 `summary.json`，与 HTML 共用一份归一化结果：

| 文件 / 字段                                      | 作用                                                                                     |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `agent-summary.md`                               | Agent 首选入口：运行环境、失败/未完成用例、诊断、三图路径与复现命令；通过用例仅汇总      |
| `summary.json` / `schemaVersion: 1`              | 版本化结构化结果，完整保存全部用例及证据路径，不嵌入图片 Base64                          |
| `status` / `complete` / `counts`                 | 运行结论、是否完成所选用例的有效比较、四类用例计数；运行级错误仍可使已完成比较的运行失败 |
| `selection` / `rerun`                            | 本次模式（all/directory/case）、选择值、选中 ID、选中/总量与绑定基线的范围复现命令       |
| `baseline` / `local` / `environment` / `timings` | 基线 SHA、本地 HEAD/dirty/修改摘要、运行时与浏览器版本、阶段耗时                         |
| `cases[].source`                                 | `path` 相对于仓库根目录；`line` 指向冻结模块入口；`frozenPath` 相对于报告目录            |
| `cases[].phases` / `errors`                      | 两侧状态及错误的 `phase`、`stage`、`category`、原始诊断文本                              |
| `cases[].images` / `attachments` / `rerun`       | 三图相对路径（缺失为 `null`）、截图/trace 等证据路径、仓库根目录复现命令                 |
| `issues` / `logs`                                | 构建、中断、清理等运行级错误，以及实际存在的日志和原生报告路径                           |

用例状态为 `passed`、`diff`、`error`、`not_run`；运行状态为前三种。错误类别包括 `visual_difference`、`missing_artifact`、`timeout`、`resource`、`render`、`interaction`、`screenshot`、`comparison`、`setup`，以及运行级 `execution` / `report`。Agent 应先读取摘要，再按需读取 JSON、源码、图片或日志；报告只给出事实，不推断根因、不放宽阈值、不自动接受差异，也不调用任何模型 API。

基线和本地阶段的 Playwright HTML/JSON 报告仍保留用于详细调试。失败阶段可能没有完整原生 HTML，汇总页只链接实际存在的报告与日志。

需要交互查看 Playwright 报告时，显式运行：

```sh
node packages/vchart/node_modules/@playwright/test/cli.js show-report .vchart-visual/runs/<run-id>/current-report
```

查看完成后 Ctrl+C 退出报告服务。测试命令不会自动启动此常驻服务。

正常结束、失败和 Ctrl+C 会回收测试子进程、浏览器、HTTP 服务及临时 worktree。报告保留供检查。SIGKILL 或断电无法执行清理：先确认无测试进程，再检查 `git worktree list`、删除该次临时 worktree 和 `.vchart-visual/running.lock` 后重跑。请勿删除其他任务的 worktree。

`.vchart-visual/` 已被 Git 忽略。确认没有测试运行后，可删除旧 `runs` 释放磁盘空间；不要提交截图，也不要把基线替换为待测图片。

## 用例约定

当前 35 个本地用例在 `cases/index.mjs` 显式注册，一用例一文件，按主要验证目的归入 `charts/`、`components/`、`layout/` 和 `api/`。详见 [目录导航、用例说明和待补场景](./cases/README.md)。元数据仅在清单中维护，每项包含 `id`、`purpose`、`file`，`sourceExample` 为可选的真实公开示例来源。

ID 必须唯一且符合 `^[a-z][a-z0-9-]*$`；file 使用 cases 内的 `./<目录>/<name>.mjs`，目录层级和文件名使用小写字母、数字与连字符。缺文件、非法导出、越界、符号链接和空选择集在构建前失败，未登记的模块不会自动执行。

用例模块默认导出 `createSpec()`、可选 `exercise(page)`、必需 `verify(page)`。核心函数补中文说明。新增用例可复制以下结构：

```js
export default {
  createSpec() {
    // 固定输入，每次创建新对象。
    return { type: 'bar', data: { values: [{ x: 'A', y: 10 }] }, xField: 'x', yField: 'y' };
  },
  async verify(page) {
    // 检查公开 spec，图片比较负责布局呈现。
    await page.evaluate(() => {
      if (window.__visualChart.getSpec().type !== 'bar') throw new Error('图表类型不正确');
    });
  }
};
```

在清单中注册模块，存在真实公开示例时填写来源，然后运行 `--list`、`--check`、`--self-compare --case <id>` 及默认基线单用例比较。BugServer 迁移项在文件头填写 `BugServer case IDs: <id>, <id>`，改写保留原 ID、合并列出多个；不得将内部业务内容直接带入公开代码。新增 case 顶部说明验证目的、图表类型、关键配置、场景条件、最终检查和覆盖边界；不修改原始调试示例。

`createSpec()` 不能导入本地 VChart 源码、Node API 或测试框架运行时代码，也不能加载网络数据。页面只加载指定产物；两侧共用冻结副本。`exercise()` 执行动作，`verify()` 验证实际目标状态；不能只等待固定时间或只检查图片存在。共享的场景树定位在 `helpers.mjs`，定位不到目标必须失败。

静态验证核对明确指定的类型、数据及配置子集，允许 VChart 合并主题默认值；公共检查还要求有效画布、图元及绘制像素。图例、tooltip、缩放和更新尺寸分别验证真实状态改变。

确定性配置集中在 `settings.mjs`：单 worker、无重试、新 context、Chromium headless、1000×800、图表 800×600、DPR 1、白底、Arial、en-US、UTC、单用例 30 秒。关闭动画，等待字体与连续稳定截图；像素颜色阈值 0.1、允许差异像素数 0。固定英文文本和数据，不使用远程图片或字体。

## 结果与错误协议

`summary.json` 是 HTML 和 Agent 摘要的共同数据源。已有 schemaVersion=1 字段保持兼容，新增 `runId`、`finalized`、`request`、`comparison`、`frozenFiles`、分阶段耗时和诊断 `code`。未完成用例还记录 `blockedBy`。

`finalized` 表示运行已形成终态，`complete` 表示所选用例全部完成有效比较；清理失败可以 finalized=true、complete=true、status=error。执行中保留 finalized=false 的 JSON；每完成一个用例原子落盘阶段结果，异常退出不丢失已完成诊断。

稳定错误码包括 `INVALID_ARGUMENT`、`PREFLIGHT_FAILED`、`CASE_MANIFEST_INVALID`、`BASELINE_FETCH_FAILED`、`BUILD_FAILED`、`WORKSPACE_CHANGED`、`RESOURCE_FAILED`、`RENDER_FAILED`、`CASE_ASSERTION_FAILED`、`INTERACTION_ASSERTION_FAILED`、`SCREENSHOT_FAILED`、`COMPARISON_FAILED`、`TIMEOUT`、`MISSING_ARTIFACT`、`RESULT_SET_MISMATCH`、`RUN_LOCKED`、`RUN_INTERRUPTED`、`RUN_INCOMPLETE`、`CLEANUP_FAILED`、`REPORT_FAILED` 和兜底 `EXECUTION_FAILED`。只有完整的原生比较证据才会标为 `VISUAL_DIFFERENCE`。

准备失败尽可能生成报告。参数不可解析或输出不可写时可能只有 stderr，退出码仍是 2；报告写入失败时保留阶段证据并尽可能写入错误 JSON，不保留误导性的成功 HTML。原始错误文字供排查，Agent 应优先使用稳定错误码。

锁的 `owner.json` 记录 runId、PID、启动时间和目录；工具不自动夺锁。SIGINT/SIGTERM 逐项清理本次资源，主错误与清理错误同时保留。SIGKILL/断电后的锁需人工确认，不允许据此终止其他进程。

## 验证工具本身

先完成一次自比较以生成本地 UMD，再运行故障自检：

```sh
node --test packages/vchart/scripts/visual-test.test.mjs
```

自检在独立临时目录中验证：相同产物通过、仅候选构建改变颜色产生差异、缺图不自动生成基线、脚本缺失/异常/外部请求/超时及构建命令失败被归类为执行错误。自检结束自动清理目录和服务。

平台验收及实测耗时见本文件末尾的验证记录；没有实际验证的平台不能视为已通过。

## 原型历史记录（2026-09-21）

环境：macOS 14.7.8 / arm64，Node.js 22.22.2，Playwright 1.63.0，Chromium 153.0.8010.12。官方基线为 `67400f3fb6501f62455392089b7a7d8367cf6b9a`。以下数据来自当前机器，不能作为其他机器的耗时保证。

| 检查                                    | 结果                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 十用例完整自比较，连续 5 轮             | 全部通过；每轮 33.8 ～ 36.9 秒                                                                    |
| 官方 develop 独立安装、构建和十用例对比 | 全部通过；最终版本约 173.5 秒                                                                     |
| 指定同一 SHA，命中基线构建缓存          | 全部通过；约 34.7 秒                                                                              |
| 本地构建 / 双侧十用例截图               | 自比较中位数分别约 21.7 / 11.9 秒                                                                 |
| 故障自检                                | 11 项原型测试通过，包含四类无效交互、差异检出、缺图、加载错误、运行异常、外部请求、超时及命令失败 |
| 未提交源码进入构建                      | 临时唯一导出标记出现在产物中；原文件按字节恢复                                                    |
| 构建阶段及浏览器阶段 SIGINT             | 返回 2，运行锁清理；浏览器阶段观察到的 18 个相关子进程均退出                                      |
| 临时 worktree / 用户原有改动            | 临时 worktree 已回收，原有 image-cloud 改动保留                                                   |
| Linux                                   | 未验收：当前环境没有可用的 Linux 执行环境                                                         |

首次基线准备会安装该版本的 monorepo 依赖，耗时包含网络下载、原生模块编译和 worktree 清理；命中缓存时仅复用构建产物，截图仍全部重新生成。首次准备当前工作区依赖和下载浏览器的时间不包含在上述测试耗时内。

原型报告增强验证：macOS 上 12 项自动检查通过，包括真实颜色差异的三图关联、`file://` 页面图片加载与筛选、无外网请求、差异图丢失升级为错误、准备失败保留未完成用例、HTML 转义和 Markdown 诊断。报告增强未单独完成 Linux 验收。

截图测试不替代内网 BugServer 的发版前全量测试。Linux 上仍需执行五轮完整自比较和故障自检后，才能标记该平台通过验收。

## 规范化版本验收

环境：macOS 14.7.8 / arm64，Node.js 22.22.2，Playwright 1.63.0，Chromium 153.0.8010.12。规范化代码的 macOS 验收完成，Linux 仍待验收。

| 检查                           | 结果                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| 原型与迁移用例使用同一构建产物 | 10 个 case 截图一致；`migration-check.json`                                                                   |
| 十用例连续 5 轮完整自比较      | 每轮 10/10 通过；32.4 ～ 35.8 秒，无差异或执行错误                                                            |
| 官方 develop 冷启动            | 10/10 通过，约 174.0 秒；固定 SHA `67400f3fb6501f62455392089b7a7d8367cf6b9a`                                  |
| 指定同一 SHA，缓存命中         | 10/10 通过，约 35.7 秒；单 case 自比较约 25.0 秒                                                              |
| 冷启动分阶段耗时               | 本地构建 19.8 秒；基线安装 79.6 秒、编译 22.9 秒；两侧截图合计 12.1 秒；清理 35.3 秒                          |
| 工具自动检查                   | 24 项全部通过；含三种视觉差异、空图、错误输入、四类无效交互、浏览器缺失、增量报告、缓存/锁/结果集合和写入失败 |
| 隔离 fork 与未提交源码         | origin 改为其他地址后仍获取官方 develop；唯一未提交导出进入 UMD；源码及 origin 保持原样                       |
| 构建 SIGINT / 浏览器 SIGTERM   | 均返回 2，记录 RUN_INTERRUPTED；运行锁移除，观察到的子进程无残留                                              |
| 离线与报告搬迁                 | 三图、筛选和图片路径检查通过；HTML 不请求外网                                                                 |
| Linux                          | 待验收，不能用以上结果替代                                                                                    |

本机证据位于 `.vchart-visual/acceptance/`：`runs.json`、`node-tests.log`、`isolated-fork.json`、`signals.json`；迁移证据位于 `.vchart-visual/migration-check.json`。这些是本机生成产物，不提交 Git。其他机器应重新运行对应检查，不将此耗时作为承诺。

Linux 后续执行相同矩阵，并在公开环境验证依赖准备；双平台验收完成后再移除平台待验收标记。

## 目录化版本验收（2026-09-22）

已完成现有十个 case 的目录迁移、统一说明与全量/目录/单用例三种运行范围。macOS 14.7.8 / arm64、Node.js 22.22.2、Playwright 1.63.0、Chromium 153.0.8010.12 实测通过；Linux 仍待验收。

迁移前后使用同一存档 UMD，十个 case 的 spec、createSpec/exercise/verify 函数和最终截图全部一致。共享帮助函数及截图配置保持一致。27 项自动检查通过，覆盖目录递归与边界、未知目录、参数组合、父目录符号链接、来源可选、冻结副本、范围报告、缺图、资源/渲染异常及四类无效交互。测试中按新清单定位故障注入文件。

官方 develop 固定为 `67400f3fb6501f62455392089b7a7d8367cf6b9a`。以下为本机实测值，不能作为其他机器的耗时保证：

| 模式                  | 选中 / 总量 | 结果 | 本地构建 | 双侧截图 | 总耗时  |
| --------------------- | ----------- | ---- | -------- | -------- | ------- |
| 全量自比较            | 10 / 10     | 通过 | 24.1 秒  | 12.4 秒  | 37.7 秒 |
| 目录 components       | 5 / 10      | 通过 | 23.5 秒  | 7.7 秒   | 32.1 秒 |
| 目录 components/label | 1 / 10      | 通过 | 22.9 秒  | 3.1 秒   | 27.2 秒 |
| 单用例 pie-label      | 1 / 10      | 通过 | 23.4 秒  | 3.1 秒   | 27.6 秒 |

三个官方基线运行均命中构建缓存。叶目录与单 case 的选中 ID 相同，两侧截图分别逐字节一致。报告区分所选集合与完整本地集合；未选用例不计为通过或未完成。预检失败仍保留所请求的 SHA/自比较模式和目录，复现命令不会改变测试范围。

本机证据保存在 `.vchart-visual/directory-acceptance-0vPpcz/`：`before-git.json`、`before-suite/`、`reference.js`、`migration/index.html`、`runs.json`、`baseline-sha.txt`、`node-tests.log` 和各模式日志。正式报告目录记录在 `runs.json`，整个运行目录可离线查看；截图、报告和缓存均不提交 Git。

目录筛选减少截图与交互次数，本地构建仍每次执行。新增用例及 Linux 平台需要完成各自的实际验收，不能用本记录替代。

## 首批 60 例验收（2026-09-22）（历史记录，已被来源纠偏替代）

以下 60 例报告仅保留历史执行证据，不代表当前迁移覆盖。当前集合及复核结果见文末。

在原有十例上新增 50 个合成用例，当前 charts 30、components 22、data 4、layout 1、api 3。产品源码和原有十例未修改。详细目的及覆盖边界见 [目录导航](./cases/README.md)。

环境：macOS arm64，Node 22.22.2，Playwright 1.63.0，Chromium 153.0.8010.12。Linux 待验收。

| 检查 | 结果 |
| --- | --- |
| 五轮双侧自比较 | 每轮 60/60 通过，共 300 次有效比较；一次正式 CLI 全新构建，四轮复用同一冻结套件和构建 |
| 官方 develop 全量 | 60/60 通过；SHA `67400f3fb6501f62455392089b7a7d8367cf6b9a`，基线构建缓存命中 |
| 新增用例的目标画面变异 | 50/50 至少一种有效变异返回 diff，具有完整三图证据 |
| 新增 API 动作抑制 | updateSpec、连续 updateData 均返回 error |
| Node 检查 | 28/28 通过，包含旧四类交互抑制、目录范围及新 spec 独立创建检查 |
| 目录运行 | components/marker：7/60 通过 |
| 单用例运行 | axis-auto-hide：1/60 通过 |

| 正式 CLI | 构建 | 两侧截图 | 总耗时 |
| --- | ---: | ---: | ---: |
| 全量自比较 | 20.8 秒 | 56.1 秒 | 78.1 秒 |
| 官方 develop 全量 | 24.9 秒 | 57.6 秒 | 85.5 秒 |
| 标注目录自比较 | 20.3 秒 | 8.3 秒 | 29.6 秒 |
| 单例自比较 | 18.9 秒 | 2.7 秒 | 22.6 秒 |

变异检验包括图元移位/隐藏，以及箱线图方向、标签可见性和标注填充的改变。首次部分容器变异没有改变画面，保留为无效注入记录；改用明确配置变化后检出。完整隐藏无轴图表会触发空图错误，不能将这种执行错误冒充像素差异。最终统计只使用返回 diff 且证据完整的有效变异。该检查不代表所有语义分支或历史缺陷都已覆盖。

本机验收材料位于忽略目录 `.vchart-visual/first-batch-20260922/`：`acceptance-summary.json`、`stability.json`、`mutation-coverage.json`、`suppressed.json` 和 `node-tests-pass.tap`。保留各轮原生报告、冻结输入和截图；不提交生成产物。

正式三图/Agent 报告位于：

- 全量自比较：`.vchart-visual/runs/1790074109072-190a5e2a/index.html`，同目录含 `summary.json` 和 `agent-summary.md`。
- 官方 develop 全量：`.vchart-visual/runs/1790074428804-ca61414b/index.html`，同目录含 `summary.json` 和 `agent-summary.md`。
- 目录：`.vchart-visual/runs/1790074568455-7dc80d36/index.html`，同目录含 `summary.json` 和 `agent-summary.md`。
- 单用例：`.vchart-visual/runs/1790074598134-ed57818c/index.html`，同目录含 `summary.json` 和 `agent-summary.md`。

## 第一批来源迁移复核（2026-09-22，历史阶段记录）

当前为原有十例加四个源码保真迁移样本，共 14 例；原有十例和产品源码未改动。原先新增的 50 例中，25 个自主设计项已撤出本次迁移，四个已对照原始代码重新迁移，21 个待复核。详见 [用例说明](./cases/README.md)。

macOS 上 29 项 Node 检查通过。14 例连续五轮自比较全部通过：一轮正式 CLI 新构建，四轮复用同一冻结输入与构建。四个源条件的画面变异均检出 diff，四个在 verify 前注入的错误配置均返回 error。官方 develop `67400f3fb6501f62455392089b7a7d8367cf6b9a` 全量 14/14 通过。Linux 仍待验收。

本机真实报告（忽略目录，不提交 Git）：

- 自比较：`.vchart-visual/runs/1790076261774-503c632b/index.html`。
- 官方 develop：`.vchart-visual/runs/1790076433426-d72c52cd/index.html`。

每个目录均包含 `summary.json`、`agent-summary.md`、冻结输入及截图；精确阶段耗时记录在 `summary.json` 的 `timings` 字段。源码审查证据和内部映射另存私有目录，不进入公开仓库。截图一致不等于证明历史缺陷全部复现。

## 第二批来源迁移验收（2026-09-22，当前有效集合）

当前 35 例：十个原有公开示例用例加 25 个 BugServer 来源迁移用例。第二批接入 21 例，分别保留不同箱线图、进度图、网格布局、标签及状态更新条件；三份不适合本轮迁移的来源暂缓，未带入公开代码。全部来源 ID 在对应 `.mjs` 文件头维护。

macOS 最终 35 例连续五轮自比较通过（一轮正式 CLI 新构建，四轮复用冻结输入）。官方 develop `67400f3fb6501f62455392089b7a7d8367cf6b9a` 全量 35/35 通过，基线构建缓存命中。30 项 Node 检查通过；第二批 21 类关键条件视觉变异全部被检出，错误配置及无效状态动作检查保留诊断证据。新增独立对象检查涵盖 common 系列内部数据；轴断言允许转换器在原轴后追加默认轴，仍严格核对原轴及其他数据数组。

| 正式运行 | 本地构建 | 两侧截图 | 总耗时 |
| --- | ---: | ---: | ---: |
| 全量自比较 | 24.8 秒 | 37.2 秒 | 63.5 秒 |
| 官方 develop 全量 | 31.0 秒 | 39.0 秒 | 73.9 秒 |

本机验收期间部分独立检查并行执行，上述耗时不是性能保证。Linux 仍待独立验收。

- 自比较三图报告：`.vchart-visual/runs/1790078700626-084a3123/index.html`。
- 官方 develop 三图报告：`.vchart-visual/runs/1790078793166-ae406f27/index.html`。
- 每个运行目录均有 `summary.json`、`agent-summary.md`、冻结输入、截图及分阶段耗时。

内部模型复核、原始源码及迁移审批记录留在私有准备目录，不进入公开仓库。模型意见经过来源对照和浏览器验证；模型认为保真不等于证明历史缺陷全部复现。
