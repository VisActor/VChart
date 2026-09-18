{{ target: chart-storyline }}

# storylineChart

叙事图，使用图片、标题和正文展示一系列有顺序的节点，支持 `landscape`（横向布局）、`portrait`（纵向布局）、`clock`（时钟布局）、`arc`（弧形布局）和 `wing`（翼形布局）。

使用前需要安装与 `@visactor/vchart` 版本一致的扩展包并注册图表：

```ts
import VChart from '@visactor/vchart';
import { registerStorylineChart } from '@visactor/vchart-extension';

registerStorylineChart();
const vchart = new VChart(
  {
    type: 'storyline',
    width: 1000,
    height: 560,
    layout: 'landscape',
    data: [
      { id: 'discover', title: '发现需求', content: '访谈用户，明确目标。' },
      { id: 'launch', title: '发布产品', content: '上线产品，收集反馈。' }
    ]
  },
  { dom: 'chart' }
);
vchart.renderSync();
```

`data` 直接传入节点数组，`title` 表示节点标题图元配置。无需配置 `series`、`xField`、`yField` 或坐标轴。

详细用法见[叙事图教程](/vchart/guide/tutorial_docs/Chart_Extensions/storyline)。示例：[`landscape`（横向布局）](/vchart/demo/extension-chart/storyline-landscape)、[`portrait`（纵向布局）](/vchart/demo/extension-chart/storyline-portrait)、[`clock`（时钟布局）](/vchart/demo/extension-chart/storyline-clock)、[`arc`（弧形布局）](/vchart/demo/extension-chart/storyline-arc)、[`wing`（翼形布局）](/vchart/demo/extension-chart/storyline-wing)。

## type(string) = 'storyline'

图表类型，必填，固定为 `'storyline'`。使用前调用 `registerStorylineChart()`。当前支持的布局为 `landscape`（横向布局）、`portrait`（纵向布局）、`clock`（时钟布局）、`arc`（弧形布局）、`wing`（翼形布局），配置示例见[叙事图教程](/vchart/guide/tutorial_docs/Chart_Extensions/storyline)。

## width(number)

图表宽度，单位为像素。`clock`（时钟布局）需要为轨道两侧的文字预留足够宽度。

## height(number)

图表高度，单位为像素。`portrait`（纵向布局）会根据可用高度分配节点槽位，显式配置有助于为最后一个节点的正文预留空间。

## autoFit(boolean) = true

是否自适应容器尺寸。显式配置的 `width`、`height` 优先于容器尺寸。

## background(string|Object)

图表背景。

{{ use: background }}

## padding(number|Array|Object)

图表外边距，单位为像素。支持统一数值、`[top, right, bottom, left]` 或 `{ top, right, bottom, left }`。

未配置时，各布局的基础默认值如下：

| 布局                         | 默认外边距（上、右、下、左）             |
| ---------------------------- | ---------------------------------------- |
| `landscape`（横向布局）      | `[20, 20, 100, 20]`                      |
| `portrait`（纵向布局）       | `[20, 20, 自动计算, 20]`，底部至少 `100` |
| `clock`（时钟布局）          | `[40, 40, 60, 40]`                       |
| `arc`（弧形布局） / `up`     | `[280, h, 100, h]`                       |
| `arc`（弧形布局） / `down`   | `[0, h, 280, h]`                         |
| `wing`（翼形布局） / `left`  | `[40, 20, 100, 20]`                      |
| `wing`（翼形布局） / `right` | `[100, 20, 40, 20]`                      |

其中 `h = Math.round(width / (Math.max(data.length, 1) + 1))`；未指定图表宽度时 `h = 20`。`portrait`（纵向布局）的底部留白根据画布高度、节点数量、图片高度和标题行高计算。

`landscape`（横向布局）、`portrait`（纵向布局）、`clock`（时钟布局）和 `wing`（翼形布局）配置可见的 `titleImage` 时，顶部留白还会取图片所需空间与配置值中的较大值。`arc`（弧形布局）通过自己的主题图几何安排空间。

### top(number)

顶部留白。`landscape`（横向布局）、`portrait`（纵向布局）、`clock`（时钟布局）和 `wing`（翼形布局）配置可见的主题图片时，会保证顶部留白不小于图片预留空间。

### right(number)

右侧留白。

### bottom(number)

底部留白。

### left(number)

左侧留白。

## data(Array)

必填的节点数组，按照数组顺序排列，不会自动根据时间排序，也不通过时间比例尺计算间距。不要使用普通图表的 `{ id, values }` 数据集包装。

