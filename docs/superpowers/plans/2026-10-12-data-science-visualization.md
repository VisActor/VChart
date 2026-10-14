# Data Science Visualization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> 本环境未提供上述两个执行技能时，按本计划顺序在当前会话执行，逐任务记录结果；不因技能名称自行安装工具或创建其他任务。本文件是实现计划，执行需用户另行提出。

**Goal:** 在 `skills/data-science-visualization/` 提供自然语言驱动的数据科学可视化技能，从真实表格或现成语义结果生成可交互、可复现的便携 HTML。

**Architecture:** 统计转换统一使用 statplots 的公共 validate/compile；从现有图库提取小型共享渲染控制器，通过哈希可校验的同步产物用于技能 HTML。Python 标准库负责导入和封装，浏览器的唯一绑定模块负责字段映射，页面控件按明确的数据口径更新同一 chart 实例。

**Tech Stack:** Node.js 22（开发与资源同步），Python 3.11+ 标准库（生成器），浏览器原生 JavaScript，VChart/statplots UMD 2.1.8-alpha.0，现有 Playwright/Jest 测试设施；openpyxl 仅用于可选 XLSX 导入。

**Design:** [设计文档](../specs/2026-10-12-data-science-visualization-design.md)。本计划基于 `codex/vchart-statplots` 的 `5246208f7`，使用该分支继续工作，不把缺少 statplots 的 develop 作为实现起点。

## Global Constraints

- 技能代码位置：`skills/data-science-visualization/`；不修改另一个仓库的 multivariate-analysis 技能。
- 第一版表格绑定只覆盖 countPlot、missingValueMatrix、histogram、kdePlot、ecdfPlot、boxPlot、violinPlot、stripPlot、scatterPlot、hexbinPlot、correlationMatrix、pairPlot。
- 已有规范语义 Spec 入口覆盖上游目录的 28 类图；其他图不承诺自动表格绑定。
- 默认生成一张直接回答需求的图，不自动生成完整分析报告。
- 固定 UMD：`https://unpkg.com/@visactor/vchart@2.1.8-alpha.0/build/index.min.js`，随后 `https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/build/index.min.js`；不使用 latest，也不加载单独 vutils UMD。
- Python 3.11+ 标准库生成；运行 HTML 不需要 Node、Python、本地服务器或 MCP。XLSX 可选 openpyxl，不新增科学计算依赖。
- 统计只由公共 compile 执行；不实现分箱、KDE、相关、回归、区间或图元几何，不把私有编译结果 ID 固化为业务协议。
- 原始观测不补零、不去重、不展开聚合计数；外部模型与区间不猜测。JSON 仅 null 缺失，0/false/空字符串保留；CSV/TSV 默认只有空单元格为缺失。
- 内部行 ID 在过滤后保持稳定。pairPlot 框选只高亮，其图例仅说明颜色；表格筛选才重算。
- 默认不自动抽样、不静默截断。8 图、10 MiB payload、pairPlot 4 变量、矩阵 20 变量；pairPlot 点预算 120000、缺失网格预算 200000、KDE/violin 分组预算 20。
- 用户输入和源数据不作为 HTML/JS 执行；JSON `<` 转义，文字 HTML 转义。HTML 只包含请求使用的声明列。
- update 串行、复用 chart，失败可恢复；成功才提交状态；释放不留下实例。hover/resize/brush 不重算。
- 文档优先中文；技能按需读取参考，禁止将整个目录、28 份 Schema 和示例全部灌入入口。
- 提交 PR 前运行 AGENTS.md 要求的全量官方 develop 基线视觉回归；无法运行和基线不支持需明确记录，不写成通过。

---

## 文件与接口总图

新增源文件及职责：

| 文件 | 职责 |
| --- | --- |
| `packages/vchart-statplots/examples/shared/statplot-controller.js` | 公共 API 的浏览器生命周期封装；图库与技能唯一渲染控制器源 |
| `packages/vchart-statplots/scripts/sync-visualization-skill.mjs` | 固定发布资源同步、链接、来源、完整性和离线 check |
| `skills/data-science-visualization/scripts/generate_visualization.py` | `--request`、`--output` CLI，统一错误和退出码 |
| `skills/data-science-visualization/scripts/visualization_io.py` | 请求校验、文件导入、声明类型、稳定 ID、来源 |
| `skills/data-science-visualization/scripts/visualization_html.py` | 安全 HTML 封装与三项输出 |
| `skills/data-science-visualization/assets/data-bindings.js` | 12 类角色映射及每图有效输入统计；无绘图数学 |
| `skills/data-science-visualization/assets/page-runtime.js` | 初绘、筛选、字段/参数、主题、导出、错误/成功状态 |
| `skills/data-science-visualization/assets/page.html`、`page.css` | 响应式图表页、静态来源、控件和空态 |
| `skills/data-science-visualization/assets/statplot-controller.js` | 自动同步副本，禁止单独修改 |
| `skills/data-science-visualization/SKILL.md`、`agents/openai.yaml` | 发现、入口与按需导航 |
| `skills/data-science-visualization/references/intent-routing.md`、`input-and-interaction.md` | 意图边界、协议与交互说明 |
| `skills/data-science-visualization/references/statplots/` | catalog/Schema/逐图文档/示例/许可证/manifest 快照 |
| `skills/data-science-visualization/examples/` | distribution、comparison、relationships、quality、external 五个真实可执行请求 |

