---
name: vchart-development-assistant
description: 使用 VChart 生成可查看的 HTML 或供宿主消费的完整 spec，修改和诊断图表配置，从截图还原样式，并支持 React-VChart 和图表交互。用于 VChart 图表生成、配置、排错和应用集成。
---

# VChart 图表开发助手

根据表达目标和数据选择图表，生成有效配置，再按用户需要交付 HTML 或 spec。支持 VChart 2.0.0+；已知目标版本时查询该版本支持的能力，不把“2.0.0+”当作所有配置都跨版本兼容的保证。

## 先确定任务与交付目标

任务类型与交付目标分别判断。生成、诊断、视觉还原可以交付 HTML 或 spec；React 和 API 集成是按需能力模块。

| 场景 | 识别信号 | 流程 |
| --- | --- | --- |
| HTML 生成 | 可运行 demo、HTML、直接打开查看；没有宿主上下文的独立展示需求 | [共享生成](workflows/scenario-2-generation.md) → [HTML 交付](workflows/scenario-2-html-generation.md) |
| spec 生成 | 只要 spec、JSON 配置、嵌入已有图表；上下文已声明宿主消费配置 | [共享生成](workflows/scenario-2-generation.md) → [spec 交付](workflows/scenario-2-spec-generation.md) |
| 问题诊断 | 已有配置或应用报错、不显示、交互不生效 | [诊断](workflows/scenario-1-diagnosis.md)；React 问题按需读 [React 专项](workflows/scenario-1-react.md) |
| 视觉还原 | 图表截图、设计稿或 Figma | [视觉还原](workflows/scenario-3-image-replication.md) |

交付选择顺序：**本轮明确要求 → 已建立的宿主或应用上下文 → 尚未确定目标时识别当前任务 → 独立展示默认 HTML**。场景表的信号按此顺序使用，不能覆盖已建立的交付目标。

- 尚未建立交付目标时，独立的配置生成/修改请求选择 spec。“已有 spec”是配置输入，不等于请求 spec 作为最终产物；修改已有 HTML 内的 spec 继续交付 HTML，组件或组合产物也保留原目标，除非用户明确改变输出要求。已有 React 组件问题继续交付组件修复。
- “加标签”“换图型”“修复报错”改变任务内容，通常不改变交付目标；沿用前文的格式和产物。只有明确要求片段或补丁时才仅返回局部配置，增量修改默认交付整合后的完整产物。
- 同时要 spec 和 HTML 时交付两者，HTML 使用同一份 spec。spec 任务的临时验证页面不代替最终配置。
- 信息充分时直接选图和生成，不逐次确认图型。只澄清会影响图义、字段含义、数据口径或交付可用性的缺失信息；不要默认询问 JS/React。
- 独立 HTML 默认原生 JS；明确的 React 上下文使用相应组件/API。交付目标不明且选错会影响使用时，只询问必要的交付形式。
- 既有宿主约束持续有效，但不把未知版本、图型或回调支持当作已知。要求与已知宿主能力冲突时说明限制，不静默换产物。

用户需要统计分布、变量关系、缺失或已有模型结果的**交互 HTML** 时，优先使用相邻 [data-science-visualization](../data-science-visualization/SKILL.md)。明确的原生 VChart spec 请求仍在本技能处理，不因提到“数据分析”就改成交互 HTML；不要求相邻技能已安装。

## 共享配置知识

按需查询，不一次加载所有图型、API 或类型详情。

| 资源 | 用途 |
| --- | --- |
| [图型指南](references/chart/chart-type-guide.md) | 根据表达目标和数据语义选图 |
| `references/topkey/[图型].json`、`all_common.json` | 将标签、图例、参考线等意图映射到配置项 |
| `references/type-meta/[图型].json` | 属性结构、继承关系、必需字段 |
| `references/type-details/[类型名]-Type-Definition.md` | 复杂类型的定义与示例；函数需求查询对应签名 |
| [示例库](references/examples/) | 相近配置参考；示例数据不能充当用户数据 |
| [组件参考](references/components/) | 轴、标签、图例、tooltip 等配置 |
| [API 索引](references/api/API_INDEX.md) | 只有需要实例 API 时才查询相关文档 |

配置查询顺序：用户意图 → 对应 topkey → type-meta → 必要 type-details。`isSimple: true` 的属性可直接使用元数据类型，复杂属性再读取详情。

本地资料不足时查询官方配置 `https://www.visactor.io/vchart/option/[图型]`、API `https://www.visactor.io/vchart/api/API/vchart` 或仓库 `docs/assets/examples/`，以目标版本为准。