```ts
data: [
  {
    id: 'launch',
    title: '发布产品',
    content: ['上线首个版本。', '收集使用反馈。'],
    marker: '2024',
    image: 'https://example.com/launch.png' // 替换为自己的图片地址
  }
];
```

### id(string|number)

可选的节点唯一标识，省略时使用数据索引。

### title(string)

节点标题。文字样式通过顶层 `title.style` 配置，省略或传入空字符串时不创建标题。

### content(string|Array)

节点正文，可以是字符串或字符串数组。数组中的段落通过换行连接。省略或传入空数组时不创建正文。

### image(string|HTMLImageElement|HTMLCanvasElement)

节点主图，支持图片 URL、data URL、图片元素或画布元素。省略时，`landscape`（横向布局）、`portrait`（纵向布局）不创建主图；`clock`（时钟布局）、`arc`（弧形布局）和 `wing`（翼形布局）会绘制占位图形。占位图形不受 `image.visible` 或 `image.showBackground` 控制。

### subImage(string|HTMLImageElement|HTMLCanvasElement)

`portrait`（纵向布局）中的错位装饰图，绘制在主图后方。省略时不绘制，不受 `image.showBackground` 控制。其他四种布局不使用此字段。

### marker(string)

仅 `portrait`（纵向布局）生效的时间标记，例如 `'2024'`。各字符在中轴上纵向排列，字号和显隐通过顶层 `marker` 配置。

### datum(any)

保留在节点中的原始业务数据，不参与布局或文本生成。

## layout(string|Object) = 'landscape'

对应 `IStorylineSpec.layout`，类型为 `StorylineLayoutType | IStorylineLayoutOptions`。省略时使用 `'landscape'`（横向布局）；字符串形式只选择布局，对象形式用于同时配置方向、角度、半径或内部留白。对象中的 `type` 必填，其余字段可选。

类型定义来自扩展包 `src/charts/storyline/interface.ts`：

```ts
export type StorylineLayoutType = 'clock' | 'arc' | 'wing' | 'landscape' | 'portrait';
export type StorylineWingDirection = 'left' | 'right';
export type StorylineArcDirection = 'up' | 'down';
export interface IStorylineLayoutOptions {
  type: StorylineLayoutType;
  padding?: number | [number, number, number, number];
  radiusRatio?: number;
  startAngle?: number;
  endAngle?: number;
  direction?: StorylineWingDirection | StorylineArcDirection;
}
```

当前五种布局的参数适用范围：

| type                    | 节点排列                           | 生效的 layout 参数                                   |
| ----------------------- | ---------------------------------- | ---------------------------------------------------- |
| `landscape`（横向布局） | 横向图片序列，文字上下交替         | `padding`                                            |
| `portrait`（纵向布局）  | 沿中轴左右交替，支持时间标记       | `padding`                                            |
| `clock`（时钟布局）     | 按数组顺序沿圆形轨道顺时针等角排列 | 使用自动几何，其余 layout 字段不参与计算             |
| `arc`（弧形布局）       | 穹顶或碗形弧线                     | `direction`、`radiusRatio`、`startAngle`、`endAngle` |
| `wing`（翼形布局）      | 左侧或右侧锚定的翼形弧线           | `direction`、`radiusRatio`、`startAngle`、`endAngle` |

```ts
import type { IStorylineSpec } from '@visactor/vchart-extension';

const simpleLayout: IStorylineSpec['layout'] = 'portrait';
const arcLayout: IStorylineSpec['layout'] = {
  type: 'arc',
  direction: 'down',
  radiusRatio: 0.88,
  startAngle: 20,
  endAngle: 160
};
```

`direction` 的类型是四个方向的联合，但有效值与布局相关：`arc`（弧形布局）使用 `up/down`，`wing`（翼形布局）使用 `left/right`。各字段的运行时适用范围以本页表格为准。

### type(string)

使用对象形式时必填。可选值为 `'landscape'`（横向布局）、`'portrait'`（纵向布局）、`'clock'`（时钟布局）、`'arc'`（弧形布局）、`'wing'`（翼形布局）。

### padding(number|Array)

类型为 `number | [number, number, number, number]`，单位为像素。数值表示四边相同；数组必须按 `[top, right, bottom, left]` 给出。`landscape`（横向布局）、`portrait`（纵向布局）读取此参数来计算节点可用区域。

优先级为 `layout.padding` → `block.padding` → `24`，显式的 `0` 会被保留。它位于顶层 `padding` 划定的绘图区内部，两层留白会分别参与计算，不会互相覆盖。`clock`（时钟布局）、`arc`（弧形布局）和 `wing`（翼形布局）的专用几何不读取此字段。

