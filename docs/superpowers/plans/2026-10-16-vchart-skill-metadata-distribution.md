# VChart 技能元数据分发精简实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.
>
> 上述技能不可用时，在当前会话顺序执行，不安装额外技能、不创建其他聊天。任务默认顺序执行；用户随后明确授权整理并本地提交，未授权推送或创建 PR。用户于 2026-10-16 授权执行，实施和本轮验收已完成；结果见 [验收记录](../validation/2026-10-16-vchart-skill-metadata-distribution.md)。

**Goal:** 从技能分发元数据中移除源码追踪、继承过程与重复信息，同时完整保留生成有效 VChart 配置所需的类型、说明、版本边界和依赖导航。

**Architecture:** 保留现有 TypeScript 抽取结果作为维护工具的内部模型，增加一个明确的分发投影函数。`generate/check/audit` 共享该投影契约；技能只消费精简 JSON，源码定位、完整继承关系与内容指纹由仓库工具继续管理。

**Tech Stack:** Node.js 22、仓库已有 TypeScript、`node:test`、既有 Playwright 验证器与 Python 标准库；不新增运行时依赖、JSON Schema、模型调用框架或配置平台。

## 全局约束

- 用户已授权执行本计划并追加授权整理、本地提交；不扩展到推送、发布或其他技能整理。
- 不修改 VChart/VRender 运行时、公开类型、图表生命周期、HTML 模板或 HTML 生成器。
- 保留已有 HTML/spec、诊断、视觉还原、React 交付规则，仅更新元数据读取说明。
- 不为历史内部元数据结构维护双格式读取分支；新产物统一使用 `formatVersion: 3`。
- 保留源码抽取、符号身份、别名绑定、映射类型、未解析依赖报错和确定性生成机制。
- 不通过缩减依赖、删除图型、截断类型或重写描述来追求体积指标。
- `since` 保留原始文本；它可能包含“某版本支持百分比字符串”，不能当作纯 semver。
- 保留前序已完成的 evals 迁移及文档改动，不重置、覆盖；按本次用户授权一并提交。
- Python 生成器单元测试迁移、README 使用说明整体去重、人工类型详情精简不属于本计划。
- Node.js 必须为 22；当前 shell 默认是 v24.19.0，本机已有 `/Users/bytedance/.nvm/versions/node/v22.23.3/bin`。命令中的临时目录须每次创建，不覆盖旧验收材料。
- 本期不创建 PR；未来提交 PR 前仍必须按仓库要求执行全量视觉回归，无法执行时如实记录。

## 执行中的有据调整

实际测试发现旧来源清单的 sequence 核心入口已不存在，故迁移后按真实扩展入口修正来源及注册前提。当前源码也已将 dot/link 迁出核心，已安装的 VRender/VDataset 版本较旧资料更新。因此，重新生成时同步了 `common.series`、相关补充声明及外部版本来源。其他属性、导航和人工知识保持不变；未为保持旧文件而回填已失效契约。

用 HEAD 原版抽取器和本轮抽取器对同一当前源码、修正后的清单及已安装依赖作完整对照，36 个内部模型和生成补充声明均相等。下述“与基线不变”验收以此当前来源对照为准；对旧已提交资料的例外和证据详见验收记录。

## 一、现状与方案选择

当前 36 份 type-meta 共 3,507,786 bytes；`bar.json` 为 119,080 bytes、3,151 行。最终有效属性共 2,601 项，其 `category` 全部为“未分类”。继承节点与最终属性重复携带类型、描述和源码信息。

| 方案 | 收益与代价 | 决策 |
| --- | --- | --- |
| 仅删除 `source/inheritedFrom` | 改动小，但重复继承属性和维护字段继续随技能分发 | 不选 |
| 保留内部抽取模型，增加精简分发投影 | 保留既有维护能力，明确使用侧契约，一次解决重复与维护信息泄漏 | 采用 |
| 重写抽取器和整个参考文档体系 | 涉及符号解析及人工知识迁移，风险超出本次目标 | 不选 |

按候选字段投影的静态测算，JSON 可降至约 1.24 MB，减少约 65%。这是测算而非已验证结果，不作为删减有效知识的理由；最终记录实际字节和变化来源。

## 二、分发字段契约

### 顶层

