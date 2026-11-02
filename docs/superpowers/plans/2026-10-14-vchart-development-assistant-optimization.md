# VChart Development Assistant Scenario Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.
>
> 上述技能不可用时，在当前会话依次执行并记录结果；不自行安装技能或创建其他聊天。用户已授权实施，仓库技能修改与本次验收已完成；未提交或发布。结果见 [验收记录](../validation/2026-10-14-vchart-development-assistant-optimization.md)。

**Goal:** 扩展现有 `vchart-development-assistant` 的生成场景，明确区分“生成可查看的 HTML”和“生成可复用的 VChart spec”，让已有开发者与自主 Agent 均能获得符合目标的产物。

**Architecture:** 配置生成保留共享的意图理解、选图、字段绑定和配置查询，再按交付目标进入 HTML 或 spec 工作流。诊断、视觉还原和 React 能力继续保留，并遵循相同的交付选择。验证使用数据与配置自检、JSON 解析及可用的真实渲染，不建设新的校验系统。

**Tech Stack:** 中文 Markdown、原生 VChart JSON/JavaScript 示例、既有 HTML 模板与生成脚本、Python 3 标准库、仓库已有浏览器与视觉测试工具；维护者视觉回归使用 Node.js 22。

## 范围与约束

- 本期核心是场景和交付契约：扩展现有技能，不新增独立技能。
- 本期不实施 schema 校验，不新增 schema CLI、Ajv/semver 依赖、版本检查器或替代 schema，不以 schema 工作完成作为交付条件。
- 不新增预览平台或共享渲染器，不调整既有 render/update/release 生命周期，不修改图库运行时。
- 优先复用配置知识库、HTML 模板与生成脚本。生成脚本只在本期场景验收暴露直接阻断时做最小修复，修复须有明确复现和对应测试；不捆绑无关重构。
- 明确 HTML 或 spec 需求时直接执行。已有宿主只接收 spec 的上下文持续有效，不每轮重复询问。
- 普通独立“画图/展示数据”请求且无宿主上下文时，延续可查看 HTML 的交付方式，不全面改成默认 JSON。只有上下文仍无法判断、且选择会影响可用性时才问一次交付形式。
- spec 场景不默认询问 JS/React；HTML 场景也不机械追问框架，独立网页默认原生 JS，已有 React 上下文则复用专项路径。
- 信息充分时自主选图，不逐次确认；只澄清会影响图义、真实数据口径或交付可用性的缺失信息。
- 不补造真实业务数据，不默认聚合、抽样、截断、补零或改写缺失；必要的数据变换说明规则及影响。功能教学允许明确标注的 mock 数据，不把 mock 当作用户数据。
- spec 不等同于 JSON。纯 JSON 宿主采用可序列化配置；文档化函数需求在允许 JavaScript 的场景中保留，不序列化丢失回调。
- 用户要求机器可消费的纯 JSON 时只输出配置本身；说明、假设、验证结果不混入配置。普通对话可给配置文件链接及简短说明。
- spec 的临时渲染页只是验收材料，不能代替所请求的 spec 产物。未执行渲染时如实说明，不因文件生成或 JSON 解析通过就声称渲染成功。
- 已知宿主约束只依据用户、已有上下文或可核实资料；不臆测宿主版本、图型、尺寸、函数及资源支持。浏览器验证不冒充目标宿主验证。
- 本期不改相邻数据科学技能；统计图 HTML 需求保持现有分流，明确的原生 VChart spec 需求进入本技能 spec 场景，不因提到“数据分析”就改变交付。
- 只维护仓库技能源码，不自动更新已安装副本。实施前检查当前工作区，保留其他任务改动。
- 按仓库 `AGENTS.md` 运行适当检查；提交 PR 前执行全量官方 develop 基线视觉比较，审查差异和执行错误，不用自比较代替。

## 场景模型

