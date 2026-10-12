# Data Science Visualization Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> 上述技能不可用时，在当前会话依次执行并记录每项结果；不自行安装工具或创建其他任务。用户本轮请求制定计划，本文不授权实施。

**Goal:** 默认生成只有图表、标题、单位和 Tooltip 的 HTML；其他交互仅按需求添加，改图通过对话及可重放请求完成。

**Architecture:** 请求明确声明页面能力，Python 根据声明生成必要 DOM，页面 runtime 只连接存在的功能。沿用唯一 statplots 字段绑定与共享控制器，以标准 Spec 控制标题及原生交互，图库缺省行为不变。

**Tech Stack:** Node 22、Python 3.11+ 标准库、原生浏览器 JavaScript、固定 VChart/statplots 2.1.8-alpha.0、现有 unittest/Node test/Playwright/Jest。

**Design:** [简化设计](../specs/2026-10-12-data-science-visualization-simplification-design.md)。基于 `codex/vchart-statplots` 的 `01d84fe64`。

## Global Constraints

- 默认只展示图表、标题、单位和 Tooltip；保留必要的坐标轴、静态图例和色标。无通用按钮、来源哈希、成功比例、技术说明或高级模式入口。
- 1 张图仅一个 HTML 标题；多图为页面标题与各图标题，不重复原生画布标题。矩阵实际变量键不重写，必要单位不能随元信息一起删除。
- request version=1；presentation.actions 枚举 theme/exportPNG/exportSpec/saveView，presentation.details 枚举 counts/provenance，默认空数组。未知/重复值拒绝。
- Chart.interactions 枚举 brush/legendFilter，默认空数组；brush 仅 pairPlot，pairPlot 不接受 legendFilter。不强行开启原生禁用的交互。
- controls 声明即创建相应控件；仅 filters 非空才有应用/清空。initialFilters 可独立声明固定条件，无需创建页面筛选器。
- 没有对应 filters 控件的 initialFilters 保持固定；应用/清空其他控件不能移除它，对话改 request 才可移除。固定范围在标题/明确图注中说明。
- 保留所有使用行、ID、单位、来源、预算与原始统计口径。10 MiB、8 图、pair 4 变量/120000 点、矩阵 20 变量、missing 200000 格、KDE/violin 20 组均不修改。
- 默认无导出按钮但仍输出 HTML/request/data 三项文件；对话改图读取 request，保留条件及数据，写新目录，不覆盖旧产物。
- Node 22、Python 3.11+；XLSX 可选 openpyxl；固定 UMD 2.1.8-alpha.0；不改 npm 依赖/版本、不添加科学计算库。
- 只改共享控制器源并同步副本；无数学/Tooltip/几何重实现；图库未传新选项时保持现状。成功更新复用实例，失败恢复、队列与 release 契约保持。
- 实施验收使用实际生成 HTML、真实交互和发布 UMD；构建与读本地 UMD 的浏览器测试不得并行。官方基线或既有类型错误不得写成通过。
- 只修改本仓库技能及对应支持代码，不修改 multivariate-analysis，不全局安装、不发布或部署。

---

## 文件与接口

| 文件 | 变更职责 |
| --- | --- |
| `skills/data-science-visualization/scripts/visualization_io.py` | 严格校验 presentation/Chart.interactions，独立固定条件 |
| `skills/data-science-visualization/scripts/visualization_html.py` | 按需求生成标题、单位、工具栏、详情与按钮；replay 保留新增协议 |
| `skills/data-science-visualization/assets/page.html`、`page.css` | 简洁布局及必要状态容器 |
| `skills/data-science-visualization/assets/page-runtime.js` | 按 DOM 能力接线，不假设所有按钮存在；保留统计状态与事务 |
| `packages/vchart-statplots/examples/shared/statplot-controller.js` | 可选展示策略，以公共 Spec 控制标题/原生交互 |
| `skills/data-science-visualization/assets/statplot-controller.js` | 现有脚本生成，不手改 |
| `skills/data-science-visualization/references/statplots/manifest.json` | 同步 workspace controller 哈希；固定 npm 资源不更新 |
| `skills/data-science-visualization/SKILL.md`、`references/input-and-interaction.md`、`references/intent-routing.md` | 默认简洁、明确按需与对话改图流程 |
| `skills/data-science-visualization/examples/*.json` | 默认例子收敛，新增一份显式交互例子 |
| `skills/data-science-visualization/tests/`、`packages/vchart-statplots/__tests__/runtime/`、`__tests__/browser/skill-*.ts` | 协议、静态输出、真实默认/按需行为和既有回归 |