请求中的 Source 为 path+format 或 records 二选一；Chart 为 binding 或 spec 二选一。输出内嵌 payload：

```text
PayloadV1 {
  version: 1,
  title: string,
  libraries: {vchart: "2.1.8-alpha.0", statplots: "2.1.8-alpha.0"},
  dataset: null | {
    columns: Column[],
    rows: Array<{id: string, values: Record<string, number|string|boolean|null>}>,
    source: {label: string, sha256: string, originalN: number,
             missingTokens: string[], conversions: string[]}
  },
  charts: ChartInput[],
  controls: ControlRequest
}
```

源文件路径不进入浏览器运行依赖。`visualization.request.json` 中 source 替换为使用列的内嵌 records，并保留 original source 元数据于 `visualization.data.json`；无真实 idColumn 时重新生成的行序不变、row-N 不变。

共享控制器：`StatPlotController.create({dom, animation?, confineTooltip?}) → {update(spec), exportPNG(name?), release(), readonly chart, readonly spec}`。

绑定接口：`StatPlotData.buildBoundSpec(binding, rows, columns) → {spec, inputN, omittedN}`；`StatPlotData.filterRows(rows, filters) → rows`，filters 为当前值 `{field, kind, value}`。所有函数不修改参数；返回 rows 可以沿用原行对象，保持 ID。

生成接口：`load_request(path) → dict`、`build_payload(request, base_dir) → dict`、`render_html(payload, asset_root) → str`、`write_outputs(payload, output_dir, asset_root) → dict[str, Path]`。

## Task 1：固定资源与可校验快照

**Files:**

- Create: `packages/vchart-statplots/scripts/sync-visualization-skill.mjs`。
- Create: `skills/data-science-visualization/references/statplots/{manifest.json,package.json,LICENSE,THIRD_PARTY_LICENSES.md}` 及目录所引用的契约、Schema 和示例。
- Modify: `packages/vchart-statplots/package.json`，增加 `sync:skill`、`check:skill-resources` 脚本，不修改版本/依赖。
- Test: `packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs`。

**Interfaces:** consumes npm registry 固定版本 metadata/dist；produces manifest（version、package、integrity、tarball、supportedTypes、每文件 source/sourceSha256/sha256、workspaceAssets）。Task 2 增加 workspace 控制器条目。

- [ ] 用 Node 内置 test 写临时 tarball/metadata fixture，验证 hash 不匹配在写目录前失败；离线 check 能发现一个被改动的 Schema；失败不留下半更新的快照。

```js
test('rejects a changed snapshot offline', async () => {
  const fixture = await createResourceFixture();
  await writeFile(fixture.schema, '{}');
  const run = spawnSync(process.execPath, [script, '--check', '--root', fixture.root]);
  assert.notEqual(run.status, 0);
  assert.match(run.stderr.toString(), /sha256.*histogram/i);
});
```

`createResourceFixture()` 在测试文件内创建最小 manifest 和匹配文件，不访问网络；script 为同步脚本绝对路径。

- [ ] 运行 `node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs`，确认命令/文件缺失导致失败。
- [ ] 实现 CLI：默认 sync 固定 2.1.8-alpha.0；`--check` 仅检查本地；`--root` 为测试/维护指定快照目录。下载先验证 dist.integrity，提取文件清单只取可信包相对路径；临时目录完整写成后替换目标。复用 Statlas 同步方案的思路，不引用其运行路径。

```js
const version = '2.1.8-alpha.0';
const digest = createHash(algorithm).update(tarball).digest('base64');
if (digest !== expected) throw new Error('npm tarball integrity mismatch');
const paths = new Set([
  'package.json', 'README.md', 'THIRD_PARTY_LICENSES.md',
  'docs/plot-catalog.json', 'docs/spec.md', 'docs/colors.md',
  'docs/computation-contract.md', 'docs/skill-authoring.md'
]);
for (const entry of catalog) {
  paths.add(entry.schema);
  paths.add(`docs/plots/${entry.type}.md`);
  paths.add(entry.example);
  for (const variant of entry.variants) paths.add(variant.example);
}
```

