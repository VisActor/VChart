# StatPlots 辅助图元修复实施计划

> 用户已确认设计；在当前会话逐项实施和验收。

**目标：** 修复拟合区间缺口、重要性区间及配对线的图例筛选。

**架构：** 保留缺失位置，使用原生 invalidType；通过 seriesField 和 legend scale/field 区分连线分组与筛选分组。

**技术栈：** Node.js 22、TypeScript、Jest、Playwright、VChart。

## 全局约束

- 只覆盖已确认的三项 P2。
- 沿用 VChart 标准路径，不在 render/state 热路径增加手工过滤。
- 交互测试断言实际数据和图元变化；不放宽图像或测试阈值。

## 任务一：先建立反例

创建 `packages/vchart-statplots/__tests__/unit/auxiliary-series.test.ts` 和 `__tests__/browser/auxiliary-series.spec.ts`。

- [x] 用 x=0..4、x=2 缺失 lower/upper 的有效外部估计输入，断言保留五行并使用 break。
- [x] 用 A/B 两组重要性区间，断言区间按 series 分组并被图例关联。
- [x] 用每组两个 before/after 对象，断言 pairs 按 id 连线而图例按 series 过滤。
- [x] 在旧实现及旧 UMD 上运行新单测和浏览器测试，确认三种反例均失败。

## 任务二：实现

修改 `src/plots/scatter/compile.ts`、`feature-importance/compile.ts`、`paired/compile.ts`。

- [x] 使用 `fit.map(row => ({ ...row, lower: row.lower ?? null, upper: row.upper ?? null }))` 构造区间，并设置 `invalidType: 'break'`。
- [x] intervals 增加 `seriesField: 'series'`；legend seriesId 包含 importance 与 intervals。
- [x] pairs 保留 `seriesField: 'id'`；legend 关联 observations / pairs 并配置 `scaleName: 'color', field: 'series'`，颜色域沿用原始系列。
- [x] 通过标准 `legend.data` 绑定图例符号与散点颜色，覆盖默认、原生及自定义色板。

## 任务三：真实渲染和交互

- [x] 检查断点的 area points、连续中心线；resize 和补齐/恢复缺口的 updateSpec 后重新核对。
- [x] 鼠标点击 B 图例，检查 B 的柱与区间一起消失；恢复后核对全部图元和轴域。
- [x] 鼠标点击 B 图例，检查 B 的散点及两条配对线一起消失；A 的两条线仍独立。核对系列颜色、updateSpec、resize 与恢复。
- [x] 执行完整单测、相关浏览器回归、类型及示例检查、修改文件 lint、diff --check；记录结果和截图。

## 验证结果

- Node.js 22.23.3。
- 旧实现：新增 3 项单测、5 项浏览器测试均失败，分别捕获缺口被连接、区间残留及配对线残留。
- `npm run build`：类型检查及 ESM/CJS/UMD 构建成功。构建仍有已有的 tslib 插件警告，退出码为 0。
- `npm test -- --runInBand`：39 个套件、672 项测试通过。
- `npm run test:browser -- auxiliary-series.spec.ts regression.spec.ts semantics.spec.ts variants.spec.ts colors.spec.ts`：154 项通过，包括新增 5 项真实渲染和鼠标交互测试。
- `npm run check:examples`：28 个主示例、122 个变体、36 个负例通过；`npm run check:catalog`：28 种类型、89 个意图匹配通过。
- 修改文件 ESLint：0 错误；44 项警告来自测试里的 any / 非空断言及原有 scatter 非空断言。`git diff --check` 通过。
- 断点及配对图分别连续五次截图一致；人工查看断点、重要性筛选、配对筛选截图，确认缺口和隐藏行为。配对图例颜色与散点一致。
- 未修改 VChart 核心；本次运行 StatPlots 相关浏览器回归，未运行 VChart 核心全量视觉测试。
