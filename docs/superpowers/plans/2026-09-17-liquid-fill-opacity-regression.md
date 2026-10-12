# Liquid 显式透明度回归修复计划与执行记录

**Goal:** 修复 PR #4687 导致的 Liquid 显式 `fillOpacity` 失效，保证初始配置、配置更新和状态切换都正确作用于三个子波浪。

**Architecture:** 在 `LiquidMark` 中声明 `fillOpacity` 通道编码，复用 `GlyphMark` 的输入变化检测、派生属性提交和默认属性恢复。用户显式值覆盖三个波浪的默认透明度；有效属性变为 `undefined` 时，由现有通道撤销流程恢复各自默认值。

**Tech Stack:** TypeScript、VChart、VRender 1.1.11、Jest / ts-jest / jest-electron。

## Global Constraints

- 基线：`codex/fix-sankey-glyph-state`，提交 `738fec391a1e323780b49b1fe5088f8d0087507a`。
- 运行时代码范围为 `packages/vchart/src/mark/liquid.ts`，复用现有 `_channelEncoder` 标准路径。
- 保持当前 VRender 1.1.11 依赖；不新增包或调整锁文件。
- 显式 `fillOpacity: v` 的结果是 `[v, v, v]`，保持原有覆盖语义；不改为与默认透明度相乘。
- 未配置时默认值仍为 `[1, 0.66, 0.33]`；退出状态时恢复当前普通样式，有普通样式则优先恢复该值。
- 透明度变化不重算波浪点数组，不把 `fillOpacity` 加入 `_positionChannels`。
- 不恢复 Glyph 全量样式复制，不改变 Ripple、BoxPlot、Sankey 或公共状态接口。
- 使用中文变更说明；修复源码、测试、变更说明与本执行记录一并提交。

---

## 依据与方案选择

