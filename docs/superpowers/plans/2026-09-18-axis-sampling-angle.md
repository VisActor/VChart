# 坐标轴采样角度单位最小修复计划

**目标：** 修复旋转轴标签被过度采样的问题，使采样与绘制都使用由 spec 度数转换得到的弧度。

**方案：** 在 `AxisComponent._tickTransformOption()` 中复用已有 `transformToGraphic`。该函数已在同一文件的绘制路径使用；直角坐标轴、极坐标轴及更新时的采样参数均经过这个公共入口。

**技术栈：** TypeScript、VChart、VRender、现有 Jest/Electron 测试环境。

**执行方式：** 单一修复任务，按“回归测试失败 → 一行修复 → 验证通过”顺序执行。已完成下面的修复与验证，结果见文末。

## 依据与取舍

- [原始 case](https://bugserver.cn.goofy.app/case?product=chartspace4&fileid=646745e9cb5fa8011f4e0344) 的底部标签设置 `angle: 90`，采样默认开启。
- 当前绘制路径收到 `Math.PI / 2`，采样路径收到 `90`；VRender 的包围盒旋转使用弧度，导致采样高估横向占用空间。
- `transformToGraphic` 以前原地修改 style；`c9e1657ac` 改为返回新对象后，采样路径漏转换的问题暴露。应保留不修改原始 style 的正确行为。
- 选择公共入口转换：一处改动，统一 VChart 到 VRender 的单位契约。只在 band 轴转换会留下同类问题；在 VRender 内转换会破坏其弧度契约。

## 约束

- 用户 spec 的角度继续使用度数，转换不修改原对象。
- 复用标准工具；不新增转换函数、缓存、兼容判断或逐标签处理。
- 仅在构建轴采样参数时转换。非零角度产生一次浅拷贝，不向每个图元的 render/update 路径增加工作。
- 保持采样算法、主题、字体、首尾标签规则和依赖版本不变。
- 本次覆盖对象形式的 `label.style.angle`，不扩展样式回调的采样能力。
- 工作区已有 pictogram 修改属于其他任务，提交时只暂存本任务文件。

## 任务：统一采样单位并锁定有效用法

**文件：**

- 修改 `packages/vchart/src/component/axis/base-axis.ts`：转换传给采样器的样式。
- 新增 `packages/vchart/__tests__/unit/component/cartesian/axis/sampling-angle.test.ts`：验证真实图表采样结果与更新行为。
- 新增 `common/changes/@visactor/vchart/fix-axis-sampling-angle_2026-09-18.json`：中文 patch 说明。

### 1. 添加能复现问题的行为测试

- [x] 使用固定画布、80 个分类、固定字号和关闭自动旋转的配置。比较短标签和长标签在正负 90° 下的采样索引，应一致；0° 为对照，长标签应采样得更稀疏。随后更新回原角度，采样应恢复，原 spec 和轴内部 spec 的角度始终保持度数。

测试文件内容：

```ts
import VChart from '../../../../../src';
import type { CartesianBandAxis, ILineChartSpec } from '../../../../../src';
import { createCanvas, removeDom } from '../../../../util/dom';

const createSpec = (prefix: string, angle: number): ILineChartSpec => ({
  type: 'line',
  width: 500,
  height: 400,
  animation: false,
  data: { values: Array.from({ length: 80 }, (_, i) => ({ x: `${prefix}${i}`, y: 10 + (i % 3) })) },
  xField: 'x',
  yField: 'y',
  axes: [
    { orient: 'left', visible: false },
    {
      id: 'x-axis',
      orient: 'bottom',
      type: 'band',
      sampling: true,
      label: {
        autoRotate: false,
        autoHide: false,
        lastVisible: true,
        style: { angle, fontSize: 14, fontFamily: 'monospace' }
      }
    }
  ]
});

describe('axis sampling angle', () => {
  let canvas: HTMLCanvasElement;
  let chart: VChart;

  beforeEach(() => {
    canvas = createCanvas();
    canvas.width = 500;
    canvas.height = 400;
  });

  afterEach(() => {
    chart?.release();
    removeDom(canvas);
  });

  const getAxis = () => chart.getComponents().find(c => c.userId === 'x-axis') as CartesianBandAxis;
  const getIndices = () => {
    const axis = getAxis();
    const domain = axis.getScale().domain();
    return axis
      .getTickData()
      .getLatestData()
      .map((tick: { value: string }) => domain.indexOf(tick.value));
  };

  it.each([90, -90])('samples vertical labels consistently at %s degrees', angle => {
    const shortSpec = createSpec('A', angle);
    chart = new VChart(shortSpec, { renderCanvas: canvas, animation: false });
    chart.renderSync();
    const expectedIndices = getIndices();

    const longSpec = createSpec('这是一段较长的标签', angle);
    chart.updateSpecSync(longSpec);
    expect(getIndices()).toEqual(expectedIndices);
    expect(expectedIndices[expectedIndices.length - 1]).toBe(79);

    chart.updateSpecSync(createSpec('这是一段较长的标签', 0));
    expect(getIndices().length).toBeLessThan(expectedIndices.length);

    chart.updateSpecSync(longSpec);
    expect(getIndices()).toEqual(expectedIndices);
    expect((getAxis().getSpec().label.style as { angle: number }).angle).toBe(angle);
    expect((shortSpec.axes[1].label.style as { angle: number }).angle).toBe(angle);
    expect((longSpec.axes[1].label.style as { angle: number }).angle).toBe(angle);
  });
});
```

- [x] 在 `packages/vchart` 执行，确认旧实现失败在长短标签采样索引一致性的断言，而非初始化、编译或测试环境错误：

```sh
./node_modules/.bin/jest __tests__/unit/component/cartesian/axis/sampling-angle.test.ts --runInBand
```

### 2. 实施一行生产代码修复

- [x] 修改 `AxisComponent._tickTransformOption()` 的返回值；文件已导入 `transformToGraphic`，无需新增依赖或导入：

```diff
-      labelStyle,
+      labelStyle: transformToGraphic(labelStyle),
```

### 3. 验证与交付

- [x] 在 `packages/vchart` 运行相关轴测试和更新测试，再做类型与定向 lint 检查：

```sh
./node_modules/.bin/jest __tests__/unit/component/cartesian/axis __tests__/unit/component/polar/axis __tests__/unit/core/update-spec.test.ts --runInBand
./node_modules/.bin/tsc --noEmit --project tsconfig.json
./node_modules/.bin/eslint src/component/axis/base-axis.ts __tests__/unit/component/cartesian/axis/sampling-angle.test.ts --quiet
```

- [x] 使用本次源码构建复验原 BugServer case，保留其 spec、字体、尺寸与数据。确认底部采样密度恢复合理、绘制角度仍为 90°，曲线和其他无关元素保持一致。不同字体环境下不以旧截图的精确标签数量作为唯一验收标准。
- [x] 新增以下 patch 变更记录，运行 `git diff --check`，检查差异范围：

```json
{
  "changes": [
    {
      "packageName": "@visactor/vchart",
      "comment": "修复坐标轴旋转标签的采样角度单位与绘制不一致，导致标签过度抽样的问题。",
      "type": "patch"
    }
  ],
  "packageName": "@visactor/vchart"
}
```

验收通过后可将本任务的源文件、测试和变更记录作为一个提交，建议标题：`fix(axis): normalize label angles before tick sampling`。修复成本与轴采样参数构建次数相关，不随图元数量新增逐项处理，因此无需为这一行转换单独增加 10k 图元性能基准。

## 执行结果（2026-09-18）

- 旧代码下，正负 90° 两个用例均失败在长短标签采样索引一致性的断言：短标签约每 5 项采样，长标签约每 15 项采样。确认是有效用法的行为回归。
- 应用一行修复后，计划中的 8 个 Jest 测试套件、77 个测试全部通过；TypeScript、定向 ESLint 和 `git diff --check` 通过。
- 使用修改前后源码分别构建浏览器 bundle，原 case 的本地对照中：底部采样角度从 `90` 修正为 `Math.PI / 2`，标签数由 10 个变为 21 个；两侧绘制角度均为 `Math.PI / 2`，轴范围均为 `[0, 324]`，输入和内部 spec 仍为 `90`。
- 其余四条轴的刻度数据、位置、尺寸、scale range 均一致。浏览器已检查实际图表。此次为本地源码验收，未运行远端 Bug Server 全量回归或更新标准图。
- 本地字体环境与截图服务器存在差异，因此上述 21 个标签只作为本地对照结果，不承诺与旧标准图逐像素一致。
- 已新增中文 patch 记录。生产代码仅修改 `base-axis.ts` 的采样样式传递，未改动其他任务的代码。

- 创建 PR 前，分支基于最新 `origin/develop`（`a6c1e7f48`），重新运行新增回归测试，2 个用例均通过。

## 历史提交与作者

Git 记录的作者与提交者均为 **kkxxkk2019**（`just_star@qq.com`），提交标题均为 `fix: fix the origin angle be modified`：

- [e1f1e64e0](https://github.com/VisActor/VChart/commit/e1f1e64e041ab1d2087d2cdb3f42e51f23c23ad2)：2025-08-15 14:32:23 +0800。
- [c9e1657ac](https://github.com/VisActor/VChart/commit/c9e1657acb9e5eeca16896e9e7fa76659951b848)：2025-08-29 15:49:10 +0800。

两个提交包含同一处角度处理变更：由原地修改 `style.angle` 改为返回带弧度的新对象。该变更保留了原始 spec，但使依赖原地修改副作用的采样路径开始接收到未转换的度数；本次在采样边界补齐转换，保留原变更。
