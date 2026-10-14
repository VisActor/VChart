# StatPlots 公共配色 Implementation Plan

**Goal:** 28 类图表共享简洁、可由 skill 生成的配色配置。

**Architecture:** BaseSpec 声明颜色角色；Schema 在编译边界校验；commonChart 配置分类色，连续图复用 VChart scale 与标签反色能力。开发期导入色板数据，运行期零新增依赖。

**Tech Stack:** TypeScript、VChart、生成式 JSON Schema / Ajv、Jest、Playwright。

## 约束

- 沿用现有分支和全部未提交改动；不修改 VChart 核心。
- 仅 VChart 原生 light/dark；纯 JSON、名称与 #RRGGBB 数组。
- 输入只读、每次更新编译完整 spec，无逐图元重复解析。
- 用户已授权执行；本会话直接实施，不创建任务或提交。

## 任务 1：公共契约与分类色

文件：src/common/types.ts、src/types.ts、src/common/colors.ts、src/common/palettes.ts、src/common/chart.ts、schema、src/generated、__tests__/unit/colors.test.ts。

- [x] 先验证 `{type:'countPlot', colors:{categorical:['#123456']},data:[]}` 可接受，未知色板、空数组和非法色号拒绝，28 类共享配置不修改输入。
- [x] 添加 StatPlotColors、HexColor、各角色数组类型与 JSDoc Schema 约束；生成 Schema。
- [x] `categoricalColors(spec: BaseSpec): string[] | undefined` 返回新的数组；vchart 返回 undefined；commonChart 写入 chart.color。
- [x] 记录 Seaborn/Matplotlib 色板来源、转换方法和上游许可证。

## 任务 2：连续图编码一致性

文件：src/common/colors.ts、plots/{hexbin,confusion-matrix,correlation-matrix,shap-beeswarm,missingness}/compile.ts、__tests__/browser/colors.spec.ts、theme.spec.ts。

- [x] `continuousColorScale(spec, role, id, min, max)` 返回等距 domain 与 range；`role` 仅 sequential/diverging。
- [x] 六边形和混淆矩阵使用 sequential；相关矩阵 diverging 固定 [-1,1]；SHAP sequential 固定 [0,1]，createScale 原生插值预生成颜色。
- [x] 矩阵标签 smartInvert 替换固定阈值配色；缺失和常量保持主题颜色。
- [x] 实际浏览器验证自定义端点/中心、图例刻度与色板、SHAP 点颜色与尺度一致、深浅主题与更新、文本对比度 ≥4.5。

## 任务 3：可用性与交付

文件：examples/index.html、gallery.js、gallery.css、docs/colors.md、docs/spec.md、docs/skill-authoring.md、README.md、__tests__/browser/gallery.spec.ts、docs/validation.md。

- [x] 图库三个角色选择器写入 JSON；自定义数组显示“自定义”，有效绘制后同步状态；类型导航和错误输入流程保持可用。
- [x] 文档给出默认值、角色/图表映射、命名和数组两种完整示例；将 colors.md 链接到 README 与 skill 协议。
- [x] 运行 `npm run build --prefix packages/vchart-statplots`，完整 Jest 和 Playwright，Schema/示例/catalog 检查与源码/测试类型检查。
- [x] 审阅图库、浅/深色连续图截图；比较 `.vchart-statplots/colors-before/benchmark.json` 与 after；实际 npm pack 消费者检查。
- [x] 在 docs/validation.md 记录结果、证据路径和明确限制。