[Review 原文](https://github.com/VisActor/VChart/pull/4687#discussion_r4035236608)。已在上述基线和正式 VRender 1.1.11 下复现：初始 `fillOpacity: 0`、`updateSpecSync` 更新为 0、hover 配置为 0 时，父 Glyph 值为 0，三个子波浪仍为 `[1, 0.66, 0.33]`。现有 Glyph 的 11 项测试通过，但 Liquid 用例只检查颜色变化和默认透明度。

| 方案 | 判断 |
| --- | --- |
| Liquid 声明 `fillOpacity` 通道编码 | 采用。直接表达 Liquid 的属性覆盖规则，复用已有缓存和恢复流程。 |
| 恢复 Glyph 对所有子图形的样式复制 | 不采用。扩大热路径成本和影响范围，还可能覆盖其他 Glyph 的派生样式。 |
| 将 `fillOpacity` 加入 Liquid 几何编码 | 不采用。透明度变化会无谓重建三组波浪点。 |

现有 `GlyphMark._encodeGlyph` 已在通道输入变为 `undefined` 时撤销该通道输出，并回退到 `_subMarks.defaultAttributes`；本修复不另设状态缓存或恢复钩子。

## Task 1：恢复 Liquid 透明度契约并完成定向验证

**Files:**

- Modify: `packages/vchart/src/mark/liquid.ts`：声明透明度通道编码。
- Test: `packages/vchart/__tests__/unit/mark/glyph-state.test.ts`：透明度变化、状态恢复和几何复用。
- Test: `packages/vchart/__tests__/unit/series/liquid.test.ts`：真实图表的初始 spec、更新 spec 和配置状态。
- Modify: `common/changes/@visactor/vchart/fix-sankey-glyph-state-20260915.json`：补充 Liquid 修复说明。

**Interfaces:**

- Consumes: `GlyphMark._channelEncoder: Record<string, (channelValue: any) => Record<string, any>>`，以及既有 `createGraphic(mark, attrs, datum?)` 测试辅助函数。
- Produces: `LiquidMark._channelEncoder.fillOpacity(value: number)` 返回三个子波浪的透明度属性；不新增公共 API。

- [x] **Step 1：添加图元级回归，锁定状态恢复与几何成本。**

在 `glyph-state.test.ts` 现有 Liquid 测试后追加以下用例，复用已有注册和 `createGraphic`；保留原有测试。

```ts
test.each([undefined, 0.4])('liquid restores normal fillOpacity %s without rebuilding points', normalOpacity => {
  const mark: any = new LiquidMark('liquid', markContext);
  const attrs: any = { y: 20, height: 100, wave: 0, fill: 'red' };
  if (normalOpacity !== undefined) {
    attrs.fillOpacity = normalOpacity;
  }
  const g = createGraphic(mark, attrs);
  const values = () => g.getSubGraphic().map((child: any) => child.attribute.fillOpacity);
  const normal = normalOpacity === undefined ? [1, 0.66, 0.33] : [normalOpacity, normalOpacity, normalOpacity];
  const points = g.getSubGraphic().map((child: any) => child.attribute.points);
  const encode = jest.spyOn(mark, '_positionEncoder');

  expect(values()).toEqual(normal);
  g.states = { hover: { fillOpacity: 0 } };
  g.setStates(['hover'], false);
  expect(values()).toEqual([0, 0, 0]);
  g.clearStates(false);
  expect(values()).toEqual(normal);

  g.setAttribute('fillOpacity', 0.6);
  expect(values()).toEqual([0.6, 0.6, 0.6]);
  expect(encode).not.toHaveBeenCalled();
  g.getSubGraphic().forEach((child: any, i: number) => {
    expect(child.attribute.points).toBe(points[i]);
  });
  g.release();
});
```

- [x] **Step 2：添加真实图表回归，覆盖 review 的三个入口。**

在 `liquid.test.ts` 中，将现有 `LiquidSeries` 导入改为 `import VChart, { LiquidSeries, registerLiquidChart } from '../../../src';`，另加 `import { createDiv, removeDom } from '../../util/dom';`。保留现有几何用例，追加：

```ts
describe('Liquid explicit fillOpacity', () => {
  let chart: VChart;
  let dom: HTMLElement;
  const spec = (liquid: any): any => ({
    type: 'liquid',
    width: 200,
    height: 200,
    data: [{ id: 'data', values: [{ value: 0.5 }] }],
    valueField: 'value',
    animation: false,
    liquid
  });
  const render = (liquid: any) => {
    chart = new VChart(spec(liquid), { dom, animation: false });
    chart.renderSync();
  };
  const glyph = (): any => chart.getChart().getAllSeries()[0].getMarkInName('liquid')!.getGraphics()[0];
  const values = () => glyph().getSubGraphic().map((child: any) => child.attribute.fillOpacity);

  beforeAll(() => registerLiquidChart());
  beforeEach(() => {
    dom = createDiv();
  });
  afterEach(() => {
    chart?.release();
    removeDom(dom);
  });

  test.each([0, 0.4, 1])('initial fillOpacity %s overrides all waves', value => {
    render({ style: { fillOpacity: value } });
    expect(glyph().attribute.fillOpacity).toBe(value);
    expect(values()).toEqual([value, value, value]);
  });

  test('updateSpecSync changes the opacity of all waves', () => {
    render({});
    expect(values()).toEqual([1, 0.66, 0.33]);
    for (const value of [0, 0.4, 1]) {
      chart.updateSpecSync(spec({ style: { fillOpacity: value } }));
      expect(glyph().attribute.fillOpacity).toBe(value);
      expect(values()).toEqual([value, value, value]);
    }
  });

  test.each([undefined, 0.4])('configured hover restores normal opacity %s', normalOpacity => {
    render({
      ...(normalOpacity === undefined ? {} : { style: { fillOpacity: normalOpacity } }),
      state: { hover: { fillOpacity: 0 } }
    });
    const normal = normalOpacity === undefined ? [1, 0.66, 0.33] : [normalOpacity, normalOpacity, normalOpacity];
    expect(values()).toEqual(normal);
    glyph().setStates(['hover'], false);
    expect(glyph().attribute.fillOpacity).toBe(0);
    expect(values()).toEqual([0, 0, 0]);
    glyph().clearStates(false);
    expect(values()).toEqual(normal);
  });
});
```

必须显式调用 `registerLiquidChart()`；当前入口没有默认注册 Liquid，否则失败原因会变成 `init chart fail`，无法验证透明度问题。状态用例通过真实 spec 建立共享状态定义，再驱动 Glyph 状态入口；本次不重复测试鼠标拾取系统。

- [x] **Step 3：在未修复源码上运行新增测试，确认失败原因。**

以下命令均在 `packages/vchart` 执行：

```sh
./node_modules/.bin/jest --runInBand --runTestsByPath __tests__/unit/mark/glyph-state.test.ts __tests__/unit/series/liquid.test.ts
```

预期新增用例在三个子波浪的透明度断言失败，收到 `[1, 0.66, 0.33]`；不是初始化、导入或类型错误。记录失败后再修改运行时代码。

- [x] **Step 4：在 Liquid 中声明最小通道编码。**

在 `liquid.ts` 的 `_positionChannels` 前加入：

```ts
protected _channelEncoder = {
  fillOpacity: (fillOpacity: number) => ({
    wave0: { fillOpacity },
    wave1: { fillOpacity },
    wave2: { fillOpacity }
  })
};
```

`0` 是有效输入，不使用 truthy 判断；`undefined` 的撤销和默认值恢复由现有 Glyph 流程处理。编码函数只产生透明度属性，不读取 datum、不生成 points、不直接调用子图形 `setAttributes`。

- [x] **Step 5：完成相关回归和静态检查。**

在 `packages/vchart` 执行：

```sh
./node_modules/.bin/jest --runInBand --runTestsByPath __tests__/unit/mark/glyph-state.test.ts __tests__/unit/series/liquid.test.ts __tests__/unit/series/sankey-emphasis-state.test.ts
./node_modules/.bin/tsc --noEmit --project tsconfig.json
./node_modules/.bin/eslint src/mark/liquid.ts __tests__/unit/mark/glyph-state.test.ts __tests__/unit/series/liquid.test.ts --quiet
./node_modules/.bin/prettier --check src/mark/liquid.ts __tests__/unit/mark/glyph-state.test.ts __tests__/unit/series/liquid.test.ts
```

预期全部通过。Glyph 套件同时覆盖 Ripple、BoxPlot、Sankey link、图元复用和渐进创建；Sankey 系列套件保护本 PR 原始修复。纯透明度路径的几何编码调用次数和 points 引用断言作为本次性能验收，不另建大规模基准。

- [x] **Step 6：补充变更说明，检查差异并形成单个修复提交。**

在现有 changes 文件的 `comment` 末尾追加以下中文句子，保留 `patch` 类型和其他原始内容：

```text
同时修复 Liquid 显式 fillOpacity 在初始渲染、配置更新及状态切换中未作用于子波浪的问题，并在退出状态时恢复普通样式或默认透明度。
```

在仓库根目录执行：

```sh
git diff --check
git diff --stat
git diff -- packages/vchart/src/mark/liquid.ts packages/vchart/__tests__/unit/mark/glyph-state.test.ts packages/vchart/__tests__/unit/series/liquid.test.ts common/changes/@visactor/vchart/fix-sankey-glyph-state-20260915.json
git add packages/vchart/src/mark/liquid.ts packages/vchart/__tests__/unit/mark/glyph-state.test.ts packages/vchart/__tests__/unit/series/liquid.test.ts common/changes/@visactor/vchart/fix-sankey-glyph-state-20260915.json
git add docs/superpowers/plans/2026-09-17-liquid-fill-opacity-regression.md
git commit -m "fix(liquid): preserve explicit fill opacity on glyph waves"
```

交付时列出实际测试结果及提交号；push、回复 review 和 resolve review 不包含在本次规划范围内。

## 完成标准

- 显式 0、0.4、1 在初始配置和配置更新中分别得到三个相同的子波浪透明度。
- hover 的透明度覆盖生效，退出后恢复普通样式；未配置普通样式时恢复三个默认值。
- 透明度更新和状态切换不触发位置编码，保留已有 points 引用。
- 相关 Glyph、Liquid、Sankey 测试和定向静态检查通过。
- 运行时代码仅修改 Liquid 通道定义，变更记录准确描述修复行为。

## 计划自查

- 已将 review 的三个失败入口映射到具体测试。
- 已明确显式覆盖、未配置默认值、状态恢复和性能约束。
- 已复用现有编码和恢复接口；无新增公共接口、依赖或通用兜底。
- 已按单个修复单元执行，未调整依赖或扩大运行时代码范围。

## 执行结果（2026-09-17）

- 修改运行时代码前，新增的 2 项图元用例和 6 项真实图表用例均在子波浪透明度断言处失败，收到默认值 `[1, 0.66, 0.33]`；无初始化或导入错误。
- 修复后 3 个测试套件、25 项测试全部通过：Glyph 13 项、Liquid 7 项、Sankey 5 项。
- 已验证显式 0、0.4、1 的初始渲染和配置更新，以及 hover 退出后恢复普通样式或默认值。
- 图元级用例验证了透明度更新和状态切换期间 `_positionEncoder` 调用为 0，子波浪 points 引用保持不变。
- `tsc --noEmit`、定向 ESLint、Prettier 和 `git diff --check` 均通过；Prettier 仅将测试中的链式 getter 换行。
- 运行时代码仅在 `LiquidMark` 中增加 8 行通道编码，复用既有撤销与恢复逻辑。
- 本轮未 push，未回复或 resolve 远端 review。
