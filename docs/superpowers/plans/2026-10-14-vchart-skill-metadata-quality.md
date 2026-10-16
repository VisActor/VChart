# VChart Skill Metadata Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.
>
> 上述技能不可用时在当前会话顺序执行，不安装额外技能或创建其他聊天。本文件已执行，元数据、维护工具及验收记录已完成；图库代码未修改。结果见 [验收记录](../validation/2026-10-14-vchart-skill-metadata-quality.md)。

**Goal:** 修复会误导配置生成的元数据与示例，为现有知识库建立可复现的维护工具、有效类型导航及明确版本来源。

**Architecture:** 用仓库 TypeScript Compiler API 按符号实际导入来源读取公开配置类型，生成 type-meta，并核对 topkey；type-details 的类型摘录和人工说明分别维护。生成工具位于仓库维护脚本目录，技能继续消费已提交的 JSON/Markdown，不在用户生成图表时运行校验或依赖本地源码。

**Tech Stack:** Node.js 22、仓库已有 TypeScript 4.9.5、node:test、既有 Python unittest 与 Playwright；复用现有依赖，不引入 JSON Schema、文档平台或新的构建服务。

## 设计选择

| 方案 | 代价与边界 | 判断 |
| --- | --- | --- |
| 逐文件手工修复 | 初次改动小，但同名类型、继承与泛型错误会继续漂移，难以跟随版本更新 | 不作为最终方案；仅用于修正人工说明与行为示例 |
| 轻量生成与维护检查，分批修复 | 一次性实现公开类型读取与核对；保留现有目录、文件名和人工知识 | 推荐 |
| 全量重建配置文档体系 | 涉及所有类型和外部依赖文档展开，产物容易膨胀，也会覆盖有效人工说明 | 本期不做 |

## 已确认的基线

- 当前有 36 份 topkey、30 份 type-meta、77 份 type-details。JSON 解析与顶层 key 一致性正常。
- 对照当前类型声明，14 个图型的 `direction` 被错误解析为播放器的 `'default' | 'reverse'`。
- bar、pie 等 `animationAppear` 错把 preset 枚举作为属性值，并遗漏 boolean 等合法形式；TypeScript 已确认 `'grow'` 不合法，而 `{ preset: 'grow' }` 和 `false` 合法。
- 27/30 份 type-meta 与当前声明比较存在缺项，共 442 个图型/属性组合。这个数量包含版本新增属性，不能全部解释为同一种抽取错误；rangeArea 的 xField/yField、radar 的 categoryField/valueField 等关键继承缺失已经确认。
- IData 详情把 URL 当 CSV 内容。VChart 2.1.7 实测未请求 URL、无有效柱；CSV 文本绘制两根柱。
- 依赖存在非法名称、错误定义位置及缺少详情；sourceFile/filePath 使用本机绝对路径，未明确记录对应 VChart 版本。
- 6 个 3D 图型有 topkey、没有 type-meta，实际实现位于 vchart-extension。pictogram 有 type-meta、没有 topkey，旧来源指向核心包残留声明，当前实现已在扩展包。
- 本轮前 HEAD 为 `de46ca24b`，上一轮 HTML/spec 优化已提交。后续执行需重新记录实际起点，不能将临时审查脚本作为唯一复现材料。

## 全局约束