### radiusRatio(number)

`arc`（弧形布局）和 `wing`（翼形布局）的半径比例。`arc`（弧形布局）默认为 `0.88`，用于水平半径；垂直半径由主题图片高度与起始角度计算。`wing`（翼形布局）默认为 `0.92`，用于水平、垂直两个半径。`clock`（时钟布局）自动计算轨道半径，不使用此参数。

这是无单位的缩放系数，例如 `0.88` 表示按该布局计算的基准半径再乘以 `0.88`，并不表示图片宽度。类型只约束为 `number`，实现没有统一限制到 `[0, 1]`；增大比例可能让内容超出可用区域。

### startAngle(number)

`arc`（弧形布局）或 `wing`（翼形布局）的起始角度，单位为度。

- `arc`（弧形布局）：`up` 默认为 `200`，`down` 默认为 `20`。
- `wing`（翼形布局）：`left` 默认为 `-70`，`right` 默认为 `110`。

`clock`（时钟布局）当前不使用此参数。

使用屏幕坐标角度：`0°` 朝右，`90°` 朝下，`180°` 朝左，`270°` 朝上。`arc`（弧形布局）、`wing`（翼形布局）按起始角到结束角的差值排列节点。

### endAngle(number)

`arc`（弧形布局）或 `wing`（翼形布局）的结束角度，单位为度。

- `arc`（弧形布局）：`up` 默认为 `340`，`down` 默认为 `160`。
- `wing`（翼形布局）：`left` 默认为 `70`，`right` 默认为 `250`。

`clock`（时钟布局）当前不使用此参数。

与 `startAngle` 一起决定节点覆盖的弧段；两个及以上节点按数组顺序在该角度区间内插值，单节点取中间角度。

### direction(string)

`arc`（弧形布局）或 `wing`（翼形布局）的方向，其他布局不使用此参数。

- `arc`（弧形布局）：`'up'`（默认）为穹顶，主题图位于底部；`'down'` 为碗形，主题图位于顶部。
- `wing`（翼形布局）：`'left'`（默认）或 `'right'`，控制圆心的锚定方向。

## themeColor(string) = '#e8543d'

主轴、连线、图片背景和强调元素的默认主题色。图元的显式样式配置优先。

## block(Object)

节点尺寸与内部留白配置。`landscape`（横向布局）、`portrait`（纵向布局）使用节点盒子；`arc`（弧形布局）使用宽度参数计算水平几何和文本宽度。`clock`（时钟布局）、`wing`（翼形布局）使用各自的几何。

接口中的 `block.gap`、`block.showBackground` 仅供通用备用布局使用，当前五种公开布局不使用它们。图片背景通过 `image.showBackground` 控制。

### width(number)

`landscape`（横向布局）、`portrait`（纵向布局）的节点固定宽度，优先于自适应宽度配置。`arc`（弧形布局）中还作为文本宽度上限，空间不足时会继续收缩。`clock`（时钟布局）和 `wing`（翼形布局）自动计算节点几何。

### widthRatio(number) = 0.24

自适应节点宽度与可用视图宽度的比例，受 `minWidth`、`maxWidth` 限制。`portrait`（纵向布局）使用此配置，`arc`（弧形布局）也将其用于弧线的水平空间计算。`landscape`（横向布局）未配置 `width` 时按节点数量计算宽度。

### minWidth(number) = 180

自适应节点宽度下限。配置了 `width` 时不生效，适用布局同 `widthRatio`。

### maxWidth(number)

自适应节点宽度上限，默认是 `Math.max(minWidth, 320)`。配置了 `width` 时不生效，适用布局同 `widthRatio`。

### height(number)

`landscape`（横向布局）、`portrait`（纵向布局）的节点基准高度。`landscape`（横向布局）默认 `320`。`portrait`（纵向布局）未配置时，使用 `Math.max(120, Math.floor(内部可用高度 / (data.length + 1)))`；实际图片高度默认取该值的 `0.6` 倍，正文区域高度至少取该值的 `1.25` 倍或三行正文的高度。

`clock`（时钟布局）、`arc`（弧形布局）和 `wing`（翼形布局）不使用此参数控制节点高度。

### padding(number|Array)

内部留白，支持统一数值或 `[top, right, bottom, left]`。`landscape`（横向布局）、`portrait`（纵向布局）的节点位置计算中，作为 `layout.padding` 的回退值，默认 `24`；`clock`（时钟布局）也使用它计算轨道和文本区域，默认 `24`。

