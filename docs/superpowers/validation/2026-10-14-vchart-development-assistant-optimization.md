# VChart 技能 HTML/spec 场景优化验收

日期：2026-10-14。对应 [实施计划](../plans/2026-10-14-vchart-development-assistant-optimization.md) 与 [技能入口](../../../skills/vchart-development-assistant/SKILL.md)。本次修改仓库源码，未更新已安装技能、提交、发布或向 issue 发送消息。

## 完成范围

- 主文件将生成、诊断、视觉还原的任务类型与 HTML/spec 交付目标分别判断；明确要求、既有上下文、任务目标与独立 HTML 默认按顺序处理。
- 配置生成保留共享选图/查询，新建 HTML 与 spec 专项流程；诊断、React 和视觉还原对齐目标保持。
- 增量修改默认交付完整产物；片段需明确请求。JSON/JS 遵循宿主和已有格式，原生声明式交互不混入实例 API；组合交付使用同一份 spec。
- 补充三份完整示例、中英文教程和行为任务定义；不新增 schema 校验、预览平台或共享渲染器。
- 真实回调验收暴露生成器文本插值错误，进行了最小转义修复与对应回归测试，没有改变图表生命周期或图库代码。

## 环境与独立执行

- 仓库 HEAD：`6fff2041c1a060800791f3c3d6212bb3812b504b`；工作区包含本次未提交技能与文档改动。
- Node.js：`v22.23.3`；macOS arm64；Playwright `1.63.0`；Chromium `153.0.8010.12`。
- 生成器及 Python unittest 使用系统 Python `3.9.6`。官方 quick_validate 需要 PyYAML，现有解释器未安装；在 `/tmp/vchart-skill-validation-20261014` 的临时 Python 3.11 venv 安装 PyYAML 6.0.3 后通过，未添加项目/全局依赖。
- 新版执行 23 个独立任务，其中 G06 另含同一任务的第二轮修改；关键 G01–G04 每类三次，G08-R/G08-I 分别执行，补充 G11–G14 四个边界任务。每个任务从无父对话历史的独立 Agent 开始，G06 后续轮保留其实际历史。
- 使用相同默认继承模型设置，未覆盖 model 或 reasoning effort。工具没有提供确切模型标识，不将这次记录视为指定模型的长期成功率评测，也未测试自动技能发现率。
- 每个 Agent 只收到实际请求、技能路径、必要输入与输出目录，没有收到优化计划、判定答案或已知错误。评估定义见 [generation-scenarios.md](../../../evals/vchart-development-assistant/generation-scenarios.md)。
- 原始产物、截图、实际验证脚本保留在 `/tmp/vchart-skill-evals/`；临时目录可能被系统清理，本文保留实际结论、关键数据和复现入口，不把临时产物作为技能运行依赖。

## 基础检查

| 检查 | 实际结果 |
| --- | --- |
| 官方 `quick_validate.py` | passed，Skill is valid |
| 修改技能文件的相对文件链接 | passed，无缺失本地文件链接 |
| 三份示例与实际 JSON 交付字段/原值 | passed，周数据顺序和值 12/25/18/32 保留 |
| `git diff --check` | passed |
| Python 回调代码转义回归 | passed，1 个用例；修复前因 datum 未定义执行失败 |
| 原演示生成器及诊断生成器 | 三份示例 HTML、诊断 HTML 生成成功；React CLI help 正常，仅作为生成/命令冒烟 |

复现回归测试（仓库根目录，Node.js 22 在 PATH）：

```sh
python3 -m unittest discover -s skills/vchart-development-assistant/tests -v
```

结构检查命令：

```sh
/tmp/vchart-skill-validation-20261014/bin/python   /Users/bytedance/.codex/skills/.system/skill-creator/scripts/quick_validate.py   skills/vchart-development-assistant
```

该路径只记录本机实际执行。其他环境使用已有 PyYAML 的 Python 运行同一标准校验脚本，不需要复用本机路径。

## 实际产物与场景判定

