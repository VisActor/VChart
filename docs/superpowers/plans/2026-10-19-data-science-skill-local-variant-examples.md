# 数据科学 skill 变体示例本地化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> 执行技能不可用时，在当前会话按任务顺序执行，不自行安装技能或启动子代理。用户已授权执行，三个任务已完成；未提交 Git，保留此前尚未提交的优化改动。实际结果见文末执行记录。

**Goal:** 将 variants.json 中全部远端 JSON 示例入口改为随 skill 分发的本地文件，保留变体语义、发布来源和独立分发能力。

**Architecture:** 现有同步器从 release.json 指定的发布 tarball 中原字节复制变体 JSON，生成 example 本地路径。离线检查将变体纳入 manifest 文件清单和引用闭包，并核对示例 type/options 与所属元数据；使用真实发布 UMD 验证示例可渲染。来源 URL 和原文件 hash 继续集中保留在 manifest。

**Tech Stack:** Node.js 22、内置 node:util、现有 node:test、Python 3.11+ unittest、现有 Playwright；不新增运行依赖。

## Global Constraints

- 当前目标版本仍为 2.2.0，release.json 继续作为唯一人工版本入口。
- 当前 variants.json 包含 21 类图表、52 个变体条目和 52 个独立示例路径；数量由发布目录推导，不把 52 写成通用运行约束。
- 变体 JSON 必须取自同版本、已核验 integrity 的 npm tarball；保持原字节，不从 workspace 示例替代，不合并 options 重造示例。
- 保留现有 name、aliases、options、图型归属和条目顺序；只将 exampleUrl 替换为 example。
- 本地路径相对 references/statplots 根目录，采用 examples/specs/variants/<发布文件名>.json，与 index.json 的 example 契约一致。
- 不保留远端 exampleUrl 的兼容分支，不新增本地失败后联网回退。
- 变体只按用户选中的图型按需读取；不要求模型预读全部 52 个文件。
- 保留 types、guides、最小示例、图型选择规则、Python 输入协议和 JavaScript 渲染逻辑，不升级 CDN。
- 保留 tarball integrity、来源 hash、输出 hash、生成器/选择器 hash、版本一致性、断链及 staging/回滚检查。
- 不手改生成资源，不新增统计计算或第二套 Spec validator/compiler。
- skill 仍可整体复制至仓库外使用。参考资料读取可本地完成，HTML 图表 JavaScript 仍通过固定 CDN 加载。
- 文档优先中文；更新当前使用说明，历史计划与验收记录保留当时事实。本轮不创建 PR、不提交 Git。

## 直接执行：方案与实施任务

### 方案选择

| 方案 | 收益与代价 | 判断 |
| --- | --- | --- |
| 原字节复制发布示例，并以本地 example 引用 | 当前新增 52 个小 JSON，沿用现有同步和 provenance 机制 | 推荐，满足本地资源要求，示例行为不另造 |
| 以最小示例合并 options 动态构造变体 | 减少示例文件，但 options 不一定包含输入数据和所有必要配置变化 | 不采用，会增加示例合成契约 |
| 将全部示例正文嵌入 variants.json | 一个文件，但定位一个变体需携带更多无关数据 | 不采用，与按需读取设计不一致 |

### 目标资源结构与契约

```text
references/statplots/
  variants.json
  examples/specs/minimal/             现有最小示例
  examples/specs/variants/            新增发布变体示例
    countPlot-proportion.json
    countPlot-series-proportion.json
    ...其他发布目录中引用的 JSON
  manifest.json
```

变体索引条目示例：

```json
{
  "name": "类别比例图",
  "aliases": ["类别占比", "proportion count plot"],
  "options": {"statistic": "proportion"},
  "example": "examples/specs/variants/countPlot-proportion.json"
}
```

example 是文件路径，不是 URL；来源在对应 manifest.files[example] 记录。原字节复制的文件应满足 sourceSha256 === sha256。variants 索引的转换规则由 variant-index-v1 改为 variant-index-v2，manifest formatVersion 维持 2，因为来源记录与文件清单结构不变。

### 文件与职责