| 处理 | 字段 |
| --- | --- |
| 保留 | `typeName`、`formatVersion`、`effectiveProperties`、`complexTypeDefinitions`、`vchartVersion` |
| 有则保留 | `extensionVersion`、`registration`、`registrationNote`、`initializationIncludes`、`openContract` |
| 有则投影 | `contractNotes` 仅保留 `description/example`，维护用 `sourceFile` 留在内部模型 |
| 不分发 | `inheritanceTree`、`statistics`、`sourceFile`、`sourceHash`、`sourceRevision`、`typescriptVersion`、固定的 `version`、自动拼接的顶层 `description` |

`formatVersion` 固定为 3；`vchartVersion/extensionVersion` 继续说明知识来源版本，不暗示所有历史版本均兼容。

### 最终属性

| 处理 | 字段 |
| --- | --- |
| 保留 | `name`、`description`、`type`、`required`、`isSimple`、`dependencies` |
| 有则保留 | `defaultValue`、`since`、`deprecated`、`literalValues`、`dependencyBindings` |
| 不分发 | `source`、`inheritedFrom`、`category`、`originalType` |

`type` 保留当前图型上下文解析后的完整类型，不改写泛型参数、联合类型或可选性。`dependencies/dependencyBindings` 继续承接类型导航；移除源码原始类型拼写不能改变别名映射。

### 依赖定义

保留 `typeName/reference` 及存在时的外部依赖 `package/version`；不分发 `filePath`。同名类型仍按现有符号身份生成不同导航键，不能因移除路径就按短类型名合并。

## 三、文件与职责

| 文件 | 操作与职责 |
| --- | --- |
| `packages/vchart/scripts/skill-metadata/distribution.mjs` | 新增：纯函数 `toDistributedMetadata(metadata)`，仅负责完整模型到分发模型的投影 |
| `packages/vchart/scripts/skill-metadata/distribution.test.mjs` | 新增：投影语义、字段白名单、false/空值保留、别名导航与不修改输入的测试 |
| `packages/vchart/scripts/skill-metadata.mjs` | 修改：生成及比较精简产物；增加 `audit --report` 的维护来源摘要 |
| `packages/vchart/scripts/skill-metadata/extract.mjs` | 修改：审计精简产物；内部抽取和补充详情输出保持原有语义 |
| `packages/vchart/scripts/skill-metadata.test.mjs` | 修改：区分内部抽取测试与分发产物审计测试；补真实图型投影回归 |
| `packages/vchart/scripts/skill-metadata/metadata-sources.json` | 从技能 references 原样迁入，作为仓库维护输入 |
| `skills/vchart-development-assistant/references/type-meta/*.json` | 重新生成全部 36 份，统一格式 3 |
| `skills/vchart-development-assistant/SKILL.md` | 删除继承树与源码字段的消费说明，明确只查询最终属性和依赖 reference |
| `skills/vchart-development-assistant/README.md` | 将“知识库维护”整节移至仓库维护说明；保留用户使用说明 |
| `docs/skills/vchart-development-assistant-maintenance.md` | 新增：来源清单位置、字段契约、生成/审计命令及维护报告说明 |
| `docs/superpowers/validation/2026-10-14-vchart-skill-metadata-quality.md` | 只更新已移动来源清单的链接，不改写历史验收结果 |
| `docs/superpowers/validation/2026-10-16-vchart-skill-metadata-distribution.md` | 实施时新增：实际基线、语义对比、体积、命令结果与阻断 |

其他历史计划中的旧路径是当时的实施记录，不批量改写。当前操作说明和可点击资源链接必须指向真实位置。

## 四、实施任务

### Task 1：固定基线并实现纯投影函数

**输入：** 当前工作区的 36 份 JSON、完整抽取模型。

**产出接口：** `toDistributedMetadata(metadata): object`，不读文件、不修改输入、不解析 TypeScript。

- [x] 用 Node 22 创建仓库外临时目录，复制当前 type-meta、topkey、人工 type-details 和生成补充详情，并登记实际 Git SHA、未提交改动与字节总量。

```sh
export PATH="/Users/bytedance/.nvm/versions/node/v22.23.3/bin:$PATH"
node --version
metadata_baseline_dir=$(mktemp -d /tmp/vchart-metadata-distribution.XXXXXX)
cp -R skills/vchart-development-assistant/references "$metadata_baseline_dir/references"
git rev-parse HEAD
git status --short
```