- 只修复知识库质量及其维护路径；保留 HTML/spec、诊断、还原、React 的已建立交付规则。
- 不修改图库运行时、公开类型契约、图表转换器、HTML 生成器或模板来迁就元数据。
- 不给用户生成流程增加 schema、TypeScript 编译或固定审批步骤。
- 维护脚本复用 `packages/vchart` 的 TypeScript/Playwright 依赖，不自动安装、不升级、不依赖个人机器目录。
- 源码是来源基准：核心图型使用 `packages/vchart/src`，扩展图型使用 `packages/vchart-extension/src`；不混用残留 d.ts 与当前源码。
- 扩展引用 `@visactor/vchart` 及 `/esm/*` 时必须解析到同一仓库版本，不能悄悄读取另一份已安装核心包。外部 VRender/VUtils 类型依照仓库依赖版本解析。
- 类型按实际符号和模块解析，不按名字全局搜索；不能用正则拆分泛型、联合、交叉或索引访问类型。
- 未解析依赖不得静默变成 any 或套用相近类型。原公开契约显式 any/索引签名则如实标注开放边界，不伪造闭合属性集合。
- 保留现有 typeName、inheritanceTree、ownProperties、type、originalType、required、isSimple、dependencies 等消费字段；不要求用户迁移配置。
- 不自动重写全部 type-details 人工正文或以新的模型解释覆盖真实声明；先核对源码，再改已证实错误和缺失导航。
- 不删除已有图型/资源，不新增本期清单外图型。最终覆盖既有 30 个元数据入口和 6 个已有 3D 索引入口；pictogram 来源迁移属于现有资源修复。
- 生成产物不携带 `/Users/...` 等绝对路径。每个输入类型保留仓库相对路径、来源版本和可核对的内容指纹。
- 同一输入连续生成结果应逐字节相同；不以当前时间或当前全局 HEAD 制造无关变更。
- 未经新请求不提交、推送、创建 PR、发布或同步全局技能。未来提交 PR 前遵循仓库全量视觉要求。

## 文件与接口

| 路径（相对仓库根目录） | 职责 |
| --- | --- |
| `packages/vchart/scripts/skill-metadata.mjs` | 维护 CLI：audit、generate、check；报告错误及执行范围 |
| `packages/vchart/scripts/skill-metadata/extract.mjs` | 读取 TS Program、类型符号、继承及依赖，输出元数据；不写文件 |
| `packages/vchart/scripts/skill-metadata.test.mjs` | 真实公开类型、模块碰撞、泛型、继承和生成一致性回归 |
| `packages/vchart/scripts/skill-metadata/verify-examples.mjs` | 原产物的真实图元/数据检查、实际 CSV 文档示例与本地服务、共享依赖 3D 验收 bundle |
| `skills/vchart-development-assistant/references/metadata-sources.json` | 唯一入口清单：图型类型、源码路径、包、扩展注册前提；引用已维护的详情目标 |
| `skills/vchart-development-assistant/references/type-meta/*.json` | 重建 30 个已有入口，新增 6 个既有 3D 入口 |
| `skills/vchart-development-assistant/references/topkey/*.json` | 核对现有 key/意图说明，明确组合图系列作用域，补 pictogram 入口 |
| `skills/vchart-development-assistant/references/type-details/*.md` | 修复 IData 说明，按实际可达类型补导航/必要声明摘录，保留有效人工内容 |
| `skills/vchart-development-assistant/SKILL.md`、`README.md` | 简短说明来源版本、详情查询与维护命令；保留已有交付规则 |
| `docs/superpowers/validation/2026-10-14-vchart-skill-metadata-quality.md` | 执行时新增：分类型错误、前后对照、实际数据/渲染与未验证范围 |

提取模块对外提供以下维护接口，CLI 和测试使用同一入口：

```typescript
type ChartSource = {
  chart: string;
  typeName: string;
  sourceFile: string; // 仓库相对路径
  package: '@visactor/vchart' | '@visactor/vchart-extension';
  registration?: string[];
};

createContext(repoRoot: string, sources: ChartSource[]): {
  program: ts.Program;
  checker: ts.TypeChecker;
};

extractChart(context, source: ChartSource): MetadataDocument;
auditReferences(context, sources, referencesRoot): AuditReport;
```

`MetadataDocument` 沿用现有消费字段，新增 `effectiveProperties` 用于记录最终图表类型的有效属性，避免把继承重复项当作最终 required/type。新增来源字段 `formatVersion`、`vchartVersion`、`extensionVersion`（扩展适用）、`typescriptVersion`、`sourceHash`；复杂类型记录有效的 `reference`（相对 references 根目录）及真正定义的来源。内容指纹基于实际输入，提交记录取修改相关输入的提交；不使用每次变化的生成时间。外部类型使用包名、版本和包内路径定位。