新字段：

```text
RequestV1.presentation?: {actions?: Action[], details?: Detail[]}
ChartInput.interactions?: ("brush" | "legendFilter")[]
PayloadV1.presentation: {actions: Action[], details: Detail[]}
Action = "theme" | "exportPNG" | "exportSpec" | "saveView"
Detail = "counts" | "provenance"
ControllerOptions.showTitle?: boolean                 // 未传保持图库原状
ControllerOptions.interactions?: Interaction[]       // 未传保持原生；[] 显式关闭
```

已有 `build_payload(request, base_dir)`、`replay_request(payload)`、`render_html(payload, asset_root)`、controller.update/exportPNG/release、StatPlotData.buildBoundSpec/filterRows 和 window.__DSV_STATUS__/__DSV_CONTROLLERS__ 接口保留。新增展示字段必须在输出、保存视图和改图重放全链路保持一致。

## Task 1：按需能力与固定条件契约

**Files:** 修改 `scripts/visualization_io.py`、`scripts/visualization_html.py` 的 replay_request；测试 `tests/test_visualization_io.py`、`tests/test_visualization_html.py`（均位于技能目录）。

**Interfaces:** 输入 RequestV1；输出带规范 presentation 的 PayloadV1，以及包含新增字段的可重放 request。

- [ ] 写边界测试：缺 presentation 默认两空数组；合法能力保留；未知/重复/错误类型拒绝；Chart.interactions 约束；固定 initialFilters 不依赖 filters，但必须有 dataset/正确类型/合法值，且将条件引用列纳入 needed。

```python
request = copy.deepcopy(self.request)
request['controls'] = {'initialFilters': [
    {'field': 'group', 'kind': 'category', 'value': 'A'}]}
payload = build_payload(request, self.root)
self.assertEqual(payload['presentation'], {'actions': [], 'details': []})
self.assertNotIn('filters', payload['controls'])
self.assertEqual(payload['dataset']['source']['originalN'], 4)
# group 为已有临时 fixture 中的 string 列；原四行全部保留。
```

- [ ] 运行定向 unittest，确认新增默认字段/独立条件断言失败；不把环境缺依赖当预期失败。
- [ ] 扩展现有 keys 校验与规范化。controls 下只有 filters/initialFilters/variableSwitch/parameters 必须是数组；presentation 单独校验。initialFilters 的 needed、kind、重复、类型、值存在性独立校验；有 filters 时仍允许重放现有条件。不要增加并行数据过滤实现。
- [ ] replay_request 保留 presentation 与每图 interactions，默认省略空 presentation 也可，重放后的规范 payload 必须等价。修改现有“必须声明 filter”测试为合法独立条件及真实非法列/值用例，保留严格校验。
- [ ] 运行 Python 全套，覆盖新目录输出/JSON 转义/0/null/ID/XLSX 既有行为；提交 `feat(skills): declare optional visualization controls`。

## Task 2：共享控制器的标题与原生交互策略

**Files:** 修改 `packages/vchart-statplots/examples/shared/statplot-controller.js`、`packages/vchart-statplots/__tests__/runtime/statplot-controller.test.cjs`；同步技能 controller 副本及 manifest。

**Interfaces:** 消费上述 ControllerOptions；产出标准 compiled VChart Spec；controller.spec 始终是完整成功语义 Spec，图库不传选项时行为保持。

- [ ] 为现有 harness 增加记录 compile 入参，测试原输入不修改、一次 compile、标题删去仅影响绘制、恢复同样应用策略、legend 单个/数组形态与 brush 不创建额外组件、默认选项不改变原编译结果。

```js
const {calls, create} = harness();
const input = {type:'pairPlot', title:'变量关系', description:'真实样本',
  data:[], legends:{interactive:true}, brush:{visible:true}};
const c = create({dom:'plot', showTitle:false, interactions:[]});
await c.update(input);
assert.equal(c.spec, input);
assert.equal(c.chart.value.title, undefined);
assert.equal(c.chart.value.legends.interactive, false);
assert.equal(c.chart.value.brush.visible, false);
assert.equal(input.title, '变量关系');
assert.equal(input.legends.interactive, true);
assert.equal(calls.compiled, 1);
```

