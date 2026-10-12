---
name: data-science-visualization
description: 从真实表格或已有统计与模型结果生成简洁的交互数据科学图表 HTML，按问题与数据条件选图，支持按需交互和对话改图。用于看数据和展示结果；完整分析报告或应用开发使用对应工作流。
---

# 数据科学可视化

生成一张能回答用户问题的图；需要互补视角时才组合多图。默认只展示标题、图表、单位与真实 Tooltip，保留必要静态图例和色标；其他交互只来自明确需求。

## 选择有意义的图

先明确观测是什么、要比较什么、字段含义/单位和数据范围。只检查会影响选择的缺失、组内有效样本、常量或点密集程度；不自动生成审计报告。数字 ID 不因是 number 就变成测量指标，唯一性也不单独证明一个字段是 ID。

按 [问题与数据条件](references/chart-selection.md) 选择图义。含义不足时只澄清会改变图义的问题。用户已指定图型时尊重选择；数据不满足契约则说明原因，不静默换图、猜带宽或伪造结果。

定位 [索引](references/statplots/index.json) 中选中 type 的条目，读取其 guide、typeFile 及必要 import 依赖、example 最小输入。索引每行一图，可按 type 定位；不要读完整联合声明或全部指南。特殊变体才读取 variantFile 中对应 type 的选项与固定链接。公共数值、区间或配色条件见 [公共约束](references/statplots/guides/common.md)。TS 是字段参考，最终仍由公共 validate/compile 校验。

## 生成与交付

复用生成器，不重写 HTML 或绘图计算。[输入与交互协议](references/input-and-interaction.md) 维护表格绑定、直接 Spec、预算和按需控件。`examples/` 为六份可执行演示；基础例子无控件，interactive.json 仅供明确交互需求参考，演示数据不能当用户数据。

```sh
python3 /实际技能目录/scripts/generate_visualization.py \
  --request /实际请求目录/request.json \
  --output /新的输出目录
```

Python 3.11+，CSV/TSV/JSON 只需标准库；XLSX 可选 openpyxl 并明确 sheet。默认解释器太旧时指定已有可用版本。输出 HTML、可重放 request 和带来源的 data；输出目录必须不存在。HTML 内嵌使用数据，固定 VChart/statplots 2.1.8-alpha.0 CDN；打开需网络及外部脚本权限，无需 npm、TypeScript、MCP 或本地服务器。

标题写实际变量、比较对象和必要范围，轴/Tooltip 保留单位。交付 HTML 链接及影响解读的数据范围、缺失省略或小样本限制；不把相关当因果，不添加分析面板。不展开聚合频数、不默认采样/截断、不猜区间或降维坐标；原始模型计算和完整推断报告使用分析工作流。

## 验收与继续改图

实际打开 HTML 检查图元、Tooltip 和所请求的交互。`window.__DSV_STATUS__.ready` 只表示批次结束，成功需每图 status=rendered；输入/省略数及详细错误保留在状态对象。仅有文件或 canvas 不能证明可用；宿主/CDN 受限时说明未完成的验收。

对话改图读取磁盘 visualization.request.json，保留全部使用行、ID、单位、固定条件和按需选项，修改请求后生成新目录。新增未内嵌字段时从已知原数据按真实 ID 补回；request 不是全列备份。浏览器后续选择不自动写回磁盘，不可读取时确认具体条件；用户请求保存当前视图时才提供 saveView。

维护者修改上游 controller 源并经 sync 脚本生成副本，不手改 assets/statplot-controller.js。references/statplots 为同版本发布资源的生成快照；类型原字节复制、指南按章节提取，来源与转换规则见 manifest。使用者无需执行同步。