## Task 1：固定来源与可重复的审查基线

**输入：** 当前已提交技能、当前仓库源码和依赖。
**输出：** 来源清单、只读 audit 命令、可复现基线报告。

- [x] 冻结完整技能到临时目录，记录 git 起点、VChart/扩展/TypeScript 版本和 3 类文件数量；副本只用于对照，不覆盖工作区。
- [x] 创建 metadata-sources.json：逐一登记当前 30 个 typeName；pictogram 指向 `packages/vchart-extension/src/charts/pictogram/interface.ts`，其余旧入口对照实际源码，不能机械替换旧绝对路径后假定存在。
- [x] 登记现有 6 个 3D 入口及其注册前提：

| 图型 | 扩展源码目录 | 图表注册入口 |
| --- | --- | --- |
| bar3d | `charts/bar-3d` | `registerBar3dChart` |
| pie3d | `charts/pie-3d` | `registerPie3dChart` |
| funnel3d | `charts/funnel-3d` | `registerFunnel3dChart` |
| histogram3d | `charts/histogram-3d` | `registerHistogram3dChart` |
| rangeColumn3d | `charts/range-column-3d` | `registerRangeColumn3dChart` |
| wordCloud3d | `charts/word-cloud-3d` | `registerWordCloud3dChart` |

根据各注册函数和 3D plugin 的实际调用关系记录其余初始化前提，不假设所有 3D 入口已自动包含 register3DPlugin，也不把注册代码混入 spec。

- [x] audit 对现有产物进行只读检查：JSON 键、真实 source symbol、有效属性/必需项、原始与解析类型、详情目标、绝对路径、版本和 topkey 作用域。报告按“确定错误 / 当前源码新增差异 / 声明开放或未解析边界”分类。
- [x] audit 不修复文件；确定错误使退出码非 0，并保存包含图型、属性、元数据值、实际声明位置的报告。与源码无关的仓库诊断不得当成元数据失败，也不能过滤掉本次类型依赖解析错误。
- [x] 用冻结版本确认 audit 检测方向、动画与关键字段缺失；CSV 示例另通过浏览器复现，不要求通用静态工具判定自然语言说明是否正确。原始请求正确的对照照实登记，不强迫所有行为样本失败。

维护命令（本轮已实现）：

```sh
node packages/vchart/scripts/skill-metadata.mjs audit --report /tmp/vchart-metadata-before.json
node --test packages/vchart/scripts/skill-metadata.test.mjs
```

## Task 2：正确抽取类型，分批重建已有元数据

**输入：** Task 1 的来源清单、TS Program 和旧消费格式。
**输出：** 按真实声明生成的已有图型元数据及结构回归。

- [x] 先对 bar、rangeArea、radar、wordCloud 四个真实入口实现 extractChart；保留公开声明的原始类型与所属泛型上下文，用 checker 计算实例化后的有效类型。
- [x] 使用 `checker.getSymbolAtLocation` 和 alias 解析绑定实际模块；`DirectionType` 必须来自当前属性声明的导入链，而非播放器中同名类型。
- [x] 用 `checker.getPropertiesOfType` 提取最终图表属性，并结合声明记录出处；递归处理接口、别名、交叉、Omit/Partial/Record、泛型与多层继承。对联合类型保留各分支和约束，不能将各分支属性简单合成“全部必填”。
- [x] ownProperties 保留实际声明/映射节点的意义；effectiveProperties 描述最终结果。重复的 type、series、axes 等按最终类型解析，不能以遍历先后决定必需项。
- [x] 修正方向和动画。动画保留 boolean、预设对象、图元动画映射及相关参数；`originalType` 必须来自真实声明，不能手写不存在的 `IAnimationConfig<BarMarks>`。
- [x] dependencies 从 TS 类型节点/符号提取；排除字符串字面量、括号、内联对象及注释，正确处理 `TreemapOptions['gapWidth']` 等索引访问。不能用字符串切割产生 `(IStateAnimateSpec`。
- [x] 同名类型按定义模块区分 reference。不能因短类型名相同而覆盖另一模块的详情；保留已有有效文件名，只对实际碰撞的新入口使用带模块含义的名称。
- [x] 根契约显式 any（如当前 pictogram）不做猜测式展开，保留开放标记，提供其明确的系列定义及转换器说明；不改公开接口、不宣称闭合枚举已经完整。
- [x] 四个入口通过后再重建其余已有入口。每批核对新增/删除属性、版本变化、文件大小和人工描述保留情况，不将 442 个差异直接批量当作缺失字段修补。