LICENSE 若发布物没有独立文件，记录 package license=MIT 并从仓库许可证复制，明确 workspace 来源与哈希；不能冒充 npm 文件。Markdown 路径优先保留已有本地目标，否则转固定版本 URL。catalog 原始路径结构保持不变，所引用示例均实际存在。

- [ ] 执行 sync、离线 check 和 Node 测试；核对 catalog 为 28 类。保存 tarball integrity 及两个 UMD 的网络可达/全局 API 检查，版本组合在 Task 7 做真实渲染验收。
- [ ] 提交此任务文件，message：`chore(skills): pin statplots visualization resources`。

## Task 2：从图库抽取共享控制器

**Files:**

- Create: `packages/vchart-statplots/examples/shared/statplot-controller.js`。
- Modify: `packages/vchart-statplots/examples/gallery.js`、`examples/index.html`。
- Modify: 同步脚本，复制控制器并记录独立 workspace 来源。
- Generate: `skills/data-science-visualization/assets/statplot-controller.js`。
- Test: `packages/vchart-statplots/__tests__/runtime/statplot-controller.test.cjs`。
- Test: `packages/vchart-statplots/__tests__/browser/gallery.spec.ts`、`skill-controller.spec.ts`。

**Interfaces:** produces StatPlotController.create 的前述接口；图库继续拥有导航、输入编辑和 URL 状态；控制器不加载 catalog、不创建页面控件、不保存 localStorage。

- [ ] 写 fake VChart/public statplots 的边界测试：两次 update 只 new 一次、compile 每次一次；编译失败后可更新；release 在 renderAsync 未完成时不会漏释放或创建后续实例。脚本用 `vm.runInNewContext` 装入 globalThis，不强加 Node 模块依赖到浏览器资产。

```js
const controller = context.StatPlotController.create({dom: 'plot'});
await controller.update(first);
await controller.update(second);
assert.equal(fake.constructed, 1);
assert.equal(fake.compiled, 2);
assert.deepEqual(controller.spec, second);
await controller.release();
await controller.release();
assert.equal(fake.released, 1);
await assert.rejects(controller.update(first), /released/);
```

fake 和 first/second 在测试文件定义为最小可校验 histogram 输入；另用延迟 promise 测试排队与 release。

- [ ] 运行 Node 测试确认未实现时失败。
- [ ] 把 gallery.draw 中渲染部分提取为无网络的 IIFE，全局命名 StatPlotController。创建时检查两个库已加载、registerStatPlots；update 内校验后 compile，按实例是否存在选择首次渲染或更新。

```js
const result = VChartStatPlots.validateStatPlot(spec);
if (!result.valid) throw new Error(result.errors.map(e => `${e.path}: ${e.message}`).join('\n'));
const compiled = VChartStatPlots.compileStatPlot(spec);
if (options.animation !== undefined) compiled.animation = options.animation;
if (options.confineTooltip) compiled.tooltip = {...compiled.tooltip, confine: true};
if (chart) await chart.updateSpec(compiled);
else {
  chart = new VChart.default(compiled, {dom: options.dom, autoFit: true});
  await chart.renderAsync();
}
```

promise 队列拒绝后继续可执行；release 标记关闭后等待队列 finally 释放；首次 render 失败也释放创建的实例。成功才设置 lastSpec。API `chart`/`spec` 通过 getter 暴露，不复制编译私有结构。校验/compile 失败不触碰旧实例；原生更新失败释放受影响实例，有 lastSpec 时尝试一次恢复渲染，失败则标记不可用。正常更新复用实例，不为每次操作重建；测试分别验证校验失败和原生更新失败。

- [ ] gallery 的 draw 改为 `await controller.update(spec)`；export 改用 `controller.exportPNG()`，beforeunload 发起 release；保留既有 revision 与加载控件，避免旧异步请求覆盖新选择。index.html 在 gallery.js 前加载共享文件。
- [ ] 同步副本，运行 Node 测试和现有 gallery browser 测试；补真实“同实例更新、主题统计不变、导出文件”测试。图库抽取前后同数据截图比较，说明可见变化；不强制给图库增加 confine/animation=false。
- [ ] 提交，message：`refactor(statplots): share browser chart lifecycle`。

## Task 3：请求边界、数据导入与可重放输入

**Files:**

- Create: `skills/data-science-visualization/scripts/visualization_io.py`。
- Create: `skills/data-science-visualization/tests/test_visualization_io.py`。
- Create: `skills/data-science-visualization/tests/fixtures/{records.csv,records.json}`。

