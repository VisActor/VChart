# 数据科学 skill 使用资源与维护材料分离 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> 执行技能不可用时，在当前会话按任务顺序执行，不自行安装技能或启动子代理。用户已授权执行，四个任务均已完成；未提交 Git，保留此前尚未提交的改动。实际结果见文末执行记录。

**Goal:** 从 skill 移除发布包 package.json、完整 manifest、测试和仓库维护说明；保留自动生成的快照版本标记、variants.json 和独立使用所需资源。

**Architecture:** 仓库新增 `packages/vchart-statplots/skill-maintenance/`，集中维护清单、测试和操作说明。skill 的 `release.json` 继续是唯一人工版本输入，生成的 `references/statplots/snapshot.json` 只记录资源版本，Python 仅比较这两个本地值。同步器在发布前验证暂存资源与外置 manifest，发布时统一管理资源、manifest 和 controller 的备份及异常回滚。

**Tech Stack:** Node.js 22、Python 3.11+ 标准库、现有 TypeScript AST、node:test、unittest、Playwright；无新增运行依赖。

## Global Constraints

- 目标版本保持 2.2.0；不更改图表 JavaScript CDN、公共渲染逻辑、输入协议或数据计算。
- `skills/data-science-visualization/release.json` 保持唯一人工库版本入口，snapshot.json 为同步产物，不另设人工版本来源。
- 保留 variants.json、52 个变体示例、28 类最小输入、类型声明、指南、用户演示、assets、agents 与许可证归属文件。
- 移除的是 `skills/data-science-visualization/references/statplots/package.json`；不删除仓库中真正的 npm 包 package.json。
- skill 使用端不读取仓库维护目录、不依赖 Node/npm、不依赖仓库外路径，整体复制后仍能生成和重放。
- 维护端保留完整来源、integrity、hash、版本一致性、引用闭包、type/options、文档本地导航及同步失败回滚检查。
- 不手改生成文件或 hash；首次迁移也必须由同步器生成新布局。
- 保证可捕获异常下的回滚，不声称多个文件系统目标在断电或进程被强杀时具有原子性。不引入通用事务框架、恢复日志或后台修复。
- 源码与维护材料的迁移按版本控制文件进行，不把 __pycache__、.pyc、.DS_Store 当作需要迁移的资源。
- 当前使用文档与路径需要更新，历史计划和验收记录不批量改写。本轮不创建 PR、不提交 Git。

## 直接执行：设计与任务

### 方案与边界

| 方案 | 结果 | 判断 |
| --- | --- | --- |
| 外置完整维护材料，skill 保留生成的 snapshot.json | 使用端只带必要版本标记；完整证据仍由仓库 --check 管理 | 采用，与用户指定范围一致 |
| skill 内保留完整 manifest，只压缩格式 | 文件略小，使用端与维护端仍耦合 | 不采用 |
| 删除 manifest 与版本一致性校验 | 结构更少，但修改目标版本后可能使用旧参考 | 不采用 |

variants.json 是使用资料，继续保留。其 options/name/aliases 用于选择变体，example 用于定位本地发布示例；不合并进主索引，也不恢复远端入口。

### 目标目录

```text
skills/data-science-visualization/
  SKILL.md
  release.json                         人工目标版本
  scripts/                             使用端 Python
  assets/ agents/ examples/            现有使用资源
  references/
    input-and-interaction.md            使用协议，不再含仓库维护流程
    chart-selection.md
    statplots/
      snapshot.json                    自动生成，仅 version
      index.json variants.json
      types/ guides/ examples/
      LICENSE THIRD_PARTY_LICENSES.md

packages/vchart-statplots/skill-maintenance/
  README.md                            唯一的 skill 维护操作说明
  manifest.json                        完整生成清单，自动生成
  tests/
    _paths.py                          Python 测试的仓库/skill 定位
    test_visualization_cli.py
    test_visualization_io.py
    test_visualization_html.py
    data-bindings.test.cjs
```

现有 packages/vchart-statplots 下的 runtime/browser 测试保持原目录。已有 docs/skill-authoring.md 只补维护说明入口，不复制整套升级步骤。

### 版本与清单契约

snapshot.json 的完整内容形状：

```json
{
  "version": "2.2.0"
}
```

- Python 比较 `release.version == snapshot.version`，不读取完整 manifest 或 source/hash 字段。
- Node 维护检查比较 `release.version == snapshot.version == manifest.version`，并核验完整快照及 controller。
- 完整 manifest 的 files 键继续相对 references/statplots 根目录；包括 snapshot.json 的 hash，不包括外置 manifest 自身、已移除的 package.json。
- 外置 manifest 保留 package、license、integrity、tarball、generator、supportedTypes、files、workspaceAssets。formatVersion 升为 3，明确区分旧的内置清单布局。
- snapshot.json 标明由同步器生成，其来源记录可以采用 `sources: []` 加 `transform: {rule: 'snapshot-version-v1'}`，不伪造 npm 包中存在该文件。
- 缺 snapshot、版本不匹配或 JSON 错误均明确失败，不回退旧 manifest。Python 错误说明更新完整技能包，不再要求普通使用者执行仓库 Node 同步命令。
- 正常升级仍只编辑 release.json 后执行原同步命令和 --check，无新增人工步骤。