必须包含的真实契约测试：

```typescript
// TypeScript 编译应拒绝前两项，接受后三项。
const badDirection: Pick<IBarChartSpec, 'direction'> = { direction: 'reverse' };
const badAnimation: Pick<IBarChartSpec, 'animationAppear'> = { animationAppear: 'grow' };
const horizontal: Pick<IBarChartSpec, 'direction'> = { direction: 'horizontal' };
const grow: Pick<IBarChartSpec, 'animationAppear'> = { animationAppear: { preset: 'grow' } };
const disabled: Pick<IBarChartSpec, 'animationAppear'> = { animationAppear: false };
```

测试还需对照 checker 的实际 symbol/type 验证：rangeArea 的 xField/yField/label 存在；radar 的 categoryField/valueField 存在；bar 的动画及 progressive 属性存在；同名播放器 DirectionType 仍为 default/reverse；单独系列允许的 data/tooltip 与 IChartExtendsSeriesSpec 的 Omit 边界不能混淆。不能只断言生成 JSON 出现某段固定文字。

## Task 3：修复详情内容和有效导航

**输入：** 真实类型依赖、已有 77 份详情、源码与运行证据。
**输出：** 可查询的详情入口和正确示例，不覆盖有效人工知识。

- [x] 修正 IData 详情：values 字符串表示 CSV/TSV 等内容，不自动 fetch URL；移除矛盾的 IData 单一数组重定义。远程请求由 HTML/宿主代码处理，纯 spec 场景保留数据绑定契约。
- [x] 将错误 CSV 示例改为真实 CSV 文本；另以明确的应用加载示例说明 `await fetch(url).then(r => r.text())` 后传文本与 parser。不要把函数或 fetch 嵌入 JSON spec。
- [x] IAnimationConfig 仍作为图元级动画类型保留，并链接系列 IAnimationSpec/IStateAnimateSpec/IMarkAnimateSpec 的真实定义，解释两个层级；不把现有文件整体替换成另一种同名概念。
- [x] 重新定位 IAnimationConfig、SunburstLabelConfig、ILiquidOutlineSpec 等错误来源；每个 recorded source symbol 必须能在其文件或准确的再导出链中找到。
- [x] 对从公开配置可达的复杂属性逐一提供有效 reference：复用既有详情；仅为没有可用入口的必要类型补短的声明摘录和继承链接，不复制完整外部依赖手册。至少处理 ICommonAxisSpec、ICrosshairSpec、IBarBackgroundSpec、ITickMaskSpec 与当前 series 依赖。
- [x] 系列定义不能直接映射到删掉 data/tooltip/morph 的图表展开块后声称等价；需要系列级完整契约时提供对应真实声明和有效父类型导航。
- [x] 对外部类型无法完整展开的边界标注所属包/版本和适用范围；用户常用属性仍需在打包技能内有足够说明，不能只提供本地源码路径。
- [x] 保留 ICartesianAxisSpec 已有 hideWhenEmpty 说明、ILabelSpec 正确 formatMethod 签名等有效补充。声明摘录可设明确的维护区块，人工正文不参与自动覆盖。

验收重点：检索一次复杂属性后能找到可用定义/说明，不存在非法依赖名、错误 source symbol、缺失目标文件或个人绝对路径；声明开放/外部边界允许明确记录，不允许“全部完整”的虚假结论。

## Task 4：补齐既有索引覆盖，稳定生成与检查

