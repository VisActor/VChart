# VChart 技能元数据分发精简验收

日期：2026-10-16。对应 [实施计划](../plans/2026-10-16-vchart-skill-metadata-distribution.md) 与 [维护说明](../../skills/vchart-development-assistant-maintenance.md)。实施验收阶段未提交；用户随后授权整理并创建本地提交，未授权推送、创建 PR、发布或同步全局技能。

## 结果

- 全部 36 份 type-meta 改为格式 3，只分发最终属性、配置说明、版本边界、扩展约束与类型导航。
- 移除逐属性 `source/inheritedFrom/category/originalType`、完整继承树及顶层维护信息；内部抽取模型继续保留这些信息，审计错误仍能定位源码。
- 来源清单迁至 `packages/vchart/scripts/skill-metadata/metadata-sources.json`；README 的维护章节迁至仓库维护说明。前序 evals 迁移保持不变。
- type-meta 从 **3,507,786 bytes 降到 1,233,236 bytes，减少 64.84%**；`bar.json` 从 119,080 bytes 降到 42,934 bytes。
- Node 22 下 **29/29 项工具测试通过**，`audit` 为零错误/零来源缺项，连续两次 `check` 均无漂移。3 个独立技能任务的真实产物均完成浏览器检查。

## 环境和证据

- 起始 HEAD：`e4517de1dee49b814ccf73669121251598c12f3b`，同时保存在基线目录 `sha.txt`；实施验收阶段没有创建新提交。起始状态包含前序 evals 迁移及本计划，保存为 `initial-status.txt`。
- 主执行与最终检查使用 Node.js `v22.23.3`，TypeScript `4.9.5`，核心/扩展 VChart `2.1.7`。
- 临时基线和产物目录：`/var/folders/p6/3_mdjbzd59n9q8rgt0s6h5240000gn/T/vchart-metadata-distribution.498plj0q/`。其中包含完整原技能 `skill/`、候选 `candidate/`、完整候选 references、审计报告、源模型对照脚本和浏览器产物。临时目录可能被系统清理，本文记录主要结论及复现方式。
- 全量工具测试日志：`/tmp/vchart-distribution-full-tests-final.log`；初次缺少投影模块的测试和缺失空依赖数组的审计反例分别先失败，修复后通过。
- 官方 `quick_validate.py` 首次因系统 Python 缺少 PyYAML 未运行成功；复用已有 `/tmp/vchart-skill-validation-20261014/bin/python` 环境后返回 `Skill is valid!`，未安装新依赖。

## 与旧已提交资料的差异及必要修正

初始全入口测试发现旧清单的 `packages/vchart/src/chart/sequence/interface.ts` 不存在，无法重生成。本轮没有恢复已删除类型或绕过该入口，而是核对当前源码后修正为 `packages/vchart-extension/src/charts/sequence/interface.ts`、扩展包及 `registerSequenceChart` 注册前提。来源清单的其他 35 个入口和 74 项人工详情映射保持不变。

旧 JSON 与当前源码/已安装依赖还存在以下变化，和分发投影区别记录：

| 项目 | 已核实差异 |
| --- | --- |
| 最终属性 | 共 2,601 项，只有 `common.series` 的类型与依赖集合变化：当前核心公开类型不再包含迁往扩展的 `IDotSeriesSpec/ILinkSeriesSpec`；其余 2,600 项保留字段逐值一致 |
| 依赖定义 | `common` 移除上述两个已不属于核心联合的定义；其余导航键、类型名与 reference 不变 |
| 外部版本 | VRender 相关包从旧记录 1.1.11 更新为当前 1.1.12；VDataset 从 1.0.27 更新为 1.0.28，路径与导航锚点不变 |
| sequence | 最终属性不变，新增真实扩展版本与注册要求 |
| 补充声明 | 590 节变为 583 节，537,354 bytes 变为 529,835 bytes；移除迁出核心且不再被当前入口引用的 7 节，正文变化仅为 `ChartSpecMap/ICommonChartSpec` 的真实核心类型变化，另同步外部版本来源行 |
| topkey 与人工详情 | 全部逐字节不变；人工详情指向补充声明的链接无新增断链 |

因此，计划中“旧资料的所有保留字段和补充声明均不变”调整为：分发投影不改变当前源码的抽取结果，上述既有资料过期项按真实来源同步，禁止隐藏为精简变化。

额外把 HEAD 原版 `extract.mjs` 保存到临时目录，用相同的当前来源清单、源码和依赖独立创建上下文，逐图型比较本轮抽取器与原版结果：**36 个完整内部模型、2,601 个属性均深度相等，生成补充声明也逐字节相等**。这验证了资料更新来自原有源码/依赖漂移，未因分发投影改变类型解析。

