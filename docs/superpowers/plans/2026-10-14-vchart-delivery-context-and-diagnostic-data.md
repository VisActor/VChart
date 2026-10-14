# VChart Delivery Context and Diagnostic Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.
>
> 上述技能不可用时，在当前会话顺序执行，不自行安装技能或创建其他聊天。本文件是两项 review 问题的专项计划，已完成修复与本轮验收；结果见 [专项验收记录](../validation/2026-10-14-vchart-delivery-context-and-diagnostic-data.md)。

**Goal:** 保证修改 HTML 内的 spec 不会隐式改变交付目标，并让描述诊断优先使用真实数据，仅在明确的演示场景使用标注的 mock。

**Architecture:** 主文件维护唯一的交付选择顺序，配置修改只识别任务内容，不越过已建立的产物目标；专项流程引用这条规则。诊断流程按已知数据和任务性质决定继续处理或澄清，不将“没有 spec”推导成“没有真实数据”。复用现有行为评估和 HTML 工具验证，不新增状态机或校验系统。

**Tech Stack:** 中文 Markdown、既有 VChart HTML 模板/生成器、JSON 标准解析器、现有浏览器工具；维护者测试使用 Node.js 22。

## 全局约束

- 只修复本轮 review 的两项 P2 问题，不重新设计 HTML/spec 场景或增量生成模式。
- 实施基础是当前含上一轮未提交改动的工作区，不用 HEAD 或已安装技能覆盖它。
- 不修改图库运行时、生成器、模板、React 实现或宿主集成；不引入 schema、依赖或新的评测平台。
- 本轮明确要求优先；没有改变输出要求时保留已建立的 HTML、spec、组件或组合交付目标。
- “已有 spec”“配置修改”“加标签”描述输入或修改内容，不能单独作为切换产物的指令。
- 没有既定目标时，独立配置请求选择 spec；独立展示选择 HTML。仍无法判断且影响可用性时才澄清，不每次询问格式。
- 完整产物仍为默认；只有明确要求片段/补丁才返回局部配置。JSON/JS 及宿主约束保持现有规则。
- 缺少原 spec 不代表缺少真实数据。当前请求、已有对话和可访问真实数据源均需优先使用，不能被 mock 替换。
- 缺少影响诊断的实际数据或字段时询问必要信息；无法取得的真实数据绑定保留其契约并说明验收限制，不填 mock 冒充成功。
- Mock 仅用于用户明确请求/允许的教学或样式演示，明确标注来源；无固定“至少 5 条”要求，不把演示配置报告为原业务问题已经修复。
- 验证检查真实产物、数据和必要交互，不添加只匹配 Markdown 用词的测试。未执行、只做走查或格式解析不能登记为实际渲染通过。
- 原版行为测试未失败时如实记录，不人为诱导失败；本期验收证明规则和指定边界成立，不推导成功率提升。
- 不发布、不向 issue 发消息、不更新全局安装副本；提交 PR 前遵循仓库全量视觉基线要求。

## 文件与职责

以下路径相对仓库根目录。

| 文件 | 修改范围 |
| --- | --- |
| `skills/vchart-development-assistant/SKILL.md` | 限定 spec 识别信号的作用范围，明确“任务内容不自动改变已建立目标” |
| `skills/vchart-development-assistant/workflows/scenario-2-generation.md` | 共享入口引用主规则，不把修改输入的 spec 当作最终产物选择 |
| `skills/vchart-development-assistant/README.md` | 修正“已有 spec 修改沿用配置目标”的无条件表述 |
| `docs/assets/guide/zh/tutorial_docs/VChart_Skill_Usage.md`、对应英文文件 | 对齐相同的上下文保持规则，保留已有内容和图片 |
| `skills/vchart-development-assistant/workflows/scenario-1-diagnosis.md` | 对齐信息收集与描述诊断的数据来源；去除无条件 mock 和最少条数要求 |
| `skills/vchart-development-assistant/evals/generation-scenarios.md` | 增加 R01–R07 专项边界，复用既有场景作回归 |
| `docs/superpowers/validation/2026-10-14-vchart-delivery-context-and-diagnostic-data.md` | 实施时新增，记录当前工作区快照、实际任务与验收限制 |

HTML/spec 专项流程已要求保持目标和使用真实数据，本期只检查它们与上述修复一致；不重写或复制一套规则。上一轮验收记录保留，本轮新增记录，不能将旧结果直接改为新修复通过。

## Task 1：修复交付识别信号与既有目标的优先级

**输入：** 用户本轮要求、既定 HTML/spec/组件目标、作为输入的已有配置。
**输出：** 沿用或明确切换后的交付目标。

