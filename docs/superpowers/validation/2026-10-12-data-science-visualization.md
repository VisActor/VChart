# data-science-visualization 实现与验收

日期：2026-10-12；分支：`codex/vchart-statplots`。实现起点 `34474909c`，功能提交截至 `67e68b2d7`；后续验收提交仅补充测试、类型标注和本文。

## 交付与复用

技能代码在 [`skills/data-science-visualization`](../../../skills/data-science-visualization/SKILL.md)。默认按分布、比较、关系、质量选择图，12 类表格绑定与全部 28 类规范 Spec 入口均已实现。

- Python 3.11+ 标准库导入 CSV/TSV/JSON；可选 openpyxl 读取明确 sheet 的 XLSX。生成 HTML/request/data 三项便携产物，目标新目录完整写入，不上传源数据。
- npm 固定发布物 `@visactor/vchart-statplots@2.1.8-alpha.0`：144 份 catalog/契约/Schema/示例/包声明资源，加 workspace MIT 许可证及 manifest。下载先验证 dist.integrity，再记录源字节及链接重写后的 SHA-256。不是把当前分支源码当 npm 发布物。
- 渲染控制器源码：`packages/vchart-statplots/examples/shared/statplot-controller.js`；图库与技能使用同一控制器。技能副本通过同步脚本生成并校验。调用公共 register/validate/compile、renderAsync/updateSpec、exportImg/release，没有重写统计或几何。
- 页面支持显式类别/闭区间筛选、数值字段和参数切换、主题、PNG、规范 Spec 下载。pairPlot 用原生稳定 ID 框选，高亮不改统计分母；外部 Spec 不随表格筛选重算。
- 多图失败恢复上次成功条件；原生更新失败最多恢复一次，恢复失败明确显示错误。`ready` 只表示批次结束，成功检查各图 status。
- 保存当前视图请求及 `controls.initialFilters` 可重放已应用筛选、图型、字段、参数和主题；保留全部观测行和实际使用列，清空恢复全部行。不是完整 CSV 备份；未使用列不内嵌。

资源固定版本与来源见 [manifest](../../../skills/data-science-visualization/references/statplots/manifest.json)。VChart/statplots 的两个 UMD 均固定 2.1.8-alpha.0；npm peer 元数据仍为 2.1.7，本验收只覆盖实际测试组合。

## 运行环境与结果

macOS arm64；Node 22.23.3；Python 3.11.16 / 3.12.14；Chromium 153.0.8010.12；Playwright 1.63.0。运行浏览器测试时通过 DSV_PYTHON 指定满足版本要求的解释器；技能不依赖这个开发变量。

| 检查 | 实际结果 |
| --- | --- |
| Python 导入/输出/CLI | 3.11 与 3.12 各 18 项通过，含有/无 openpyxl 路径 |
| Node 生命周期/绑定/资源 | 12 项通过，含完整性失败保留原快照 |
| Statplots Jest | 38 套、664 项通过 |
| Statplots 完整浏览器 | 427 项通过，最终串行运行；日志 `.vchart-statplots/dsv/full-browser-final.log` |
| 28 类发布 UMD + 实际生成 HTML | 全部通过；使用完整性核验的 npm UMD 字节，不替换为本地构建 |
| 12 类绑定 + 发布 UMD | 全部通过；另有 12 类当前源码 API 浏览器检查 |
| 五个便携示例 | 仓库外复制技能、生成、删除源 CSV、重放与实际 file URL 打开均通过 |
| 实际 CDN，不拦截响应 | 通过；360 px 深浅主题无页面横向溢出 |
| 源码 compile、Schema、catalog、examples | 通过；28 主例、122 有效变体、36 反例，89 选型预期不等于模型命中率 |
| Skill quick_validate、资源离线 check、git diff check | 通过 |
| ESLint | 0 errors、1110 warnings，含既有与新增测试的 any/非空断言警告；没有改变规则 |
| 扩展测试项目 tsc | 未通过；修正本次新增性能测试的一处 unknown 后，无 skill 文件剩余错误；既有 confusion-matrix.spec.ts/raw-input.spec.ts 的隐式 any 与 build-schema.ts 的 DefinitionOrBoolean 错误仍在。源码 compile 不包含这些文件，不能混称全部类型检查通过 |
| 官方 develop 全量视觉比较 | 被基线四个断言失败阻断，完整比较 false，详见下文 |