**Interfaces:** produces load_request、build_payload；payload.rows 是 `{id, values}`，无 VChart 结构、分箱或模型计算；后续 renderer 与 JS binder 使用同一形状。

- [ ] 用 unittest 写 BOM/引号/换行 CSV，字符串 `001`、number 的 `0`、JSON false、null/空字符串、重复行、非法数值、重复 idColumn 和相对路径用例。

```python
def test_keeps_zero_and_leading_zero_id(self):
    payload = build_payload(self.csv_request(), self.fixture_dir)
    rows = payload['dataset']['rows']
    self.assertEqual(rows[0]['id'], '001')
    self.assertEqual(rows[0]['values']['income'], 0)
    self.assertIsNone(rows[1]['values']['income'])
    self.assertEqual(payload['dataset']['source']['originalN'], 4)
```

fixture 明确四条原始观测，含 `id=001`、数值 0、一处空单元格、一条重复数据但不同 id。JSON fixture 包含 false、空字符串、null；测试不得把这些值统一归空。

- [ ] 运行 `python3 -m unittest discover -s skills/data-science-visualization/tests -p test_visualization_io.py -v` 确认缺模块失败。
- [ ] 实现请求未知键、互斥 source、互斥 binding/spec、唯一 chartId、列存在/类型及 controls 指向校验。csv 用 `csv.DictReader`、JSON 用 `json.loads` 并拒绝非标准 NaN 常量；number 转换后 math.isfinite。

```python
def typed_number(value, missing_tokens, location):
    if value is None or (isinstance(value, str) and value in missing_tokens):
        return None
    if isinstance(value, bool):
        raise ValueError(f'{location}: number 不接受 boolean')
    number = float(value)
    if not math.isfinite(number):
        raise ValueError(f'{location}: 数值必须有限')
    return number
```

JSON number 列要求原值为 number，不自动解析 JSON 数字字符串。CSV boolean 只接收明示 true/false；string 不执行数字解析。投影到需要的声明列（包括 idColumn、筛选和变量候选列），不将未知原表列全量嵌入。dataset 未指定且存在 binding 报错；所有图为 spec 时允许 dataset=null。

- [ ] 建立源 SHA-256、转换和 missingTokens 元数据；内嵌 records 的哈希基于确定性 JSON 字节，文件源基于原始字节。idColumn 要真实唯一非空字符串；默认 row-N 一次生成。可选 xlsx 使用延迟 import openpyxl 与明确 sheet，缺依赖报可执行建议。
- [ ] 实现入口规模预算：8 图、payload 10 MiB 和映射变量数量；直接 Spec 也检查变量与观测规模，不绕过预算。实际 N×K、分组数量在绑定构造时按筛选后数据再验证，初绘也必须验收。外部结果未知语义不在 Python 猜测，由对应文档和公共校验器验证。
- [ ] 运行 unittest；保存一个全语义输入和一个 CSV 输入 payload，确认包含数据而非原路径依赖。提交，message：`feat(skills): import reproducible visualization data`。

## Task 4：唯一字段绑定与过滤路径

**Files:**

- Create: `skills/data-science-visualization/assets/data-bindings.js`。
- Create: `skills/data-science-visualization/tests/data-bindings.test.cjs`。
- Test: `packages/vchart-statplots/__tests__/browser/skill-bindings.spec.ts`。

**Interfaces:** produces buildBoundSpec(binding, rows, columns) 与 filterRows(rows, filters)；供初绘、筛选和变量切换复用。Python 不再实现这些映射。

- [ ] 表驱动验证 12 类映射，列存在/角色类型、禁止 options 覆写 type/data/variables、输入不修改、稳定 ID、矩阵 null、逐图 omittedN。数值图过滤 0 保留，矩阵值 false/空字符串保留仅限 missingValueMatrix。

```js
const rows = [
  {id:'row-1', values:{x:0, y:1, group:'A'}},
  {id:'row-2', values:{x:null, y:2, group:'A'}}
];
const result = StatPlotData.buildBoundSpec(
  {type:'scatterPlot',fields:{x:'x',y:'y'}}, rows, columns);
assert.equal(result.inputN, 1);
assert.equal(result.omittedN, 1);
assert.equal(result.spec.data[0].id, 'row-1');
assert.equal(result.spec.data[0].x, 0);
assert.equal(rows[1].values.x, null);
```

columns 在测试定义 x/y 为 number、group 为 string。另断言 histogram 的结果不含 id/series，stripPlot 每行有 id。

