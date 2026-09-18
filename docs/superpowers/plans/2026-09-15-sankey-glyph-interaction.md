# 桑基图 Glyph 交互恢复 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.
>
> 执行状态：源码修复与本地验收已完成；正式依赖接入等待修复包发布。详见 [验收记录](../validation/2026-09-15-sankey-glyph-interaction.md)。本轮按任务依赖顺序在当前任务内执行。

**Goal:** 恢复原桑基图 case 的连线 hover、按流量比例高亮、连续切换和取消选择，并保证状态动画、数据更新及其它 Glyph 图表正常。

**Architecture:** VRender 负责统一的状态解析、属性恢复及 Glyph 子图形更新契约；VChart 负责把最终 Glyph 属性编码成连线路径和子图形样式。保留文档承诺的 `glyphStates/glyphStateProxy` 输入，将其适配到现有状态机制；VChart 复用标准状态入口和 Glyph 更新入口。

**Tech Stack:** TypeScript、Rush/pnpm、VRender Core/Animate、VChart、Jest、浏览器 Canvas。

## Global Constraints

- VChart 根目录：`/Users/bytedance/Documents/opensource/VChart`。
- VRender 根目录：`/Users/bytedance/Documents/opensource/VRender`。
- 静态真值主路径：`baseAttributes + resolvedStatePatch -> attribute`；动画不能写坏静态真值。
- `normalAttrs` 不再承担 snapshot/restore 核心职责。
- 标准状态输入保持 Group-first ownership；旧 Glyph 输入的既有优先级单独保留，具体规则见下表，不能改动普通图形的行为。
- `glyphStates/glyphStateProxy` 是已保留的公开入口；本次不删除，不新增 `subAttributes` 自动传播行为。
- 优先标准 API；不 monkey-patch 实例状态方法，不向桑基图点击回调添加补偿式属性写入。
- 高频路径不增加宽泛深比较、全量属性复制、每次交互重新编译状态定义或重复清空再添加状态。
- 覆盖 10k 图元与多 chart 页面；纯颜色/透明度变化维持 paint-only，几何变化正确更新 bounds/picking。
- 文档和变更说明优先中文；本计划不包含发布、远端 case 保存或无关重构。

## 评审后确定的契约

### 状态来源与覆盖顺序

| 有效输入 | 定义来源 | 同一属性冲突时的规则 |
| --- | --- | --- |
| 显式配置 `glyphStateProxy` | 旧 Glyph 适配器；proxy 优先于 `glyphStates` | 有 `stateSort` 时按其排序，否则按传入状态顺序；后面的状态覆盖前面的状态 |
| 无 proxy，配置非空 `glyphStates` | 旧 Glyph 适配器 | 同上 |
| 未配置上述旧输入，配置 `states` / Group shared-state | 现有标准定义解析 | 保持现有 Group-first、priority/rank、exclude/suppress 语义 |

旧输入与 Group 同时存在时，**旧输入仍是该 Glyph 的完整定义来源**，不逐状态混合两套定义；旧输入缺失的状态不隐式回退 Group。这保留原 Glyph 的有效调用行为，是范围明确的兼容规则。移除旧输入后回到标准来源，需重新绑定并刷新当前状态。两种输入都使用同一套状态提交、动画和恢复生命周期。

VChart 全部走标准 Group 输入，不再安装 `glyphStateProxy/glyphStates`。共享定义只在 Mark 配置变化时编译，resolver 从 `ctx.graphic` 读取各图元的数据和 `runtimeStateCache[stateName]`；同一状态内的覆盖顺序为 **静态样式 → 数据驱动样式 → 运行时 patch**。不同状态之间仍按 Mark 编译出的优先级覆盖。不能把 ratio 放进被 Group 遮蔽的实例 `states`，也不能让共享 resolver 捕获某一个 Glyph。

### 子图形编码与撤销

- 编码器读取宿主已提交的最终属性。跟踪每个编码来源实际拥有的输出键；新结果缺少旧键表示撤销该来源的贡献。
- 显式通道编码优先于位置编码，二者优先于通用继承样式；例如 `backgroundStyle.fill` 优先于 back 的继承 fill，ripple 的派生透明度优先于通用透明度同步。子图形自身的独立属性不能被通用同步覆盖或删除。
- 撤销后恢复当前仍有效的低优先级贡献、子图形默认值或宿主继承值；不恢复进入状态时的旧快照。若没有自己的值，应删除 own key，让继承/主题默认值生效；写入 `undefined` 不等价于删除。
- 只比较注册通道和实际拥有的输出键，按顶层值/引用判断变化；不增加逐帧深比较或全量子图形快照。