- [x] 冻结当前技能到新的临时目录，保留本轮修复前的实际工作区版本，避免错误地比较上一轮优化前的 HEAD：

```sh
python3 - <<'PY'
from pathlib import Path
import shutil
import tempfile
snapshot = Path(tempfile.mkdtemp(prefix='vchart-review-before-'))
shutil.copytree('skills/vchart-development-assistant', snapshot / 'vchart-development-assistant')
print(snapshot)
PY
```

- [x] 用冻结副本执行一次 R01、R04，保存实际产物和决策。不要求必然失败；静态歧义可以存在于一次正确输出中。
- [x] 在主文件将交付规则明确为下列语义，场景表的信号只在该顺序内使用：

```text
1. 本轮明确指定产物或变更格式：按要求交付，遵守实际能力限制。
2. 未指定变更：保持已建立的交付目标，包括已有 HTML、组件和组合产物。
3. 仍无目标：根据当前任务识别；独立配置请求选 spec，独立展示选 HTML。
4. 必要歧义影响可用性时才澄清。

已有 spec 是配置输入，不等于用户请求 spec 作为最终输出。
```

- [x] 主文件相关条目写为：“尚未建立交付目标时，独立的配置生成/修改请求选择 spec；已有 HTML 或组件上下文时保留原产物，除非用户明确改变交付要求。”React 特例和组合交付继续成立。
- [x] 共享生成流程继续引用主文件，并明确 HTML 内 spec 修改不重新路由。只修改冲突句，不再定义第二套默认值。
- [x] README 及中英文教程同步：已有 HTML 中的 spec 修改继续交付 HTML；独立 spec 修改继续交付 spec；“只返回 JSON”是明确变更，优先于旧 HTML 目标。
- [x] 执行 R01–R03，确认上下文保持、显式切换和无既定目标的配置请求均成立。对 R01 实际打开更新页面，核对原数据、标签和既有交互。

建议提交：`docs(skills): preserve delivery target during spec edits`。

## Task 2：修复描述诊断的真实数据与 mock 规则

**输入：** 当前或此前提供的数据、可访问真实数据源/绑定、错误描述、是否已有 spec，以及是否明确为演示任务。
**输出：** 使用真实数据的修复配置、必要澄清，或明确标注的演示配置。

- [x] 配置诊断的信息收集先复用已提供信息，只补充影响定位的缺项；移除“至少 3–5 条”机械要求，防止已有上下文仍被重复追问。
- [x] 描述诊断在“问题类型/图型/目标”之外，检查已有真实数据、字段、单位和可用绑定。不要因为未提供原 spec 就默认生成数据。
- [x] 用以下规则替换“构建至少 5 条 mock 数据”：

```text
真实数据或可用绑定已知：按原字段和口径构建配置，不替换或增加记录。
真实数据缺失且影响诊断：询问必要数据/字段，不能伪造完整业务修复配置。
绑定真实但本地不可访问：保留绑定契约，区分配置分析与未完成的运行验收。
用户明确请求或允许演示：可用明确标注的 mock 解释问题，不报告业务修复通过。
```

- [x] 仍按既定 HTML/spec 目标交付，不因数据不足强制 HTML；无法完成时说明或澄清，不输出空数据或假数据的“已修复”配置。
- [x] 对照主文件、共享流程和 spec 流程检查一致性；只将诊断分支收敛到现有真实数据规则，不新增数据解析器。
- [x] 执行 R04–R07：真实数据、缺少必要信息、允许 mock 演示、不可访问绑定分别检查。实际 JSON 的记录数、字段和原值必须可核实。

建议提交：`docs(skills): use actual data in descriptive diagnosis`。

## Task 3：专项行为验证与已有场景回归

每个独立任务只提供技能、原始请求和必要输入，不提供判定答案或疑似问题。R01 先完成 HTML 生成，再在同一任务追加真实修改请求，以实际历史验证目标保持。描述诊断任务按需读取诊断工作流，审查读取记录以确认该分支被覆盖。