### 维护接口与发布策略

同步和校验函数的默认调用保留，第二参数增加 manifestPath：

```js
syncResources(root = defaultRoot, { manifestPath } = {})
checkResources(root = defaultRoot, { manifestPath, checkWorkspace = true } = {})
```

默认 root 使用 `packages/vchart-statplots/skill-maintenance/manifest.json`。自定义 root 必须显式提供独立 manifestPath，避免临时测试覆盖主仓库清单。CLI 保留 --root 并新增 --manifest：

```sh
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --root /tmp/dsv/resources --manifest /tmp/dsv/manifest.json
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --root /tmp/dsv/resources --manifest /tmp/dsv/manifest.json --check
```

资源暂存目录和备份目录位于目标 root 同级，清单暂存文件和备份文件位于 manifestPath 同级，避免引入跨文件系统 rename 假设。

## Task 1：迁移维护测试，保持现有行为

**Files:** 迁移 skill/tests 下的 3 个 Python 源测试和 data-bindings.test.cjs；新增 skill-maintenance/tests/_paths.py。

**Interfaces:** 测试中的 SKILL/ASSETS 仍指向仓库原 skill，便携性测试仍复制这个真实目录。测试源本身不再随 skill 分发。

- [x] **Step 1：新增测试路径定位并迁移源文件。** _paths.py 的定位固定依据新目录结构，不搜索用户其他目录：

```python
from pathlib import Path

REPOSITORY = Path(__file__).resolve().parents[4]
SKILL = REPOSITORY / 'skills' / 'data-science-visualization'
```

三个 Python 测试导入 `from _paths import SKILL`；IO/HTML 测试将 SKILL/scripts 加入 sys.path，ASSETS 使用 SKILL/assets。Node 测试读取：

```js
const skill = path.resolve(__dirname, '../../../../skills/data-science-visualization');
```

不复制本地缓存及 Finder 文件；不通过改变测试数据使路径问题消失。

- [x] **Step 2：在旧清单布局下运行迁移后的测试。** 先证明移动目录没有改变断言或减少覆盖：

```sh
python3.11 -m unittest discover -s packages/vchart-statplots/skill-maintenance/tests -p 'test_*.py'
node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs packages/vchart-statplots/skill-maintenance/tests/data-bindings.test.cjs
```

使用已有具备 openpyxl/PyYAML 的 Python 3.11+ 环境。本步骤应保留现有全部通过用例；不先改成空跑测试以迁就新路径。

## Task 2：拆分版本标记与完整清单，保证同步异常回滚

**Files:** sync-visualization-skill.mjs、visualization_io.py、迁移后的 CLI 测试、现有 runtime/skill-resources.test.cjs、自动生成资源和外置 manifest。

**Interfaces:** Python load_release_version(skill_root) 签名保持；syncResources/checkResources 采用上文 manifestPath 参数。允许新增一个只负责本次三个发布目标的维护端 publishSnapshot 函数，禁止扩展成任意资源事务系统。

- [x] **Step 1：先补版本标记和独立使用测试。** 修改 CLI 的版本传播用例，使其在临时副本中修改 snapshot.json，而非完整 manifest；新增确认副本中没有 tests、完整 manifest、package.json 也可生成/重放的断言。仅修改 release 时仍失败，snapshot 匹配后才成功。

```python
self.assertFalse((copied / 'tests').exists())
self.assertFalse((copied / 'references/statplots/manifest.json').exists())
self.assertFalse((copied / 'references/statplots/package.json').exists())
snapshot_path = copied / 'references/statplots/snapshot.json'
snapshot_path.write_text(json.dumps({'version': '9.9.9-test.0'}))
```

测试值只在副本使用，不请求虚构发布物。另测缺标记、非法 JSON、版本不匹配时无输出目录。执行新增测试并确认旧实现失败。

同时把 Node 资源测试的临时 fixture 改为分开复制资源与外置清单，所有自定义 root 调用显式传 manifestPath；按 Task 3 Step 1 的路径契约接通，供本任务的失败注入及语义测试使用。

- [x] **Step 2：修改生成器和清单布局。** Python 只读取 release/snapshot，不再打开完整 manifest。同步器停止复制发布包 package.json，生成 snapshot.json 并登记 hash；完整 manifest 写入独立暂存文件，资源目录内不再生成完整清单。

