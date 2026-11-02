# 数据科学 skill 使用资源与维护材料分离验收

日期：2026-10-19。对应[实施计划](../plans/2026-10-19-data-science-skill-maintenance-separation.md)。维护入口：[skill-maintenance/README.md](../../../packages/vchart-statplots/skill-maintenance/README.md)。

## 直接执行

已移除 skill 内发布包 package.json 和完整 manifest，将 3 个 Python 测试、1 个 Node 测试及仓库维护说明迁至 packages/vchart-statplots/skill-maintenance。现有 runtime/browser 测试保留在原目录，新增 skill-publication.test.cjs 验证发布故障。

skill 根目录 release.json 仍是唯一人工库版本入口；生成的 references/statplots/snapshot.json 仅包含 version，当前为 2.2.0，25 字节。Python 只核对这两个本地版本值，不读取仓库维护目录。安装态说明不再指引用户阅读完整清单或运行仓库 Node 命令，异常时要求使用完整匹配技能包。

完整 manifest 自动生成到维护目录，formatVersion=3，保留来源、integrity、hash、转换规则、生成器/选择器与 controller 信息；files 相对使用资源目录，并登记 snapshot.json。旧 manifest/package.json 重新出现会被检查为多余资源。variants.json 及全部本地示例保留。

同步与 --check 的默认命令保持不变；自定义 --root 必须提供外置 --manifest，且清单不能位于资源目录中。测试使用独立临时资源与清单，发布 UMD 缓存的独立 manifest 不受影响。

同步先核验资源与清单的暂存版本，再备份和替换资源、清单及 controller。最终检查通过前出错则回滚所有已变动目标；某个恢复动作失败时继续恢复其他目标并保留尚未恢复的备份，报告 AggregateError。流程不承诺进程强杀或断电下的多目标原子性。

### 验证结果

环境：Node.js 22.23.3；Python 3.11.16，使用已有 `/tmp/vchart-dsv-220-validation` 环境（含 openpyxl、PyYAML）。无项目依赖变更。

| 检查 | 实际结果 |
| --- | --- |
| 测试目录迁移后、旧布局下的回归 | 原有 25 Python、37 Node 用例通过 |
| 版本标记/移除维护资源的新测试先于实现运行 | 旧实现出现 3 项预期失败，然后接入新布局 |
| 最终 Python unittest | 26 项通过，无跳过 |
| 最终 Node 资源/CLI 检查 | 40 项通过，无跳过，顺序复测 7.1 秒 |
| Node 发布/回滚测试 | 8 项通过，无跳过 |
| 迁移后的 data-bindings Node 测试 | 5 项通过，无跳过 |
| Playwright skill-catalog + skill-portable | 100 项通过，49.6 秒 |
| skill quick_validate | 通过 |
| 默认及自定义 root/manifest CLI 校验 | 通过 |
| 首次真实布局迁移 | 同步器成功生成新布局，无手改资源树 |
| 重复同步 | 使用资源、外置清单及 controller 共 150 个文件逐字节一致 |
| git diff --check | 通过 |

本轮最终共 179 项自动测试通过：26 Python + 40 资源/CLI + 8 发布故障 + 5 绑定 + 100 浏览器。Node 总计 53 项，未将重跑用例重复计数。

故障验证覆盖外置清单备份失败、资源安装失败、清单安装失败、controller 部分写入失败和最终校验失败；验证旧字节恢复、暂存/备份清理及后续重试成功。首次迁移失败时恢复包含旧内置 manifest/package.json 的目录；首次全新发布失败时无部分输出。另验证恢复资源目录本身失败时，原备份保留，其他清单/controller 仍恢复。

浏览器回归保留 28 类最小示例、52 个变体、7 个复制分发场景、12 类表格绑定及真实 CDN/移动布局检查。所有复制场景增加断言：不含 tests、完整 manifest、发布包 package.json，含 snapshot.json。Python 副本验证生成与重放，以及缺标记、非法 JSON、版本不匹配时无输出目录。

### 执行中的一次失败与修正

加入 CLI 检查后的资源复核曾与重复同步重叠执行，8 项测试在资源目录替换期间遇到 ENOENT。原因是执行安排不当，而非断言不兼容；没有放宽测试或改变链接/hash 检查。待同步完成后顺序重跑同一资源测试文件，40 项全部通过。维护说明已明确先等待同步退出，再复制资源或运行资源回归。

### 命令

从仓库根目录执行，PATH 使用上述 Node 22，Python 为上述虚拟环境：

```sh
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
python -m unittest discover -s packages/vchart-statplots/skill-maintenance/tests -p 'test_*.py'
node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs packages/vchart-statplots/__tests__/runtime/skill-publication.test.cjs packages/vchart-statplots/skill-maintenance/tests/data-bindings.test.cjs
```

最终资源复测单独执行 skill-resources.test.cjs。维护文档中的 --root/--manifest 显式路径调用由独立 CLI 子进程测试覆盖。

在 packages/vchart-statplots 目录执行：

```sh
DSV_PYTHON=/tmp/vchart-dsv-220-validation/bin/python ./node_modules/.bin/playwright test \
  --config __tests__/browser/playwright.config.ts \
  skill-catalog.spec.ts skill-portable.spec.ts
```

### 内容与体积比较

按本轮实施前工作区保存的有效源文件与分发资源计量，排除 __pycache__、.pyc 和 .DS_Store：

| 指标 | 实施前 | 实施后 |
| --- | ---: | ---: |
| skill 文件数 | 174 | 169 |
| skill 总字节 | 477,888 | 381,671 |
| skill 内完整 manifest | 67,952 | 0 |
| skill 内发布包 package.json | 2,263 | 0 |
| 自动生成 snapshot.json | 0 | 25 |

分发净减少 96,217 字节，约 20.1%；维护目录的完整 manifest 为 67,869 字节。维护证据仍保存在仓库，并非从项目删除。

与本轮前工作区逐文件比较：移出上述 2 个元数据和 4 个源测试，新增 snapshot.json；使用端仅 SKILL.md、输入协议和 Python 版本读取逻辑发生相应修改。variants/index、52 个变体、最小示例、类型、指南、release.json、HTML/JS 与 controller 均逐字节保留。此前尚未提交的改动未被 reset。

## 深度交互

目标版本与生成资源版本分别保留，是忘记同步时的检测依据；snapshot 由工具生成，不新增人工维护入口。模型选图仍按需使用本地 variants/类型/指南，完整来源追溯集中在仓库。

未提交 Git、未创建 PR，未运行 VChart 全量视觉基线比较。本轮没有修改公共库渲染路径；后续创建 PR 前仍需按 AGENTS.md 完成全量视觉比较并审查报告，不能用这 100 项技能浏览器测试替代。