`landscape`（横向布局）还将此值用于图片宽度计算和图片最小高度计算，其中图片最小高度计算的局部默认值为 `12`。`arc`（弧形布局）、`wing`（翼形布局）的专用节点几何不使用此参数。

### style(Object)

矩形背景样式。当前 `landscape`（横向布局）、`portrait`（纵向布局）会将其合并到图片背景上，需要同时开启 `image.showBackground`。例如 `{ fill: '#fff', stroke: '#3b82a0', lineWidth: 2 }`。

{{ use: graphic-rect(prefix = '###') }}

## title(Object)

每个节点的标题图元配置，文字来自 `data[].title`，默认最多显示两行。这里不是普通图表的标题组件，不使用顶层 `title.text` 或 `title.subtext`。

### visible(boolean) = true

是否显示节点标题。

### style(Object)

标题文字样式，例如 `{ fontSize: 20, lineHeight: 27, fontWeight: 'bold', fill: '#23364d' }`。`fontSize`、`lineHeight` 使用数值。

未指定字号时，`landscape`（横向布局）、`portrait`（纵向布局）自适应范围为 `8–34`，`clock`（时钟布局）为 `8–30`，`arc`（弧形布局）为 `10–40`；`wing`（翼形布局）按文本测量结果在 `14–30` 内调整。显式设置 `fontSize` 优先。默认行高为字号乘以布局比例后四舍五入：`landscape`（横向布局）、`portrait`（纵向布局）、`arc`（弧形布局）为 `1.35`，`clock`（时钟布局）为 `1.28`，`wing`（翼形布局）为 `1.3`。

标题默认加粗，带白色描边；`landscape`（横向布局）、`portrait`（纵向布局）、`arc`（弧形布局）使用深色填充，`clock`（时钟布局）、`wing`（翼形布局）使用主题色。位置、对齐和默认两行限制由布局设置，显式样式会覆盖图元属性。

{{ use: storyline-text-style(prefix = '###') }}

## content(Object)

节点正文图元配置，文字来自 `data[].content`。当前五种布局将段落连接为带换行的文本，可用宽高由布局决定。

### visible(boolean) = true

是否显示正文。

### style(Object)

正文文字样式，例如 `{ fontSize: 14, lineHeight: 21, fill: '#526174' }`。字号和行高使用数值。

默认字号 / 行高：`landscape`（横向布局）、`portrait`（纵向布局）为 `16 / 23`，`clock`（时钟布局）为 `14 / 20`，`wing`（翼形布局）为 `12 / 17`；`arc`（弧形布局）根据节点数量和可用空间缩放，以 `18 / 24` 为基准。`clock`（时钟布局）的默认正文高度固定为 `80`，调整行高不会同步增大文本区域。

`landscape`（横向布局）、`portrait`（纵向布局）、`arc`（弧形布局）默认使用 `heightLimit` 和省略号处理超出区域的正文；`wing`（翼形布局）允许长正文继续延伸，可能超出画布。可通过 `heightLimit`、`ellipsis` 调整文本显示，布局的节点间距不会随之自动增大。

{{ use: storyline-text-style(prefix = '###') }}

## image(Object)

对应 `IStorylineSpec.image`，类型为 `IStorylineImageSpec`，用于统一配置所有节点的主图片。每个节点的资源分别放在 `data[i].image` 中，主图配置对象本身没有顶层 `image` 资源字段。

```ts
import type { IMarkSpec, IImageMarkSpec } from '@visactor/vchart';

export type StorylineImagePosition = 'top' | 'left' | 'right' | 'bottom';
export interface IStorylineImageSpec extends IMarkSpec<IImageMarkSpec> {
  width?: number;
  height?: number;
  position?: StorylineImagePosition;
  gap?: number;
  showBackground?: boolean;
}
```

该接口继承 `IMarkSpec<IImageMarkSpec>`：`visible`、`interactive`、`zIndex`、`style`、`state` 等来自通用图元配置，其中 `style` 的准确类型为 `ConvertToMarkStyleSpec<IImageMarkSpec>`。样式属性支持静态值和图元样式表达式；参与 Storyline 布局计算的顶层 `width`、`height` 则是像素数值。

各层配置的职责：

| 配置位置               | 作用                                                                  |
| ---------------------- | --------------------------------------------------------------------- |
| `data[i].image`        | 第 i 个节点的图片 URL、data URL、图片元素或画布元素                   |
| `image.width/height`   | 参与对应布局的节点图片尺寸计算                                        |
| `image.visible`        | 控制已创建的主图片图元显隐                                            |
| `image.showBackground` | 控制布局单独创建的背景装饰                                            |
| `image.style`          | 主图片的绘制属性，最后合并到布局计算的默认样式上                      |
| `data[i].subImage`     | `portrait`（纵向布局）中独立的错位装饰图，不继承 `image` 的样式和显隐 |