checkResources 从 manifestPath 读取 formatVersion=3，expected/referenced 集合仅包含使用资源及 snapshot.json；不将旧 manifest/package.json 当作允许的特例。旧文件重新出现应被识别为多余资源。保留已有 variants、类型和文档检查。

- [x] **Step 3：在替换前完成暂存校验。** 校验暂存资源时显式提供暂存清单，不读取线上旧清单：

```js
await checkResources(stagingRoot, {
  manifestPath: stagingManifestPath,
  checkWorkspace: false
});
```

来源、generator、snapshot、文件 hash 和引用关系均通过后，才允许发布。

- [x] **Step 4：将资源、清单和 controller 纳入同一异常回滚范围。** 发布顺序为备份旧资源、备份旧外置清单、安装新资源、安装新清单、更新 controller、最终检查。每个成功的备份/安装动作单独记录；任何步骤抛错，删除已经安装的新目标、恢复实际存在的备份及原 controller 字节。

特别覆盖“资源已备份，但备份旧清单失败”的状态，不能只对最后几次 rename 增加 catch。首次迁移时外置清单不存在是有效状态；失败后恢复原资源目录，包括其中旧 manifest/package.json，不捏造一个旧外置文件。首次创建全新目录失败后不残留部分输出。

如提取 publishSnapshot，使用明确的领域参数：

```js
publishSnapshot({
  root, stagingRoot, manifestPath, stagingManifestPath,
  controllerPath, controllerBytes,
  validate: () => checkResources(root, { manifestPath })
})
```

validate 在发布后、删除备份前调用。没有 controller 源时不新增 controller 操作。辅助函数仅服务这三个目标，无网络、无版本推导、无通用插件机制。

- [x] **Step 5：新增故障注入与外置清单反例。** 维护端发布函数使用 node:fs/promises 的默认 fs 对象执行 rename，以便 Node test 的 mock.method 定点模拟错误；不新增生产 CLI 的测试专用故障开关。每个用例只操作临时目录，测试结束恢复 mock。

必须覆盖：备份外置清单失败、资源安装后清单安装失败、controller 写入失败、最终 validate 失败，以及无旧目录/清单的首次发布失败。分别断言资源树、清单、controller 的旧字节恢复，临时 staging/backup 清理；不得污染仓库真实副本。

还需覆盖自定义 root 缺 manifestPath 的拒绝行为、外置清单缺失/版本不符、snapshot 版本或 hash 不符，以及旧 manifest/package.json 再次出现在资源目录的拒绝行为。保留现有发布 integrity/类型缺失回滚测试。

- [x] **Step 6：执行首次真实迁移与离线检查。** 由同步器从同版本发布物重建；移出完整清单和 package.json 只能是新布局发布的结果，不手改生成树使检查通过。

```sh
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
```

## Task 3：迁移校验用例与维护说明，清理使用端入口

**Files:** skill-resources.test.cjs、SKILL.md、input-and-interaction.md、新 skill-maintenance/README.md、docs/skill-authoring.md。

**Interfaces:** 正常使用端只依赖复制后的 skill；完整来源核验与维护命令留在仓库。发布 UMD 测试缓存的 `.vchart-statplots/dsv/published/manifest.json` 是独立缓存清单，不迁移或误改。

- [x] **Step 1：审查资源测试副本的迁移覆盖。** 确认 Task 2 已将每个临时资源测试改为同时复制外置 manifest 到独立 sibling 路径；checkResources/syncResources 必须显式传 manifestPath。所有 hash 篡改、断链、type/options 和来源断言针对该副本清单操作，不访问默认主仓库清单。

```js
const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'dsv-resources-'));
const root = path.join(temp, 'resources');
const manifestPath = path.join(temp, 'manifest.json');
await fs.cp(path.resolve(__dirname, '../../../../skills/data-science-visualization/references/statplots'), root, { recursive: true });
await fs.copyFile(path.resolve(__dirname, '../../skill-maintenance/manifest.json'), manifestPath);
await checkResources(root, { manifestPath });
```

迁移时可提取一个小型测试 fixture helper，返回 `{temp, root, manifestPath}`，统一复制路径；它只供测试使用，不给生产代码添加第二套路径解释。

- [x] **Step 2：收拢维护说明到 README。** 将 input-and-interaction.md 的维护版本章节和 SKILL.md 中 controller 同步/manifest 阅读/仓库命令说明移入 skill-maintenance/README.md。README 给出唯一版本入口、snapshot/manifest 职责、同步/校验命令、新测试目录、回滚边界以及 PR 前全量视觉测试要求；docs/skill-authoring.md 链接到它，避免复制步骤。