### 更新时序

必要的子图形派生同步与可跳过的外部通知分开：**宿主属性提交 → 维护继承绑定 → 派生编码及子图形提交 → 外部通知**。`skipUpdateCallback` 只跳过外部通知，不能留下旧几何。VChart 在子图形及 datum/context 就绪后完成一次初始编码。

**评审验收重点：** 反向状态列表的覆盖结果、同 Group 多 Glyph 的不同 ratio、输出键撤销后的低优先级恢复、初始/静默/动画更新时序。比例验收检查实际路径端点厚度，性能验收检查编码和写入次数，不能只看状态名、路径字符串变化或总耗时。

---

## 1. 基线与已知证据

[原 case](https://bugserver.cn.goofy.app/case?product=chartspace4&fileid=64ed94bed4858ce3fbd85afa) 使用层级桑基图、`emphasis: { enable: true, effect: 'related' }`，并配置 `link.state.hover.stroke` 和 `link.state.selected.backgroundStyle`。

上一轮浏览器诊断基于 VChart `6cab358b5` 与已安装的 VRender 1.1.8：

| 操作 | 预期 | 已观察到的失败 |
| --- | --- | --- |
| hover 连线，再移开 | 描边恢复 | `currentStates=[]`，子路径仍有黑色描边 |
| 选择 A → top | top → 00 高亮 15/115 | `ratio` 正确，前景 path 不变，背景 path 为空 |
| 再选择 B → top | 同一连线改为 100/115 | `ratio` 改变，path 仍不变 |
| 点击空白取消 | 状态与外观恢复 | 状态名清空，`ratio/backgroundStyle` 残留 |

制定计划时，两个仓库均无未提交改动，但 HEAD 已更新为 VChart `351e1d1d6`、VRender `69d82c11b`。VRender 源码包版本是 1.1.9；VChart 实际安装的五个 VRender 包仍为 1.1.8。上述浏览器证据不能直接当成新 HEAD 的测试结果，执行任务 1 时先重新建立基线。

源码证据：

- VRender `packages/vrender-core/src/graphic/glyph.ts`：独立实现 `useStates/clearStates`，未统一维护 `resolvedStatePatch`；旧式恢复不能可靠删除状态新增属性。
- VRender `packages/vrender-core/src/graphic/graphic.ts`：状态和动画使用 transient/restore 写入路径，不等价于普通 `setAttributes` 的前置钩子。
- VChart `packages/vchart/src/mark/glyph.ts`：位置和通道编码绑定 `onBeforeAttributeUpdate`，状态补充同步只覆盖基础样式。
- VRender `setSubGraphic` 将子图形属性原型绑定到宿主属性对象；属性分层会替换对象。需要通过定向测试检查绑定在首次状态、恢复和子图形自身更新后是否仍正确，不能仅靠 VChart 复制颜色掩盖问题。

规范入口位于 VRender `docs/refactor/state-engine/D3_ARCH_DESIGN.md`、`D3_UPPER_LAYER_ADOPTION_GUIDE.md` 第 7 节，以及现有状态测试。

## 2. 改动边界

| 仓库 / 文件 | 责任 |
| --- | --- |
| VRender `packages/vrender-core/src/graphic/glyph.ts` | 旧输入来源/排序适配、标准状态生命周期、派生编码入口和子图形绑定 |
| VRender `packages/vrender-core/src/graphic/graphic.ts` | 提取来源选择和子图形属性删除所需的窄 protected 扩展点；复用属性提交与失效处理 |
| VRender `packages/vrender-core/src/graphic/state/state-engine.ts`、`state-definition.ts` | 为旧 Glyph 适配增加内部输入顺序策略；默认 priority/rank 行为不变 |
| VRender `packages/vrender-core/src/interface/graphic/glyph.ts` | 声明派生编码/批量子图形提交接口，明确它们与 `onUpdate` 的区别 |
| VRender `packages/vrender-core/__tests__/unit/graphic/glyph-state.test.ts` | 状态切换、属性删除、同状态刷新和公开输入兼容 |
| VRender 新增 `packages/vrender-core/__tests__/unit/graphic/glyph-update.test.ts` | 属性提交通知、继承关系和更新类别 |
| VRender `packages/vrender-animate/__tests__/unit/animation-runtime-attribute.test.ts` | 用真实动画推进验证 Glyph 中间帧与结束恢复 |
| VChart `packages/vchart/src/mark/base/base-mark.ts` | 共享 resolver 合入运行时 patch、声明影响键，以及 context 就绪后的初始化扩展点 |
| VChart `packages/vchart/src/mark/glyph.ts` | 统一子图形编码、输出键归属和初始化，删除旧状态安装与重复同步路径 |
| VChart `packages/vchart/src/mark/utils/glyph.ts` | 动态 ratio 更新复用同状态刷新，避免先删除再添加 |
| VChart `packages/vchart/src/mark/link-path.ts` | 预声明高亮状态的运行时 ratio；只修改测试证明需要的路径编码部分 |
| VChart `packages/vchart/__tests__/unit/series/sankey-emphasis-state.test.ts` | 原 case 的事件到最终图形集成回归 |
| VChart 新增 `packages/vchart/__tests__/unit/mark/glyph-state.test.ts` | linkPath、boxPlot、ripple、liquid 的公共 Glyph 编码回归 |
| 两仓库中文文档、`common/changes/` | 记录确定后的更新契约及对应 patch 说明 |

桑基图路径遍历算法不属于本次根因修复。执行中若暴露独立的 node-link 遍历缺陷，应单独记录，避免扩大这个补丁。

## Task 1：固定最小复现和失败断言

**Files:**

- Create: VChart `packages/vchart/__tests__/unit/series/fixtures/sankey-related.ts`。
- Modify/Test: VChart `packages/vchart/__tests__/unit/series/sankey-emphasis-state.test.ts`。
- Modify/Test: VRender `packages/vrender-core/__tests__/unit/graphic/glyph-state.test.ts`。

**Interfaces:** 使用现有 `findMarkGraphic(rootGroup, eventTarget)` 和 `series.event.emit('pointerdown', { item, mark }, Event_Bubble_Level.chart)`；输出可由后续任务直接运行的回归测试。

- [x] 记录两仓库 HEAD、实际包版本和 realpath；不依赖目录名推断加载版本。
- [x] 新建最小层级 fixture，保留 15/115、100/115 和无关分支：

```ts
export const createRelatedSpec = () => ({
  type: 'sankey', width: 800, height: 460,
  data: [{ values: [{ nodes: [
    { name: 'A', children: [{ name: 'top', children: [{ name: '00', value: 15 }] }] },
    { name: 'B', children: [{ name: 'top', children: [{ name: '00', value: 100 }] }] },
    { name: 'C', children: [{ name: 'bottom', value: 30 }] }
  ] }] }],
  categoryField: 'name', valueField: 'value', nodeKey: datum => datum.name,
  nodeAlign: 'left', nodeWidth: 10, nodeGap: 8,
  node: { state: { hover: { fill: 'red' }, blur: { fillOpacity: 0.15 } } },
  link: { state: {
    hover: { stroke: '#000000' },
    selected: { backgroundStyle: { fill: '#e8e8e8' } },
    blur: { fill: '#e8e8e8' }
  } },
  emphasis: { enable: true, effect: 'related' }
});
```

- [x] 在现有 VChart DOM setup 内渲染 fixture，通过子路径解析真实 mark/item 后发出事件，保存初始前景 path，检查比例、背景与恢复。下面是属性与恢复断言；还必须执行紧随其后的真实厚度断言。`target` 是 `source='top', target='00'` 的 link，`front/back` 来自 `target.getSubGraphic()`：

```ts
expect(target.attribute.ratio).toBeCloseTo(15 / 115);
expect(front.attribute.path).not.toBe(initialPath);
expect(back.attribute.path).toBe(initialPath);
expect(back.attribute.fill).toBe('#e8e8e8');
// 再选择 B → top 后：
expect(target.attribute.ratio).toBeCloseTo(100 / 115);
expect(front.attribute.path).not.toBe(pathAfterA);
// 取消后：
expect(target.currentStates).toEqual([]);
expect(target.attribute.ratio).toBeUndefined();
expect(target.attribute.backgroundStyle).toBeUndefined();
expect(front.attribute.path).toBe(initialPath);
expect(back.attribute.path).toBe('');
```

- [x] 在同一测试文件增加独立的曲线路径端点读取 helper，限定本 fixture 的无箭头 `M C L C Z` 格式，从命令端点取起点/终点的两侧坐标；不调用生产 `getHorizontalPath/getVerticalPath` 生成期望值。增加 `round: false` 的几何测试变体，断言前景两端厚度都等于 `target.attribute.thickness * ratio`，背景两端厚度都等于完整 thickness，覆盖 15/115、100/115、0、1、取消恢复。原始完整 case 保留默认取整设置，端点厚度按像素取整误差验收。
- [x] 增加同 Group 两个 Glyph 同时 selected、ratio 各不相同的测试，以及没有配置 selected 样式、只有运行时 ratio 的场景；防止共享 resolver 捕获单个图元或编译器跳过空样式状态。

- [x] 在 core 现有 `createTestGlyph` helper 内增加“初始不存在的键”的测试；既检查显示属性也检查静态真值：

```ts
test('removes attributes introduced only by glyph state', () => {
  const { glyph } = createTestGlyph();
  glyph.glyphStates = {
    selected: { attributes: { fillOpacity: 0.25 }, subAttributes: [] }
  };
  glyph.setStates(['selected'], false);
  expect(glyph.attribute.fillOpacity).toBe(0.25);
  expect(glyph.baseAttributes.fillOpacity).toBeUndefined();
  glyph.setStates([], false);
  expect(glyph.attribute.fillOpacity).toBeUndefined();
  expect(Object.prototype.hasOwnProperty.call(glyph.attribute, 'fillOpacity')).toBe(false);
});
```

- [x] 分别运行以下命令，保存实际失败断言；若新 HEAD 已修复某项，保留该测试并缩减对应实现任务，不预设它必须失败。

```sh
# cwd: /Users/bytedance/Documents/opensource/VRender/packages/vrender-core
./node_modules/.bin/jest -c jest.config.js __tests__/unit/graphic/glyph-state.test.ts --runInBand
# cwd: /Users/bytedance/Documents/opensource/VChart/packages/vchart
./node_modules/.bin/jest __tests__/unit/series/sankey-emphasis-state.test.ts --runInBand
```

**完成标准：** 测试能区分状态名、实际路径比例、最终属性及删除语义，并记录修复前结果。

## Task 2：VRender Glyph 接入统一状态生命周期

**Files:** VRender `graphic/glyph.ts`、`graphic/graphic.ts` 窄扩展点、`graphic/state/state-engine.ts`、`graphic/state/state-definition.ts`、`glyph-state.test.ts`。

**Interfaces:** 消费 `glyphStates/glyphStateProxy`；对外维持 `setStates(states, options)`、`useStates(states, hasAnimation)`、`clearStates(hasAnimation)`；产出正确的 `currentStates/effectiveStates/resolvedStatePatch` 和最终 `attribute`。

- [x] 增加组合状态测试：hover → hover+selected → selected → empty；基准中不存在的键须删除，状态期间更新的 base 值须在清空后保留。
- [x] 先锁定旧状态排序：`a.stroke=red`、`z.stroke=blue` 时，`useStates(['z', 'a'])` 得到 red，反向列表得到 blue；再配置自定义 `stateSort` 验证覆盖结果，proxy 收到排序后的完整目标列表。标准 `states` 的 priority/rank 排序保持原测试结果，不能把两种规则混为一谈。无需保留旧实现原地排序调用方数组的副作用。
- [x] 增加同状态动态刷新测试：

```ts
test('refreshes the same glyph state without clearing it first', () => {
  const { glyph } = createTestGlyph();
  let opacity = 0.2;
  glyph.glyphStateProxy = () => ({ attributes: { fillOpacity: opacity }, subAttributes: [] });
  glyph.setStates(['selected'], { animate: false });
  opacity = 0.8;
  glyph.setStates(['selected'], { animate: false });
  expect(glyph.currentStates).toEqual(['selected']);
  expect(glyph.resolvedStatePatch.fillOpacity).toBe(0.8);
  expect(glyph.attribute.fillOpacity).toBe(0.8);
  expect(glyph.baseAttributes.fillOpacity).toBeUndefined();
});
```

- [x] 将 Glyph 特有逻辑收敛为状态输入适配：静态 `.attributes` 对应 patch，动态 `.attributes` 对应 resolver；resolver 使用上下文中的实际 graphic，不捕获宿主实例。proxy 返回空时不回退静态定义。纯 proxy 模式支持未在 `glyphStates` 中枚举的目标状态名。
- [x] 在状态引擎选项中增加仅由旧 Glyph 适配器选择的内部排序策略：默认保持 definition priority/rank；旧输入按目标列表或 `stateSort` 排序后依次合并。复用同一 merge/resolve/commit 过程。禁止通过每次切换重编译 priority/rank 模拟顺序；只在定义引用、proxy、已知状态名集合变化时更新适配缓存，并以测试计数证明反复切换不重编译。

- [x] 删除 Glyph 独立的属性合并、快照恢复实现；状态提交、同状态刷新、动画过渡与清空复用 Graphic 主路径。若需要新扩展点，只提取已有解析步骤，不复制第二套状态机。
- [x] 按契约表测试来源矩阵：proxy 优先、静态旧输入、标准本地输入、标准 Group 输入，以及旧输入与 Group 同时存在时旧输入权威的兼容行为。不做隐式逐状态合并；移除旧输入后切回标准来源，Group 移动、定义更新、clear/release 不留下失效的 scope 登记。
- [x] 保留公开输入兼容测试；现有测试中“应与普通 Graphic 不同”的描述收窄为“Glyph 专有定义的明确优先级”，不将旧实现方式作为契约。
- [x] 运行 core 的 glyph-state、state-same-state-refresh、shared-state-refresh、state-update-category 测试。通过后形成独立 VRender 提交。

**完成标准：** 清空精确还原静态真值；同名状态可刷新动态 patch；正常用法下没有短暂 normal 状态、属性泄漏或共享状态登记残留。

## Task 3：VRender 提供 Glyph 派生同步与继承契约

**Files:** VRender `graphic/glyph.ts`、必要的 `graphic/graphic.ts` 批量删除扩展点、`interface/graphic/glyph.ts`、新增 `glyph-update.test.ts`、animate 的 `animation-runtime-attribute.test.ts`。

**Interfaces（拟新增，当前源码尚不存在）：**

- `glyph.setSubGraphicEncoder(encoder?: (g: IGlyph, context?: ISetAttributeContext) => void)`：注册/替换必要的派生编码器，并在显式注册时完成一次初始同步；调用方必须已准备好子图形及编码上下文。传入空值解除绑定。后续所有已提交写入都经过此编码器；相同输入可直接跳过子图形写入。
- `glyph.commitSubGraphicAttributes(subGraphic, patch, removedKeys?, context?)`：提交编码器生成的值及需要删除的 own keys；只修改本 Glyph 所持子图形，复用 Graphic 的 base/state/animation 提交及更新标记。无删除时走已有属性更新路径，不引入全量重建。VChart 决定输出键归属，VRender 负责正确提交。
- 现有 `onUpdate(cb)` 保留为外部观察入口，位于派生同步之后，遵守 `skipUpdateCallback`；不把 VChart 编码器注册到这里。

- [x] 新增测试，要求派生入口在状态写入及清空时读到最终属性；清空观察到键缺失。单独断言注册时的初始同步，后续记录只包含两次有效提交：

```ts
const seen: unknown[] = [];
glyph.setSubGraphicEncoder(g => seen.push(g.attribute.fillOpacity));
expect(seen).toEqual([undefined]);
seen.length = 0;
glyph.glyphStates = {
  selected: { attributes: { fillOpacity: 0.25 }, subAttributes: [] }
};
glyph.setStates(['selected'], false);
glyph.setStates([], false);
expect(seen).toEqual([0.25, undefined]);
```

- [x] 在 Glyph 自身的属性提交边界完成“绑定维护 → 必要派生同步 → 可跳过的观察回调及 Graphic 服务通知”。覆盖普通设置、`initAttributes`、状态 transient/restore、动画中间帧。不能扩大普通 Graphic 的前置钩子语义，也不能从 render 循环补做编码。
- [x] 增加 `skipUpdateCallback: true` 测试：子几何正确同步，`onUpdate`、Graphic 服务及自定义事件均不额外通知；向子图形提交时传递该标记。覆盖 render interceptor 的 interactive clone 属性设置，防止渲染期间触发额外通知循环。
- [x] 编码器只允许写子图形，不在回调中写宿主属性或增删宿主状态；不加每个图元都付费的宽泛重入兜底。clone 保持既有回调不复制语义，子图形初始外观与原件一致；独立注册编码器后只更新 clone。detach/rebind/release 清理自己的绑定，不能持有旧宿主或旧 datum。
- [x] 用测试锁定宿主属性对象替换后的子图形继承、子图形自身属性覆盖、detach/rebind。只有属性对象身份变化时才重绑原型；正常状态更新不全量复制父属性到所有子图形。
- [x] 批量撤销测试覆盖：patch 更新与 own key 删除在一次提交中完成；删除后读到当前宿主值或主题默认值；子图形独立值不丢失；子图形自身状态/动画存在时仍从正确静态真值恢复。不能直接由 VChart `delete subGraphic.attribute[key]` 绕过 base、dirty tags 与提交生命周期。
- [x] 区分几何与绘制更新：纯 fill/fillOpacity 不重新编码 path、不强制所有子图形更新 bounds；ratio/尺寸变化由子图形的新几何触发必要更新。
- [x] 复用 `animation-runtime-attribute.test.ts` 中的 `createStageHarness`、`bindGraphicService` 和 `tick`，使用真实 ManualTicker 检查 `t=0 / t=mid / t=end` 和中断清空：编码器读到动画当前值，子图形对应中间值，结束后回到静态真值，基础属性保持正确。
- [x] 跑新增 core 测试和 animate 定向测试，补充 Glyph 更新契约中文说明，形成独立 VRender 提交。

**完成标准：** 首帧及所有提交路径的子图形均正确；静默更新保留派生同步且无额外通知；原生 Glyph 的继承与状态恢复本身也正确。

## Task 4：VChart 统一 Glyph 编码与运行时状态刷新

**Files:** VChart `mark/base/base-mark.ts`、`mark/glyph.ts`、`mark/utils/glyph.ts`、声明运行时影响键的 `mark/link-path.ts`，两个 Glyph/Sankey 回归测试文件。

**Interfaces:** 消费任务 2 的标准状态 API 和任务 3 的 `setSubGraphicEncoder/commitSubGraphicAttributes`；位置编码仍使用 `_positionEncoder(glyphAttrs, datum, g)`，通道编码仍使用 `_channelEncoder[channel](value)`。BaseMark 新增 protected `_afterCreateGraphic(g)` 与 `_getRuntimeStateKeys()`：前者默认不做派生工作，后者默认无运行时键声明；Glyph/LinkPath 按需覆盖。

- [x] 先完成任务 5 中的本地依赖接入，再运行任务 1 测试，记录“仅 VRender 修复”的剩余失败。
- [x] BaseMark 创建流程在 `_createGraphic` 返回、赋好 `g.context` 后调用 `_afterCreateGraphic`，Glyph 在此注册一次 `setSubGraphicEncoder` 并完成首轮编码，再进入依赖 bounds/picking 的流程。明确覆盖 progressive 创建路径；不能继续在缺少 datum 的 `_createGraphic` 尾部编码。
- [x] 移除 `onBeforeAttributeUpdate` 与硬编码状态类型 `2` 的双路同步、子图形空前置钩子，以及 Glyph 的 clear/proxy/useStates 覆盖；状态设置复用 BaseMark 标准路径。
- [x] 编译时固定需跟踪的输入集合；每个图元只缓存必要输入值与输出键归属。属性存在变为缺失也算变化，采用顶层值/对象引用语义，不支持未承诺的嵌套原地修改。`updateSpecSync` 的 encoder/config 版本变化、图元复用或 datum/context 更换必须使对应缓存失效；读取当前 Mark 编码器和当前图元 context，不捕获初始化 datum。
- [x] 跟踪位置与各通道对每个子图形的输出贡献，按契约中的优先级合成受影响键。新结果缺少旧键时，撤销该来源并读取当前较低优先级值；没有 own value 时用任务 3 的批量删除入口恢复继承。未由编码器持有的自身属性保持不变；只记录实际占用键，不快照整个子图形。
- [x] 增加撤销断言：boxPlot angle 从有效值变为缺失时同时撤销 angle/anchor；backgroundStyle 从 `{fill, stroke}` 变为 `{fill}` 时撤销旧 stroke，随后清空时恢复当前宿主 fill；hover stroke 清空后无残留。状态期间更新基础 fill/几何，取消后展示新基础值。
- [x] 清空 ratio 使 front 恢复全宽、back path 为空；ripple 的专用透明度不被通用样式覆盖；liquid 纯 fill 更新不重建点数组。除位置输入或编码上下文变化外不重复调用位置 encoder。
- [x] 修改 BaseMark `_applySharedStateDefinitions`：状态名取样式编码状态与 `_getRuntimeStateKeys()` 声明状态的并集；LinkPath 预声明 `STATE_SANKEY_EMPHASIS` 对应的 `ratio`。没有静态/动态样式但声明运行时键的状态也生成定义。普通 Mark 没有运行时键时保留既有路径。
- [x] 共享 resolver 从 `ctx.graphic` 读取 datum 和运行时 patch；同一状态内按“静态 patch → 数据驱动 resolver → runtime patch”合并。`declaredAffectedKeys` 包含动态键与运行时键的并集，编译 cache key 包含运行时声明及 encoder 配置。定义由 Mark 共享，解析结果由各 Graphic 缓存，ratio 更新不替换共享定义。
- [x] 为共享来源补测试：两个 Glyph 的 ratio 互不污染；静态背景色、数据驱动属性和 runtime 同时生效；同属性冲突由 runtime 覆盖；只有 ratio 的状态不被跳过；普通 Mark 状态行为不变。不能以实例 `g.states` 补运行时 patch。
- [x] `addRuntimeState` 更新缓存后一次性调用现有标准刷新入口，不再先 remove 再 add；保留其它活跃状态，由现有 `setGraphicStates` 传入支持同状态刷新及动画的 options：

```ts
g.runtimeStateCache ??= {};
g.runtimeStateCache[stateName] = attrs;
addGraphicState(g, stateName, keepCurrentStates, hasAnimation);
```

- [x] 测试连续 A → B → A、hover 与 selected 叠加后仅移除 hover、点击空白、`updateDataSync/updateSpecSync` 后重新交互；保留已有 adjacency 子路径拾取及初始单路径透明度测试。
- [x] 为 boxPlot、ripple、liquid 补齐上述对应的公共编码验证，包含首帧、几何变化、专用样式与 clear；添加图元复用后旧 ratio 不会复活的用例。运行时缓存按图元数据生命周期处理，不为每次 hover 全量清理。
- [x] 跑定向 VChart 测试并形成一个独立 VChart 提交，不在桑基图 handler 中额外刷新图形。

**完成标准：** 原 case 四项行为同时恢复，实际路径厚度和子图形属性均正确；多 Glyph 共享定义、普通数据更新、其它 Glyph 图表无回归。

## Task 5：跨仓库接入、原 case 与性能验收

**Files:** 两仓库测试和中文 patch 变更记录；VChart 依赖与锁文件只在正式接入修复版本时更新。

**Interfaces:** VRender 同一源码提交构建出的 `vrender/core/kits/components/animate` 五个包；VChart 实际解析路径与包版本必须可追溯。

- [x] 在 VRender 通过现有 Rush 构建依赖闭包：

```sh
# cwd: /Users/bytedance/Documents/opensource/VRender
rush build -t @visactor/vrender
```

- [x] 创建 `/tmp/vrender-glyph-fix`，将五个包分别在各自包目录执行 `npm pack --pack-destination /tmp/vrender-glyph-fix`，记录 tarball 名称、校验和与源码提交。通过 Rush 的 `common/config/rush/pnpm-config.json` 临时 `globalOverrides` 统一指向这批本地产物，再 `rush update`；禁止只替换顶层 core 而保留传递依赖里的另一份 core。临时路径不提交。
- [x] 用 Node `createRequire` 从 VChart 及五个包分别解析 `@visactor/vrender-core`，比较 realpath；确认单一 core 实例来源，并在浏览器产物记录构建标识。
- [x] 在同一原 case 上验证三组构建：旧依赖基线、仅修复 VRender、完整修复。前两组用于归因，完整修复须通过全部验收。
- [x] 浏览器使用原始完整 spec、真实鼠标输入，验证节点与连线 hover、移出、点击选择、连续切换和空白清空；再验证 `emphasis.trigger: 'hover'`、纵向布局和已有 adjacency 场景。截图与路径端点厚度/own key/状态属性结构断言同时保留，不能只检查 handler、状态名或 path 不相等。
- [x] 完成功能与类型检查：

```sh
# cwd: /Users/bytedance/Documents/opensource/VRender/packages/vrender-core
./node_modules/.bin/jest -c jest.config.js __tests__/unit/graphic --runInBand
./node_modules/.bin/tsc --noEmit
# cwd: /Users/bytedance/Documents/opensource/VRender/packages/vrender-animate
./node_modules/.bin/jest -c jest.config.js __tests__/unit/animation-runtime-attribute.test.ts --runInBand
./node_modules/.bin/tsc --noEmit
# cwd: /Users/bytedance/Documents/opensource/VRender/packages/vrender
./node_modules/.bin/jest -c jest.config.js __tests__/graphic/graphic-state.test.ts --runInBand
./node_modules/.bin/tsc --noEmit
# cwd: /Users/bytedance/Documents/opensource/VChart/packages/vchart
./node_modules/.bin/jest __tests__/unit/series/sankey-emphasis-state.test.ts __tests__/unit/series/sankey-link-opacity.test.ts __tests__/unit/mark/glyph-state.test.ts __tests__/unit/interaction --runInBand
./node_modules/.bin/tsc --noEmit
```

- [x] 对实际改动文件执行 ESLint/Prettier 检查；两个仓库执行 `git diff --check`。若 shared-state 公共扩展点影响 React 绑定，追加 react-vrender 的状态/生命周期测试及 compile，不自动扩大到无关测试矩阵。
- [x] 性能检查分两类：10k 个 Glyph（20k 子路径）的连续状态切换，及多 chart 的 render/update/release。固定机器与构建条件，预热 2 次、测量 7 次，报告中位数、范围、调用次数及实际依赖。
- [x] 在测试/基准中计数，不向生产热路径加遥测：状态编译次数、resolver 次数、位置/通道 encoder 次数、实际子图形属性提交次数。10k Glyph 重复交互不重新编译共享定义；纯颜色切换的位置 encoder 为 0；相同状态与相同 patch 的子图形提交为 0；无动画的同状态 ratio 变化每个受影响 Glyph 编码一次，每个真正变化的子图形至多提交一次，不中途恢复 normal。
- [x] 动画按每次实际属性提交检查派生同步，不强求整个过渡只编码一次。性能差异须与测量波动区分；稳定变慢时定位分配/编译/重绘成本，不能以功能通过代替性能验收。
- [x] 按仓库流程生成中文 patch 说明；移除自己引入的临时 overrides 和锁文件变更，保留其它工作区改动。
- [ ] 待修复包发布后，VChart 正式依赖采用包含本修复的实际发布版本并通过 Rush 更新锁文件。本任务不直接执行发布，不能把本地源码版本号当作发布完成。

**完成标准：** 原 case 真实操作通过；core、上层、类型、代码规范检查通过；依赖来源唯一且可追溯；性能无未解释退化；临时联调配置不进入提交。

## 3. 执行顺序与最终交付

1. 任务 1 固定基线。
2. 任务 2 修复状态真值；任务 3 修复 Glyph 更新契约。
3. 任务 5 的本地构建/接入步骤先完成，再做任务 4。
4. 任务 5 完成最终验收与交付记录。

**合入门槛：** 状态来源/覆盖顺序、共享 ratio、输出键撤销、派生同步时序这四组回归全部通过；原 case 有真实厚度证据；10k/多 chart 的调用次数和耗时无未解释退化。不能仅凭点击视觉恢复合入。

交付包括 VRender 与 VChart 可分别审查的提交、失败到通过的测试证据、原 case 对照截图/结构输出、性能结果及实际依赖版本。运行时修复与验证完成前，不以计划完成替代问题修复完成。
