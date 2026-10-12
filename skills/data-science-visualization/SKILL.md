---
name: data-science-visualization
description: 从 CSV、TSV、JSON 表格或已有统计与模型结果生成可交互的数据科学图表 HTML，支持分布、分组比较、变量关系、缺失检查、现成结果展示，以及筛选和改图。用于看数据、探索图表和展示结果；完整统计分析报告与应用开发使用对应工作流。
---

# 数据科学可视化

用真实数据和自然语言问题生成可打开、可继续修改的交互图表。默认交付一张直接回答需求的图；有互补视角时才生成多图页。不要让用户先学习统计方法或挑选技术图名。

## 从目的开始

先查看数据字段、类型、单位及少量真实行，再决定图义。信息足够就生成；只有字段含义、配对关系、正例定义或区间含义会改变结果时才澄清关键问题。

- 看分布：histogram；比较分组密度或累计比例：kdePlot / ecdfPlot。
- 比较类别数量：countPlot；比较数值分布：boxPlot / violinPlot；查看个体：stripPlot 的 jitter / swarm。
- 看两个变量：scatterPlot；大量密集点：hexbinPlot；多个变量：correlationMatrix / pairPlot。
- 查缺失位置：missingValueMatrix。0、false 和 JSON 空字符串不是缺失。
- 展示已有降维、区间、预测或 SHAP：按相应 Spec 契约绘图，保留真实来源。

更细选择读 [意图与边界](references/intent-routing.md) 和 [上游目录](references/statplots/docs/plot-catalog.json)，然后**只读选中的图**：`references/statplots/docs/plots/<type>.md`、`references/statplots/schema/plots/<type>.schema.json`、目录引用的示例。不要一次读取全部 28 类图资源。

## 两个输入入口

**表格绑定**支持 12 类：countPlot、missingValueMatrix、histogram、kdePlot、ecdfPlot、boxPlot、violinPlot、stripPlot、scatterPlot、hexbinPlot、correlationMatrix、pairPlot。声明使用列的类型和语义角色，浏览器从原始观测构造输入；分箱、密度、相关和几何全部由 statplots 公共 API 计算。

**直接 Spec**接受目录中全部 28 类图。对其余图按逐图文档提交已准备好的规范 JSON；不承诺通用字段切换或表格筛选。需要生成或修改这些输入时读 [上游生成协议](references/statplots/docs/skill-authoring.md) 与 [计算契约](references/statplots/docs/computation-contract.md)。

只有原始高维数据时，不能编造 PCA/UMAP 坐标；只有聚合频数时，不能展开成假样本。未知上下界不默认填 95% confidence。纯散点不自动拟合；只有用户明确请求时使用库的图内回归或区间计算，并说明实际参数。完整建模、推断报告或因果解释使用分析工作流；普通业务图和应用嵌入使用图表开发工作流。本技能运行不要求它们已安装。

## 生成产物

使用本技能的生成器；不要每次重写 HTML 或复制图库导航。请求格式和控件规则见 [输入与交互](references/input-and-interaction.md)。可以从 `examples/` 中最接近的请求开始，替换成用户真实数据与字段，不将演示数据当用户数据。

```bash
python3 /实际技能目录/scripts/generate_visualization.py \
  --request /实际请求目录/request.json \
  --output /新的输出目录
```

需要 Python 3.11+，默认仅标准库；若默认 python3 太旧，指定可用解释器，或 `uv run --python 3.12 ...`。CSV/TSV/JSON 不安装科学计算环境；XLSX 指定 sheet，可选依赖 openpyxl，缺依赖时也可导出 CSV。

输出 `visualization.html`、可重放的 `visualization.request.json` 和带真实来源哈希的 `visualization.data.json`。输出目录必须不存在；改图写新目录，保留旧版本。HTML 内嵌数据，固定 VChart/statplots 2.1.8-alpha.0 UMD 按顺序加载；打开页面需要能访问 CDN，但不需要 npm、MCP 或本地服务器。

## 交互口径

- 默认使用真实 Tooltip；图例只按该图原生语义隐藏/显示或说明颜色。
- 按需要声明类别、数值范围筛选；选择后点“应用筛选”，所有绑定图重算，显示原始行数、筛选行数、每图输入及省略数。筛选不作用于外部 Spec 图。
- pairPlot 框选按稳定 ID 跨面板高亮，不重算统计；它的图例仅说明颜色。
- 可声明数值列切换、直方图分箱/统计量、相关方法控件。改列确实改变数据与单位，不能只换轴标题。
- 不默认抽样或截断。超过页面预算时说明具体规模，选择有意义的变量或明确注明的子集；不要把子集统计说成全量。

## 验收与继续修改

生成后实际打开 HTML，等待加载结束，检查每图状态、真实 Tooltip 和所声明的控件。`window.__DSV_STATUS__.ready` 只表示加载结束，成功还需每图 `status === 'rendered'`。筛选要检查数据/计数确实变化；pairPlot 要真实拖动检查高亮。CDN 或宿主脚本受限时如实说明未完成图表/交互验收，不能只凭文件或 canvas 存在宣称可用。

交付 HTML 链接和必要的数据范围说明；除非用户要求，避免长篇模型术语。多轮改图有已应用条件时，先“保存当前视图请求”，从该 request 修改图型，保留全部 records、单位和 controls.initialFilters；不要用仅含筛选子集的 Spec 替换原数据。生成新版本后检查首次打开就恢复条件，并检查清空后仍能恢复全部观测。不重新拟合已有模型；原始来源哈希保留在初次 data 中。

维护资源时修改上游控制器源，使用仓库 `packages/vchart-statplots/scripts/sync-visualization-skill.mjs` 同步。`assets/statplot-controller.js` 是共享源码的副本，禁止手改。维护者可 `--check` 离线校验，使用者无需执行同步脚本。