- [x] **Step 3：保留使用者需要的错误处理说明。** SKILL.md 和输入协议继续说明固定 CDN、整体分发、只更新完整匹配资源、缺失或不匹配时停止生成。不要从安装态文档链接回仓库外文件；不要求使用者阅读清单或运行 Node 同步器。

- [x] **Step 4：搜索并区分真实调用与历史记录。** 检查活动脚本/测试/当前文档中旧 tests 路径、旧 manifest 读取和 package.json 复制；修正真实依赖。历史计划、历史验收报告保留原路径，不用全仓替换制造无关改动。

## Task 4：独立分发、升级一致性与体积验收

**Files:** 使用现有 skill-catalog/portable 浏览器测试，按需补迁移后分发断言；新建本任务验收记录。

- [x] **Step 1：执行全部相关单元测试。** Python 测试从新维护目录发现；Node 使用迁移后的 data-bindings 路径和既有资源测试，确认迁移没有减少用例。

```sh
python3.11 -m unittest discover -s packages/vchart-statplots/skill-maintenance/tests -p 'test_*.py'
node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs packages/vchart-statplots/skill-maintenance/tests/data-bindings.test.cjs
```

- [x] **Step 2：执行复制分发与发布 UMD 回归。** 在 packages/vchart-statplots 目录运行，DSV_PYTHON 指向已有 Python 3.11+：

```sh
DSV_PYTHON=python3.11 ./node_modules/.bin/playwright test \
  --config __tests__/browser/playwright.config.ts \
  skill-catalog.spec.ts skill-portable.spec.ts
```

保留 28 类最小示例、52 个变体、仓库外复制/重放和真实 CDN 验收。复制后的 skill 不得包含完整清单、包元数据或维护测试；不通过复制仓库维护目录使生成成功。

- [x] **Step 3：审查真实内容差异。** 以本轮实施前工作区为基准，确认 variants/index、示例、类型、指南、release、HTML/JS 与 controller 字节保留；变化限于目标元数据布局、Python 版本标记读取、测试路径和当前说明。生成 snapshot 与外置 manifest 必须解释清楚，之前未提交的变更不能被 reset。
- [x] **Step 4：检查重复同步与失败后的重新同步。** 资源树、外置清单和 controller 均逐文件 hash 比较，重复同步不产生变化。外置清单故障用例回滚后，正常调用应仍可成功；首次布局迁移也需覆盖。不要只比较 skill 目录而漏掉外部清单。
- [x] **Step 5：计量分发体积。** 报告移出 package/完整清单/测试、增加 snapshot 后的文件数与字节差异；按版本控制资源计量，排除 Python 缓存和 Finder 文件。预计节省约 70 KB 的完整清单与包元数据，另有测试及维护文字，最终写实际值。
- [x] **Step 6：记录验收及范围限制。** 新建 `docs/superpowers/validation/2026-10-19-data-science-skill-maintenance-separation.md`，记录实际命令、通过/跳过/失败、故障回滚、首次迁移、独立分发和体积数据。执行 skill quick_validate、--check、git diff --check。本轮不创建 PR；后续 PR 前仍需执行 AGENTS.md 要求的全量视觉基线比较并审查结果。

## 深度交互：必要保留与成本

release.json 与 snapshot.json 中重复出现版本值，是“目标”和“已生成资源”之间的一致性证明。只有 release.json 人工维护，snapshot 自动生成；删除后者会失去忘记同步时的检测能力。

完整 manifest 的 URL 是维护证据，移出是为了明确职责，不应连带删除来源和可复现性检查。variants 是按需使用目录，保留它有助于避免模型从文件名反推变体语义。

外置清单引入多目标发布，需要承担有限的回滚实现成本。该成本只发生在维护同步路径，不进入每图 render/update 热路径；不为更强的断电一致性新增长期基础设施。

## 计划自审

- 已覆盖用户指定的删除、迁移、保留项，并保留归属文件与独立分发。
- 明确 3 个 Python 源测试和 1 个 Node 源测试的迁移路径；不误迁移缓存。
- 明确外置清单路径、snapshot 形状、自定义 root 行为与三版本校验。
- 首次迁移、备份阶段失败、安装失败和验证失败均有回滚要求及临时测试边界。
- 四个任务已实施，实际测试、故障复测及体积结果见执行记录。

## 执行记录

四个任务已在当前会话完成。26 项 Python、53 项 Node、100 项浏览器测试通过；首次真实迁移、异常回滚及后续重试、150 个文件的重复同步检查通过。skill 从 477,888 字节降至 381,671 字节，生成版本标记为 25 字节。

资源复核曾与同步重叠导致 8 项 ENOENT，改为顺序复测后该文件 40 项全部通过；完整经过见[验收记录](../validation/2026-10-19-data-science-skill-maintenance-separation.md)。未提交 Git、未创建 PR，PR 前全量视觉基线比较本轮未执行。
