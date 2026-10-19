# 数据科学 skill 本地文档导航验收

日期：2026-10-19。对应[实施计划](../plans/2026-10-19-data-science-skill-local-doc-navigation.md)。

## 直接执行

同步器已删除 28 份图型指南顶部的远端完整文档链接，以及 index.json 全部 28 个 fullDocsUrl；指南保留 TS 类型、最小输入和公共约束三条本地入口。内部 sourceUrl 仅参与发布文档相对地址解析，不写入阅读入口。

未知引用无法映射为本地资源时同步失败。离线校验拒绝远端指南链接、残留 fullDocsUrl 及远端 guide/typeFile/example，保留本地断链、hash、类型闭包、版本与回滚检查。变体示例的固定版本 URL 检查仍然执行。manifest 保留来源和 sourceSha256，指南/索引转换规则分别为 plot-guide-v2/type-index-v2。

为区分本轮与此前未提交的升级改动，实施前记录当前工作区的文件内容及 hash。本轮生成资源恰好变化 30 个文件：28 份指南、index.json、manifest.json。逐项比较确认：

- 指南除顶部第 3 行外，正文逐字节一致；common.md 全文一致。
- 索引仅删除 fullDocsUrl，其余字段及顺序一致。
- 类型声明、最小输入、variants.json、包信息、许可证及 controller 字节一致。
- release.json、Python 生成器和 HTML 模板字节一致，目标版本仍为 2.2.0。

环境：Node.js 22.23.3；Python 3.11.16，使用已有 `/tmp/vchart-dsv-220-validation` 环境（包含 openpyxl、PyYAML）。无项目依赖变更。

| 检查 | 实际结果 |
| --- | --- |
| 新测试先于实现运行 | 18 项资源测试中 8 项预期失败，暴露索引/指南契约与导航校验缺口 |
| Python unittest | 25 项通过，无跳过 |
| Node skill-resources + data-bindings | 23 项通过，无跳过 |
| Playwright skill-catalog + skill-portable | 47 项通过，26.3 秒 |
| skill quick_validate | 通过 |
| sync --check | 通过 |
| 重复同步 | 98 个快照/controller 文件逐文件 SHA-256 一致，无额外变化 |
| guides/index 远端入口搜索 | 无 HTTP/HTTPS URL，无 fullDocsUrl |
| git diff --check | 通过 |

本轮共 95 项自动测试通过，组成是 25 Python + 23 Node + 47 浏览器，不沿用此前版本入口优化的测试数。

主要执行命令（PATH 使用上述 Node 22，Python 为上述虚拟环境）：

```sh
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs skills/data-science-visualization/tests/data-bindings.test.cjs
python -m unittest discover -s skills/data-science-visualization/tests -p 'test_*.py'
```

在 packages/vchart-statplots 目录执行：

```sh
DSV_PYTHON=/tmp/vchart-dsv-220-validation/bin/python ./node_modules/.bin/playwright test \
  --config __tests__/browser/playwright.config.ts \
  skill-catalog.spec.ts skill-portable.spec.ts
```

反例在独立临时资源副本中运行：修改文件后同步更新副本 manifest 的文件 hash，仍需拒绝远端指南、索引 fullDocsUrl、远端 guide/typeFile/example，以及本地断链，避免仅由 hash 不一致造成假通过。正常快照的发布源与 sourceSha256 也有断言。

浏览器测试覆盖本地索引消费、28 类图表、12 类表格绑定、复制至仓库外生成/重放，以及无拦截的真实 JS CDN 加载。360px 明暗主题用例通过；已查看 distribution 截图，默认布局正常。截图在 `.vchart-statplots/dsv/screenshots/`，浏览器报告在 `.vchart-statplots/report/`。

## 深度交互

本次清理的是文档阅读入口，variants.json 的 52 个远端 JSON 示例链接与图表 JavaScript CDN 保持现状，不能将结果称为整个 skill 离线。

不新增 Markdown 标题锚点解析；本轮校验本地文件目标与现有锚点表示的保留。内容缺口应从同版本发布物补足必要说明，不恢复远端完整文档入口。

未提交 Git、未创建 PR，未运行 VChart 全量视觉基线比较；本次没有修改公共渲染路径。后续创建 PR 前仍需按 AGENTS.md 执行全量视觉基线比较并审查报告，不能把本轮浏览器通过视为该项通过。
