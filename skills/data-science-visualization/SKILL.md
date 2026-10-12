---
name: data-science-visualization
description: 从 CSV、TSV、JSON 表格或已有统计与模型结果生成可交互的数据科学图表 HTML，支持分布、分组比较、变量关系、缺失检查、现成结果展示，以及筛选和改图。用于看数据、探索图表和展示结果；完整统计分析报告与应用开发使用对应工作流。
---

# 数据科学可视化

用真实数据和自然语言问题生成可打开、可继续修改的交互图表。默认交付一张直接回答需求的图；有互补视角时才生成多图页。不要让用户先学习统计方法或挑选技术图名。

默认页面只有图表、标题、单位和真实 Tooltip；保留必要的静态图例和色标。不要推测用户需要探索面板：筛选器、变量/参数切换、主题切换、框选、图例筛选、导出和来源详情只在明确请求时添加。改图通过对话修改可重放请求完成。

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

使用本技能的生成器；不要每次重写 HTML 或复制图库导航。请求格式和按需选项见 [输入与交互](references/input-and-interaction.md)。`examples/` 五个基础请求均为简洁页面；仅需要交互时参考 interactive.json，保留需求明确需要的项。例子使用 observations.csv 演示数据，不能当用户数据。

```bash
python3 /实际技能目录/scripts/generate_visualization.py \
  --request /实际请求目录/request.json \
  --output /新的输出目录
```

需要 Python 3.11+，默认仅标准库；若默认 python3 太旧，指定可用解释器，或 `uv run --python 3.12 ...`。CSV/TSV/JSON 不安装科学计算环境；XLSX 指定 sheet，可选依赖 openpyxl，缺依赖时也可导出 CSV。

输出 `visualization.html`、可重放的 `visualization.request.json` 和带真实来源哈希的 `visualization.data.json`。输出目录必须不存在；改图写新目录，保留旧版本。HTML 内嵌数据，固定 VChart/statplots 2.1.8-alpha.0 UMD 按顺序加载；打开页面需要能访问 CDN，但不需要 npm、MCP 或本地服务器。

## 交互口径

- “只看东区”：固定 controls.initialFilters 并在标题说明范围，不添加筛选器；“让我按地区切换”：声明 controls.filters 才生成筛选器。清空页面筛选保留未声明控件的固定范围。
- “能调整分箱”：只加对应参数选择器；“深色”：直接设置图的 theme，不自动增加主题按钮。变量切换确实改变数据与单位，不能只换轴标题。
- 明确请求筛选时，应用后所有绑定图重算，显示当前行数；外部 Spec 图不随表格筛选变化。原始/每图输入/省略数保留于 data/status，只有请求 counts 才显示。
- 只有请求时才声明 Chart.interactions；pairPlot 的 brush 按稳定 ID 跨面板高亮，不重算统计；它的图例始终只说明颜色。legendFilter 沿用支持图的原生行为，不重算分母。
- 不默认抽样或截断。超过页面预算时说明具体规模，选择有意义的变量或明确注明的子集；不要把子集统计说成全量。

## 验收与继续修改

生成后实际打开 HTML，等待加载结束，检查每图状态、真实 Tooltip 和所声明的控件。`window.__DSV_STATUS__.ready` 只表示加载结束，成功还需每图 `status === 'rendered'`。默认不能出现额外操作入口；请求筛选时检查计数变化，请求 brush 时真实拖动检查高亮。CDN 或宿主脚本受限时如实说明未完成图表/交互验收，不能只凭文件或 canvas 存在宣称可用。

交付 HTML 链接和必要的数据范围说明，包括被省略的缺失值；除非用户要求，避免长篇模型术语。对话改图默认读取磁盘 visualization.request.json，修改图型/字段/条件，保留全部 records、ID、单位、presentation 与 initialFilters，生成新目录。不要用筛选后的 Spec 替换原始完整数据，也不要自动增加编辑控件。

浏览器后续选择不会自动写回磁盘。无法读取当前浏览器条件时确认具体条件；用户请求保存当前视图时才添加 saveView。新图首次打开应恢复请求中的条件，移除固定条件后应恢复全部使用行。不重新拟合已有模型；初次原文件来源哈希仍在初次 data 中。

维护资源时修改上游控制器源，使用仓库 `packages/vchart-statplots/scripts/sync-visualization-skill.mjs` 同步。`assets/statplot-controller.js` 是共享源码的副本，禁止手改。维护者可 `--check` 离线校验，使用者无需执行同步脚本。