类型仍声明 `position`（`top/left/right/bottom`）和 `gap`（像素间距），它们用于通用备用节点布局；当前五种公开布局自行安排图片与文字，不使用这两个参数。

下面用 `portrait`（纵向布局）同时设置布局尺寸与图片裁切方式：

```ts
import type { IStorylineSpec } from '@visactor/vchart-extension';

const spec: IStorylineSpec = {
  type: 'storyline',
  width: 1080,
  height: 1920,
  layout: 'portrait',
  image: {
    width: 220,
    height: 140,
    visible: true,
    showBackground: true,
    style: { imageMode: 'cover', imagePosition: 'center', cornerRadius: 12 }
  },
  data: [
    {
      title: '1930',
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-1930.png',
      subImage: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/node-world-cup-2022.png'
    }
  ]
};
```

省略整个 `image` 配置时，只要节点提供 `data[i].image` 就会使用默认样式绘制主图。缺少图片资源时的占位行为见 `data.image`。

### visible(boolean) = true

是否显示由 `data[].image` 创建的图片图元。不控制图片背景、缺少图片时的占位图形或 `data[].subImage`，也不会移除图片原有的布局空间。

### interactive(boolean) = false

继承自 `IMarkSpec`。是否允许主图片图元响应交互；需要图片参与鼠标事件时设为 `true`。不会同步开启独立背景或 `subImage` 的交互。

### zIndex(number)

继承自 `IMarkSpec`。覆盖图片图元的绘制层级；默认由具体布局决定。节点内图元仍受所属 group 的绘制层级约束。

### state(Object)

继承自 `IMarkSpec<IImageMarkSpec>` 的状态样式，支持 `normal`、`hover`、`hover_reverse`、`selected`、`selected_reverse` 及自定义状态名。状态值可以直接写图片样式，也可以使用包含 `style` 的完整状态配置。

需要通过鼠标触发状态时同时开启 `image.interactive`；只配置状态不会改变 Storyline 的节点布局。

### width(number)

`portrait`（纵向布局）默认 `Math.max(blockWidth, 80)`。`wing`（翼形布局）以 `160` 为默认基准宽度，并沿主线进一步缩放。

`arc`（弧形布局）将 `Math.max(image.width ?? 240, image.height ?? 240)` 作为基准直径，再按可用空间缩放为正方形图片区域。因此只将一个维度设为小于 `240` 的值不会降低基准直径。

`landscape`（横向布局）和 `clock`（时钟布局）自动计算图片宽度，不使用此字段。

### height(number)

`landscape`（横向布局）默认以节点高度的 `0.42` 倍作为图片高度，再结合标题行高、内部留白及画布空间调整；`portrait`（纵向布局）默认 `Math.round(blockHeight * 0.6)`。`wing`（翼形布局）以 `160` 为默认基准高度，并沿主线进一步缩放。

`arc`（弧形布局）与 `image.width` 一起决定基准直径，详见 `image.width`。`clock`（时钟布局）自动计算图片高度，不使用此字段。

### showBackground(boolean)

是否显示图片背景装饰。`landscape`（横向布局）、`portrait`（纵向布局）默认为 `false`，`clock`（时钟布局）、`arc`（弧形布局）、`wing`（翼形布局）默认为 `true`。

该开关不控制主图、`subImage` 或缺少主图时的占位图形。需要主图隐藏时使用 `image.visible`。

### style(Object)

类型来自 `IMarkSpec<IImageMarkSpec>['style']`。先根据布局计算图元默认位置、尺寸和资源，再将本对象合并，显式样式优先。

| style 字段                    | 默认值 / 作用                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `imageMode`                   | `contain`：完整包含；可选 `cover`（铺满并裁切）、`fill`（拉伸）、`auto`（原始尺寸） |
| `imagePosition`               | `center`；也支持方位关键字、组合方位和 `[x, y]` 元组，如 `['25%', '75%']`           |
| `repeatX / repeatY`           | `no-repeat`；可选 `repeat`、`stretch`                                               |
| `imageScale`                  | 额外缩放图片内容，不改变布局尺寸                                                    |
| `imageOffsetX / imageOffsetY` | 图片内容的像素偏移，不改变节点位置                                                  |
| `opacity`                     | 整个图元透明度，范围 `0–1`                                                          |