技能面向用户明确说明四类场景：HTML 生成、spec 生成、问题诊断、视觉还原。HTML/spec 是生成需求的两条交付路径；诊断与视觉还原可以交付其中一种。React 和 API 集成保持能力模块，不再新增一组并行场景。

| 维度 | HTML 生成 | spec 生成 |
| --- | --- | --- |
| 目标 | 直接查看、演示、操作图表 | 交给宿主渲染、嵌入应用或供其他工具消费 |
| 典型信号 | “生成 HTML”“可运行 demo”“能打开查看”；无宿主上下文的普通展示需求 | “只要 spec”“返回 JSON”“生成配置”；上下文已声明接收 spec 的宿主 |
| 共享输入 | 表达目标、真实数据、已知图型与样式要求 | 表达目标、真实数据、已知图型与样式要求 |
| 专属上下文 | 必要的应用环境、交互 API、页面展示要求 | 宿主已知支持范围、配置格式与必要运行约束 |
| 产物 | 可运行 HTML；React 请求按已有专项契约处理 | 完整可复用 spec；只有明确要求片段或补丁才返回增量 |
| 边界 | 按需包含实例创建、事件和页面代码 | 不混入 HTML、实例创建、宿主包装或传输代码 |
| 验收 | 实际打开页面，检查图元及明确请求的交互 | 检查字段、数据、必需配置及格式；条件允许时真实渲染 |

交付选择顺序：最新明确要求 → 已建立的宿主/应用上下文 → 用户任务目标 → 既有独立 HTML 默认。最新消息未改变交付目标时保留之前目标。同时请求 spec 与 HTML 时交付两者，并使用同一份配置。格式沿用用户要求、宿主契约与已有配置，均未知时可序列化配置用 JSON，确需且环境允许函数时用 JS。

## 文件与职责

下列路径相对仓库根目录。

| 文件 | 改动 |
| --- | --- |
| `skills/vchart-development-assistant/SKILL.md` | 修改：入口描述、四类场景、HTML/spec 路由、条件化澄清、输出和自检原则 |
| `skills/vchart-development-assistant/workflows/scenario-2-generation.md` | 修改：共享生成过程和两条交付流程的导航，保留原路径 |
| `skills/vchart-development-assistant/workflows/scenario-2-html-generation.md` | 新增：HTML 交付与既有模板/脚本使用，按需交互和实际验收 |
| `skills/vchart-development-assistant/workflows/scenario-2-spec-generation.md` | 新增：自主 spec 编写、宿主约束、JSON/JS、验证与交付 |
| `skills/vchart-development-assistant/workflows/scenario-1-diagnosis.md`、`scenario-1-react.md`、`scenario-3-image-replication.md` | 修改：对齐交付选择及上下文保持，不重写专项知识 |
| `skills/vchart-development-assistant/references/chart/chart-type-guide.md` | 修改：有针对性地补充选图和数据语义，校正被触及的误导规则 |
| `skills/vchart-development-assistant/examples/spec-generation/README.md`、`weekly-bar.json`、`composition-pie.json`、`callback-label.js` | 新增：用途和边界说明；JSON 业务图与 JS 回调示例 |
| `evals/vchart-development-assistant/generation-scenarios.md` | 新增：固定提示、上下文、预期产物、判定与实际输出记录要求 |
| `skills/vchart-development-assistant/README.md` | 修改：两种生成场景的用途、提问示例和交付区别 |
| `docs/assets/guide/zh/tutorial_docs/VChart_Skill_Usage.md`、对应英文文件 | 修改：中文优先补全场景说明，英文按现有体系同步 |
| `docs/superpowers/validation/2026-10-14-vchart-development-assistant-optimization.md` | 实施时新增：规则走查、Agent 行为、真实渲染、既有场景及视觉回归证据 |

## Task 1：明确场景入口与交付决策

**输入：** 用户需求与已有上下文。
**输出：** HTML 或 spec 交付目标，以及诊断/视觉还原等当前任务类型；分类是内部决策，不要求用户传新协议。

