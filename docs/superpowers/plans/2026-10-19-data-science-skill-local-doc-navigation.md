# 数据科学 skill 本地文档导航 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> 执行技能不可用时，在当前会话按任务顺序执行，不自行安装技能或启动子代理。用户已授权执行，三个任务均已完成；未提交 Git，保留此前的版本入口优化改动。验收结果见文末执行记录。

**Goal:** 让 guides 与 index.json 的文档阅读入口全部指向随 skill 分发的本地资源，删除重复的远端完整文档导航，同时保留发布来源追溯。

**Architecture:** 修改现有同步器，生成仅含本地链接的指南和本地文件索引。同步器内部仍用发布文档源 URL 解析相对链接，但不把该源 URL 输出为阅读入口；manifest 继续保存版本、来源 URL、原文件 hash 和转换记录。通过离线检查阻止远端文档入口或本地断链重新出现。

**Tech Stack:** Node.js 22、现有 TypeScript AST、node:test、Python 3.11+ unittest、现有 Playwright；不新增依赖。

## Global Constraints

- 保持 release.json 的目标版本 `2.2.0`，不改 JavaScript CDN、图表配置或渲染逻辑。
- 保留唯一人工版本入口，保留 skill 复制到仓库外使用的能力。
- 保留 28 类本地图表指南、类型声明、最小输入、公共约束和图型选择语义；不裁剪正文以消除链接。
- 本轮处理 guides（含 common.md）和 index.json 的文档导航。variants.json 的 52 个远端 JSON 示例链接保持现状，不宣称整个 skill 完全离线。
- 来源地址留在 manifest；继续使用已发布包的原字节资源，不从 workspace 中另一个版本补充声明或语义。
- 不复制完整文档副本，不将远端 Markdown 链接替换成 GitHub 链接或仓库外相对路径。
- 只修改同步源并重新生成资源，禁止手改生成文件或 hash。
- 保留 tarball integrity、生成器/选择器 hash、文件 hash、引用检查及 staging/回滚流程。
- 文档优先中文，历史计划和验收记录保留原状。本轮不创建 PR、不提交 Git。

## 直接执行：设计与任务

### 现状与方案

当前 28 份图型指南的正文已在本地，顶部均有三条本地链接和一条远端“完整文档”链接；index.json 每项也保存一个 fullDocsUrl。指南正文中的既有资源导航已经是本地链接。运行生成器和浏览器图型用例消费 guide、typeFile、example 等字段，不依赖 fullDocsUrl。

| 方案 | 结果 | 判断 |
| --- | --- | --- |
| 删除远端文档入口，本地内容继续按需维护 | 不新增文档副本，来源由 manifest 追溯 | 推荐，满足当前目标且改动集中 |
| 将完整发布文档额外复制进 skill | 保留完整手册入口 | 扩大资源和重复阅读范围；目前未发现具体内容缺口，不采用 |
| 改成 GitHub 或 CDN 的其他地址 | 仍需外部文档读取 | 不能解决外部导航依赖，不采用 |

### 目标契约

- 图型指南顶部只保留 TS 类型、最小输入、公共约束三条本地链接。
- index.json 保留 `type/name/useWhen/avoidWhen/typeName/typeFile/guide/example/variantFile?`，删除 fullDocsUrl，不增加同义 URL 字段。
- guides 的 Markdown 资源链接只允许相对文件路径或本页锚点；文件目标必须收录在 manifest 中。既有文件校验继续使用，不新增 Markdown 解析依赖。
- 变体 JSON 链接的固定版本检查继续独立执行；删除 index.fullDocsUrl 后，不能连带删除这项检查。
- manifest 的发布来源和 hash 不因清理阅读入口而删除。
- 以文件目标可达为本轮链接检查范围；不声称已增加 Markdown 标题锚点存在性解析。

指南示例：

```markdown
# 类别计数图 `countPlot`

[TS 类型](../types/plots/count/types.d.ts) · [最小输入](../examples/specs/minimal/countPlot.json) · [公共约束](common.md)
```

### 文件与接口

| 文件 | 职责及变化 |
| --- | --- |
| `packages/vchart-statplots/scripts/sync-visualization-skill.mjs` | 移除索引 fullDocsUrl 和指南完整文档入口；内部 sourceUrl 只用于链接解析；完善离线检查 |
| `packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs` | 覆盖本地导航生成、来源保留、远端导航与断链反例 |
| `skills/data-science-visualization/references/statplots/index.json` | 重新生成 28 项本地资源索引 |
| `skills/data-science-visualization/references/statplots/guides/` | 重新生成指南，正文统计语义保留 |
| `skills/data-science-visualization/references/statplots/manifest.json` | 由同步器更新生成器 hash、输出 hash 和转换规则版本 |
| `skills/data-science-visualization/SKILL.md` | 明确图型文档使用本地入口、发布来源在 manifest |
| `skills/data-science-visualization/references/input-and-interaction.md` | 补充维护约束和本轮与变体远端示例的范围区别 |