`imageMode`、`imagePosition`、`imageScale` 与图片内容偏移用于非重复平铺模式，保持 `repeatX`、`repeatY` 为 `no-repeat` 时使用。

修改 `image.width/height` 会参与适用布局的尺寸计算；修改 `image.style.width/height` 只改变主图绘制盒，背景、引导线和文本仍按原布局计算。`image.style.image` 也仅覆盖已创建的主图，无法替代节点的 `data[i].image` 来触发主图创建。

{{ use: graphic-image(prefix = '###') }}

#### cornerRadius(number|Array)

`landscape`（横向布局）、`portrait`（纵向布局）的主图默认不额外设置圆角；`clock`（时钟布局）、`arc`（弧形布局）、`wing`（翼形布局）的主图默认按半径做圆形裁切。可传统一数值或四项数组 `[左上, 右上, 右下, 左下]`，单位为像素。只控制图片图元的圆角；图片背景装饰单独计算。

## titleImage(Object)

对应 `IStorylineSpec.titleImage`，类型为 `IStorylineTitleImageSpec`。这是整张图共用的主题图片，资源放在 `titleImage.image`；它与节点主图 `data[i].image`、节点装饰图 `data[i].subImage` 分别配置。

```ts
import type { IMarkSpec, IImageMarkSpec } from '@visactor/vchart';

export interface IStorylineTitleImageSpec extends IMarkSpec<IImageMarkSpec> {
  width?: number;
  height?: number;
  visible?: boolean;
  image?: string | HTMLImageElement | HTMLCanvasElement;
}
```

该接口的四个自有字段 `image`、`visible`、`width`、`height` 均可选；但要实际创建主题图片，必须提供有效的 `image`。该接口继承 `IMarkSpec<IImageMarkSpec>`：`visible`、`interactive`、`zIndex`、`style`、`state` 等来自通用图元配置，其中 `style` 的准确类型为 `ConvertToMarkStyleSpec<IImageMarkSpec>`。样式属性支持静态值和图元样式表达式；参与 Storyline 布局计算的顶层 `width`、`height` 则是像素数值。

| 布局                                                                   | 默认主题图位置                 | 默认尺寸计算使用的区域       |
| ---------------------------------------------------------------------- | ------------------------------ | ---------------------------- |
| `landscape`（横向布局） / `portrait`（纵向布局） / `clock`（时钟布局） | 画布顶部居中，距顶部 `12` 像素 | 整个画布                     |
| `arc`（弧形布局） / `up`                                               | 绘图区底部居中                 | 扣除图表 padding 后的 region |
| `arc`（弧形布局） / `down`                                             | 绘图区顶部居中                 | 扣除图表 padding 后的 region |
| `wing`（翼形布局） / `left`                                            | 画布顶部靠右，距顶部 `12` 像素 | 整个画布                     |
| `wing`（翼形布局） / `right`                                           | 画布顶部靠左，距顶部 `12` 像素 | 整个画布                     |

`clock`（时钟布局）使用顶部主题图。`width`、`height` 是布局盒的像素尺寸，默认值见子配置项；图片内容通过 `style.imageMode` 在盒内缩放，而不是根据资源原始宽高决定布局盒。

```ts
import type { IStorylineSpec } from '@visactor/vchart-extension';

const titleImage: IStorylineSpec['titleImage'] = {
  image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/title-world-cap.png',
  visible: true,
  width: 520,
  height: 180,
  style: { imageMode: 'contain', imagePosition: 'center', opacity: 0.9 }
};
```

### image(string|HTMLImageElement|HTMLCanvasElement)

图片资源类型为 `string | HTMLImageElement | HTMLCanvasElement`，可传图片 URL、data URL、已加载的图片元素或画布元素。

未配置时不创建主题图片。创建条件读取这里的资源，因此只设置 `titleImage.style.image` 无法创建主题图。已创建图元后，`style.image` 可以覆盖其绘制资源；常规用法应把资源统一放在本字段。

### visible(boolean) = true

是否创建主题图片，默认 `true`；没有 `titleImage.image` 时仍不会创建。设为 `false` 时，`landscape`（横向布局）、`portrait`（纵向布局）、`clock`（时钟布局）和 `wing`（翼形布局）不再为主题图追加顶部留白，布局的基础 padding 仍会保留。

`arc`（弧形布局）的半径和位置计算始终会使用主题图盒的尺寸，包括默认尺寸；隐藏主题图片不会自动收起这部分布局空间。