- [x] 调整 description，覆盖“生成可查看 HTML”和“为宿主生成可复用 spec”，保留诊断、还原、API 和 React 识别条件。
- [x] 主文件明确四类场景，按上方选择顺序路由。现有配置生成流程保留为共享入口，不复制选图和配置查询知识。
- [x] 将“所有场景必须 HTML”替换成条件化输出规范：HTML 场景交付可运行页面；spec 场景交付完整配置；诊断、还原沿用用户明确目标及上下文。
- [x] 移除无条件框架追问和选图确认，补充信息充分时直接执行的规则。
- [x] 诊断生成错误时保留交付目标：spec 出错仍修复 spec，HTML 出错仍修复页面；用户明确要求转换产物时才切换交付目标。
- [x] 删除无证据的“字段映射占 80% 问题源”，要求 Agent 根据实际数据检查字段，不能只把检查责任交给用户。
- [x] 规则走查：明确 HTML、明确 spec、上下文宿主、普通独立展示、spec 失败后诊断，各检查一次；只记为文档一致性检查，不冒充行为实测。

建议提交：`docs(skills): distinguish HTML and spec generation scenarios`。

## Task 2：编写两条生成工作流

**共享过程：** 目标理解 → 数据语义 → 选图 → 字段绑定 → 配置查询与生成。
**分支过程：** HTML 包装和页面验收；或 spec 格式、宿主约束和配置验收。

- [x] `scenario-2-generation.md` 保留完整/增量生成说明，将两种交付的专项规则集中到对应文件，不再定义相反默认值。
- [x] HTML 流程继续使用 `template/demo.html` 和 `scripts/generate_demo_html.py`；独立网页默认原生 JS，页面按钮与交互代码只按真实需求添加。
- [x] HTML 流程记录现有脚本的工作目录要求，以可执行命令说明，而不是借本期重构所有生成器：

```sh
cd skills/vchart-development-assistant
python3 scripts/generate_demo_html.py \
  --spec-file /tmp/vchart-skill-check/spec.js \
  --output /tmp/vchart-skill-check/chart.html
```

`spec.js` 是前一步实际生成的配置。实施验收使用新的临时目录；该 HTML 命令不能作为仅要 spec 的任务的最终交付。

- [x] spec 流程从目标、数据和已有约束开始，不要求技术栈、实例或应用代码；图型与字段已知时直接生成。
- [x] 完整 spec 包含数据或明确可用的数据绑定、图型所需字段和用户要求的配置。不能把“完整 spec”固定成所有图型都必须有 xField/yField。
- [x] JSON 通过标准解析器验证，保持 0、null、Unicode 和数据顺序；JS 保留文档化回调，明确不能用于只接收 JSON 的宿主。
- [x] 宿主只能接收 JSON 而需求依赖函数时，优先查询已知声明式能力；无法表达则说明限制，不静默删除函数，也不擅自改交付 HTML。
- [x] 明确不得静默改变单位、顺序、缺失和分母；只检查会影响当前选图的语义，不扩大为数据审计。
- [x] 验证分三项记录：数据/配置检查、JSON 格式检查（仅 JSON）、真实渲染（条件允许）；本期不包含 schema 阶段。
- [x] 真实渲染直接使用交付 spec。可临时加 `const spec = ...` 并复用现有演示工具；针对 JS 回调直接保留代码。记录实际使用的渲染环境与版本证据，不凭模板 URL 猜宿主支持。
- [x] 移除原流程无必要的选图确认和 spec 输出里强制附带 `new VChart`/render 调用的要求。

建议提交：`docs(skills): add dedicated HTML and spec generation workflows`。

## Task 3：示例与既有场景对齐

**输入：** 标准原生 VChart 配置及现有专项流程。
**输出：** 无宿主外壳的可复用示例，以及保持原交付目标的诊断/还原说明。

- [x] 新建周数据柱图示例：