- [x] 先在 `distribution.test.mjs` 建立投影语义测试。最小输入同时包含本次保留与移除字段，使用值级断言而不是匹配生成文本。

```js
const raw = {
  typeName: 'Spec', formatVersion: 2, vchartVersion: '2.1.7',
  sourceHash: 'maintenance-only', inheritanceTree: {},
  effectiveProperties: [{
    name: 'enabled', description: '是否启用', type: 'boolean | undefined',
    originalType: 'boolean', required: false, isSimple: true,
    dependencies: [], defaultValue: false,
    since: '1.11.2 支持百分比字符串', deprecated: false,
    source: 'packages/example.ts', inheritedFrom: 'Spec', category: '未分类'
  }],
  complexTypeDefinitions: {}
};
const before = structuredClone(raw);
const published = toDistributedMetadata(raw);
assert.equal(published.formatVersion, 3);
assert.deepEqual(published.effectiveProperties[0], {
  name: 'enabled', description: '是否启用', type: 'boolean | undefined',
  required: false, isSimple: true, dependencies: [], defaultValue: false,
  since: '1.11.2 支持百分比字符串', deprecated: false
});
assert.deepEqual(raw, before);
```

- [x] 运行 `node --test packages/vchart/scripts/skill-metadata/distribution.test.mjs`，确认首次失败来自缺失投影能力，再实现按字段白名单构造输出。可选字段按是否存在保留，不使用真值过滤；无合法值不新增默认值或兜底。
- [x] 测试覆盖：外部包版本保留、同名定义不同 reference、别名绑定、`contractNotes.example` 不变、非分发字段不泄漏、重复调用结果一致。
- [x] 重新运行投影测试。预期全通过，输入不变，导航键和 reference 不变。

### Task 2：让生成、审计与检查使用同一分发契约

**输入：** `extractChart(context, source)` 的完整模型与 Task 1 的投影函数。

**产出：** `generate/check` 生成格式 3；`auditReferences` 检查格式 3，同时继续使用完整抽取结果提供诊断来源。

- [x] `buildArtifacts` 统一通过投影生成 JSON，保持原有完整抽取成功后才写文件的行为。

```js
const metadata = extractChart(context, source);
files.set(
  `type-meta/${source.chart}.json`,
  JSON.stringify(toDistributedMetadata(metadata), null, 2) + '\n'
);
```

- [x] 更新审计：每个图型分别持有 `expectedRaw` 与 `expected = toDistributedMetadata(expectedRaw)`；仅从 `actual.effectiveProperties` 读取发布属性，删除回退读取 `inheritanceTree` 的分支。
- [x] 审计保留原有属性存在性、解析类型、required、依赖集合、别名绑定、topkey 作用域、reference 目标和锚点检查；新增格式 3、字段白名单、扩展注册约束及其他保留值检查。`sourceFile/filePath` 不再是发布产物必需字段。
- [x] 审计属性错误的来源从 `expectedRaw.effectiveProperties` 查找；定义正确性以投影后的导航键、`typeName/reference/package/version` 核对，不能只检查目标文件存在。
- [x] `audit --report` 在现有报告上增加 `provenance`：`vchartVersion`、`extensionVersion`、`typescriptVersion`、`sourceHash`、`sourceRevision`。报告写入显式输出路径，不在技能中创建另一份维护清单。
- [x] 为实际分发模型补充反例：缺 `required`、替换合法方向枚举、篡改 reference、交换同名别名目标、丢弃注册前提、遗留非分发字段均被拒绝；合法模型无需源码路径也能通过。

```js
const full = metadata('bar');
const published = toDistributedMetadata(full);
const wrong = structuredClone(published);
wrong.effectiveProperties.find(p => p.name === 'direction').type = "'default' | 'reverse'";
const report = auditReferences(context, [source('bar')], references, new Map([['bar', wrong]]));
assert(report.errors.some(e => e.code === 'TYPE_MISMATCH' && e.property === 'direction'));
```

- [x] 内部抽取测试仍可断言 `inheritanceTree/filePath/originalType`；分发审计测试传入投影对象。不要为了让测试通过删掉同名符号、Omit、循环依赖、泛型或未解析导入的反例。
- [x] 更新隔离 CLI 夹具：复制新增 `distribution.mjs`，后续还须复制 Task 3 迁移后的清单路径；保留“传递依赖失败时无部分输出”的反例。
- [x] 执行针对投影和分发审计的测试。此阶段旧已提交 JSON 与格式 3 不一致属于待重生成状态；Task 4 完成后再登记完整 `check` 通过。