- [ ] Node 内置测试先失败，再实现无依赖 IIFE globalThis.StatPlotData。
- [ ] 实现角色表：count(category,series?)；histogram(value)；kde/ecdf(value,series?)；box/violin(category,value,series?)；strip(id 自动注入,category,value,series?)；scatter(id 自动注入,x,y,series?)；hexbin(x,y)；missing/correlation(variables)；pair(variables,series?)。

```js
const matrixRows = rows.map(row => ({
  id: row.id,
  values: Object.fromEntries(binding.fields.variables.map(name => [name, row.values[name]]))
}));
const spec = {
  ...binding.options,
  type: binding.type,
  variables: binding.fields.variables,
  data: {observations: matrixRows}
};
```

pair 的 series 只在确实映射时加入；null series 行计入 omittedN。数值缺失不删整个矩阵行。fieldLabels 只按支持键加入，单位附在展示名称，不修改值；矩阵不填写 fieldLabels。

- [ ] filterRows 支持 category 的“全部/具体值”和 number range 的闭区间；空选择得到 []，清空得到原 IDs。用明确 null 判断，不用 truthiness；不重排输入。
- [ ] 用真实 UMD 对 12 类 buildBoundSpec 结果调用 validate 和 compile/render；断言缺失/常量/重复样本统计，沿用上游数值基准，不为映射器写新 KDE/相关算法。核验 10k/4 变量预算给明确错误。
- [ ] 运行 Node 测试、skill-bindings 浏览器测试。提交，message：`feat(skills): bind tables to statplots contracts`。

## Task 5：便携 HTML 与生成 CLI

**Files:**

- Create: `skills/data-science-visualization/scripts/visualization_html.py`、`generate_visualization.py`。
- Create: `skills/data-science-visualization/assets/page.html`、`page.css`。
- Create: `skills/data-science-visualization/assets/page-runtime.js` 的基本初绘和逐图错误状态；Task 6 在同一文件增加控件。
- Create: `skills/data-science-visualization/tests/test_visualization_html.py`、`test_visualization_cli.py`。

**Interfaces:** render_html(payload, asset_root) 与 write_outputs(payload, output_dir, asset_root)；CLI `python3 scripts/generate_visualization.py --request request.json --output output-dir`，成功 0，输入错误 2，资产缺失/写入错误 3。

- [ ] 测试恶意 `</script><script>`、含 HTML 的标题、资源缺失、10 MiB、部分写入失败以及从任意 cwd 运行 CLI。用 HTMLParser 检查数据脚本不能被源数据提前闭合；不只匹配固定标题。

```python
page = render_html(payload_with_hostile_text, self.assets)
self.assertNotIn('</script><script>alert(1)', page)
self.assertIn('\\u003c/script>', page)
restored = json.loads(extract_application_json(page))
self.assertEqual(restored['title'], payload_with_hostile_text['title'])
```

extract_application_json 在测试用 HTMLParser 获取 `visualization-data` 的 script 内容；payload_with_hostile_text 是合法最小请求产生的 payload。

- [ ] 跑 unittest 确认缺 renderer 时失败，再实现安全序列化与资产嵌入。

```python
payload_json = json.dumps(payload, ensure_ascii=False, allow_nan=False).replace('<', '\\u003c')
title = html.escape(payload['title'], quote=True)
```

模板中先 data JSON，再 VChart UMD、statplots UMD、共享控制器、bindings、page-runtime；无本地 fetch、动态 import 或库路径依赖。静态来源和初始总行数由 Python 生成，即使 CDN 失败仍可读。

- [ ] write_outputs 在目标旁的临时目录完整生成 html/request/data，再 rename 为目标目录；目标必须不存在，已存在时提示使用新的输出目录，避免三个文件只更新一部分。request 内嵌使用列 records，不留不可重放的源路径。CLI 错误含字段/位置，用户可修正而非自动换图。
- [ ] 基本 page-runtime 读取 payload，逐图创建 controller；binding 图调用 buildBoundSpec，spec 图原样提交，捕获各自错误，最后标记 ready。`ready` 表示这批加载已结束，成功必须检查每图 status=rendered。在无控件时先完成真实初绘，Task 6 再增加交互，不能交付永久加载中的中间任务。

```js
const built = input.binding
  ? StatPlotData.buildBoundSpec(input.binding, payload.dataset.rows, payload.dataset.columns)
  : {spec: input.spec, inputN: null, omittedN: 0};
await controller.update(built.spec);
```
- [ ] CSS 使用系统字体，图表高度随图型调整，控件有 label/键盘操作，details 放配置说明；360/420 px 不产生页面横向溢出。多图有独立来源/样本量/错误，不强制报告目录或论文版式。
- [ ] 复制整个技能到临时目录，在仓库外 cwd 用标准库执行 CLI，移走源 CSV 后仍能重放 request 和打开 HTML。提交，message：`feat(skills): generate portable visualization artifacts`。