```json
{
  "type": "bar",
  "data": {
    "values": [
      {"day": "周一", "value": 12},
      {"day": "周二", "value": 25},
      {"day": "周三", "value": 18},
      {"day": "周四", "value": 32}
    ]
  },
  "xField": "day",
  "yField": "value"
}
```

- [x] `composition-pie.json` 采用同一总体 A=30、B=70，配置 `type:'pie'`、`categoryField:'category'`、`valueField:'value'`，注明演示数据和分母。
- [x] `callback-label.js` 在周数据柱图基础上使用文档化 label formatMethod 回调，注明 JS 格式要求；不把该例转换为 JSON 以“验证兼容”。
- [x] README 说明三份示例的目标、数据、格式与宿主要求，不把示例数据当作用户数据。
- [x] 选图指南只修正与本期相关的语义：数字 ID 与度量区分、趋势与类目比较、占比分母、零与缺失；移除仅按记录数量机械选图的规则。
- [x] 诊断、React 和视觉还原文件对齐主入口契约。保留已有专项模板及知识，避免把 React 组件问题当作纯配置生成。
- [x] 修正触及文件的 `chart-type-guide.md` 路径和死链，不做知识库全面搬迁。

建议提交：`docs(skills): add reusable specs and preserve existing scenario contracts`。

## Task 4：验证场景行为与实际产物

**执行原则：** 不建设新的评测平台。行为任务使用相同模型与设置、独立上下文和固定提示，保存实际产物和结果；不能拿手工示例通过替代 Agent 成功。

| ID | 固定任务与上下文 | 判定 |
| --- | --- | --- |
| G01 | issue 四天数据，明确“只返回 JSON spec” | JSON 可解析；四条值与顺序正确；无框架追问、选图确认、HTML 或实例代码 |
| G02 | 相同数据，明确“生成可打开查看的 HTML” | 完整 HTML；实际绘制正确柱值 |
| G03 | 前文宿主声明只接收 JSON，本轮只说“用合适图表展示” | 保留 spec 目标；不重复问宿主或改成 HTML |
| G04 | 无宿主上下文的普通独立展示需求 | 默认可查看 HTML；不会因新增 spec 场景直接改为 JSON |
| G05 | JSON 宿主要求只能用函数实现的效果 | 核实声明式能力；不能实现时说明限制；不删除函数后声称完成 |
| G06 | 给错误 spec，要求完整修复 JSON；随后反馈仍有问题 | 修复配置并保留 JSON 交付目标；不强制 HTML |
| G07 | HTML 需求：点击柱子获取 datum | 真实点击后断言数据值，不以点击成功或截图存在代替 |
| G08 | React 问题和图片还原，各一个代表任务 | 两个子任务分别检查；保持已有专项能力和用户指定交付目标 |
| G09 | 数据含零、缺失、数字 ID；明确字段含义 | 图义和字段角色正确；不静默补零、删行或把 ID 当度量 |
| G10 | 明确要 spec，但当前没有可用浏览器 | 给出可完成的 spec，自检说明真实；不声称实际渲染通过 |

- [x] 在 `evals/vchart-development-assistant/generation-scenarios.md` 写出每份任务的完整提示、数据、已知约束和判定；不能在执行后补充有利假设。
- [x] G01–G04 各执行三次；其余至少一次。G08 两个子任务分别记录，总计至少 19 份实际任务输出。另补充完整增量交付、JSON 原生 tooltip、spec/HTML 组合交付与 JS 回调四项边界任务。记录结果，失败则调整规则并重测相关任务，不用一次成功证明稳定。
- [x] 比较原版与新版的关键 HTML/spec 路由行为，避免新增 spec 场景抢占既有 HTML 需求。
- [x] 用 Python 标准库解析实际 JSON 产物；检查数据与字段。示例格式检查可以从仓库根执行：

```sh
python3 - <<'CHECK'
import json
from pathlib import Path
root = Path('skills/vchart-development-assistant/examples/spec-generation')
def reject_constant(value):
    raise ValueError(f'JSON 不允许 {value}')
for file in sorted(root.glob('*.json')):
    spec = json.loads(file.read_text(), parse_constant=reject_constant)
    assert isinstance(spec, dict), file
    assert isinstance(spec.get('type'), str), file
    print(file)
CHECK
```

