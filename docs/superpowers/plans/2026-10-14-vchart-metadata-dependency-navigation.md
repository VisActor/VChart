# VChart 元数据依赖与类型导航修复计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.
>
> 本计划于 2026-10-15 在当前会话顺序实施。未安装额外技能、未创建其他聊天、未提交或推送代码。结果见 [验收记录](../validation/2026-10-15-vchart-metadata-dependency-navigation.md)。

**Goal:** 修复同名类型覆盖、人工详情绕过传递依赖检查、typeof 导航缺失三个问题，补充能在修复前暴露问题的反例测试，保持现有 HTML/spec 场景规则不变。

**Architecture:** 继续使用仓库 TypeScript Compiler API。依赖内部按真实声明位置和符号标识归并，输出阶段再分配导航键；将相关类型解析校验与文档展开策略分离；为类型查询补充对应值声明及导航。保留现有元数据消费字段、生成 CLI 和技能交付流程，不建立新的文档平台。

**Tech Stack:** Node.js 22、仓库 TypeScript 4.9.5、node:test、现有 Python unittest；复用项目依赖，不安装或升级依赖。

## 范围与已知事实

- 当前分支为 `codex/improve-vchart-skill-html-spec`，HEAD 为 `de46ca24b`。上一轮元数据优化仍在工作区，不能以 HEAD 代替本轮基线，也不能覆盖或提交其他未提交内容。
- 同一属性 `A | B` 引用两个模块的同名 `Item` 时，当前依赖 Map 只保留一个定义；当前 36 个入口未发现真实碰撞。
- 属性经 `Broken` 引用缺失模块时，没有人工详情会拒绝；配置人工详情后会跳过递归，错误被遗漏。当前直接缺模块测试没有覆盖这个分支。
- 新补充文档中 `DirectionType = keyof typeof Direction` 和 `RenderMode = keyof typeof RenderModeEnum` 已缺少所引用枚举的详情导航。
- 当前 12 项 Node 测试与 check 均通过。因此新增测试必须证明修复前的上述失败，不能仅追加通过的生成快照。

## 方案选择

| 方案 | 代价 | 判断 |
| --- | --- | --- |
| 修复共享依赖解析、校验与序列化路径 | 局部修改维护脚本，三类问题都有统一回归入口 | 采用 |
| 手工添加缺失 JSON/Markdown 引用 | 下一次生成仍覆盖修补；同名与传递依赖问题仍存在 | 不采用 |
| 全仓库语义检查、全量递归复制文档 | 无关可选依赖可能阻断生成，资源进一步膨胀 | 不采用 |

## 全局约束

1. 不修改 HTML/spec 选择、JSON/JS 格式、增量完整交付、诊断真实数据、React 或 API 场景规则。
2. 不修改图库运行时、公开类型、转换器、HTML 生成器或模板，不引入 schema 校验或用户生成时的编译步骤。
3. 保留 `dependencies: string[]`、`complexTypeDefinitions`、`reference`、`typeName`、`inheritanceTree`、`effectiveProperties` 等现有消费字段。导航键是查找标识，`typeName` 始终保留真实符号名。
4. 无碰撞的短名称继续使用原键；有碰撞时所有相关目标使用稳定的模块区分键，不能让遍历顺序决定谁保留短名称。
5. 人工详情映射只能改变展示入口；不能决定是否校验类型依赖。显式 any、合法索引签名及 pictogram 的开放契约继续保留。
6. 只校验可达的公开类型声明及实际类型查询。不遍历函数体、未被引用的导入或整个包，不把 TS Program 的全部诊断当作失败条件。
7. 若可达类型声明确实依赖缺失模块或符号，必须报错。不能用“可选依赖”标签忽略实际相关错误；与配置类型无关的可选模块缺失不阻断生成。
8. 校验范围与文档展开范围分离：保留外部类型的直接声明及包版本边界，不因补校验而递归复制外部依赖手册。
9. 同一输入、不同入口或属性访问顺序输出稳定；新增键和锚点不携带个人路径。使用现有源码路径规范化和 hash 工具。
10. 本轮实施时未经后续请求不提交、推送、创建 PR、发布或同步全局技能。未来提交 PR 前遵循仓库全量视觉比较要求。

## 文件职责