两个固定发布 UMD 的 SHA-256：

- VChart：`9d0f5651b1e322f383c7101b54265c9b3a7ee0f5cd7c9165db83f8f19f22cd0b`。
- statplots：`4902756722b23bd9f54b8b4b17ed20ccaba28301cc5f0971e734e1fc20655a04`。

完整 npm dist.integrity、tarball URL 与测试缓存路径在 `.vchart-statplots/dsv/published/manifest.json`。缓存路由和一次真实在线加载分别记录，在线失败不能用缓存成功冒充。

## 实际交互与测试清单

| 文件 | 目的 |
| --- | --- |
| `__tests__/runtime/skill-resources.test.cjs` | npm 完整性、离线修改/缺文件、失败同步保留快照 |
| `__tests__/runtime/statplot-controller.test.cjs` | 同实例/一次 compile、队列、校验失败、原生失败恢复、释放竞态、文件名导出 |
| `skills/.../tests/data-bindings.test.cjs` | 12 类角色、类型、null/0、ID、输入不修改、闭区间和预算 |
| `skills/.../tests/test_visualization_io.py` | CSV BOM/引号/换行、TSV、JSON null/false/空字符串、严格类型、ID、控件与初始条件、XLSX |
| `skills/.../tests/test_visualization_html.py` | 数据文字转义与 JSON 往返、资源缺失不写半产物、不覆盖、记录重放 |
| `skills/.../tests/test_visualization_cli.py` | 仓库外便携执行、删除原 CSV 后重放、退出码 |
| `__tests__/browser/skill-bindings.spec.ts` | 当前源码公共 API 的 12 类真实输入和图元 |
| `__tests__/browser/skill-catalog.spec.ts` | 28 类固定发布 UMD 的真实生成、渲染和图元 |
| `__tests__/browser/skill-interactions.spec.ts` | 鼠标 Tooltip、筛选后的计数/相关及分母、同实例、变量与单位、参数、空态、框选、回滚、导出、条件保存改图 |
| `__tests__/browser/skill-failures.spec.ts` | CDN 拒绝、静态来源与输入下载、HTML 注入保持为数据、原生失败后恢复 |
| `__tests__/browser/skill-portable.spec.ts` | 五个复制目录示例、发布库 12 类绑定、在线 CDN、窄屏与主题 |
| `__tests__/browser/skill-performance.spec.ts` | 10k/4 图和 4 变量 pair；实例复用、编译计数、resize/release |

浏览器鼠标命中使用实际图元几何并转换到页面坐标；断言真实 Tooltip 内容、数量和观测 ID，未把 canvas 存在当成功。

关键数值：筛选 A 后直方图由 4 条变 2 条；相关矩阵逐对 n 从 4 到 2，Pearson r 从 19/35 到 1。pairPlot 真实拖动选择 `002`，不同面板选中同一个 ID，hover/resize/brush 不调用 compile。故意令小提琴单组仅剩一条且未提供固定带宽，公共 compile 报错，前一张已经更新的直方图恢复 4 条，控件与分母同步回退。

保存视图实际下载 request，保留四行原始使用列及 ID；只改 boxPlot 为 violinPlot，新 HTML 首次打开恢复 A 的两条，单位为元，清空回到四行。没有以筛选子集替换全部记录。

已审阅分布、关系、移动端、深色截图，存于 `.vchart-statplots/dsv/screenshots/`。图库控制器抽取前后 1440/390 截图逐字节相同；1000 截图仅卡片右上边缘 5 像素不同（x=978–979/y=119–122），绘图区完全相同。未改变图片比较阈值。

## 规模测量

最终性能专项复跑中的单次测量（2 项通过），包含库解析和绘制，不作为 SLA：