## Task 6：交互页面与状态口径

**Files:**

- Modify: `skills/data-science-visualization/assets/page-runtime.js`。
- Modify: `assets/page.html`、`page.css` 的控件区域。
- Test: `packages/vchart-statplots/__tests__/browser/skill-interactions.spec.ts`、`skill-failures.spec.ts`。

**Interfaces:** browser `window.__DSV_STATUS__ = {ready, charts:[{id,status,error,inputN,omittedN}], filteredN}`；ready 表示批次已结束，成功由每图 status=rendered 判定。测试可读状态，不把 native series 私有 ID 当生成协议。页面持有 Map<chartId, controller> 和最后成功 filters/requests；JSON 下载从各 controller.spec 获取。

- [ ] 用真实鼠标和控件写筛选后直方图计数变化、相关值变化、清空恢复 IDs、pairPlot 高亮、空筛选、变量切换确实换数据、主题不变统计和 PNG download 用例。先生成 Task 5 的 HTML，以 file URL 打开而非绕过生成器拼测试专用页面。

```ts
await page.getByLabel('地区').selectOption('A');
await expect.poll(() => page.evaluate(() => (window as any).__DSV_STATUS__.filteredN)).toBe(2);
await page.mouse.move(binCenter.x, binCenter.y);
await expect(page.locator('.vchart-tooltip-element')).toContainText('2');
await page.getByRole('button', {name:'清空筛选'}).click();
await expect.poll(() => page.evaluate(() => (window as any).__DSV_STATUS__.filteredN)).toBe(4);
```

binCenter 从渲染图元几何计算，仅用于测试鼠标定位；确定数据为 A 两条/B 两条，设置一箱，确认 tooltip 展示的是计数而非任意包含 2 的文本。

- [ ] 初绘与更新统一构造函数，不在各控件复制数学路径。

```js
async function updateBoundChart(chartInput, filteredRows) {
  const result = StatPlotData.buildBoundSpec(chartInput.binding, filteredRows, payload.dataset.columns);
  await controllers.get(chartInput.id).update(result.spec);
  return {inputN: result.inputN, omittedN: result.omittedN};
}
```

所有 spec 入口图直接交 controller，不经过表格转换。全局筛选仅作用于 binding 图，外部结果明确标注“不随表格筛选更新”。每图更新失败保留旧图/旧样本口径并标记，ready 不等于成功；其他图仍可正常更新。

- [ ] 控件只按 request 声明创建；参数路径 allowlist 与设计一致，值先校验再提交；主题通过语义 theme 重编译，JSON 下载导出最后成功 spec，PNG 调用公共 exportPNG。改字段时重建 fieldLabels，不留下旧单位。多图筛选开始前保存上次成功的 specs/各图计数，部分失败时恢复成功更新的图；全批成功才提交 filteredN 和控件状态。恢复本身失败则明确标记图不可用及实际条件，不显示全局成功。用一个合法图和一个故意触发 compile 范围错误的图覆盖此路径。
- [ ] 只在用户提交筛选时扫描数据；控制区加载期间禁用更新按钮，队列处理完成再恢复。错误恢复到最后成功控件值；空筛选显示空态，clear 可恢复。CDN 缺失显示错误并结束 pending 状态；数据配置可读，不显示假成功。
- [ ] 加 beforeunload 释放实例；不添加二套 resizeObserver，沿用 autoFit。pairPlot 实际拖动框选验证 ID 联动；hover/resize/brush compile 调用次数不变；其图例不做筛选承诺。
- [ ] 验证下载配置再次渲染得到相同筛选结果；截图检查长中文 tooltip 在 420 px 视口内。提交，message：`feat(skills): add truthful visualization interactions`。

## Task 7：技能入口、可执行例子与行为验收

**Files:**

- Create: `skills/data-science-visualization/SKILL.md`、`agents/openai.yaml`。
- Create: `references/intent-routing.md`、`input-and-interaction.md`。
- Create: `examples/observations.csv`、`distribution.json`、`comparison.json`、`relationships.json`、`quality.json`、`external.json`。
- Modify: `packages/vchart-statplots/docs/skill-authoring.md`，新增技能位置与共享控制器说明。
- Modify: `skills/vchart-development-assistant/SKILL.md`，仅补统计图意图边界，不改其工作流。

**Interfaces:** 用户自然语言 → 按目的与真实数据选图 → 按需读 canonical catalog/Schema/doc → request → CLI → 真实浏览器验收 → 交付及自然语言修改。自动发现默认开启；不依赖另一个已安装技能自动调用。