| 文件 | 计划修改 |
| --- | --- |
| `packages/vchart/scripts/skill-metadata/extract.mjs` | 依赖身份、碰撞导航键、可达类型校验、typeof 解析、详情与审查一致性 |
| `packages/vchart/scripts/skill-metadata.test.mjs` | 三组反例与正例、CLI 不写入检查、真实类型导航回归 |
| `packages/vchart/scripts/skill-metadata.mjs` | 仅在需要跨图型收集后统一序列化时调整 buildArtifacts；保留命令接口 |
| `skills/vchart-development-assistant/references/type-meta/*.json` | 用修复后的生成器重建，仅接受有依据的导航和来源变更 |
| `skills/vchart-development-assistant/references/type-details/AdditionalTypes-Type-Definition.md` | 补真实 typeof 值声明和相关链接 |
| `docs/superpowers/validation/2026-10-15-vchart-metadata-dependency-navigation.md` | 实施时新增，记录修复前失败、修复后通过和场景约束检查 |

`SKILL.md`、workflows、scripts、template、topkey、人工 type-details 和 metadata-sources.json 不计划修改。若实施发现必须改变这些文件，先说明具体原因；不得借维护修复改写场景规则。

## Task 1：冻结本轮基线并建立真实 fixture

**Files:** 测试文件、实施验收记录；基线文件存放临时目录。

**输入：** 当前工作区完整技能及维护脚本。
**输出：** 可重现的修复前状态、临时源码 fixture、受保护文件的内容摘要。

- [x] 保存当前工作区技能与维护工具快照、git 起点、Node/TS/包版本及文件摘要，不 reset 工作区。
- [x] 保存 `SKILL.md`、README、workflows、scripts、template、topkey、人工 type-details 的摘要，后续逐文件比较；生成目录另记录 type/required/原始声明/继承视图。
- [x] 在现有测试文件加入下列 fixture 辅助函数。全部 TS 源码放临时目录，通过现有 createContext 的真实 Compiler API 解析，finally 清理。

```javascript
function withFixture(files, fn, detailReferences = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vchart-meta-navigation-'));
  try {
    for (const [name, text] of Object.entries(files)) {
      const file = path.join(directory, name);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, text);
    }
    const sourceFile = path.relative(root, path.join(directory, 'index.ts'));
    const item = { chart: 'fixture', typeName: 'Spec', sourceFile, package: '@visactor/vchart' };
    const mapped = Object.fromEntries(Object.entries(detailReferences).map(([name, target]) => {
      const [file, symbol] = name.split('#');
      const relative = path.relative(root, path.join(directory, file)).split(path.sep).join('/');
      return [`${relative}#${symbol}`, target];
    }));
    const c = createContext(root, [item], { ...manifest, detailReferences: mapped });
    return fn(c, item, directory);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}
```

- [x] 跑现有 12 项 Node 测试和 check，记录本轮实际基线。夹具断言读取真实符号、source/filePath 和类型；不以与 extractor 无关的 rootDir 提示为失败依据。

## Task 2：按真实身份保留同名依赖

**Files:** extract.mjs、skill-metadata.test.mjs。

**内部接口：**

```typescript
type DependencyEdge = {
  id: string; // 规范化声明文件 + 符号限定名；包含命名空间/所属声明链
  symbol: ts.Symbol;
  expressions: Set<string>; // 此声明内出现的引用拼写，例如 A、B
};
// 现有 dependencies/boundDependencies 改为按 id 合并，避免短名称覆盖。
type DependencyMap = Map<string, DependencyEdge>;
```

**输出约定：** `dependencies` 继续指向 `complexTypeDefinitions` 的键。唯一名称用 `Item`；同名不同来源用 `Item__<来源身份hash的12位前缀>`。收集当前图表的完整依赖后一次性分配键，并检测意外 hash/键碰撞，禁止静默覆盖。详情锚点沿用真实来源身份。

已有顶层声明继续使用 `文件#名称` 身份；同一文件不同命名空间的同名声明使用各自限定名。不要把行号加入正常身份，使无关插入行导致全部键和锚点迁移。

当引用拼写与真实名称不同，或发生同名碰撞时，属性增加可选 `dependencyBindings`，例如 `{ A: 'Item__abc...', B: 'Item__def...' }`。这样 `type: 'A | B'` 能对应到两个实际目标，不仅保留两个无法关联的文件路径。无此需求的属性不增加该字段。

- [x] 加入失败测试：同一属性联合引用两份同名 Item，必须保留两个独立目标，并保持 A/B 到目标的绑定。