| 任务 | 次数 | 实际观察与判定 |
| --- | --- | --- |
| G01 纯 JSON | 3 | 三次最终答复均是完整 JSON 柱图，四条原值和顺序正确，无额外说明、HTML、实例代码或确认问题；passed |
| G02 明确 HTML | 3 | 三份完整 HTML，Chromium 实测四根柱及原数据，VChart 2.1.7；passed |
| G03 宿主上下文 | 3 | 三份宿主可消费 JSON 配置，无宿主外壳或框架追问；配置文件与必要的对话说明分离；passed |
| G04 独立展示默认 | 3 | 三次交付可查看 HTML，实际渲染原数据；没有被 spec 路由抢占；passed |
| G05 JSON 无业务事件能力 | 1 | 给合法配置并明确无法实现点击 POST 及所需宿主能力，没有制造事件字段或真实请求接口；passed |
| G06 诊断及后续改动 | 1，含两轮 | yField 从 values 修复为 value；第二轮加 label.visible 后仍返回完整 JSON/data；passed |
| G07 点击 datum | 1 | 四根柱的真实点击分别显示 day/value；编辑重渲染后再次逐柱断言通过，无页面错误；passed |
| G08-R React | 1 | 交付带 BarChart 导入、以 rows props 传 data 的完整 JSX，不强制 HTML/spec；核对仓库 props/导出源码；路由与源码契约 passed，未进行组件挂载 |
| G08-I 图片还原 | 1 | 实际读取截图，JSON 保留真实周数据、颜色 #3b82f6、barMaxWidth=56 和标签样式；VChart 2.0.0 实际绘制四根柱，颜色/宽度与输入一致；passed |
| G09 数值 ID/零/缺失 | 1 | id 101/102/103 保持类别，amount=0/null/25 不改写；父任务用本地 2.1.7 UMD 复核 band 轴与原数据；passed |
| G10 无浏览器 | 1 | 完整 JSON、自检记录，无 HTML 或虚构渲染证据，明确未执行浏览器/宿主验证；passed |
| G11 完整增量 | 1 | “加标签”返回完整 data/type/字段/label，而非补丁；父任务实际渲染四根柱；passed |
| G12 JSON tooltip | 1 | 原生 tooltip.visible/trigger 在 JSON spec 内，无 HTML、实例事件或函数；父任务实际渲染通过；passed（未把该项记为 tooltip hover 内容验收） |
| G13 组合交付 | 1 | JSON spec 和 HTML 齐全；父任务比较 HTML 的 SPEC_START 源配置与 JSON 全量对象完全相同，实际四根柱值正确；passed |
| G14 JS 回调 | 1 | 完整 JS 保留 formatMethod(text, datum) 条件回调；实际标签为周一 12 较低、周二 25 较高、周三 18 较低、周四 32 较高；值=20 的边界断言为较高；passed |

原始目录：`g01-a/b/c`、`g02-a/b/c`、`g03-a/b/c`、`g04-a/b/c`、`g05`、`g06`、`g07`、`g08-react`、`g08-image`、`g09`、`g10`、`g11`、`g12`、`g13`、`g14`，均位于上述临时根目录。父任务另复核了相关 JSON/data、五份实际 JSON 渲染和组合交付源对象；不是只采信 Agent 的自述。

### 原版对照

从 HEAD 通过 `git archive` 冻结原技能至 `/tmp/vchart-skill-evals/old/skills/vchart-development-assistant/`，不覆盖工作区。使用相同 G01、G03、G04 请求分别执行一次，产物在 `old-g01`、`old-g03`、`old-g04`。

三项对照均得到正确产物：旧版也能够遵循明确 JSON 请求和宿主上下文，并为独立展示交付 HTML。因此本次样本**没有证明新版成功率高于旧版**。本次明确改善是消除主文件/生成流程中的输出冲突、将两条场景边界及增量/交互规则集中维护。三轮重复测试是冒烟检查，不证明长期稳定性。

## 真实示例与受控反例

原生成器生成的周数据柱图、同一总体饼图及 JS 回调标签示例在 Chromium 实际渲染，运行时均报告 VChart 2.1.7：柱图 4 根、饼图 2 个扇区，数据为原值；JS 标签实际显示“周一: 12”等四项。证据 `/tmp/vchart-skill-evals/examples/validation.json` 与对应 PNG。

回调示例初次渲染失败：`datum is not defined`，页面没有 window.vchart。原生成器把回调代码注入 `initialCode` 模板字符串，却未转义 `${...}`，导致代码文本被提前执行。修复只在 `escape_js_string` 中增加 `${` 转义；回归测试验证 JS 文本完整往返，Unicode、反引号、反斜线和换行保留，文本里的 `${globalThis.executed = true}` 未执行。修复后重生成并实际渲染三份示例通过。

G07 受控反例：不执行点击时，目标 day/value 断言在限定时间内失败；随后真实点击首柱才得到“day: 周一，value: 12”。记录 `/tmp/vchart-skill-evals/g07/counterexample.json`。不以鼠标动作成功或截图存在代替交互判定。

## 官方基线全量视觉比较

实际命令（仓库根目录）：

```sh
PATH=/Users/bytedance/.nvm/versions/node/v22.23.3/bin:$PATH   node packages/vchart/scripts/visual-test.mjs
```

- 状态：passed；完整比较 true；266 passed，0 diff，0 error，0 not_run。
- 官方 develop 基线 SHA：`c5ec72804c6b7205d69f1d93e65b299741404547`；没有使用 self-compare。
- 已读取 [agent-summary.md](../../../.vchart-visual/runs/1791960528746-45ab1c94/agent-summary.md) 及 summary.json，所有用例均无差异或执行错误。[三图报告](../../../.vchart-visual/runs/1791960528746-45ab1c94/index.html)。
- 此次运行在技能文档编辑过程中完成；后续变化只有教程、评估材料和上述 HTML 生成器文本转义修复。图库运行时没有变化；转义修复由独立单元与真实产物渲染覆盖，没有把之前的图库截图当成该修复的验证。

## 验证限制

未访问实际飞书等目标宿主，没有记录宿主验收通过。React 子任务验证交付路由、JSX 与源码契约，没有进行实际组件挂载；本次没有修改 React 运行时。JSON 解析、配置自检、真实浏览器渲染与目标宿主验证分别记录，不将其相互替代。本期没有 schema 阶段。