| 文件 | 计划变化 |
| --- | --- |
| `packages/vchart-statplots/scripts/sync-visualization-skill.mjs` | 提取变体索引构造函数，复制发布示例，扩展资源清单/引用闭包/语义检查 |
| `packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs` | 增加索引映射、来源 hash、本地路径、缺文件、JSON/type/options 反例 |
| `packages/vchart-statplots/__tests__/browser/skill-catalog.spec.ts` | 在现有 28 类最小示例基础上，逐个验收变体示例 |
| `packages/vchart-statplots/__tests__/browser/skill-portable.spec.ts` | 增加复制 skill 后读取变体并生成/渲染的端到端用例 |
| `skills/data-science-visualization/references/statplots/variants.json` | exampleUrl 改为本地 example，保留其余元数据 |
| `skills/data-science-visualization/references/statplots/examples/specs/variants/` | 从发布包生成当前 52 个独立 JSON |
| `skills/data-science-visualization/references/statplots/manifest.json` | 登记新资源、来源/输出 hash、索引转换规则与生成器 hash |
| `skills/data-science-visualization/SKILL.md` | 特殊变体改为按需读取 options 与本地 example |
| `skills/data-science-visualization/references/chart-selection.md` | 将变体“固定链接”说明改为本地示例路径 |
| `skills/data-science-visualization/references/input-and-interaction.md` | 更新此前保留变体远端示例的边界说明 |

### Task 1：发布示例复制与索引生成

**Interfaces:** 新增纯函数 `buildVariantIndex(catalog) -> Record<string, Array<{name, aliases, options, example}>>`；保留 syncResources(root)、checkResources(root, options)、release.json 的调用方式。

- [x] **Step 1：先补变体映射测试。** 在 skill-resources.test.cjs 中构造一个有变体、一个无变体的 catalog；断言返回值只包含有变体的图型，保留元数据，example 为原发布相对路径，且没有 exampleUrl。

```js
const { buildVariantIndex } = await import(moduleURL);
const item = {
  name: '类别比例图', aliases: ['类别占比'],
  options: { statistic: 'proportion' },
  example: 'examples/specs/variants/countPlot-proportion.json'
};
const variants = buildVariantIndex([
  { type: 'countPlot', variants: [item] },
  { type: 'missingValueMatrix', variants: [] }
]);
assert.deepEqual(variants, { countPlot: [item] });
assert.equal(Object.hasOwn(variants.countPlot[0], 'exampleUrl'), false);
```

运行 `node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs`，确认新增测试因缺少目标接口而失败。

- [x] **Step 2：提取索引映射并复制变体原文。** 复用现有 catalog、read、write、sourceRecord；不要针对 52 个 URL 再发独立网络请求。按索引引用的 example 去重写入，同一资源只登记一次。

```js
const variants = buildVariantIndex(catalog);
const paths = new Set(Object.values(variants).flat().map(variant => variant.example));
for (const name of paths) {
  await write(name, read(name), sourceRecord(name));
}
```

保留 variants.json 一行一个 type 的现有输出风格。索引元数据来自发布目录，不由本地示例文件名重新推导名称或 options。发布归档缺少任一引用文件时提取失败，在替换快照前终止；沿用现有清理/回滚逻辑。

- [x] **Step 3：补齐资源白名单和引用闭包。** 在既有允许类型之外新增 `examples/specs/variants/[A-Za-z0-9_-]+.json` 路径形式；保留最小示例现有规则，不放开任意目录。将所有 variant.example 纳入 referenced 集合，继续拒绝未被引用的多余文件。

- [x] **Step 4：定义本地变体检查并重新同步。** checkResources 中删除旧的 variant.exampleUrl 固定 URL 检查，改为 Task 2 的本地资源与元数据检查。删除旧字段，不保留兼容分支。执行现有同步和 --check，确认生成当前 52 个文件及 variant-index-v2 记录。

```sh
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
```

### Task 2：验证本地引用、示例语义与来源

**Interfaces:** checkResources 对整个本地快照离线工作，不加载浏览器或源码 compiler。语义对照复用上游 check-catalog.ts 的判定方式：spec.type 必须等于图型，options 每个顶层键的值与 spec 对应值深度相等，嵌套对象使用 Node 内置 isDeepStrictEqual。

