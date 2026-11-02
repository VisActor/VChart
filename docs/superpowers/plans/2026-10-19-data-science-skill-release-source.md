# 数据科学 skill 版本来源收敛 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> 执行技能不可用时按任务顺序在当前会话执行，不自行安装技能或启动子代理。用户已授权执行，实施与验收已完成；未提交 Git，保留此前的 2.2.0 升级改动。验收结果见文末执行记录。

**Goal:** 数据科学 skill 后续升级只维护一个版本配置，执行现有同步命令即可更新配套资源；生成 HTML、参考快照和测试使用同一个固定发布版本。

**Architecture:** 在 skill 根目录增加 `release.json`，作为唯一人工维护的库版本来源。Python 生成器、Node 同步器及发布 UMD 测试缓存读取该文件；manifest 继续作为生成结果和来源证明，离线检查验证其与配置一致。章节选择器及维护文档不再重复记录具体发布版本。

**Tech Stack:** Node.js 22、Python 3.11+ 标准库、现有 TypeScript AST、node:test、unittest、Playwright；不新增运行依赖。

## Global Constraints

- 当前目标版本保持 `2.2.0`，本次仅优化维护流程，不再次升级依赖。
- VChart 和 statplots 继续固定为同版本组合；不引入 latest、自动追新、混合版本或 workspace 包版本推导。
- skill 可整体复制到仓库外运行；Python 不依赖 Node、npm 或仓库根目录。
- 保留现有 tarball integrity、文件 hash、生成器/选择器 hash、引用检查及 staging/回滚机制。
- 不手工替换生成指南、索引、manifest 中的版本或 hash；由同步工具重新生成。
- 配置或快照不一致时明确失败，不回退旧版、不静默改写快照。
- 版本检查在生成/同步边界执行，不进入浏览器图元 render、update 或交互热路径。
- 保留现有 request version=1、12 类表格绑定、28 类图表、预算、交互和三个输出文件；库版本与 request 协议版本分别处理。
- 中文说明优先；历史设计、计划和验收记录保留当时版本，不批量重写历史。

## 直接执行：设计与实施步骤

### 现状与成功标准

目前有四类重复维护点：Python `VERSION`、Node `version`、选择器 `version`、文档/测试中的固定版本字符串。此前 38 个文件的升级 diff 中，32 个是生成资源；本计划消除人工重复输入，不承诺减少必须更新的生成资源数量。

完成后的日常升级流程：

1. 修改 `skills/data-science-visualization/release.json` 的一个版本值。
2. 从仓库根目录执行同步和离线检查。
3. 执行相关自动测试，审查发布内容引起的实际差异。

若新发布改变章节、类型或行为，仍需调整选择器或代码；“只改一处”只指版本号输入，不承诺任意升级都无需适配。

### 方案比较

| 方案 | 收益 | 成本与判断 |
| --- | --- | --- |
| 独立 `release.json`，推荐 | 一个输入，同时供 Python/Node 使用；保留现有同步接口 | 新增一个小 JSON，职责是目标版本，和生成结果分开 |
| manifest 同时作为目标版本 | 不新增配置文件 | manifest 是生成物，需另设计升级参数或自修改流程，容易混淆目标版本与已同步版本 |
| 从 workspace package.json 推导 | 复用仓库发版版本 | skill 不能独立消费；源码版本也不证明对应 npm 资源已发布，不采用 |

### 版本契约

新增文件内容：

```json
{
  "version": "2.2.0"
}
```

`version` 只接受固定的 `主.次.补丁` 或其预发布版本，例如 `2.1.8-alpha.0`；不支持 npm tag、范围或 URL。配置与快照中的版本可以重复出现，但只有配置是人工编辑入口，其余均为派生产物。

数据流：`release.json → 同步器 → manifest/指南/索引`；`release.json + manifest 一致性检查 → payload.libraries → HTML CDN`。测试缓存沿用同步器导出的版本读取配置，不另存人工版本。

### 文件职责

| 文件 | 计划变化 |
| --- | --- |
| `skills/data-science-visualization/release.json` | 新增唯一人工版本入口 |
| `skills/data-science-visualization/scripts/visualization_io.py` | 移除固定 VERSION；加载配置并验证快照版本，写入 payload.libraries |
| `skills/data-science-visualization/scripts/visualization_html.py` | 移除 VERSION 导入，从 payload.libraries 取得模板版本 |
| `packages/vchart-statplots/scripts/sync-visualization-skill.mjs` | 从 release.json 读取导出的 version；保留同步与 --check 接口 |
| `packages/vchart-statplots/scripts/visualization-skill-resources.json` | 删除重复的发布 version，保留章节选择规则 |
| `packages/vchart-statplots/scripts/cache-published-umd.mjs` | 沿用其既有 version 导入，通常无需修改 |
| `skills/data-science-visualization/SKILL.md` | 改为说明版本由 release.json 固定，维护流程集中指向协议文档 |
| `skills/data-science-visualization/references/input-and-interaction.md` | 移除写死的发布版本，集中记录升级命令和验收方式 |
| Python CLI/HTML/IO 测试、Node skill-resources 测试 | 验证真实传播和遗漏同步时的失败行为 |
| `skills/data-science-visualization/references/statplots/` | 通过现有同步脚本重建，更新生成器及选择器 hash |