- [ ] 编写精简入口和明确描述：

```yaml
name: data-science-visualization
description: 从 CSV、TSV、JSON 表格或已有统计与模型结果生成可交互的数据科学图表 HTML，支持分布、分组比较、变量关系、缺失检查和现成结果展示，以及筛选与改图。适用于看数据、探索图表和展示结果；完整统计分析报告与应用开发使用对应工作流。
```

正文说明默认一图、12 类绑定与 28 类 Spec 的差别、字段/区间/正例含义的澄清条件、真实模型结果边界、输出路径、固定 UMD、验收与改图步骤。入口目标不超过约 200 行，避免复述完整文档；intent-routing 引用 catalog，而不复制一张 28 图维护表。

- [ ] openai.yaml 用中文 display_name/short_description，default_prompt 包含 `$data-science-visualization`；不添加虚构 MCP dependency，不改成 explicit-only。
- [ ] 写五个 CLI 可运行请求：distribution 用 income histogram + bin 控件；comparison 用 department violin + strip；relationships 用 pair+correlation + region filter；quality 用原始 null/0/false；external 用上游真实 embedding 示例，声明来源并保留 method/dimensions。样例数据用于示例须明确是演示，不冒充用户数据。
- [ ] 在 vchart-development-assistant 入口增加：当主要目标为原始观测的统计分布/关系/质量或现成模型结果展示时，选择本技能；普通业务图、React 和应用嵌入仍用原工作流。给相邻目录相对链接，复制单个技能后链接缺失不影响核心执行。
- [ ] 验证 frontmatter、引用文件与五个例子实际生成。执行 skill-creator 的 quick_validate（若宿主可用），并用普通请求检查触发与输出：

```text
给我看工资分布，能调整分箱，不用做分析报告。
这些部门谁的分布更分散？能看到每个样本吗？
看年龄收入消费之间的关系，按地区筛选。
这些字段哪里缺失？0 和 false 要保留。
这是已经算好的 UMAP 坐标，按类别着色。
把上一张箱线图改成小提琴，保留筛选和单位。
只有原始 20 维数据，帮我画 PCA 坐标。
这些上下界画误差线，但我不知道它们是什么区间。
```

前六项检查真实产物、正确数据和可用交互；后两项应请求必要计算/区间语义，不伪造结果。行为验收需执行任务和观察产物，不能用 prompt 关键字 regex 或 check:catalog 的通过当命中率。
- [ ] 如宿主可用，验证正常自动发现；未安装技能时不擅自安装，记录仅显式路径使用已验收、隐式触发未验收。必要的独立评估只在获得授权且可用时安排。
- [ ] 提交，message：`feat(skills): add data science visualization workflow`。

## Task 8：版本兼容、回归、规模和最终验收

**Files:**

- Create: `packages/vchart-statplots/__tests__/browser/skill-catalog.spec.ts`、`skill-portable.spec.ts`、`skill-performance.spec.ts`。
- Create: `docs/superpowers/validation/2026-10-12-data-science-visualization.md`。
- Modify: `packages/vchart-statplots/docs/validation.md`，记录技能消费者验收与控制器回归结果。

**Interfaces:** 使用生成器实际产物验证发布 UMD；本地 core/statplots browser suite 验证抽取影响。报告明确区分固定发布库、当前源码、宿主预览和真实用户触发。

- [ ] 在测试运行前下载两个固定发布 UMD 到 `.vchart-statplots/skill-cache/`，记录 npm dist.integrity 与提取文件 SHA-256；自动浏览器 route 只能返回同版本已核验字节，不能用当前 workspace build 替换固定 CDN 而宣称发布组合通过。

```ts
await page.route(vchartURL, route => route.fulfill({path: publishedVChartUMD, contentType:'text/javascript'}));
await page.route(statplotsURL, route => route.fulfill({path: publishedStatplotsUMD, contentType:'text/javascript'}));
await page.goto(pathToFileURL(generatedHTML).href);
await expect.poll(() => page.evaluate(() => (window as any).__DSV_STATUS__.ready)).toBe(true);
expect(await page.evaluate(() => (window as any).__DSV_STATUS__.charts.every((c: any) => c.status === 'rendered'))).toBe(true);
```

另跑不拦截网络的一次真实 CDN smoke，验证当前可访问和全局 API；失败如实报告，缓存路由通过不能声称在线通过。