`titleImage.style.visible: false` 只隐藏已创建的图元，仍保留顶部预留空间；需要关闭主题图片时优先用本字段。

### interactive(boolean) = false

继承自 `IMarkSpec`。是否允许主题图片图元响应交互；需要图片参与鼠标事件时设为 `true`。不会同步开启独立背景或 `subImage` 的交互。

### zIndex(number)

继承自 `IMarkSpec`。覆盖图片图元的绘制层级；默认由具体布局决定。节点内图元仍受所属 group 的绘制层级约束。

### state(Object)

继承自 `IMarkSpec<IImageMarkSpec>` 的状态样式，支持 `normal`、`hover`、`hover_reverse`、`selected`、`selected_reverse` 及自定义状态名。状态值可以直接写图片样式，也可以使用包含 `style` 的完整状态配置。

需要通过鼠标触发状态时同时开启 `titleImage.interactive`；只配置状态不会改变 Storyline 的节点布局。

### width(number)

主题图片宽度。`landscape`（横向布局）、`portrait`（纵向布局）、`clock`（时钟布局）默认取画布宽度的 `0.52` 倍，上限 `720`；`wing`（翼形布局）默认取画布宽度的 `0.6` 倍，上限 `820`；`arc`（弧形布局）默认取 region 宽度的 `0.68` 倍，上限 `900`。

显式宽度覆盖上述默认值，`arc`（弧形布局）最终宽度至少 `80`，其余布局至少 `1`。

### height(number)

主题图片高度。`landscape`（横向布局）、`portrait`（纵向布局）、`clock`（时钟布局）、`wing`（翼形布局）默认取主题图片宽度的 `0.36` 倍，且不超过画布高度；`arc`（弧形布局）默认取宽度的 `0.34` 倍。

显式高度覆盖上述默认值，`arc`（弧形布局）最终高度至少 `40`，其余布局至少 `1`。

### style(Object)

类型来自 `IMarkSpec<IImageMarkSpec>['style']`。先根据布局计算图元默认位置、尺寸和资源，再将本对象合并，显式样式优先。

| style 字段                    | 默认值 / 作用                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `imageMode`                   | `contain`：完整包含；可选 `cover`（铺满并裁切）、`fill`（拉伸）、`auto`（原始尺寸） |
| `imagePosition`               | `center`；也支持方位关键字、组合方位和 `[x, y]` 元组，如 `['25%', '75%']`           |
| `repeatX / repeatY`           | `no-repeat`；可选 `repeat`、`stretch`                                               |
| `imageScale`                  | 额外缩放图片内容，不改变布局尺寸                                                    |
| `imageOffsetX / imageOffsetY` | 图片内容的像素偏移，不改变节点位置                                                  |
| `opacity`                     | 整个图元透明度，范围 `0–1`                                                          |

`imageMode`、`imagePosition`、`imageScale` 与图片内容偏移用于非重复平铺模式，保持 `repeatX`、`repeatY` 为 `no-repeat` 时使用。

修改 `titleImage.width/height` 会参与主题图布局和空间预留；修改 `titleImage.style.width/height`、`x/y`、`dx/dy` 只覆盖绘制属性，不会同步重新计算顶部留白或 `arc`（弧形布局）的几何参数。

{{ use: graphic-image(prefix = '###') }}

#### cornerRadius(number|Array)

主题图片默认不额外设置圆角。可传统一数值或四项数组 `[左上, 右上, 右下, 左下]`，单位为像素。只控制图片图元的圆角；图片背景装饰单独计算。

## line(Object)

布局主线或中轴配置。`landscape`（横向布局）、`portrait`（纵向布局）、`arc`（弧形布局）、`wing`（翼形布局）分别生成自己的曲线、中轴、弧线和主线；`clock`（时钟布局）使用固定轨道和引线。

接口中的 `line.type`、`line.showArrow`、`line.arrowSize`、`line.distance` 用于通用备用连线，当前五种公开布局的主线不使用这些字段。

### visible(boolean)

- `landscape`（横向布局）：默认显示，至少两个节点时绘制主曲线和节点圆点；设为 `false` 隐藏二者，但保留每个节点的文字引导线。
- `portrait`（纵向布局）：默认显示，至少两个节点时绘制中轴；设为 `false` 隐藏中轴及其时间标记。
- `arc`（弧形布局）：默认隐藏，显式设为 `true` 才显示主弧线；节点文字引导线独立显示。
- `wing`（翼形布局）：默认显示，设为 `false` 隐藏主线；节点文字引导线独立显示。
- `clock`（时钟布局）：不使用此参数，轨道与引线始终按布局内置规则绘制。