- [ ] 运行 Node 生命周期定向测试确认策略尚未实现导致失败。
- [ ] 在唯一 compile 路径先校验原 Spec；showTitle=false 时用解构浅拷贝去除 title/description，再调用 compileStatPlot。interactions 未传不做策略修改；显式数组才关闭未请求的已有 legend/brush。仅修改标准组件配置，不改变数据和 Tooltip，不用 graphic 私有状态实现策略。
- [ ] 固定发布 pair/seasonal 验证无标题余白，pair 显式 brush 使用原稳定 ID 联动，pair legend 始终静态。测试真实 grouped count 默认 legend 不过滤，显式请求才过滤；未支持类型不能伪装为可筛选。
- [ ] 执行资源 sync 与 --check，确认固定 npm 文件哈希不变，仅 workspace controller 更新。运行 Node 测试与 gallery.spec.ts，审阅图库前后图像；提交 `refactor(statplots): support minimal chart presentation`。

## Task 3：按声明生成简洁 HTML 与接线

**Files:** 修改技能 `scripts/visualization_html.py`、`assets/page.html`、`page.css`、`page-runtime.js`；修改 `tests/test_visualization_html.py`；新增 `packages/vchart-statplots/__tests__/browser/skill-minimal.spec.ts`。

**Interfaces:** 消费规范 payload；生成仅需要的 DOM；状态对象仍保存完整 inputN/omittedN/filteredN/error；controller 创建传 showTitle=false 与每图 interactions。

- [ ] 静态 HTMLParser 测试默认无 toolbar/buttons/details/provenance/footer，单图标题一次；矩阵有单位时保留单位；title/source/data 恶意字符串仍转义。来源默认只在内嵌 payload 中，现有测试不能再要求来源以可见 HTML 出现。
- [ ] 新增真实最小页测试，先运行并确认当前工具栏使其失败：

```ts
const request = tableRequest([histogram()]);
await openGenerated(page, generate(request, 'minimal'));
await expectRendered(page);
await expect(page.locator('.toolbar')).toHaveCount(0);
await expect(page.getByRole('button')).toHaveCount(0);
await expect(page.locator('select,input')).toHaveCount(0);
await expect(page.getByRole('heading')).toHaveCount(1);
const mark = (await marks(page, 'hist'))[0];
await page.mouse.move(mark.x, mark.y);
await expect(page.locator('.vchart-tooltip-element')).toBeVisible();
expect(await page.evaluate(() => (window as any).__DSV_CONTROLLERS__
  .get('hist').spec.fieldLabels.value)).toBe('年龄（岁）');
```

- [ ] 模板保留基本骨架、标题、数据脚本、charts、错误区；Python 分别构造存在的 controls/actions/details。默认无 card header/原生重复 title、scope/自动 caption/说明。单图 title 使用 request.title；多图 card title 使用 options.title/spec.title/id。明确 caption 仍显示。错误区独立于 toolbar，确保默认也能展示加载失败。
- [ ] 精简 CSS 白底、间距与边框；不为不存在的区域留占位。绘图区保留合理高度、pair 矩阵尺寸和 autoFit；不采用 100vw 造成溢出。
- [ ] runtime 按实际功能节点接线：只创建所声明控件，对可选按钮统一按是否存在处理。setBusy、summary、showMetadata 不要求这些 DOM 存在；内部状态依旧更新。默认不监听不存在的动作，不能以隐藏一整套 DOM 代替按需生成。
- [ ] 通过 field+kind 区分可编辑条件和固定条件；apply 合并固定条件与当前控件值，clear 仅清空可编辑条件。用真实测试验证固定地区 A + 可编辑年龄范围：修改/清空年龄后仍只含 A，saveView 同时保存两类已接受条件；不复制过滤算法。
- [ ] 筛选存在时仅显示必要当前计数；counts 显示完整口径；provenance 显示来源；没有请求时保留 data/status 中的完整信息。默认仅必要单位/明确图注。出错用简短消息、详细 error 仍在 status；失败后恢复成功页应清掉提示。
- [ ] 更新相关真实测试请求显式声明 actions/details/interactions：导出与主题测试、pair 框选、元数据、失败输入下载均只在对应测试启用。不要在共享 tableRequest helper 默认开启所有能力，以免掩盖真实默认。
- [ ] 跑 minimal/interactions/failures/portable/performance；截图审阅最小单图、只筛选、多图矩阵、明确图注和 CDN 错误；提交 `feat(skills): render charts with controls on demand`。

## Task 4：技能默认与对话改图流程

**Files:** 修改技能 `SKILL.md`、`references/input-and-interaction.md`、`intent-routing.md`、原有五个 examples；新增 `examples/interactive.json`；修改对应 portable/CLI/replay 测试。

