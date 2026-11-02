# VChart 交付上下文与诊断数据专项验收

日期：2026-10-14。对应 [专项计划](../plans/2026-10-14-vchart-delivery-context-and-diagnostic-data.md) 和 [技能入口](../../../skills/vchart-development-assistant/SKILL.md)。本轮基于上一轮未提交优化继续修改，仅调整技能规则、教程和评估文档；未提交、创建 PR、发布或同步全局安装副本。

## 修复范围

- 主文件明确：本轮要求优先，其次保持既有产物；只有目标尚未确定时才按任务识别。已有 spec 是输入，不能单独触发产物切换。
- 修改 HTML 内的 spec 继续交付完整 HTML；组件和组合交付保留原目标；明确“只返回 JSON”仍可切换。共享生成和诊断输出入口均引用主规则，README、中英文教程同步。
- 描述诊断先复用真实数据、字段、单位和绑定；移除无条件 mock 与固定样本条数。缺少必要信息时澄清，绑定不可访问时保留契约并说明限制。
- 明确允许的教学演示仍可使用标注的 mock；诊断示例注明其教学前提，不能将其报告为原业务根因已定位或修复。
- 未改图库运行时、生成器、模板、React 实现；未引入 schema、依赖或新增技能场景。

## 环境与方法

- HEAD：`6fff2041c1a060800791f3c3d6212bb3812b504b`。修复前快照来自当时完整工作区技能，位置 `/var/folders/p6/3_mdjbzd59n9q8rgt0s6h5240000gn/T/vchart-review-before-lw59icc9/vchart-development-assistant`，未用优化前 HEAD 冒充对照。
- Node.js `v22.23.3`，Playwright Chromium `153.0.8010.12`。本轮实际渲染的新版产物使用 VChart `2.1.7`；修复前 R01 使用 `2.0.0`，因此对照不构成固定运行时的效果实验。
- 新版共 11 个从无父历史开始的独立 Agent 任务；R01 两次都各含两轮，R02 为 R01-a 第三轮。合计 9 次专项场景执行与 3 次既有回归。R01/R04 各两次，其余各一次。
- 沿用默认模型设置，无 model/reasoning override。任务只接收技能路径、实际请求、必要输入和产物目录，不接收判定答案。诊断任务明确读取诊断工作流；已检查实际产物、渲染记录、截图和验证脚本。
- 原始产物与复现脚本在 `/tmp/vchart-followup-evals/`。临时目录可能被清理；以下保留关键数据、实际结论及限制，不把临时产物作为技能运行依赖。

## 修复前对照

| 任务 | 实际结果 |
| --- | --- |
| R01，一次两轮 | 仍交付完整更新 HTML，标签开启、四条数据保留、逐柱点击正确；`before-r01/updated-verification.json` 无浏览器错误 |
| R04，一次 | 返回合法 JSON，保留 day/amount 与 11/23/7/35 四条原值，没有新增 mock；只做格式和数据检查，未渲染 |

两项对照均通过。原规则仍有文本冲突，本轮消除冲突并确认指定边界；少量样本不能证明成功率提升或长期统计稳定性。

## 专项实际结果

| 场景 | 次数 | 验收结果与证据 |
| --- | --- | --- |
| R01，HTML 内 spec 修改 | 2 | `r01-a`、`r01-b` 均保留完整 HTML。父任务比较初始与更新文件，实际变化仅为源配置和编辑器中的 `label.visible: false → true`；四条 day/value 为周一12、周二25、周三18、周四32。浏览器真实显示四个数值标签，逐根点击分别显示对应 day/value；无页面错误。A 另验证编辑后点击仍有效 |
| R02，明确切换 JSON | 1 | R01-a 第三轮的 `converted-spec.json` 可直接解析，包含完整四条原数据、字段和 `label.visible=true`，无 HTML、实例创建或事件绑定；父任务核对实际文件 |
| R03，独立配置修改 | 1 | `r03/spec.json` 是完整 JSON，原 data/type/xField/yField 保留并开启标签，未转 HTML、未退化为补丁；格式及数据检查通过，未渲染 |
| R04，无 spec 但有真实数据 | 2 | `r04-a/spec.json`、`r04-b/spec.json` 都只有四条原始 day/amount 记录，值为 11/23/7/35，映射 day/amount，轴标题“金额（元）”。父任务实际渲染两份产物：四根正高度柱、图元原值及单位正确，无浏览器错误；证据 `parent-render-validation.json`、`parent-preview.png` |
| R05，缺必要数据且禁止 mock | 1 | `r05/response.md` 说明当前无法可靠生成修复配置，只索取真实数据/绑定、字段单位、当前与期望数值及口径；未伪造字段、数据、spec 或渲染结论 |
| R06，明确允许 mock 教学 | 1 | `r06/diagnosis.html` 使用标注的 A=10/B=20/C=15 MOCK，明确非业务修复。实际错误配置 `yField=values` 无有效高度柱，修复 `yField=value` 有三根柱；在错误侧编辑后恢复三根柱且数据不变。`verification.json` 断言通过、无页面错误/请求失败；截图确认教学说明和对比图 |
| R07，不可访问真实绑定 | 1 | `r07/response.md` 保留 `dataId='actual-orders'`，列出绑定、字段、轴关联、标签和范围等候选检查；未填 mock/空 values，明确未访问真实数据、未在目标宿主渲染，不声称已定位根因 |

## 已有场景回归

| 场景 | 次数 | 实际结果 |
| --- | --- | --- |
| G01，纯 JSON 生成 | 1 | `regression-g01/spec.json` 是纯 JSON 完整柱图，day/value 及周一12、周二25、周三18、周四32 全部保留，无围栏、解释或 HTML；父任务解析及数据检查通过，未渲染 |
| G03，宿主消费配置 | 1 | `regression-g03/spec.json` 遵守原宿主仅 JSON、bar/line、无函数约束，完整四条原数据及字段正确，无宿主外壳；格式及数据检查通过，未在宿主渲染 |
| G08-R，React 修复 | 1 | `regression-react/Chart.jsx` 导入并使用标准 `VChart` 完整 spec 入口，`data.values=rows`，保留 props 数据，未转 HTML 或只给 spec。父任务对照仓库 VChart 导出、BaseChart spec 解析契约；交付与源码走查通过，未编译 JSX、未挂载或验证 props 更新 |

## 基础检查与范围限制

- 官方 `skill-creator/scripts/quick_validate.py`：通过，`Skill is valid!`。沿用上轮 `/tmp/vchart-skill-validation-20261014` 的临时 PyYAML 环境，未改项目或全局依赖。
- 既有模板字符串转义 unittest：1 个用例通过，使用 Node.js 22 的 PATH。该生成器修复来自上一轮，本轮生成器/模板与修复前快照逐文件一致。
- 本地 Markdown 文件链接和 `git diff --check`：通过。覆盖技能主文件、README、全部工作流、专项计划与验收文档；教程未删除既有内容或图片。
- 本轮仅 Markdown 变更，未重新运行图库全量视觉比较。上一轮相同图库代码的官方 develop 比较为 266 passed、0 diff、0 error、0 not_run，见 [上一轮验收](2026-10-14-vchart-development-assistant-optimization.md)。这是先前结果，不能算成本轮新运行；未来提交 PR 前仍须按仓库要求运行并审查全量视觉报告。
- JSON 格式/数据检查、浏览器渲染、宿主验收分别记录。未访问 `actual-orders` 宿主；React 回归不预设已挂载；少量行为冒烟不证明自动技能发现率或所有既有请求都无回归。