**输入：** 正确的提取器、来源清单与详情导航。
**输出：** 现有入口完整覆盖、稳定生成命令和维护说明。

- [x] 为已存在 topkey 的 6 个 3D 图型生成对应 type-meta，使用实际扩展类型和核心类型导入；记录扩展版本、注册入口及适用宿主前提。
- [x] 补 pictogram 的 topkey，使已有类型入口可查询；沿用当前扩展实现，不能复活旧核心包定义。
- [x] 核对所有 topkey 的 key 与真实配置路径。组合图 common 中 bar/line 等系列属性标明 series 作用域，不能要求它们都是 common 根属性；all_common 是共享索引，不算独立图型。
- [x] 保留有效 oneDesc 意图说明。TS JSDoc 可提供事实依据，但不自动将全部描述替换成机械属性名；删除或变更旧 key 必须有真实契约依据。
- [x] CLI generate 先生成到临时输出目录，审查后写入；check 按相同输入重建并比较已提交产物，仅报告漂移，不修改工作区。生成顺序固定，不更新时间戳。
- [x] 生成来源清单外的孤立文件报告为待审查，不自动删除；新文件名沿用既有大小写惯例。
- [x] README 记录维护命令、依赖准备与版本边界；SKILL.md 仅补充按 reference 找详情及遇到来源版本不符时查询目标版本资料，不改变交付选择。

命令契约：

```sh
node packages/vchart/scripts/skill-metadata.mjs generate --output /tmp/vchart-metadata-generated
node packages/vchart/scripts/skill-metadata.mjs generate --write
node packages/vchart/scripts/skill-metadata.mjs check
```

连续两次 generate 对相同输入逐字节相同，check 后 git 状态不变。只改计划/教程再运行 check 也不能导致所有元数据因全局 HEAD 变化而漂移。

## Task 5：语义验收和原场景回归

**输入：** 冻结版与修复版技能、真实请求、当前运行环境。
**输出：** 来源/结构、配置语义、实际渲染分层记录。

- [x] 运行 node:test 的提取、模块碰撞、继承、泛型、详情导航、稳定输出及只读 check 测试；按实际输入类型对照，不引入通用用户 spec 验证器。
- [x] 关键任务从独立上下文读取技能，输入只包含实际需求和必要数据，不给预期答案或疑似错误。若委派不可用，记录为当前上下文检查，不冒充独立测试。
- [x] 下表每项先执行一次；明确复现失败后修复并重复相同任务。少量样本只证明这些边界，不统计成功率。浏览器检查实际交付产物，不能手工修正后算技能通过。

| ID | 请求与输入 | 验收 |
| --- | --- | --- |
| M01 | 周一12、周二25、周三18、周四32，生成水平柱图完整 JSON | direction 合法，字段绑定和数据完整；浏览器确认四根水平柱 |
| M02 | 同一周数据柱图，入场使用 grow 预设，只要完整 spec | 使用合法动画配置，未用动画名字符串替代整个属性；实际渲染 |
| M03 | 同一数据，关闭入场动画，保留其余配置与 JSON | false 合法，完整产物和数据保留 |
| M04 | 周一 low=3/high=8、周二5/11、周三4/9，生成区间面积图 JSON | 区间字段和三条记录完整，不错误拒绝合法字段；实际面积及范围正确 |
| M05 | 速度70、力量60、耐力80，生成雷达图 JSON | 类别/数值字段、三条数据正确；实际三维度图元/轴可核对 |
| M06 | CSV 文本 `day,value\n周一,12\n周二,25`，生成 HTML | parser 解析文本并绘制两条真实数据，无虚构网络加载 |
| M07 | 从测试提供的本地 CSV URL 加载并绘图，生成 HTML | 实际发起本地请求、拿到同一 CSV 后绘制；不请求 example.com 或外部业务系统 |
| M08 | 周数据 JS spec，标签显示星期和数值 | formatMethod 正确签名，渲染四条实际标签，未因详情修复退化 |
| M09 | 先生成带点击结果区、无标签的 HTML，再要求“修改其中 spec，加标签” | 第二轮仍完整 HTML，数据、真实点击保留，数值标签出现 |
| M10 | 宿主只接收 JSON；在完整配置上加标签 | 仍是完整 JSON，未强制 HTML/实例代码 |
| M11 | 宿主已注册扩展及对应 3D 能力，要求 bar3d 完整 JSON | 使用实际扩展字段及正确 type，不混入注册代码；说明检查环境，不把核心 2D 渲染当成 3D 通过 |