### Task 1：统一版本输入及消费路径

**Files:** 新增 release.json；修改 visualization_io.py、visualization_html.py、sync-visualization-skill.mjs、visualization-skill-resources.json，以及对应测试。

**Interfaces:**

- Python 新增 `load_release_version(skill_root: Path) -> str`：读取根目录配置，确认固定版本格式，并检查 `references/statplots/manifest.json` 的 version 相等。
- Python `build_payload(request, base_dir)`、`render_html(payload, asset_root)` 的调用接口不变。
- Node 保留 `export const version`、`syncResources(root)`、`checkResources(root, options)`；version 的值来自配置。
- Node 新增可测试的 `readReleaseVersion(file: string) -> string`，默认调用点传入 skill 配置绝对路径；不新建通用配置框架。

- [x] **Step 1：补充能发现遗漏同步的测试。**

在 Python 测试复制整个 skill 到临时目录；只把 release.json 改为 `9.9.9-test.0`，保留旧 manifest，执行真实 CLI。断言返回非零、错误包含同步提示、输出目录不存在。不要通过修改生产目录制造失败。

在该副本中再把 manifest.version 改为同一测试值，重新运行 CLI，检查两个实际 script src 和生成 data 文件中的两个库版本。固定预期为测试值，不能只比较两个同源变量。该用例只验证版本传播，不访问这个虚构版本的 CDN，也不伪称发布物已验收。

示例断言，沿用现有 CliTests 的临时目录和 run 变量：

```python
self.assertNotEqual(run.returncode, 0)
self.assertIn('同步', run.stderr)
self.assertFalse((root / 'out').exists())

# 在配置与 manifest 均匹配的另一次运行后：
self.assertIn('vchart@9.9.9-test.0/build/index.min.js', page)
self.assertIn('vchart-statplots@9.9.9-test.0/build/index.min.js', page)
self.assertEqual(data['libraries'], {
    'vchart': '9.9.9-test.0', 'statplots': '9.9.9-test.0'
})
```

Node 使用临时 JSON 测试 readReleaseVersion：固定版本和预发布版本可读，latest、^2.2.0、缺失 version 均失败。现有 checkResources 用例增加“只改 manifest.version”的反例，断言版本不一致失败。

- [x] **Step 2：运行新增测试，确认它们能发现当前硬编码路径。**

```sh
python3.11 -m unittest discover -s skills/data-science-visualization/tests -p 'test_*.py'
node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs
```

预期新增断言失败；现有行为不应出现无关回归。

- [x] **Step 3：实现最小消费路径。**

Python 在 build_payload 内加载一次配置/快照并写入 libraries，避免配置错误在模块 import 时绕过 CLI 的现有错误处理。文件缺失沿用资源错误，版本不一致使用包含配置路径和同步命令的 ValueError；不扫描整个快照的 hash。HTML 模板保留单个 VERSION 占位符，以 `payload['libraries']['vchart']` 填充，两个库同版由 build_payload 保证。

Node 用现有 readFileSync/JSON.parse 加载配置；只在这个维护边界检查固定版本格式。删除选择器 version 校验中的重复条件，保留图型覆盖数和章节存在性校验。checkResources 仍把 manifest.version 与配置目标比较。

readReleaseVersion 不依赖快照，因而同步工具仍能在快照缺失时创建它。安装态 Python 缺快照则明确失败，因为它需要该快照的类型索引。

- [x] **Step 4：由同步器重建派生产物并运行回归。**

```sh
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
python3.11 -m unittest discover -s skills/data-science-visualization/tests -p 'test_*.py'
node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs skills/data-science-visualization/tests/data-bindings.test.cjs
```

预期全部通过。检查发布缓存仍从同步器导入版本、版本变化时会重建缓存；保留既有 integrity 失败、类型缺失时保存旧快照/controller 的测试。

### Task 2：去除文档和测试中的重复升级点

**Files:** SKILL.md、references/input-and-interaction.md、tests/test_visualization_cli.py。

**Interfaces:** 使用者照常生成 HTML；维护者只修改 release.json 并运行现有命令。