```javascript
test('同一属性的同名类型不覆盖，别名能定位真实目标', () => {
  withFixture({
    'index.ts': "import type { Item as A } from './a'; import type { Item as B } from './b'; export interface Spec { value: A | B }",
    'a.ts': 'export interface Item { a: string }',
    'b.ts': 'export interface Item { b: number }'
  }, (c, item) => {
    const doc = extractChart(c, item);
    const value = doc.effectiveProperties.find(p => p.name === 'value');
    assert.equal(value.dependencies.length, 2);
    const targets = value.dependencies.map(key => doc.complexTypeDefinitions[key]);
    assert.equal(new Set(targets.map(t => t.filePath)).size, 2);
    assert(targets.every(t => t.typeName === 'Item'));
    const bindings = value.dependencyBindings;
    assert.notEqual(bindings.A, bindings.B);
    assert(doc.complexTypeDefinitions[bindings.A].filePath.endsWith('/a.ts'));
    assert(doc.complexTypeDefinitions[bindings.B].filePath.endsWith('/b.ts'));
  });
});
```

- [x] 运行此测试，记录修复前失败在依赖数量/身份上。
- [x] 统一 AST 依赖、实例化依赖、跨属性合并、supplementalDetails 的身份规则；移除按短名称覆盖或拒绝合法同名类型的路径。
- [x] 补正例：`A` 和 `B` 都导入同一个 `Item` 时只保留一个定义，但两个别名绑定均可解析。
- [x] 补反例：两份 Item 分别出现在两个属性、嵌套 `Record<string, A | B>`、以及补充声明的父类型中，都不得覆盖。
- [x] 补反例：同一文件的两个命名空间分别定义 Item，两个限定引用必须保留独立目标，不能仅凭 filePath 相同而判为同符号。
- [x] 在同一临时路径下重写 import/属性顺序并新建 Context，比较规范化导航键与目标集合；现有真实入口逆序抽取测试继续通过。跨临时路径的 hash 不要求相等，因为来源身份确实不同。

**完成条件：** 联合分支、跨属性与补充父类型能各自导航；同符号不重复；当前没有碰撞的导航键不发生无理由迁移。

## Task 3：人工详情不再绕过可达类型校验

**Files:** extract.mjs、skill-metadata.test.mjs；必要时调整 CLI 的抽取调用时机。

**内部接口：** `validateReachableDependencies(context, declaration, trace): void`。trace 记录图型/属性、类型链和出错符号位置。使用真实符号身份做访问缓存及循环处理；正在访问与已成功校验分别记录，失败不能被缓存为成功。

- [x] 加入失败测试：实际存在的人工详情目标不能隐藏另一文件中的缺失导入。

```javascript
test('人工详情不能掩盖传递缺失模块', () => {
  withFixture({
    'index.ts': "import type { Broken } from './middle'; export interface Spec { value: Broken }",
    'middle.ts': "import type { Missing } from './absent'; export type Broken = Missing;"
  }, (c, item) => {
    assert.throws(() => extractChart(c, item), /Missing|absent/);
  }, { 'middle.ts#Broken': 'type-details/IData-Type-Definition.md' });
});
```

该现有详情文件只用来复现“映射后跳过检查”的行为，不作为合法 Broken 文档；测试在检查内容之前就必须拒绝未解析类型。

- [x] 跑测试确认修复前仍会成功抽取，导致 assert.throws 失败。
- [x] 把校验入口放在属性类型处理和 isSimple 分类之前。相关声明无论使用人工详情、补充声明还是外部直接摘录，都遵守相同解析检查；文档展开仍保留原有边界。
- [x] 沿类型节点、父类型、泛型约束/实参、被查询值的类型定位实际符号；导入别名即使模块存在但导出不存在，也必须拒绝。错误含相关属性、类型链、缺失模块/符号及源码位置。
- [x] 补反例：中间声明 `import type { Missing } from './present'`，present.ts 只有 `export interface Other {}`；必须拒绝缺失导出，而非只看 unresolved 模块列表。
- [x] 补正例：同一中间模块存在无关的缺失导入，但属性引用的类型为合法 `string`；必须通过。不得继续使用“属性声明所在文件存在任意 unresolved 就拒绝”的宽泛判断。
- [x] 补正例：显式 `any`、`{ [key: string]: any }`、合法循环引用、合法人工详情映射均通过；当前 pictogram 开放标记保持。
- [x] 补 CLI 反例：复制维护工具到带临时入口清单的隔离测试仓库骨架，依赖使用已有路径；使用上述 Broken 夹具运行实际 generate。验证非零退出、诊断包含类型链、预先存在的哨兵文件内容不变、没有部分新元数据。不得为测试改真实 metadata-sources.json。

