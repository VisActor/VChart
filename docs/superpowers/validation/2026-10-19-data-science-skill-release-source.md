# 数据科学 skill 版本来源收敛验收

日期：2026-10-19。对应[实施计划](../plans/2026-10-19-data-science-skill-release-source.md)。

## 直接执行

已新增 `skills/data-science-visualization/release.json`，当前值为 `2.2.0`。它是唯一人工库版本入口；Python 在生成 payload 时读取配置并核对 manifest.version，HTML 使用 payload 中的版本，Node 同步器及其发布缓存使用同一配置。配置错误、缺失或快照未同步时，CLI 不生成输出。

选择器已移除重复 version，说明文档改为引用 release.json。快照通过同步器生成，保留完整性、文件 hash、生成器/选择器 hash、链接检查及同步失败回滚；未手改生成物。此前的 2.2.0 升级改动保留。

环境：Node.js `22.23.3`；Python `3.11.16`。Python 使用已有 `/tmp/vchart-dsv-220-validation` 虚拟环境，含 openpyxl、PyYAML；未新增项目运行依赖。

| 检查 | 结果 |
| --- | --- |
| 新增测试先于实现运行 | 复现旧生成器忽略配置、未同步也生成输出，以及缺少 Node 读取函数的问题 |
| Python unittest | 25 项通过，无跳过 |
| Node skill-resources + data-bindings | 16 项通过，无跳过 |
| Playwright skill-catalog/interactions/portable | 54 项通过，31.3 秒 |
| 真实 CDN 加载 | 无请求拦截的便携性用例通过；360px 明暗主题无横向溢出 |
| skill quick_validate | 通过 |
| 同步器 --check | 通过 |
| 重复同步 | 98 个快照/controller 文件逐文件 SHA-256 一致，无额外字节变化 |
| 人工版本入口搜索 | skill 非生成目录、同步脚本与选择器中，仅 release.json 保留当前发布版本字面量 |
| git diff --check | 通过 |

执行命令如下；实际 PATH 使用上述 Node 22，DSV_PYTHON 使用上述虚拟环境：

```sh
python -m unittest discover -s skills/data-science-visualization/tests -p 'test_*.py'
node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs skills/data-science-visualization/tests/data-bindings.test.cjs
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
```

在 packages/vchart-statplots 目录执行：

```sh
DSV_PYTHON=/tmp/vchart-dsv-220-validation/bin/python ./node_modules/.bin/playwright test \
  --config __tests__/browser/playwright.config.ts \
  skill-catalog.spec.ts skill-interactions.spec.ts skill-portable.spec.ts
```

CLI 反例与传播检查在临时 skill 副本完成：只改配置为 `9.9.9-test.0` 时失败且没有输出；副本 manifest 版本匹配后，两个 script src 与 data.libraries 均采用测试值。该测试不访问虚构版本 CDN；真实发布资源验收使用 `2.2.0`。latest、版本范围、缺失字段及缺配置均不会生成 HTML，也不会回退旧版本。

浏览器检查覆盖 28 类图表、12 类表格绑定、真实 Tooltip/筛选/框选/改图状态，以及复制至仓库外生成与无原始 CSV 重放。已查看 distribution 的 360px 深色截图，布局正常；截图位于本地 `.vchart-statplots/dsv/screenshots/`，浏览器报告位于 `.vchart-statplots/report/`。

## 深度交互

本次目标是单一人工输入；生成资源仍记录固定版本及来源，不以减少 diff 文件数代替可复现性。后续升级若遇到类型或文档章节变化，需要审查适配，不能自动放宽同步检查。

本次未创建 PR、未提交 Git，也未运行 VChart 全量视觉基线比较；修改范围为技能生成/维护流程。创建 PR 前仍需按 AGENTS.md 执行全量视觉比较并审查结果，不能把这 54 项浏览器测试视为全量基线通过。