此命令只证明示例 JSON 基本格式，不证明 VChart 配置正确、Agent 任务成功或图表已经渲染。

- [x] 用已有浏览器工具打开实际 HTML，以及由实际交付 spec 临时生成的验收 HTML；检查真实数据、字段、图元和可见效果。JS 回调示例检查真实标签内容。
- [x] G07 断言实际 datum；做一次受控反例确认字段错误或动作被抑制时不能通过。反例不作为合法 spec 提交，也不固化为兼容承诺。
- [x] 不改变现有模板生命周期以便通过验收。若脚本存在直接阻断，记录复现、最小修复和针对性测试；新修复必须独立说明。
- [x] 单独记录目标宿主验收情况；没有真实宿主环境时记录未执行，浏览器验证通过不改变该结论。

建议提交：`test(skills): document generation scenario evaluation and evidence`。

## Task 5：文档与交付验收

- [x] README 和中文教程按 HTML/spec 两类生成场景介绍用途、提问和产物；补充纯 JSON 和既有宿主上下文案例，英文按现有结构同步。
- [x] 明确“HTML 用于直接查看；spec 用于其他环境消费”，并说明 spec 场景生成临时 HTML 验收不会改变最终产物。
- [x] 检查触及文件的 Markdown 链接、JSON 示例和全文规则一致性。纯文档改动不新增只匹配文字的实现镜像测试。
- [x] 按改动运行相关视觉目录；本期没有图库运行时修改，主要有效证据来自真实生成产物和场景行为，不把图库基线测试代替技能验收。
- [x] 提交 PR 前运行 `node packages/vchart/scripts/visual-test.mjs`，审查 `agent-summary.md` 和三图 HTML。差异说明、执行错误和环境阻断如实记录，不跳过或放宽阈值。
- [x] 只有发现相关公共渲染覆盖空缺时才新增图库 case，按显式清单登记并完成用例指南要求；不写虚构或空白 BugServer ID。
- [x] 新建 validation 文档：固定模型与设置、任务产物路径、每次判定、JSON 检查、实际渲染/交互、既有场景和视觉回归结果；失败及未执行单独记录。
- [x] 检查 diff 与本期范围一致；不发布、不更新全局技能副本、不向 issue 发消息。

建议提交：`docs(skills): explain HTML and spec delivery scenarios`。

## 最终验收

- [x] HTML/spec 两类生成场景均有明确触发、输入、产物和验收要求，主文件与专项流程无矛盾。
- [x] 明确 spec 需求和宿主上下文可直接产出完整配置，普通独立展示继续交付 HTML。
- [x] JSON/JS 格式选择尊重真实约束，不丢回调、不混入宿主包装或应用代码。
- [x] 诊断及还原保留交付目标；React 和真实 API 交互未退化。
- [x] 数据、格式、自检和实际渲染证据分开记录，未执行不写成通过。
- [x] G01–G04 三次及其余任务的实际产物均有记录；失败已修正并完成相关重测。
- [x] 文档、示例和 PR 前视觉结果已审查；没有新增 schema 校验、预览平台或渲染器重构。

## 深度交互

HTML/spec 是交付目标，不是两套图表知识。两条工作流共享选图与配置查询，专项文件只承载各自的交付规则，避免长期重复维护。独立 HTML 默认与宿主 spec 上下文可以同时成立，新增场景不需要强制所有用户改变使用方式。


## 执行记录

2026-10-14 完成上述任务，详见验收记录。旧版三项对照也得到正确产物，本次不宣称模型成功率提升。直接验收暴露了既有生成器对回调代码 `${...}` 的插值问题，进行了单点转义修复并增加行为回归测试；没有引入新渲染器或改变图库运行时。目标宿主、React 挂载和自动技能发现不在本次已通过的证据范围内。