**Interfaces:** 普通需求生成最小 RequestV1；用户明确请求才加入 controls/presentation/interactions；对话修改读取三项产物中的 request。

- [ ] 入口明确“不要推测用户需要浏览器探索面板”；默认一图，无控件/action/details/native brush/legendFilter。按自然语言明确添加，示例：“可调分箱”只加一个分箱选择器；“按地区切换”只加地区筛选；“深色”直接设置 theme，不自动提供切换按钮；固定条件如“仅看东区”写入 initialFilters 与标题，不添加页面控件。
- [ ] 五个基础例子去掉非必要 controls 和通用 caption；演示数据身份写在示例说明及 source，不误作真实数据。interactive.json 复用 observations.csv，显式展示筛选、分箱和 exportPNG；无需加入其他按钮。
- [ ] 改图默认从输出 request 修改；保留 initialFilters、presentation、原始使用行/ID/单位。去掉“有已应用条件时必须先点保存”的默认要求。浏览器条件不可读时确认该条件；saveView 为用户请求时的可选捕获，不能声称磁盘 request 自动包含浏览器后续变更。
- [ ] 写真实对话重放回归：固定 A 条件 + 无 filters 控件，4 原始行仍在；box 改 violin、单位元、仍 A 两条，页面仍无按钮；再通过请求清除初始条件恢复 4 条。既有可选 saveView 回归另保留。
- [ ] 正向人工执行三个普通请求：“看收入分布”“按地区筛选收入”“把箱线图改为小提琴，保留东区条件”。检查真实产物与该需求对应的唯一必要功能，不用关键词 regex 当意图评估。不新增全局安装。
- [ ] 运行所有例子实际生成、Python/portable/replay 测试与 skill quick_validate；提交 `docs(skills): make conversational chart editing the default`。

## Task 5：完整验收与记录

**Files:** 新增 `docs/superpowers/validation/2026-10-12-data-science-visualization-simplification.md`；更新 `packages/vchart-statplots/docs/validation.md`、本文执行记录。新增测试登记路径与目的，无 BugServer 占位 ID。

**Interfaces:** 针对新生成 HTML 的实测记录，区分固定发布库、当前源码、图库、宿主限制及正式基线。

- [ ] 先顺序完成构建/资源准备，再运行测试。源码编译、Schema、catalog、examples、Node/Python 检查复用现有命令；两个 Python 版本均测，有/无 openpyxl 按原覆盖要求验证。

```sh
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
node --test packages/vchart-statplots/__tests__/runtime/*.test.cjs skills/data-science-visualization/tests/*.test.cjs
python3 -m unittest discover -s skills/data-science-visualization/tests -p 'test_*.py' -v
npm run compile --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
DSV_PYTHON=python3 npm run test:browser --prefix packages/vchart-statplots
git diff --check
```

- [ ] 完整 browser 包含新最小页、28 类发布 UMD、12 类绑定、复制目录、真实 CDN、Tooltip、原生 opt-in、错误恢复、改图重放、图库和 10k；记录实际新总数，不沿用上一轮 427。关闭交互的反例须实际点击/拖动断言无状态变化；开启后断言真实状态变化。
- [ ] 360/420/1000/1440 px 审阅最小默认、筛选、多图和必要单位截图；默认首页无多余操作入口，Tooltip 不溢出；标题与 pair/seasonal 布局无空白残留。原图统计值、分母和预算不变。
- [ ] 记录同实例更新/compile 次数/release；无 hover/resize 编译。完整性失败保留快照、所有无按钮页面状态均不因空 DOM 报错。
- [ ] 依据 AGENTS 在 PR 前执行正式全量 `node packages/vchart/scripts/visual-test.mjs`；修改共享渲染策略时评估相关目录范围。与 statplots 浏览器测试串行；审查三图与 agent-summary.md。四个既有基线错误若仍发生，记录 SHA、命令、错误和未完成范围，不替换基线/跳例/放宽阈值。扩展测试 tsc 既有错误同样保留实情。
- [ ] 验收文档包含默认与按需截图、协议/对话回放、原生交互开关、图库行为、性能、实际命令、剩余限制。确认只规划的项目不标完成；最终提交 `test(skills): validate minimal visualization delivery`。

## 完成定义

普通绘图需求第一次打开只有必要图表信息；所有额外交互都能追溯到明确声明；对话改图无需默认保存按钮且不会丢失数据条件；现有 statplots 资源、统计与渲染路径继续复用；图库回归保持，实测结果与未完成项分别记录。

本轮状态：设计与计划已制定；上述实施及验收步骤均未执行。
