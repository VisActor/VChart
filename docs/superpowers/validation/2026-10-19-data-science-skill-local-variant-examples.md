# 数据科学 skill 变体示例本地化验收

日期：2026-10-19。对应[实施计划](../plans/2026-10-19-data-science-skill-local-variant-examples.md)。

## 直接执行

已将 variants.json 中 21 类图表的全部 52 个变体由 exampleUrl 改为本地 example，路径相对 references/statplots 根目录。同步器从 release.json 指定的 2.2.0 发布 tarball 原字节复制示例，按路径去重，新增资源登记到 manifest，索引转换规则为 variant-index-v2。

本地校验包括变体目录路径、manifest 登记、引用闭包、JSON 解析，以及 spec.type/options 与索引元数据一致性。嵌套选项使用 Node 内置 isDeepStrictEqual，比照现有上游目录检查方式；未新增运行期 validator/compiler，也无远端回退分支。

skill 入口、选图说明和输入协议已明确：只读取选中变体的 options/本地 example，不预读全部变体；发布来源与 hash 在 manifest，HTML 图表 JavaScript 继续使用固定 CDN。

环境：Node.js 22.23.3、Python 3.11.16。Python 使用已有 `/tmp/vchart-dsv-220-validation` 环境，包含 openpyxl 和 PyYAML；无项目依赖变更。

| 检查 | 实际结果 |
| --- | --- |
| 新索引测试先于实现运行 | 确认因缺少 buildVariantIndex 失败，再实现该接口 |
| Python unittest | 25 项通过，无跳过 |
| Node skill-resources + data-bindings | 37 项通过，无跳过 |
| Playwright skill-catalog + skill-portable | 100 项通过，52.8 秒 |
| 发布原字节核验 | 重新读取发布 tarball 并验证 integrity，52 个文件逐字节一致 |
| 元数据核验 | 名称、别名、选项、图型和顺序保留，仅将 exampleUrl 改为 example |
| skill quick_validate | 通过 |
| 同步器 --check | 通过 |
| 重复同步 | 150 个快照/controller 文件 SHA-256 一致，无额外变化 |
| variants.json 远端字段检查 | 无 exampleUrl，52 个条目均为本地 example |
| git diff --check | 通过 |

本轮共 162 项自动测试通过，组成是 25 Python + 37 Node + 100 浏览器。浏览器包括 28 类最小示例、52 个变体、7 个复制分发场景、12 类表格绑定和 1 个真实 JS CDN/移动端布局用例。

独立复制场景检查副本内所有变体文件存在，并只用副本的比例示例和 Python 脚本生成 HTML；发布 UMD 渲染成功，有真实图元，controller 的规范 spec.statistic 为 proportion。原仓库示例路径没有作为该输入的后备来源。

Node 新增反例覆盖：缺文件、字节篡改、远端/绝对/越界路径、残留 exampleUrl、未登记引用、非法 JSON、错误 type、错误顶层/嵌套 options，以及未被引用的文件。需要触达语义检查的反例会更新临时副本的输出 hash，避免仅因 hash 失败造成假通过。此前来源、版本、本地文档导航及失败回滚测试继续通过。

主要执行命令如下；PATH 使用上述 Node 22，Python 为上述虚拟环境：

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

为隔离之前未提交的优化，实施前保存当前工作区 hash 与元数据。比较确认：旧资源中只有 variants.json、manifest.json 变化；新增 52 个示例。已有类型、指南、最小示例、包信息、许可证、release.json、Python/HTML 与 controller 均逐字节一致。

| 资源体积（UTF-8 字节） | 实施前 | 实施后 |
| --- | ---: | ---: |
| 变体 JSON 示例 | 0 | 150,492 |
| variants.json | 14,180 | 11,372 |
| references/statplots 全目录 | 204,560 | 370,974 |

目录净增 166,414 字节，包括示例和来源记录；变体索引减少 2,808 字节。新增文件由同步器生成，不新增人工版本入口。

## 深度交互

参考资料已可随 skill 本地读取；HTML 图表仍依赖固定 JavaScript CDN，不能将此结果描述为图表完全离线运行。

未提交 Git、未创建 PR，也未运行 VChart 全量视觉基线比较。本轮修改的是技能资源及维护/验收流程，没有修改公共库渲染路径；后续创建 PR 前仍需按 AGENTS.md 完成全量视觉基线比较并审查报告。