- [x] **Step 1：补充正常资源检查。** 每个条目都必须有符合变体目录形式的 example，且在 manifest.files 中登记；禁止残留 exampleUrl、HTTP/HTTPS/绝对路径及目录穿越。读取并解析 JSON，确认图型和 options 对应，不重写输入数据或配置。

核心判定示意：

```js
const spec = JSON.parse(await readFile(join(root, variant.example), 'utf8'));
if (spec.type !== type) throw new Error(`Variant example type mismatch: ${variant.example}`);
for (const [key, value] of Object.entries(variant.options)) {
  if (!isDeepStrictEqual(spec[key], value)) {
    throw new Error(`Variant example option mismatch: ${variant.example}: ${key}`);
  }
}
```

- [x] **Step 2：增加独立临时副本反例。** 沿用已有 Node 资源测试结构，每个反例复制完整快照；需要触达语义检查时同步更新副本 manifest 文件 hash，避免只有 hash 不符造成假通过：

| 变更 | 应失败的原因 |
| --- | --- |
| 删除一个被引用的变体文件 | 缺失资源 |
| 改变示例字节但不更新 hash | 文件 hash 不符 |
| 将 example 改为 URL、绝对路径或 ../ 路径 | 本地变体路径契约 |
| 重新加入 exampleUrl | 远端旧字段残留 |
| 写入非法 JSON并更新 hash | JSON 解析失败 |
| 将示例 type 改为其他图型并更新 hash | 图型不匹配 |
| 改变示例某个 options 对应值并更新 hash | 变体选项不匹配 |
| 登记并加入一个未被引用的 JSON | 资源引用闭包不完整 |

例如在已有副本 root/manifest 结构下测试选项不匹配：

```js
const variants = JSON.parse(await fs.readFile(path.join(root, 'variants.json'), 'utf8'));
const file = variants.countPlot[0].example;
const spec = JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
spec.statistic = 'count';
const bytes = Buffer.from(JSON.stringify(spec));
await fs.writeFile(path.join(root, file), bytes);
manifest.files[file].sha256 = createHash('sha256').update(bytes).digest('hex');
await fs.writeFile(path.join(root, 'manifest.json'), JSON.stringify(manifest));
await assert.rejects(checkResources(root), /Variant example option mismatch/);
```

- [x] **Step 3：验证来源与原字节。** 对全部变体资源检查 source 指向 release.json 对应的发布路径，sourceSha256 与输出 sha256 相同；实施时与已核验 tarball 中对应文件逐字节比较。variants.json 的来源仍为发布 plot-catalog.json；其规则更新为 variant-index-v2。
- [x] **Step 4：执行 Node 测试与离线检查。** 保留并通过此前的版本入口、文档本地导航、tarball 完整性和失败回滚用例；不为新目录放宽旧检查。

```sh
node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs skills/data-science-visualization/tests/data-bindings.test.cjs
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
```

### Task 3：使用说明、发布 UMD 与独立分发验收

**Interfaces:** 用户仍读取 index 指向的 variantFile，并只读取选中条目的 options/example；模型无需 npm、TypeScript、仓库源码或远端 JSON fetch。

- [x] **Step 1：更新三处使用说明。** SKILL.md 与 chart-selection.md 将“选项与固定链接”改为“选项与本地 example”；input-and-interaction.md 删除变体 JSON 仍为远端的说明，明确参考内容随 skill 分发，浏览器图表 JS 仍使用固定 CDN。历史验收记录不改写。
- [x] **Step 2：扩展现有 skill-catalog 浏览器用例。** 保留 28 类最小示例测试，从本地 variants.json 枚举全部条目，读取本地 JSON 并交给既有 generate/openGenerated/expectRendered/marks；每个变体一个确定性测试。不得通过合并 options 修复发布示例。