| 场景 | 实际测量 |
| --- | --- |
| 10k 行、histogram/scatter/hexbin/correlation 四图首绘 | 366 ms |
| 筛选到 5k | 161 ms |
| 四图主题切换 | 118 ms |
| resize | 45 ms |
| release | 4 ms，canvas 数量为 0 |
| JS heap（浏览器粗粒度指标） | 53.5 MB |
| 10k 行、4 变量 pairPlot | 120000 非对角点，首绘 745 ms |

数据在 `.vchart-statplots/dsv/four-chart-performance.json`、`pair-performance.json`。同实例更新、hover/resize 不重新编译均有独立断言，没有自动抽样、减少观测或放宽预算。

## 独立真实需求执行

依据 skill-creator 的独立正向测试建议，评估者只获得技能路径、10 行原始员工数据与普通用户请求，没有父任务计划、测试预期或结论。它复制整个技能后生成收入分布、团队箱线、个体蜂群，再改为小提琴。

首次独立执行发现请求未持久化已应用地区条件；已修正为 initialFilters + 保存当前视图请求，并增加真实浏览器回归。独立重查执行未修改的页面状态脚本与绑定模块，捕获保存请求并用 CLI 改图/重放：保留十行使用数据，东区五行、有效收入四条，清空恢复十行；单位及前导零 ID 保留。未使用的 age/spend/active 不内嵌符合原设计，不能称完整 CSV 备份。

独立评估的宿主 IAB 拒绝 `file://`，没有绕过。其重查采用 DOM/控制器测试替身，证明状态和协议，不能当真实绘制；主任务的独立 Chromium 测试另有真实编译、绘图、鼠标和下载证据。宿主预览及隐式发现/全局安装未验收。

独立记录：`.vchart-statplots/dsv/forward-validation/validation-report.md`、`recheck-report.md`，以及 v4/v5 实际产物。没有安装全局技能、push、创建 PR、发布或部署。

## 官方基线阻断与一次运行污染

实际执行 `node packages/vchart/scripts/visual-test.mjs`，262 用例全选，Node 22。官方基线 `e5426efe9e363ad4c71757aa4702baa877ead0da`，本地核心构建对应 `202faea7a`；之后的改动仅技能与测试/文档，未改核心源码。

baseline 阶段 258 项执行通过、四项断言失败：

- band-axis-update-spec：主题更新后新 band axis spec 未应用。
- legend-piecewise-domain：预期 [-1,1]，实际 -1,0。
- brush-link-data-key：不同面板未按同一观测 ID 联动。
- update-resize：更新或 resize 未生效。

CLI exit=2；归一化报告为 error、完整比较 false，4 error/258 not_run，current 未进入比较。此四项在本分支先前 [上游验收记录](../../../packages/vchart-statplots/docs/validation.md) 已有相同基线阻断；本次没有改核心、跳过用例、替换基线或降低阈值，也未用 self-compare 冒充正式比较。

报告：`.vchart-visual/runs/1791790271927-f6acb5e3/index.html`、`agent-summary.md`、`summary.json`。阻断发生在合法基线截图生成前，因此相关三图缺失，不能声明全量视觉通过。

第一轮图库完整浏览器测试与核心构建同时运行，核心构建暂时移除/重写本地 UMD，导致 12 项库加载错误（registerStatPlots 不可用），414 项通过；该轮不是有效的最终回归。构建结束后串行重跑，427 项全部通过，保留两轮日志。维护者不要同时执行这两类读写构建产物的任务。

## 复现命令

```sh
# 在仓库根目录，用 Node 22、Python 3.11+；DSV_PYTHON 指向自己的解释器。
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
node --test packages/vchart-statplots/__tests__/runtime/*.test.cjs skills/data-science-visualization/tests/*.test.cjs
python3 -m unittest discover -s skills/data-science-visualization/tests -p 'test_*.py' -v
npm run compile --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
DSV_PYTHON=python3 npm run test:browser --prefix packages/vchart-statplots
# 等图库浏览器测试退出后再运行；官方基线阻断不能写成成功。
node packages/vchart/scripts/visual-test.mjs
```