不修改 release.json、Python 生成器、HTML 模板、公共库源码；若实施中发现实际依赖，先记录证据再调整范围。

### Task 1：修改生成器及本地导航契约

**Files:** sync-visualization-skill.mjs、skill-resources.test.cjs。

**Interfaces:**

- `buildPlotIndex(catalog, typeFiles)` 调用不变，返回项移除 fullDocsUrl。
- `buildPlotGuide(sourceText, selectors, links)` 保留三参数；links 改为 `{typeFile, example, sourceUrl}`。sourceUrl 是内部发布源定位，不写入指南或索引。
- 内部 `rewriteLinks(content, links)` 使用 links.sourceUrl 解析包内相对地址，不依赖 index 中的远端字段。
- `syncResources(root)`、`checkResources(root, options)` 调用不变。

- [x] **Step 1：补强已有索引和指南测试，先观察失败。**

索引测试增加字段缺失断言。指南测试 fixture 使用真实的发布路径结构，包含 schema 链接和跨图指南链接；检查正文语义保留及导航输出，不只检查标签文字。

```js
const { buildPlotGuide, version } = await import(moduleURL);
const source = '# 图\n\n## 输入\n每行是真实观测。\n[类型](../../schema/plots/a.json)\n[另一图](b.md)\n';
const guide = buildPlotGuide(source, ['输入'], {
  typeFile: '../types/a.d.ts',
  example: '../examples/a.json',
  sourceUrl: `https://unpkg.com/@visactor/vchart-statplots@${version}/docs/plots/a.md`
});
assert.match(guide, /真实观测/);
assert.match(guide, /\[TS 类型\]\(\.\.\/types\/a\.d\.ts\)/);
assert.match(guide, /\[最小输入\]\(\.\.\/examples\/a\.json\)/);
assert.match(guide, /\[公共约束\]\(common\.md\)/);
assert.match(guide, /\[另一图\]\(b\.md\)/);
assert.doesNotMatch(guide, /https?:\/\//);
```

在已有 buildPlotIndex 测试中加入：

```js
assert.equal(Object.hasOwn(index[0], 'fullDocsUrl'), false);
```

运行 `node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs`，预期新增导航契约失败。

- [x] **Step 2：修改索引、指南生成与内部链接上下文。**

从 buildPlotIndex 返回值删除 fullDocsUrl；buildPlotGuide 顶部仅输出三条本地链接。同步循环直接以 `releaseURL(name)` 构造 sourceUrl，公共指南以 `releaseURL(settings.source)` 构造同类上下文；rewriteLinks 不再读取 fullDocsUrl。

包内 schema、最小示例、图型指南及公共说明继续映射到既有本地资源。删除“未识别包内链接直接退回 CDN”的行为：无法映射时明确报错，包含源文档和目标，让维护者补足必要本地内容。外部 HTTP 链接不得成为 guides 的资源导航；本轮不新建通用外链白名单。

示例生成片段：

```js
const guide = buildPlotGuide(read(name).toString(), selectors.plots[entry.type], {
  typeFile: '../' + entry.typeFile,
  example: '../' + entry.example,
  sourceUrl: releaseURL(name)
});
```

- [x] **Step 3：更新转换规则标识及资源检查。**

将输出语义改变的 plot-guide-v1/type-index-v1 更新为 plot-guide-v2/type-index-v2；manifest formatVersion 仍为 2，其文件清单及来源记录结构不变。checkResources 明确拒绝索引残留 fullDocsUrl、guide/typeFile/example 的远端路径，以及 guides 中的 HTTP/HTTPS 资源链接；本地文件不存在时沿用断链报错。variants.exampleUrl 的固定版本检查保留。

- [x] **Step 4：重新生成资源并跑本任务测试。**

```sh
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs
```

应通过全部测试；同步仍从已发布 2.2.0 读取，不能手工修正生成结果使测试通过。

### Task 2：验证完整性校验不被削弱

**Files:** skill-resources.test.cjs、同步器 checkResources。

**Interfaces:** `checkResources(root, {checkWorkspace})` 对临时副本离线验证；保留现有 hash 和文件目标校验。

- [x] **Step 1：增加语义反例，排除“只靠 hash 检测”的假通过。**

每个反例使用独立临时资源副本。写入修改后更新副本 manifest.files 对应 sha256，再调用 checkResources：

1. 将指南一个本地链接替换为固定版本 CDN Markdown 链接，预期远端导航错误。
2. 在索引项重新加入 fullDocsUrl，预期索引契约错误。
3. 将索引 guide 改成远端 URL，预期本地资源目标错误。
4. 将指南本地链接改成 absent.md，仍需报断链。

参考现有测试的写入模式：

```js
const file = 'guides/histogram.md';
const bytes = Buffer.from('[远端文档](https://example.test/histogram.md)');
await fs.writeFile(path.join(root, file), bytes);
manifest.files[file].sha256 = createHash('sha256').update(bytes).digest('hex');
await fs.writeFile(path.join(root, 'manifest.json'), JSON.stringify(manifest));
await assert.rejects(checkResources(root), /Remote guide link/);
```

实现时采用上述明确错误文本，测试与实现一致；不通过放宽 hash 检查触达语义分支。

- [x] **Step 2：证明来源记录仍然完整。**

对已生成 manifest，断言 index.json 的 sources 和 countPlot 指南的 sources 非空、指向 release.json 选择的固定发布地址，并保留 sourceSha256 与转换规则；保留已有 tarball 完整性失败及同步失败保留旧快照/controller 的用例。

- [x] **Step 3：运行 Node 回归与离线检查。**

```sh
node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs skills/data-science-visualization/tests/data-bindings.test.cjs
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
```

预期本地导航反例失败得当，正常资源通过，原有版本入口和回滚测试通过。

### Task 3：更新使用说明并验证分发产物

**Files:** SKILL.md、references/input-and-interaction.md；使用现有 Python 与浏览器用例。

**Interfaces:** 使用者按本地 guide/typeFile/example 读取；维护者照常修改 release.json 并执行同步，无额外命令。

- [x] **Step 1：补充两处短说明。** SKILL.md 明确按本地索引读取类型、指南和最小输入，发布来源见 manifest；协议文档说明远端文档链接不得重新作为 guides/index 的入口。本轮保留变体 JSON 链接，不把图表 JS CDN 描述为已离线。
- [x] **Step 2：审查生成差异。** 应主要是 28 个指南顶部远端入口、28 个索引字段及 manifest 的 hash/转换记录变化；正文统计语义、types、最小输入和 variants 字节不应变化。若有额外变化，逐项解释。
- [x] **Step 3：再次同步并比较字节。** 对 references/statplots 全目录及 controller 逐文件 SHA-256 比较，确认不产生额外变化；不使用 Git reset 清理此前尚未提交的改动。
- [x] **Step 4：运行消费者回归。** Python 选用已有含可选依赖的 3.11+ 环境，Node 使用 22。

```sh
python3.11 -m unittest discover -s skills/data-science-visualization/tests -p 'test_*.py'
```

在 packages/vchart-statplots 目录执行：

```sh
DSV_PYTHON=python3.11 ./node_modules/.bin/playwright test \
  --config __tests__/browser/playwright.config.ts \
  skill-catalog.spec.ts skill-portable.spec.ts
```

覆盖本地索引消费、28 类图表、12 类表格绑定、复制到仓库外生成/重放及真实 JS CDN 加载。检查结果不得用已有 95 项测试的历史通过数替代。

- [x] **Step 5：记录实际验收结果。** 按实施情况新建 `docs/superpowers/validation/2026-10-19-data-science-skill-local-doc-navigation.md`，记录命令、通过/跳过/失败、正文差异及同步稳定性。运行 git diff --check。若后续创建 PR，仍需额外完成 AGENTS.md 要求的全量视觉基线比较；本轮不创建 PR。

## 深度交互：边界与后续判断

本地指南不足以解释某种有效用法时，应按具体内容缺口完善生成选择规则，从同版本发布文档提取必要说明；不以复制整本手册或恢复远端入口作为默认处理。

本计划没有将 variants.json 的 52 个远端示例本地化。那会涉及选择保留 options、删除可选链接还是新增示例副本，应由具体使用需求决定，避免为追求“零 URL”扩大维护范围。

## 计划自审

- 所有实施步骤落在同步源、校验、生成资源和必要使用说明，未修改公共库渲染或 Python/HTML 生成逻辑。
- sourceUrl 仅为同步器内部上下文，fullDocsUrl 从消费索引删除；来源仍由 manifest 提供。
- 反例同时检验 hash 与导航契约，不能靠只检查字符串消失证明链接可用。
- JavaScript CDN 和变体 JSON 示例均有明确边界，未宣称全技能离线。

## 执行记录

已在当前会话顺序完成三个任务。25 项 Python、23 项 Node、47 项浏览器测试均通过，离线资源检查、skill 校验及 98 个文件的重复同步一致性检查通过。指南正文和非目标资源已与本轮实施前工作区逐字节比较。

详见[验收记录](../validation/2026-10-19-data-science-skill-local-doc-navigation.md)。未提交 Git、未创建 PR；PR 前全量视觉基线比较本轮未执行。