- [x] 冻结版至少复用 M01/M02/M06 作真实对照；元数据错误已确认但行为可能正确，照实记录。M11 的运行验收仅在真实扩展环境执行，无法执行则明确未渲染；六个扩展类型的来源和字段对照仍必须完成。
- [x] 补本地 CSV fixture 服务及可复现浏览器验收材料，放在维护测试目录或临时输出，不能将测试 URL/数据变成技能默认业务数据。
- [x] 运行既有 Python 转义单测、skill-creator 结构检查、相对文件导航检查与 git diff --check，确认上轮 HTML/spec 行为未受影响。
- [x] 保存独立验收文档，分别记录元数据准确性、详情内容检查、实际渲染、宿主/React 未验证范围；未全量审阅 77 份详情语义时不得宣称全部无误。
- [ ] 后续提交 PR 前运行仓库官方 develop 全量视觉比较并审查报告。本轮未创建 PR，图库/生成器/模板未变，未重跑全量；此项保留为未来 PR 的前置要求。执行错误解决或如实登记阻断，不把先前 266 passed 记录当成本轮新运行。

## 风险与处理

| 风险 | 处理 |
| --- | --- |
| 当前源码与遗留 d.ts/安装包混用 | 单一来源清单、明确 package resolution、版本及输入指纹；解析错误阻止写入 |
| checker 的 any 掩盖未解析模块 | 区分公开声明显式 any 与模块失败导致 any；后者失败，前者明确开放范围 |
| 泛型/联合展开破坏真实语义 | 保留实际声明及实例化类型，按分支处理，关键合法/非法配置双向测试 |
| 生成工具自证正确 | 对照真实 TS 接口、修复前错误和浏览器产物，不只比较两次生成器输出 |
| 自动重写覆盖人工说明 | 仅维护声明区块、导航和已证实错误；保留有效补充，按文件审查差异 |
| 类型详情无限扩张 | 只补可达公开配置所需入口，复用现有说明，外部依赖不复制全手册；记录体积变化 |
| 3D 元数据存在被理解成任意宿主可运行 | 明确扩展及注册前提，纯 spec 与应用代码分离，不将类型检查记为宿主运行通过 |

## 完成条件

- [x] 已确认方向、动画、关键继承缺失和 CSV 示例错误修复，具有真实类型/运行证据。
- [x] 既有 30 个元数据入口及 6 个已有 3D 索引入口均有准确来源；pictogram 来源已迁移，索引补齐；开放契约不假装闭合。
- [x] 可达复杂类型导航有效，无非法依赖、错误定位、个人绝对路径；版本及内容指纹可核对。
- [x] 同输入生成稳定，check 只读，改动无关文档不制造元数据漂移。
- [x] HTML/spec 原交付规则保持，关键行为及已知验收限制有独立记录。
- [x] 用户生成流程不新增 schema、编译依赖、固定澄清或审批流程。

## 深度交互

本期目标是“知识源准确且可维护”，不是“把所有公开类型都复制成更大的知识库”。静态类型不能证明数据口径和实际效果正确，人工说明也不能替代真实类型来源。小型维护工具、按需详情和真实行为检查共同承担各自职责，避免用更多提示词掩盖错误元数据。

## 执行中发现的契约边界

bar3d 的公开类型继承二维 bar 字段，未声明仓库示例及真实运行使用的 bar3d.style。按本期不改公开接口的约束，新增 contractNotes 明确记录实际文档来源及样式示例，不伪造类型属性；真实共享扩展环境的四个 rect3d 已验证。公开类型修正应另行处理。