| ID | 完整请求与上下文 | 检查内容 |
| --- | --- | --- |
| R01 | 第一轮：“周一 12、周二 25、周三 18、周四 32。生成完整 VChart HTML，点击柱子在页面显示 day/value；先不显示数值标签。”第二轮：“在已有 HTML 中，把 spec 的数值标签打开，其他内容保留。” | 第二轮仍是完整 HTML；四条数据不变；真实标签出现，点击结果仍正确；没有只交付 JSON/spec |
| R02 | 使用 R01 的完整 HTML 上下文，新请求：“现在只返回其中更新后的完整 JSON spec，不要 HTML 或解释。” | 明确变更生效；最终答复可解析 JSON，无实例/事件代码；数据完整 |
| R03 | 独立上下文，提供完整周数据 JSON 柱图：“加上数值标签，返回修改后的配置。” | 完整 spec，不因独立展示默认值生成 HTML；没有退化成补丁 |
| R04 | “我的 VChart 柱图数值轴空白，没有原 spec。真实数据为 [{day:'周一',amount:11},{day:'周二',amount:23},{day:'周三',amount:7},{day:'周四',amount:35}]，amount 单位为元。请按这些真实字段提供可用完整 JSON 配置，不要解释。” | 覆盖描述诊断流程；只含四条真实记录，保留 day/amount 和单位；不能替换成 A/B 类别或增加第 5 条；不能声称已定位未提供代码的根因 |
| R05 | “业务图数值不对，我暂时没有原配置、实际数据或字段定义。请给修复后的完整 spec，不能使用模拟数据。” | 询问必要信息或说明当前不能完成；不填 mock、不虚构字段，不报修复/渲染通过 |
| R06 | “这是教学演示：请用明确标注的 mock 数据解释 yField 指错导致柱图空白的情况，给可运行 HTML。” | 演示能力保留，标注 mock；可运行修复示例；不声称真实业务问题已解决 |
| R07 | “宿主负责绑定 dataId='actual-orders' 的真实数据，字段 day/amount，但本地不能访问它。我没有原 spec，只知道数值轴空白；请给配置排查方向，保留真实绑定，不生成模拟数据。” | 保留绑定信息，不以内嵌 mock 替代；区分候选原因、配置检查与未执行运行验收 |

- [x] R01 与 R04 修复后各执行两次，其余各一次；另复用已有 G01、G03、G08-R 请求各一次。重复次数只作为边界冒烟，不宣称统计稳定性。
- [x] 对 R01 比较改动前后数据、应用交互和实际标签。不要只看 HTML 文件存在或单个 canvas；明确切换的 R02 按纯 JSON 检查。
- [x] 对 R04 用标准 JSON 解析器核对真实字段与完整记录：

```python
expected = [
    {'day': '周一', 'amount': 11},
    {'day': '周二', 'amount': 23},
    {'day': '周三', 'amount': 7},
    {'day': '周四', 'amount': 35},
]
data = actual_spec['data']
sources = data if isinstance(data, list) else [data]
assert len(sources) == 1
assert sources[0]['values'] == expected
assert actual_spec['xField'] == 'day'
assert actual_spec['yField'] == 'amount'
```

`actual_spec` 是从实际答复解析的 JSON，不能由测试者重写后再检查。此处检查的字段绑定适用于该固定垂直柱图任务，不把它变成通用 VChart 校验器。

- [x] R04 条件允许时实际渲染四个原值；R06 实际打开修复演示；R07 不通过接入 mock 伪造运行结果。记录所有无法执行的阶段。
- [x] 运行既有转义单测、技能结构校验和本地链接检查；本期不新增文本匹配测试：

```sh
python3 -m unittest discover -s skills/vchart-development-assistant/tests -v
git diff --check
```

结构校验复用现有 `skill-creator/scripts/quick_validate.py` 与可用的 PyYAML 环境；不修改项目依赖。

- [x] 保存独立的 validation 文档，记录修复前/后实际观察、两项问题对应的证据、回归结果和未验证范围；保留上一轮记录。
- [ ] 提交 PR 前按仓库要求运行 `node packages/vchart/scripts/visual-test.mjs`，审查报告。本轮未创建 PR，仅修改 Markdown，未重跑图库视觉比较；此项保留为未来 PR 的前置要求。图表基线不能代替上述技能行为测试，也不能因其通过就忽略数据/产物错误。

## 完成条件

- [x] 输入含 spec 不再自动覆盖已建立的 HTML/组件/组合目标，显式产物变更仍优先。
- [x] 描述诊断优先使用真实数据/绑定，未提供 spec 不再触发无条件 mock。
- [x] 缺少关键信息时不伪造配置；明确教学演示仍可使用标注的 mock。
- [x] R01–R07 与三项既有回归有真实结果记录，实际 HTML 交互与 JSON 数据核对符合要求。
- [x] 规则集中维护，没有新增场景、运行时改造、schema 或依赖。

## 深度交互

这两项修复都属于规则优先级收敛：输入类型不决定最终产物，缺少配置不决定数据来源。维护一条主决策并让专项流程遵循，比新增更多例外或场景更容易长期保持一致。
