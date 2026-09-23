# 本地视觉回归测试工具

工具结构见 [设计说明](./DESIGN.md)，用例选择与新增见 [用例指南](./cases/README.md)，平台实测范围见 [验收摘要](./cases/ACCEPTANCE.md)。

使用同一批精简用例，在本机分别运行当前工作区与官方 `VisActor/VChart` 的 develop 构建，生成截图和差异报告。无需内网 BugServer 或访问凭证。图片差异表示需要检查，不等同于缺陷；两侧共同存在的错误仍需其他测试发现。

## 准备

使用 Node.js 22。macOS（arm64）与 Linux 验收通过，Linux 实测环境为 veLinux 2（x64）。Ubuntu 未独立实测，不阻塞本轮交付。Linux 必须有 Chromium 所需系统库。先在仓库根目录完成依赖安装：

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

当前 256 个本地用例在 `cases/index.mjs` 显式注册，一用例一文件，按主要验证目的归入 `charts/`、`components/`、`data/`、`layout/`、`theme/`、`interaction/` 和 `api/`。详见 [目录导航、用例说明和待补场景](./cases/README.md)。元数据仅在清单中维护，每项包含 `id`、`purpose`、`file`，`sourceExample` 为可选的真实公开示例来源。

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

在清单中注册模块，存在真实公开示例时填写来源，然后运行 `--list`、`--check`、`--self-compare --case <id>` 及默认基线单用例比较。开发者或 Agent 独立新增的用例不填写 `BugServer case IDs` 行，不填写空值、占位或虚构 ID。既有 BugServer 迁移项保留真实 ID，改写保留原 ID、合并列出多个；后续独立新增项待同步成功后再补齐服务返回的 ID，本期没有同步功能。不得将内部业务内容直接带入公开代码。新增 case 顶部说明验证目的、图表类型、关键配置、场景条件、最终检查和覆盖边界；不修改原始调试示例。

`createSpec()` 不能导入本地 VChart 源码、Node API 或测试框架运行时代码，也不能加载网络数据。页面只加载指定产物；两侧共用冻结副本。`exercise()` 执行动作，`verify()` 验证实际目标状态；不能只等待固定时间或只检查图片存在。共享的场景树定位在 `helpers.mjs`，定位不到目标必须失败。

静态验证核对明确指定的类型、数据及配置子集，允许 VChart 合并主题默认值；公共检查还要求有效画布、图元及绘制像素。图例、tooltip、缩放和更新尺寸分别验证真实状态改变。

确定性配置集中在 `settings.mjs`：单 worker、无重试、新 context、Chromium headless、1000×800、图表 800×600、DPR 1、白底、Arial、en-US、UTC、单用例 30 秒。关闭动画，等待字体与连续稳定截图；像素颜色阈值 0.1、允许差异像素数 0。固定数据和文本，来源中的通用中英文文字及显式富文本字体保留，不使用远程图片或字体；两侧在同机比较，不要求 macOS 与 Linux 像素一致。

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

平台验收及实测耗时见 [验收摘要](./cases/ACCEPTANCE.md)。视觉测试不替代单元测试、性能测试及内网 BugServer 的发版前全量测试。