## 工具验证

| 检查 | 实际结果 |
| --- | --- |
| 纯投影 | false、0、空字符串、null、版本说明、扩展约束、同名定义及别名绑定保留；不修改输入 |
| 审计反例 | 遗留维护字段、缺属性说明/required/dependencies、错误方向类型、错误类型名/reference、别名目标交换、注册约束丢失均被拒绝 |
| 维护诊断 | 错误方向类型仍报告 `packages/vchart/src/chart/cartesian/interface.ts` |
| 既有深层测试 | Omit、同名类型、泛型、typeof、循环依赖、缺失导入、无部分输出、真实 CLI 等测试保留并通过 |
| 候选及最终 audit | `errors: 0`、`sourceChanges: 0`；开放边界 1 项、运行时契约说明 1 项 |
| check | 两次 `changed: []`、`orphanMetadata: []`；最终测试还执行真实 CLI 检查 |
| 格式和差异 | 修改的 5 个 JS 文件 Prettier 检查通过，`git diff --check` 通过 |

审计还检查保留字段的存在性：缺少简单属性的空 `dependencies: []` 不能被静默归一化后当成通过。该反例先失败，补强字段存在性检查后，重新执行全部 29 项测试通过。

## 独立技能消费及实际渲染

三个任务使用无父对话历史的独立上下文，按计划顺序执行，未覆盖 model 或 reasoning effort。没有确切模型标识，不将这三次冒烟观察推广成成功率或自动技能发现率评测。子任务自述的资料读取与本次主任务实际检查的产物分开：主任务读取原产物并运行浏览器验证，不仅采信最终自述。

| 任务标识 | 产物与读取说明 | 主任务实际验收 |
| --- | --- | --- |
| `/root/distribution_horizontal` | `agent-artifacts/m01/spec.json`；子任务报告读取 bar topkey/type-meta、数据说明及工作流 | 原 spec 未重写，既有验证器在 VChart 2.1.7 渲染 4 根有效水平柱；四条数据与次序保持，图元几何正确 |
| `/root/distribution_callback` | `agent-artifacts/g14/spec.js`；子任务报告读取 bar 元数据、ILabelSpec 与回调示例 | 原 JS 配置未重写，实际渲染 4 根柱，真实文本为“周一: 12 较低”“周二: 25 较高”“周三: 18 较低”“周四: 32 较高”；无页面错误 |
| `/root/distribution_html` | `agent-artifacts/g02/chart.html`；子任务报告使用共享/HTML 工作流、元数据及原模板/生成器 | Node 22 重新检查两个内联脚本语法；原 HTML 经本地 HTTP 打开，在线 VChart 2.1.7 与 Monaco 依赖实际加载，4 根柱和数据正确，无页面错误或请求失败 |

三份截图由主任务查看，确认方向、四条数值和标签可见。JSON/JS/HTML 的验证输出分别为 `spec-parent-validation.json`、`callback-render.json`、`html-render.json`，截图在各任务目录。

执行边界说明：HTML 子任务最初使用默认 Node 24 做静态检查，并额外读取了一份仓库外的 brainstorming 技能文件；该读取不符合子任务限定范围，记录为执行偏差。主任务随后使用 Node 22 对同一原产物重新检查及渲染；未将子任务的静态检查冒充浏览器通过。

## 复现主要检查

使用 Node.js 22，从仓库根执行：

```sh
node --test packages/vchart/scripts/skill-metadata/distribution.test.mjs packages/vchart/scripts/skill-metadata.test.mjs
node packages/vchart/scripts/skill-metadata.mjs audit --report /tmp/vchart-metadata-distribution-audit.json
node packages/vchart/scripts/skill-metadata.mjs check
node packages/vchart/scripts/skill-metadata.mjs check
git diff --check
```

已有本次实际 Agent 产物时，水平柱图可复用：

```sh
node packages/vchart/scripts/skill-metadata/verify-examples.mjs --artifacts /var/folders/p6/3_mdjbzd59n9q8rgt0s6h5240000gn/T/vchart-metadata-distribution.498plj0q/agent-artifacts --case m01
```

缺失临时产物应记录为 `not_run`，不能凭进程退出码登记通过。

## 验证范围

本轮没有修改图库运行时、HTML 生成器、模板或公开类型。未运行新的 3D 图元用例、目标业务宿主验收或全量视觉回归；扩展注册和开放契约只完成元数据/反例检查。未来创建 PR 前仍需按仓库要求执行全量视觉回归并审查报告。本次未将这些未执行项登记为通过。