CLI 夹具骨架明确包含：当前 skill-metadata.mjs 与 extract.mjs 的原目录结构、两个包的 package.json、核心 tsconfig.json、指向已有核心 node_modules 的符号链接、临时 index.ts/middle.ts、仅 fixture 入口的 metadata-sources.json 和现有 IData 详情副本。临时 `.git` 指向 `git rev-parse --absolute-git-dir` 得到的实际 Git 目录，CLI 只执行 git log，不在夹具中执行任何 Git 写操作；这样无需提交夹具或安装依赖。

以下断言加入该 CLI 测试，`fixtureRoot` 为上述临时骨架，`output` 为其中的独立输出目录，两者在 finally 删除：

```javascript
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'sentinel.txt'), 'keep');
const result = spawnSync(process.execPath, [
  path.join(fixtureRoot, 'packages/vchart/scripts/skill-metadata.mjs'),
  'generate', '--output', output
], { encoding: 'utf8' });
assert.notEqual(result.status, 0);
assert.match(result.stderr, /Missing|absent/);
assert.match(result.stderr, /value/);
assert.equal(fs.readFileSync(path.join(output, 'sentinel.txt'), 'utf8'), 'keep');
assert.deepEqual(fs.readdirSync(output), ['sentinel.txt']);
```

**完成条件：** 校验由真实类型链决定，人工文档不影响判断；相关错误被拒绝，无关模块缺失不阻断，抽取失败不写产物。

## Task 4：补齐 typeof 的真实值声明与导航

**Files:** extract.mjs、skill-metadata.test.mjs、生成的补充声明。

- [x] 更新测试导入以使用现有 `supplementalDetails`，加入失败测试：类型别名引用本地枚举时，补充详情必须同时包含枚举及别名到枚举的链接。