```ts
const variants = JSON.parse(fs.readFileSync(path.join(resource, 'variants.json'), 'utf8'));
for (const [type, items] of Object.entries(variants) as [string, any[]][]) {
  for (const entry of items) {
    test(`published UMD renders local variant ${entry.example}`, async ({ page }) => {
      const spec = JSON.parse(fs.readFileSync(path.join(resource, entry.example), 'utf8'));
      expect(spec.type).toBe(type);
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      const html = generate({ version: 1, title: entry.name,
        charts: [{ id: 'plot', spec, source: { label: '发布变体示例' } }] });
      await openGenerated(page, html);
      await expectRendered(page);
      expect((await marks(page, 'plot')).length).toBeGreaterThan(0);
      expect(errors).toEqual([]);
    });
  }
}
```

数据源明确标注为发布演示数据，不能将其包装为用户真实分析结果。若真实发布示例失败，记录具体原因；不得跳过、放宽 rendered 检查或临时替换为 workspace 产物。

- [x] **Step 3：补一个完整复制场景。** 在 skill-portable.spec.ts 临时复制整个 skill，读取副本的 variants.json，确认所有 example 文件存在，再用副本中的 countPlot 比例示例和副本 Python 脚本生成 HTML。用发布 UMD 打开并断言 rendered、真实图元和规范 spec.statistic=proportion；测试中的输入路径不得回指原仓库。复用既有 portable 用例的临时目录清理方式。
- [x] **Step 4：运行消费者回归。** Node 使用 22，Python 选用已有 3.11+ 且具备可选测试依赖的环境。先运行 Python 测试，再在 packages/vchart-statplots 目录运行以下浏览器测试：

```sh
python3.11 -m unittest discover -s skills/data-science-visualization/tests -p 'test_*.py'
```

```sh
DSV_PYTHON=python3.11 ./node_modules/.bin/playwright test \
  --config __tests__/browser/playwright.config.ts \
  skill-catalog.spec.ts skill-portable.spec.ts
```

测试数量按真实结果记录：当前预计为新增 52 个变体渲染测试和 1 个独立分发测试，不沿用此前的 95 项历史通过数。

- [x] **Step 5：审查差异及重复同步稳定性。** 基于本轮开始前工作区记录快照，确认新增当前 52 个示例和 variants/manifest 变化；现有类型、指南、最小示例、release、Python/HTML 与 controller 字节保持一致。记录新增文件字节数、资源总体积及索引大小，说明文件数增长而非隐藏其成本。再次同步，全目录及 controller hash 应完全一致。
- [x] **Step 6：记录实际验收。** 新建 `docs/superpowers/validation/2026-10-19-data-science-skill-local-variant-examples.md`，记录测试、原字节比较、缺文件/语义反例、分发和同步稳定性。执行 skill quick_validate 和 git diff --check。本轮不创建 PR；后续创建 PR 前仍需按 AGENTS.md 执行全量视觉基线比较，不能以技能浏览器回归替代。

## 深度交互：维护成本与边界

本地化会新增 52 个生成资源文件，但不新增 52 个人工维护点。未来仍只维护 release.json 的一个版本值，索引与文件均从同版本发布包重建。保留发布原文，避免逐次升级时维护示例合成逻辑。

本地示例解决的是参考资料读取的网络依赖，不能据此声称 HTML 完全离线运行。JavaScript CDN 的离线分发属于不同目标，本轮不扩展。

## 计划自审

- 已覆盖目录白名单、manifest 文件清单、引用闭包、变体 type/options 语义、原字节与发布来源。
- example 与 index.json 的同名字段使用相同根目录，不引入第二套路径基准。
- 迁移不保留 exampleUrl，消费者文档与生成规则一同更新。
- 测试覆盖所有发布变体的真实渲染及仓库外复制；不依赖源码版本替代发布物。
- 三个任务已执行，测试、发布原字节和体积比较结果见执行记录。

## 执行记录

已在当前会话顺序完成三个任务。25 项 Python、37 项 Node、100 项浏览器测试通过；52 个变体与核验后的发布 tarball 原字节一致，150 个文件的重复同步检查通过。新增示例共 150,492 字节，variants.json 从 14,180 字节减少为 11,372 字节。

详见[验收记录](../validation/2026-10-19-data-science-skill-local-variant-examples.md)。未提交 Git、未创建 PR，PR 前全量视觉基线比较本轮未执行。