- [x] **Step 1：替换现有 CLI 测试中的 2.2.0 字面量。** 读取副本的 release.json，检查真实生成的两条 CDN 和 libraries 元数据；保留 Task 1 的独立测试值传播用例，避免所有预期都跟随同一处错误实现。
- [x] **Step 2：文档改成稳定契约。** SKILL.md 写“VChart/statplots 使用 release.json 指定的同版本固定 CDN”；协议文档写明配置路径、同步与 --check 命令、快照失败处理及浏览器验收，不再维护“当前版本号”段落。
- [x] **Step 3：审查升级操作。** 未来同接口版本升级不应需要修改 Python/Node 源码、测试预期或说明正文；只编辑 release.json，生成物随同步变化。章节语义不兼容时应失败并要求审查，不自动放宽选择规则。
- [x] **Step 4：确认只有一个人工发布版本输入。** 下列搜索仅用于人工审查；生成快照出现固定版本是正常结果，不新增遍历全仓文字的脆弱测试。

```sh
rg -n '2\.2\.0|2\.1\.8-alpha\.0' skills/data-science-visualization packages/vchart-statplots/scripts/sync-visualization-skill.mjs packages/vchart-statplots/scripts/visualization-skill-resources.json
git diff --check
```

Task 1 和 Task 2 完成后构成一个可审查提交；不要把 Task 1 中短暂尚未更新的固定测试断言作为最终状态。

### Task 3：行为验收与升级演练

**Files:** 使用现有 browser skill-catalog、skill-interactions、skill-portable 用例；按需记录结果到 `docs/superpowers/validation/2026-10-19-data-science-skill-release-source.md`。

**Interfaces:** 无新运行接口；使用真实发布的 2.2.0 CDN/经 integrity 核验的发布 UMD。

- [x] **Step 1：重复同步当前 2.2.0。** 记录第一次同步后的 diff，再次同步，确认不产生额外变化。不得用 Git 重置清除之前已存在的升级修改。
- [x] **Step 2：执行 28 类图表、交互及仓库外便携性测试。** 在 packages/vchart-statplots 工作目录运行，确保当前 PATH 使用 Node 22，DSV_PYTHON 指向已有 Python 3.11+。

```sh
DSV_PYTHON=python3.11 ./node_modules/.bin/playwright test \
  --config __tests__/browser/playwright.config.ts \
  skill-catalog.spec.ts skill-interactions.spec.ts skill-portable.spec.ts
```

预期包含真实 CDN 无拦截加载的 54 项测试通过；检查每图 rendered、真实图元和交互状态。查看便携演示截图，确认默认页面布局一致。

- [x] **Step 3：确认反例有效。** Task 1 的副本用例证明“只改目标未同步”失败、“同步结果匹配后版本传播”成功；再确认缺配置/非法配置不会生成带旧版本的 HTML。不向 npm 请求虚构测试版本。
- [x] **Step 4：记录检查结果和必要限制。** Node 22、Python 版本、自动测试、离线资源检查、重复同步、真实 CDN 结果分别记录。缺 openpyxl 导致跳过时如实记录或用已有具备依赖的环境复测，不写成全部通过。
- [x] **Step 5：准备提交时遵守仓库测试要求。** 本次改动不影响公共渲染实现，以技能相关回归为主；若创建 PR，提交 PR 前额外执行仓库要求的全量视觉基线比较，并审查 agent-summary.md。无法执行须明确记录。

## 深度交互：取舍与风险

1. **不以 diff 文件数衡量维护成本。** 固定链接、包元数据及校验记录必须反映新发布；隐藏这些变化会削弱可复现性。目标是把人工版本输入从多处收敛到一处。
2. **不让仓库发版自动改变 skill。** skill 使用的是已经验收的发布物。主仓库升级与 skill 采用版本分开，避免发布前引用尚不存在的 CDN。
3. **不同步时应停止生成。** release.json 是期望版本，manifest 是已准备的快照；二者不一致说明升级未完成。只做一次边界比较，不加入浏览器运行时兼容分支。
4. **不把旧 HTML 变成自动追新版。** 已生成文件继续锁定原来的 CDN。重新生成时才采用新配置；本计划不增加跨版本历史环境管理。
5. **配置不是新的抽象平台。** 一个 version 字段足够表达当前同版本契约；不预设多 CDN、多包矩阵、自动依赖解析或自动发布流水线。

## 计划自审

- 单一输入、独立分发、来源完整性及当前同版本契约均有明确消费路径。
- 覆盖配置错误、快照未同步、版本传播、同步失败保留旧资源和重复同步稳定性。
- 计划不实施此前 38 项改动之外的业务功能，不改历史记录，不引入运行依赖。
- 方案已执行，代码实现和测试结果见下方执行记录。

## 执行记录

已完成三个任务，采用本会话顺序执行。25 项 Python、16 项 Node、54 项浏览器测试均通过；离线资源检查、技能校验及 98 个文件的重复同步字节一致性检查通过。

详见[验收记录](../validation/2026-10-19-data-science-skill-release-source.md)。Task 3 Step 5 的 PR 前全量视觉比较为条件步骤：本次未创建 PR，不把未运行项目计为通过。尚未提交 Git。