### style(Object)

`landscape`（横向布局）的曲线支持 `stroke`、`lineWidth` 和 `lineDash`；`portrait`（纵向布局）的中轴使用 `fill`、`stroke`、`lineWidth` 和 `cornerRadius`；`wing`（翼形布局）的主线使用 `fill` 或 `stroke` 作为填充色。`arc`（弧形布局）和 `clock`（时钟布局）不使用此配置，颜色由 `themeColor` 决定。

主线形状由布局生成，不通过 `style.path` 或 `style.points` 配置。

#### stroke(string|Object|boolean)

`landscape`（横向布局）的曲线或 `portrait`（纵向布局）的中轴描边。`wing`（翼形布局）未设置 `fill` 时，还会将 `stroke` 用作主线填充色。

#### fill(string|Object)

`portrait`（纵向布局）的中轴或 `wing`（翼形布局）的主线填充色。`portrait`（纵向布局）默认使用主题色渐变，`wing`（翼形布局）默认使用主题色。

#### lineWidth(number)

`landscape`（横向布局）的曲线线宽（默认 `4`）或 `portrait`（纵向布局）的中轴描边宽度（默认 `0`），单位为像素。`wing`（翼形布局）还将其作为主线末端宽度的回退配置。

#### lineDash(Array)

`landscape`（横向布局）的曲线虚线模式，默认 `[6, 5]`。该值也会用于 `landscape`（横向布局）的节点文字连接线。

#### cornerRadius(number|Array)

`portrait`（纵向布局）的中轴圆角，默认 `0`。

## marker(Object)

`portrait`（纵向布局）的时间标记配置，文字来自 `data[].marker`。标记在中轴上逐字纵向排列，其他布局不使用此配置。

### visible(boolean) = true

是否显示时间标记。中轴隐藏或节点没有 `marker` 值时，也不会绘制标记。

### style(Object)

时间标记样式，常用 `fontSize` 和 `lineHeight`，均设置为数值；省略时根据画布、标记长度和槽位空间自动计算。标记的默认字色是白色，单字符富文本样式由布局生成。

#### fontSize(number)

标记文字字号，单位为像素。未指定时根据画布、文本长度和中轴槽位计算，默认自适应范围为 `16–38`。

#### lineHeight(number)

纵向排列时每个字符的行高，默认 `Math.round(实际字号 * 0.9)`。

#### fontWeight(string|number) = 'bold'

标记文字字重。

#### shadowColor(string) = 'rgba(0, 0, 0, 0.3)'

文字阴影颜色。

#### shadowBlur(number) = 8

文字阴影模糊半径。

#### shadowOffsetX(number) = 0

文字阴影的水平偏移。

#### shadowOffsetY(number) = 5

文字阴影的垂直偏移。

{{ target: storyline-text-style }}

#${prefix} fontSize(number)

文字字号，单位为像素。

#${prefix} lineHeight(number)

文字行高，单位为像素。

#${prefix} fontFamily(string)

文字字体。

#${prefix} fontWeight(string|number)

文字字重，例如 `'normal'`、`'bold'` 或 `500`。

#${prefix} fill(string|Object)

文字填充色。

#${prefix} stroke(string|Object|boolean)

文字描边颜色，设置为 `false` 可关闭描边。

#${prefix} lineWidth(number)

文字描边宽度，单位为像素。

#${prefix} textAlign(string)

水平对齐方式，例如 `'left'`、`'center'`、`'right'`。默认由布局决定。

#${prefix} textBaseline(string)

垂直对齐基线，例如 `'top'`、`'middle'`、`'bottom'`。默认由布局决定。

#${prefix} maxLineWidth(number)

最大行宽。覆盖布局计算的行宽时，需为相邻节点预留足够空间。

#${prefix} opacity(number)

文字透明度，范围为 `0` 到 `1`。

#${prefix} dx(number)

相对布局位置的水平偏移，单位为像素。

#${prefix} dy(number)

相对布局位置的垂直偏移，单位为像素。

#${prefix} heightLimit(number)

文本绘制高度上限，单位为像素。只影响文字的显示范围，不改变布局中的节点间距。

#${prefix} lineClamp(number)

最多显示的文本行数。标题默认 `2`；修改时需要同时调整文本高度。

#${prefix} ellipsis(string|boolean)

文本超出限制时的省略标记，例如 `'...'`。

#${prefix} whiteSpace(string)

换行方式，布局默认 `'normal'`。

#${prefix} wordBreak(string)

单词换行方式，布局默认 `'break-word'`。