### Task 3：迁移维护入口并更新技能消费说明

**输入：** 完整来源清单、现有 CLI/测试夹具、技能读取说明。

**产出：** 分发目录不再含元数据维护清单；工具和文档均使用新契约。

- [x] 将 `references/metadata-sources.json` 原样迁至 `packages/vchart/scripts/skill-metadata/metadata-sources.json`。修改 CLI 和测试的读取位置；其中 `sourceFile` 仍按仓库根解析，`detailReferences` 仍按 references 根解析，不改清单内容。
- [x] 修改 CLI 失败夹具中的清单写入位置。用迁移前字节比较，确认除 sequence 必要修正外的 35 个入口和 74 个人工详情映射没有变化；sequence 的扩展约束按真实源码补齐。
- [x] 修改 `SKILL.md`：说明 `effectiveProperties` 是当前图型最终属性；复杂类型经 `dependencies/dependencyBindings` 到 `complexTypeDefinitions.reference` 查询。移除“读取继承树/源码路径”的要求，保留版本与开放契约说明。
- [x] 将 README 的“知识库维护”章节搬入 `docs/skills/vchart-development-assistant-maintenance.md`，补全新路径、格式 3 和维护报告位置；README 保留用户使用内容，不让普通生成流程要求仓库依赖或维护命令。
- [x] 更新历史验收文档中来源清单的可点击链接；检索活跃工具和使用文档，保证没有旧清单路径、旧继承树消费要求或漏更新的夹具。

```sh
rg -n 'metadata-sources\.json|inheritanceTree|originalType|sourceFile' \
  packages/vchart/scripts/skill-metadata.mjs \
  packages/vchart/scripts/skill-metadata.test.mjs \
  packages/vchart/scripts/skill-metadata \
  skills/vchart-development-assistant/SKILL.md \
  skills/vchart-development-assistant/README.md \
  skills/vchart-development-assistant/workflows \
  docs/skills/vchart-development-assistant-maintenance.md
```

检索到内部抽取、维护说明和测试中的源码字段是正常的，不能机械删除；技能消费说明不得依赖被移除字段。

### Task 4：重生成并证明配置知识和导航未退化

**输入：** 基线副本、新生成器与维护入口。

**产出：** 36 份格式 3 JSON，保留值与基线一致，候选通过后才更新工作区。

- [x] 先生成候选目录，运行真实审计；必要时通过 `audit --references` 建立包含候选 type-meta 和现有详情/topkey 的临时 references 副本，不把仅含 type-meta 的目录冒充完整知识库。

```sh
metadata_candidate_dir=$(mktemp -d /tmp/vchart-metadata-candidate.XXXXXX)
node packages/vchart/scripts/skill-metadata.mjs generate --output "$metadata_candidate_dir"
```

- [x] 对基线与候选逐图型、逐属性比较：属性名字集合、`description/type/required/isSimple/defaultValue/since/deprecated/literalValues/dependencies/dependencyBindings` 均不变；定义的导航键、`typeName/reference/package/version` 不变；注册、版本和行为说明不变。不得用字段数量相同代替值级比较。
- [x] 检查所有 reference 文件与锚点存在，并实际沿“方向枚举、动画泛型、标签回调、同名别名、嵌套泛型”查到对应声明。保留内部 Omit 测试，确认顶层最终属性与完整系列定义没有混淆。
- [x] 比较基线副本：topkey、人工 type-details 不变；`AdditionalTypes-Type-Definition.md` 与旧资料的差异已逐节核对，限于迁出核心的类型及外部版本来源同步；与 HEAD 抽取器在当前源码的输出逐字节相等。
- [x] 候选检查通过后执行 `generate --write`，再执行完整工具测试、`audit/check` 和第二次 `check`，记录零漂移。

```sh
node packages/vchart/scripts/skill-metadata.mjs generate --write
node --test packages/vchart/scripts/skill-metadata/distribution.test.mjs packages/vchart/scripts/skill-metadata.test.mjs
node packages/vchart/scripts/skill-metadata.mjs audit --report "$metadata_candidate_dir/audit.json"
node packages/vchart/scripts/skill-metadata.mjs check
node packages/vchart/scripts/skill-metadata.mjs check
git diff --check
```