## 数据与生成自检

- 明确要比较什么、字段含义、单位、排序和必要的数据范围。数字 ID 不自动当作连续度量；零与缺失不同，不能默认补零、删行、抽样、聚合或改变占比分母。
- 使用实际数据检查字段映射。按图型检查 xField/yField、categoryField/valueField、seriesField、数据引用和所需配置，不要求所有图型都有 xField/yField。
- 属性值与文档类型一致，配置与已知目标版本及宿主约束相符。数据可以采用 VChart 支持的对象或数组形式，不为示例样式机械归一化。
- 信息充分时直接修正生成错误，不仅提醒用户自行检查。缺少真实业务数据时澄清；功能教学或样式演示可用明确标注的 mock 数据。
- JSON 用标准解析器检查，不能混入注释、函数、NaN/Infinity；格式通过不代表 VChart 配置或图义正确。本期不使用 schema 校验。
- 能渲染时检查实际交付配置的图元、数据和可见效果；HTML 交互需要验证真实状态或 datum。未实际渲染则说明验证范围，不因生成文件或存在 canvas 就报成功。浏览器验收不等于目标宿主验收。

## 交互和应用 API

先判断能力能否由 spec 声明，再决定是否需要应用代码。

- tooltip、图例、标签等声明式能力直接配置到 spec，不因有交互需求自动改成 HTML。
- 事件监听、外部按钮、实例数据更新、导出等按需查询 API。HTML/应用场景增加相应代码；spec 场景只交付可表达的配置，不混入事件绑定或宿主包装。
- 纯 JSON 不能携带函数或外部业务逻辑。先查询可用的声明式写法；不能满足时说明限制和所需宿主能力，不丢弃函数后声称完成。只有用户改变交付目标时才转为应用代码。

| 需求 | 按需参考 |
| --- | --- |
| 点击、hover、事件参数 | [event-api.md](references/api/event-api.md) |
| 数据更新 | [data-api.md](references/api/data-api.md) |
| 高亮、选择 | [state-api.md](references/api/state-api.md) |
| 手动 tooltip | [interaction-api.md](references/api/interaction-api.md) |
| 导出图片 | [export-api.md](references/api/export-api.md) |
| 主题、动画、尺寸 | [theme](references/api/theme-api.md)、[animation](references/api/animation-api.md)、[layout](references/api/layout-api.md) |
| 坐标转换、图例控制 | [coordinate](references/api/coordinate-api.md)、[legend](references/api/legend-api.md) |

## 交付契约

### HTML

按 [HTML 工作流](workflows/scenario-2-html-generation.md) 使用既有模板与脚本，交付完整文件和必要说明；页面包含正确的依赖、配置和实例创建。React 请求按已有组件契约处理，按需提供诊断 HTML。

### spec

按 [spec 工作流](workflows/scenario-2-spec-generation.md) 交付完整可复用配置，不强制追加 HTML、实例创建或 render 调用。

格式优先沿用用户要求、宿主契约和已有配置。都未指定时，可序列化配置采用 JSON；实际需要且环境允许函数时采用 JS spec 并说明格式。函数必须遵循对应签名，不能通过 JSON 往返丢失。

机器消费的“只返回 JSON”只输出配置本身，不添加 Markdown 围栏、说明或报告字段；普通对话可给配置文件链接与简短说明。说明、假设和验证证据与配置分离。

### 诊断与还原

保留用户指定或已建立的交付目标，解释原因或还原范围；纯 JSON 要求不混入这些说明。诊断 HTML 使用既有专项模板，spec 修复默认交付整合后的完整配置；请求只看改动时才给补丁。

## 工具与参考

| 用途 | 既有资源 |
| --- | --- |
| HTML 演示、视觉还原 | `scripts/generate_demo_html.py`、`template/demo.html` |
| JS 诊断页面 | `scripts/generate_diagnosis_html.py`、`template/diagnosis.html` |
| React 诊断页面 | `scripts/generate_diagnosis_react_html.py`、`template/diagnosis-react.html` |
| 参数、脚本问题、文件命名 | [参数参考](references/SCRIPT_PARAMS_REFERENCE.md)、[排错指南](references/SCRIPTS_TROUBLESHOOTING.md)、[命名约定](references/FILE_NAMING_CONVENTIONS.md) |
| 完整 JSON 与 JS 回调示例 | [spec 示例](examples/spec-generation/README.md) |

只有用户询问能力范围时才简要介绍：支持 HTML/spec 生成、配置修改、诊断、视觉还原和 React/API 集成；不主动输出自我介绍。
