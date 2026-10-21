# VChart Development Assistant 使用说明

## 两类生成场景

| 场景 | 用途 | 产物 |
| --- | --- | --- |
| HTML 生成 | 直接打开查看、可运行演示、页面交互 | 完整 HTML；已有 React 需求按组件契约处理 |
| spec 生成 | 宿主渲染、应用嵌入、其他工具消费配置 | 完整 VChart spec，遵循 JSON/JS 格式要求 |

选择顺序：本轮明确要求 → 已有宿主/应用上下文 → 尚未确定目标时识别当前任务 → 独立展示默认 HTML。已有产物的配置修改沿用原目标：HTML 内的 spec 修改仍交付 HTML，独立 spec 修改仍交付 spec；组件和组合产物也保留原目标。“加标签”“修复报错”不会自动改变格式，明确“只返回 JSON”等要求才切换。只有明确要求片段或补丁才仅返回局部改动。

两条生成流程共享选图与配置知识，不需要重复指定所有配置。数据和目标充分时直接执行，不机械询问框架或确认图型。技能也支持问题诊断、截图/Figma 还原、React-VChart 和按需 API 集成。

## 怎么提问

提供表达目标、实际数据和已知约束；修改或诊断时提供现有 spec/组件及实际问题。单位、字段含义或数据范围影响图义时补充，不要求所有请求都给技术栈或固定数量的样本。

### 直接查看 HTML

```text
周一 12、周二 25、周三 18、周四 32。
用 VChart 比较四天数值，生成能直接打开查看的完整 HTML。
```

HTML 请求交付页面。点击读取 datum、外部按钮等需要应用代码；tooltip、图例等声明式能力直接写入配置。

### 只要完整 spec

```text
周一 12、周二 25、周三 18、周四 32。
用合适的 VChart 图表比较数值，只返回完整 JSON spec，不要解释。
```

纯 JSON 请求只返回配置，不混入 Markdown、HTML、实例创建或报告。普通对话可给配置文件和必要说明。未指定格式时优先沿用宿主及现有配置；均未知时可序列化配置采用 JSON，确需且环境允许函数时采用 JS。

### 已有宿主上下文

```text
宿主负责渲染，只接收 JSON VChart spec，支持 bar 和 line，不接受函数。
后续给数据时请按这些约束生成配置。
```

后续“用合适图表展示这些数据”继续交付配置，不重新询问 HTML 或框架，也不添加宿主卡片外壳。

### 修改配置与组合交付

```text
给我现有 spec 加上数值标签，保留数据，返回修改后的完整 JSON。
```

```text
生成完整 spec，再提供一个使用同一份配置的 HTML 预览。
```

spec 临时渲染页是验收材料，不会取代最终配置。JSON 不能承载函数；需要回调时先查询声明式写法，不能实现则说明宿主限制，不丢函数后声称完成。

## 验收与排错

检查实际字段、数据、必需配置和已知运行约束。JSON 可解析不代表图表已经渲染；有可用环境时打开真实产物，检查数据图元、标签/tooltip 和明确要求的交互。未渲染或未在目标宿主验证时如实说明。

排错优先提供原配置、错误和实际效果；现有 React 问题继续处理组件/hooks/API，不能只替换 spec 后忽略组件问题。

## 参考

- [共享生成流程](workflows/scenario-2-generation.md)、[HTML 流程](workflows/scenario-2-html-generation.md)、[spec 流程](workflows/scenario-2-spec-generation.md)
- [JSON/JS 示例](references/examples/spec-generation/README.md)
- [VChart Skill 教程](https://www.visactor.io/vchart/guide/tutorial_docs/VChart_Skill_Usage)
- [配置文档](https://www.visactor.io/vchart/option)、[API 文档](https://www.visactor.io/vchart/api/API/vchart)