- [x] 记录实际总字节、每图型字节和缩减率。预期约减少 65%；若明显偏离，说明字段/缩进差异，不删有效内容或放宽语义断言。

### Task 5：验证技能消费并登记验收

**输入：** 精简技能、现有仓库级行为任务、真实渲染验证工具。

**产出：** 语义回归、实际使用验证及限制清晰的验收记录。

- [x] 使用现有 Agent 执行能力按独立上下文顺序执行下列请求，不预先提供正确配置；只提供技能路径、真实请求和输出位置。未具备独立执行能力时记录未执行，不用手写 spec 代替 Agent 行为通过，也不建设新框架。

| 任务 | 原始请求 | 检查 |
| --- | --- | --- |
| 水平柱图 | “周一 12、周二 25、周三 18、周四 32。用 VChart 水平柱图比较，返回完整 JSON spec。” | 四条数据不变，方向及字段合法，实际柱图方向正确 |
| 标签回调 | 复用仓库级 `evals/vchart-development-assistant/generation-scenarios.md` 的 G14 原始请求 | 实际查询标签签名，JS 函数保留，四个标签与高低条件正确 |
| HTML 生成 | 复用 G02 原始请求 | 继续输出完整 HTML，有真实数据图元，未因知识格式调整改变交付目标 |

- [x] 对实际 JSON/HTML/JS 产物解析并渲染；复用 `verify-examples.mjs` 的 `m01` 柱图入口及既有页面验证能力。验证器不覆盖标签条件的部分须检查实际文本，不能仅凭出现 canvas 或截图报通过。

```sh
node packages/vchart/scripts/skill-metadata/verify-examples.mjs --artifacts /tmp/vchart-distribution-artifacts --case m01
```

上述 `/tmp/vchart-distribution-artifacts` 是本次实际产物目录示例，执行时使用本次创建并登记的目录。验证器缺产物会返回 `not_run`，必须检查每项状态，不能仅看进程退出码。

- [x] 扩展注册与开放契约通过真实元数据投影及反例验证；未新建 3D 产物或未运行 3D 环境时明确记录范围，不复用旧报告冒充本次实测。
- [x] 此变更不涉及图库渲染实现，本轮验证以元数据语义、导航及代表性实际产物为主，不冒称全量视觉通过。提交 PR 前按仓库要求执行 `node packages/vchart/scripts/visual-test.mjs` 并审查差异及执行错误。
- [x] 在本次 validation 文档记录 Git 状态、Node 版本、基线/产物目录、字段对比、实际体积、全部命令结果、Agent 任务与浏览器证据及未执行项。

## 五、完成标准

- [x] 技能目录不再分发来源清单；全部 36 份 type-meta 为格式 3，只有本计划允许的字段。
- [x] 最终属性、解析类型、必需性、说明、默认值、版本说明、弃用提示和依赖导航与当前来源对照保持一致；旧资料的必要同步已单独登记。
- [x] 分发产物无需源码路径即可通过审计；维护错误仍能指出实际源码位置。
- [x] 同名、别名、泛型、循环依赖与缺失导入反例仍生效；错误输入不会生成部分产物。
- [x] Node 22 下投影测试、完整维护工具测试、真实 CLI `audit/check` 通过；二次检查无漂移。
- [x] topkey、人工详情不变；补充声明仅接受已核实的资料同步，技能交付规则保持不变。
- [x] 行为验证和渲染范围如实记录；阻断、`not_run`、未运行全量视觉不能登记为通过。
- [x] 只有本计划和前序 evals 迁移范围内的预期改动，无自动提交、发布或全局技能同步。

## 六、风险与回退

主要风险是投影时丢失合法 false/可选字段、移除来源后破坏同名类型身份，以及审计仍依赖旧结构。以保留字段值级比较、独立导航反例和真实 CLI 检查分别约束。

若原始类型拼写中的信息确实无法通过 `type + dependencies + reference` 找回，应先修复导航或解析契约；只有存在具体必要信息缺失的证据时，才讨论增加最小消费字段，不恢复整份维护结构。

回退以 Task 1 的工作区基线副本为准，只恢复本次修改的生成工具、消费说明与 type-meta；保留前序 evals 迁移和用户其他修改。不得使用 `git reset --hard` 或覆盖整个工作区。