- [ ] 全部 28 类：读取快照 catalog 引用的最小 Spec，用真实生成器每类产出 HTML；等待实际图元，核对各图 source/状态无失败。新增测试覆盖 12 类绑定、外部 pointInterval/UMAP/ROC；用结构化数值基准确认分母、单位与区间；不只检查 canvas 是否存在。
- [ ] 便携：复制技能和五个输出到临时目录，原始 CSV 不可用且当前 cwd 不在 repo；重新执行 request 并用 file URL 渲染。网络阻断用例验证静态来源/错误，不能把阻断 HTML 报为交互成功。
- [ ] 真实交互：鼠标 hover、pair 拖动框选、实际 select/range/按钮、PNG 和配置下载。记录 360/420/1000 px 及深浅主题截图，检查页面不溢出、tooltip 不越界、空态可恢复。
- [ ] 规模：构造明确种子、10k 行、4 图（histogram、scatter、hexbin、correlation），记录初绘/筛选/主题/resize/release。pair 用 4 变量/10k 行（120000 点预算）单独验收。controller 包装调用次数，断言 hover/resize/brush 不 compile；多次更新保持实例数，release 清除绘图节点/事件，不引入静态全局实例缓存。
- [ ] 所有新测试登记为明确的文件清单与对应目的，运行以下命令，记录实际结果：

```bash
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
node --test packages/vchart-statplots/__tests__/runtime/*.test.cjs skills/data-science-visualization/tests/*.test.cjs
python3 -m unittest discover -s skills/data-science-visualization/tests -p 'test_*.py' -v
npm run check:catalog --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm run compile --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
npm run test:browser --prefix packages/vchart-statplots
git diff --check
```

Node 使用 22；若依赖尚未安装，先按仓库 Rush 规范安装/构建。不为技能消费者增加 npm install 要求。Python 验证 3.11 和宿主现有 3.12；XLSX 有/无可选依赖两条路径都验证。

- [ ] PR 前按根 AGENTS.md 执行全量官方基线视觉回归：

```bash
node packages/vchart/scripts/visual-test.mjs
```

如该分支未含视觉测试 runner，明确记录实际缺失；不要直接 cherry-pick 测试基础设施作为本功能附加改动。可在含正式 runner 的兼容工作区验证最终改动，记录实际 SHA/来源和三图审查；若仍无法运行，保留阻断，不使用 self-compare 代替。

- [ ] 写验收文档：每项数据源、库版本、测试命令/结果、真实行为与截图位置、性能数字、未覆盖宿主/隐式触发、网络限制和剩余阻断。不能将计划步骤标为实测通过。
- [ ] 最终检查源码/生成副本一致、无跨仓库绝对路径运行依赖、无 latest/伪造模型数据/数学重实现；提交，message：`test(skills): validate statplots visualization delivery`。

## 执行顺序与完成定义

Task 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8。只按任务边界提交，问题修在实际来源：数学/绘图问题修 statplots 或上游 API；字段导入问题修 io/bindings；页面状态问题修 controller/page-runtime，不用局部兜底掩盖。

完成意味着：技能目录可独立复制使用；普通数据需求能生成经过实际交互检查的 HTML；下载配置与画面一致；现有图库仍通过回归；固定发布 UMD 与当前源码测试分别有证据；文档明确所有未验收项。安装、push、PR、发布和部署需对应用户任务，不属于本计划默认执行动作。

## 2026-10-12 执行记录

用户已授权执行。Task 1–7 已实现并分阶段提交；Task 8 的消费者、图库回归、规模和便携验收已完成，官方全量基线比较仍有既有阻断，不能将该项标为通过。详见 [验收文档](../validation/2026-10-12-data-science-visualization.md)。

| 任务 | 实际交付 |
| --- | --- |
| 1 固定资源 | a55682f6f；28 类、144 发布资源及来源/哈希、离线 check |
| 2 共享控制器 | 3c60b4687；图库复用公共生命周期，技能同步副本 |
| 3 数据导入 | dd11f4e50；声明类型、稳定 ID、来源与预算 |
| 4 字段绑定 | f6c42dba3；12 类语义角色，单一 JS 映射路径 |
| 5/6 HTML 与交互 | 36e02f132、8a1f673b1；三项产物、真实交互与恢复 |
| 7 技能入口 | 5214df0fa；精简入口、按需参考、五个可执行示例和相邻技能边界 |
| 8 回归 | 202faea7a；固定发布物、便携/规模；664 单元/427 浏览器通过 |
| 独立反馈修复 | 67e68b2d7；initialFilters、保存当前视图请求及真实改图重放测试 |

实现调整：CSV/JSON fixtures 在 unittest 临时目录构造；HTML 基本渲染和控件一起交付，回归随后补强；独立正向执行发现的筛选持久化缺口在同一范围内修复。没有把新统计实现、全局安装或另一个仓库迁移加入本次工作。