```javascript
test('typeof 枚举在补充声明中有真实定义和导航', () => {
  withFixture({
    'index.ts': "enum AxisDirection { horizontal = 'horizontal', vertical = 'vertical' }; type Direction = keyof typeof AxisDirection; export interface Spec { config: { direction: Direction } }"
  }, (c, item) => {
    extractChart(c, item);
    const details = supplementalDetails(c);
    const alias = [...c.definitions.values()].find(d => d.symbol.name === 'Direction');
    const enumeration = [...c.definitions.values()].find(d => d.symbol.name === 'AxisDirection');
    assert(alias);
    assert(enumeration);
    assert(details.includes('horizontal'));
    assert(details.includes('vertical'));
    const start = details.indexOf(`id="${alias.anchor}"`);
    const end = details.indexOf('<a id=', start + 1);
    const section = details.slice(start, end === -1 ? undefined : end);
    assert(section.includes(`](AdditionalTypes-Type-Definition.md#${enumeration.anchor})`));
  });
});
```

- [x] 运行测试确认修复前缺少 AxisDirection 声明或相关链接。
- [x] 在共享依赖遍历中处理 `TypeQueryNode.exprName`，通过 checker 解析真实符号和导入别名；限定成员引用保留可理解的所属值/枚举上下文，不输出无上下文的孤立枚举成员。
- [x] 补夹具：`typeof importedEnum`、`typeof Namespace.Mode`、`typeof Enum.member`、`keyof typeof` 常量对象及循环类型查询；验证真实来源、字段/枚举值和链接均正确，不执行源码中的应用代码。
- [x] 补反例：两个模块都有 Mode，别名各自通过 typeof 引用时，两份值声明和导航不得覆盖；缺失的 typeof 导入必须被 Task 3 校验拒绝。
- [x] 真实源码回归：DirectionType 能导航到 typings/space.ts 的 Direction，取值 horizontal/vertical；RenderMode 能导航到 RenderModeEnum。播放器同名方向不能进入图表方向定义。
- [x] 将 audit 的导航检查扩展到本次新增的碰撞绑定和补充声明依赖边：目标存在不够，还要身份匹配。测试删除实际依赖的枚举段/锚点后 audit 非零；注入 A/B 的错误目标绑定时 audit 必须报错。

**完成条件：** 本地相关 typeof 声明在打包资料中可查询；不会靠外部工作区源码或同名猜测补全。外部值声明保留包版本及直接摘录边界。

## Task 5：重建资源并验证原场景约束

**Files:** 生成资源、实施验收记录；不修改受保护场景文件。

- [x] 先生成到临时目录，审查与本轮工作区基线的差异，再更新 type-meta 与补充声明。更新范围不得以“重新生成”掩盖属性类型、required、作用域或人工正文变化。
- [x] 对全部 36 个入口比较 effectiveProperties 的 name/type/originalType/required、inheritanceTree 的声明/映射结果；除依赖导航及必要绑定外应相等。指纹变化要说明实际输入，不能为了避免变化回填旧 hash。
- [x] 重跑 Node 全套、audit、check、现有 Python 测试、git diff --check。连续生成两次并使用逆序 Context 检查稳定性。
- [x] 比较 Task 1 摘要，确认 SKILL.md、README、所有 workflows/scripts/template、topkey、人工详情未改变。新增 dependencyBindings 不改变已有“按 dependencies 查 reference”的使用方式。
- [x] 利用上一轮仍存在的实际产物做小范围浏览器复核：M06 CSV HTML、M08 JS 回调 spec、M09 HTML 内 spec 修改、M10 JSON 宿主配置。读取原产物，不手工修补配置；检查数据、标签和 M09 实际点击。缺少产物或环境时记录 not_run，不能替写产物后算通过。
- [x] 本轮不强制重复全部 Agent 行为评测；场景规则和执行工具均未改，文件内容比较是规则保持的直接证据。浏览器复核只证明实际产物运行，不宣称覆盖全部宿主或 React。
- [ ] 若后续准备创建 PR，另运行并审查 `node packages/vchart/scripts/visual-test.mjs` 的官方 develop 全量比较；本轮不引用上一轮结果作为新通过证据。
- [x] 新增验收文档，记录各反例修复前失败点、修复后结果、真实源码导航、文件变更范围及未验证边界。

实施命令，从仓库根目录执行，确保 PATH 中为 Node.js 22：

```sh
node --test packages/vchart/scripts/skill-metadata.test.mjs
node packages/vchart/scripts/skill-metadata.mjs generate --output /tmp/vchart-metadata-navigation-generated
node packages/vchart/scripts/skill-metadata.mjs audit --report /tmp/vchart-metadata-navigation-audit.json
node packages/vchart/scripts/skill-metadata.mjs check
python3 -m unittest discover -s skills/vchart-development-assistant/tests -v
git diff --check
```

## 验收矩阵

| 问题 | 必须失败的旧行为 | 必须通过的新行为 | 防止误伤的正例 |
| --- | --- | --- | --- |
| 同名依赖覆盖 | 两模块 Item 被合成一个；跨属性碰撞抛错 | 两目标独立、别名绑定准确、相关详情完整 | 同符号不同导入别名去重；无碰撞键保持 |
| 人工详情绕过校验 | Broken 配置人工目标后缺模块仍被接受 | 缺模块/缺导出有类型链诊断，generate 不写部分文件 | 显式 any、开放契约、循环引用、无关缺失导入 |
| typeof 缺导航 | 别名只有 typeof 文本，没有值声明及链接 | 枚举/对象/限定成员真实定义可导航，audit 识别破坏 | 同名值依赖不串模块，不执行应用代码，不复制外部手册 |
| 原场景保持 | 不适用，本轮不新增场景 | 受保护文件逐字节相等，原产物小范围运行可复核 | JSON/JS spec 不加入 HTML；HTML 修改保持完整 HTML |

## 风险与控制

- **键迁移风险：** 只为真正碰撞的名称引入稳定键；真实名称保留在 typeName，别名关联局限于相关属性。不得重命名现有人工文档。
- **误报风险：** 校验沿具体类型边，不按模块整体 unresolved 或全量诊断拒绝；无关导入正例用于锁定边界。
- **递归与体积风险：** 身份去重、访问状态与文档展开策略分别控制。审查新增声明清单和字节变化；不设置无依据的数量阈值，也不为缩小文件静默丢弃必要导航。
- **自证测试风险：** 使用真实 TS 夹具、真实符号来源、故意破坏导航的 audit 反例及实际 CLI；保留原有编译正反例，不能只做生成快照比对。
- **规则回归风险：** 以本轮工作区快照为基线检查受保护文件，而非 HEAD；此轮只修复维护工具和知识导航，不扩展 HTML/spec 场景。

## 计划自审

- [x] 三个审查问题各有修复任务、修复前失败测试、正例及验收条件。
- [x] 校验与文档展开分离，不要求整个仓库先编译成功。
- [x] 内部依赖身份与输出导航键分离，保留原字段和短名兼容。
- [x] 不把浏览器产物复核解释为 Agent 交付策略或全部宿主验收。
- [x] 实施范围、未提交状态与未来 PR 全量视觉检查已分别记录。
