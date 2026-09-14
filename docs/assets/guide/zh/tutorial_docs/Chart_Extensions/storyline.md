# 扩展图表：叙事图

叙事图（Storyline Chart）将图片、标题和正文组合成一系列节点，适合展示产品演进、项目里程碑和故事发展过程。节点按照 `data` 数组的顺序排列，不会根据日期排序，也不使用时间比例尺计算间距。

Storyline 由 `@visactor/vchart-extension` 提供，支持 `landscape`、`portrait`、`clock`、`arc` 和 `wing` 五种布局。

完整字段、默认值和各布局的适用范围见[叙事图配置项](/vchart/option/storylineChart)。

## 注册与使用

安装与 `@visactor/vchart` 版本一致的 `@visactor/vchart-extension`，并在创建图表前注册：

```js
import VChart from '@visactor/vchart';
import { registerStorylineChart } from '@visactor/vchart-extension';

registerStorylineChart();

const spec = {
  type: 'storyline',
  width: 1000,
  height: 560,
  layout: 'landscape',
  themeColor: '#3b82a0',
  title: { style: { fontSize: 20 } },
  content: { style: { fontSize: 14, lineHeight: 21 } },
  data: [
    { id: 'discover', title: '发现需求', content: '访谈用户，明确需要解决的问题。' },
    { id: 'design', title: '设计原型', content: ['梳理关键流程。', '通过原型收集反馈。'] },
    { id: 'launch', title: '发布产品', content: '上线首个版本，持续改进体验。' }
  ]
};

const vchart = new VChart(spec, { dom: 'chart' });
vchart.renderSync();
```

页面中需要提供 `id="chart"` 的容器。使用 TypeScript 时，可从扩展包导入 `IStorylineSpec` 为配置添加类型标注。

通过 CDN 引入时，使用扩展包暴露的全局对象，并将页面中的 VChart 构造函数传给注册函数：

```html
<div id="chart"></div>
<script src="https://cdn.jsdelivr.net/npm/@visactor/vchart/build/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@visactor/vchart-extension/build/index.min.js"></script>
<script>
  VChartExtension.registerStorylineChart({ VChart: VChart.default });
  const vchart = new VChart.default(
    {
      type: 'storyline',
      width: 1000,
      height: 560,
      data: [
        { title: '发现需求', content: '明确目标。' },
        { title: '发布产品', content: '收集反馈。' }
      ]
    },
    { dom: 'chart' }
  );
  vchart.renderSync();
</script>
```

生产环境建议为两个 CDN 地址指定相同的、包含 Storyline 的包版本。

## 数据结构

`data` 直接接收节点数组，无需使用普通图表中的 `{ id, values }` 数据集结构，也无需配置 `xField`、`yField` 或 `series`。

| 字段       | 类型                                              | 说明                                                            |
| ---------- | ------------------------------------------------- | --------------------------------------------------------------- |
| `id`       | `string \| number`                                | 可选的节点标识，省略时使用数据索引。                            |
| `title`    | `string`                                          | 节点标题。                                                      |
| `content`  | `string \| string[]`                              | 节点正文；数组中的段落通过换行连接。                            |
| `image`    | `string \| HTMLImageElement \| HTMLCanvasElement` | 节点主图，可使用图片 URL、data URL 或图片、画布元素。           |
| `subImage` | 同 `image`                                        | 纵向布局中绘制在主图后方的错位装饰图，省略时不绘制。            |
| `marker`   | `string`                                          | 仅纵向布局使用的时间标记，例如 `'2024'`，在中轴上逐字纵向排列。 |
| `datum`    | `unknown`                                         | 可选的原始业务数据。                                            |

图片、标题和正文均可省略。需要时间顺序时，请先在业务侧排序，再传入 `data`。更新节点数组或布局时，使用包含新 `data` 的完整配置调用 `vchart.updateSpec(nextSpec)`。

## 布局

`layout` 可以是布局名称，也可以是包含 `type` 的对象。省略时使用 `landscape`。

完整类型定义、参数适用范围以及方向、角度、留白的配合方式，见 [layout 配置说明](/vchart/option/storylineChart#layout)。

| 布局        | 排列方式                                              | 适用场景               |
| ----------- | ----------------------------------------------------- | ---------------------- |
| `landscape` | 图片横向排列，文字在上下两侧交替出现，曲线串联节点。  | 横向流程、产品演进。   |
| `portrait`  | 图片和文字沿中轴左右交替排列，可在轴上显示 `marker`。 | 纵向里程碑、发展历程。 |
| `clock`     | 节点沿圆形轨道顺时针排列，文字向外展开。              | 阶段回顾、周期过程。   |
| `arc`       | 节点沿弧形分布，主题图片作为视觉中心。                | 成长故事、主题信息图。 |
| `wing`      | 圆形图片沿翼形主线排列，文字分布在两侧。              | 纵向叙事、项目推进。   |

弧形布局可以通过 `direction` 切换穹顶和碗形：

```js
layout: {
  type: 'arc',
  direction: 'up', // 'up'：穹顶，主题图位于底部；'down'：碗形，主题图位于顶部
  radiusRatio: 0.9
}
```

翼形布局使用 `layout: { type: 'wing', direction: 'left' }`，其中 `direction` 可以是 `left`（默认）或 `right`。

当前专用布局的参数支持有所区别：

- `arc` 支持 `radiusRatio`、`startAngle`、`endAngle`，角度单位为度。默认起止角为 `200` / `340`（`up`）或 `20` / `160`（`down`）。
- `wing` 也支持上述三个参数。默认起止角为 `-70` / `70`（`left`）或 `110` / `250`（`right`），默认 `radiusRatio` 为 `0.92`。
- `clock` 自动计算整圆节点的角度和半径，当前不使用上述三个参数。
- `layout.padding` 支持数值或 `[top, right, bottom, left]`，用于横向、纵向节点布局的内部留白。图表外边距通过顶层 `padding` 设置。

## 图片与文字

`title` 配置的是每个节点的标题图元样式，标题文字来自 `data[].title`。正文来自 `data[].content`，样式通过 `content` 配置。这里的 `title` 不使用普通图表标题组件的 `text`、`subtext` 结构。

```js
title: {
  style: { fontSize: 20, lineHeight: 27, fontWeight: 'bold', fill: '#23364d' }
},
content: {
  style: { fontSize: 14, lineHeight: 21, fill: '#526174' }
},
image: {
  showBackground: true,
  style: { opacity: 0.95 }
}
```

| 配置                           | 说明                                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `themeColor`                   | 连接线、主轴和图片装饰的默认主题色，默认为 `#e8543d`。                                                          |
| `title.style`、`content.style` | 节点文字样式；也可以通过各自的 `visible: false` 隐藏文字。标题最多展示两行，正文空间由布局决定。                |
| `image.width`、`image.height`  | 纵向、弧形、翼形布局的图片尺寸配置；横向布局使用 `height` 并自动计算宽度，时钟布局自动计算节点图片尺寸。        |
| `image.showBackground`         | 图片背景装饰，横向、纵向默认关闭，其他布局默认开启。不控制 `subImage` 的显隐。                                  |
| `image.style`                  | 图片图元样式，例如 `opacity`。                                                                                  |
| `titleImage`                   | 主题图片，支持 `image`、`width`、`height`、`visible` 和 `style`；位置由布局决定。                               |
| `marker`                       | 仅纵向布局生效，使用 `visible` 控制时间标记显隐，使用 `style.fontSize`、`style.lineHeight` 设置文字大小和行高。 |

例如，为弧形布局添加主题图片：

```js
titleImage: {
  image: 'https://example.com/story-title.png', // 替换为自己的图片地址
  width: 320,
  height: 140
}
```

图片资源、布局尺寸与图元样式的分工，详见 [image 配置说明](/vchart/option/storylineChart#image)和 [titleImage 配置说明](/vchart/option/storylineChart#titleImage)，其中包含类型定义、各布局的默认行为和带类型的配置示例。

## 节点尺寸与连线

横向、纵向布局可通过 `block.width`、`block.height` 调整节点尺寸。纵向布局还可以使用 `block.widthRatio`、`minWidth`、`maxWidth` 控制自适应宽度，显式 `width` 优先。横向布局默认按节点数量计算宽度，纵向布局默认根据可用高度分配节点槽位。弧形布局的 `block.width` 是文本宽度上限，空间不足时仍会收缩。

| 布局        | 主线配置                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| `landscape` | 默认显示曲线，使用 `line.visible` 控制显隐，`line.style.stroke`、`line.style.lineWidth` 设置样式。           |
| `portrait`  | 默认显示中轴，使用 `line.visible` 控制显隐，`line.style.fill` 设置轴的填充。隐藏中轴也会隐藏其中的时间标记。 |
| `arc`       | 弧形主线默认隐藏，设置 `line.visible: true` 后显示。                                                         |
| `wing`      | 翼形主线默认显示，可通过 `line.visible: false` 隐藏。                                                        |
| `clock`     | 使用布局内置的虚线轨道和引线，颜色取自 `themeColor`，当前不使用 `line.visible` 和 `line.style`。             |

接口中还保留了通用节点和连线参数，如 `block.showBackground`、`block.gap`、`image.position`、`image.gap`、`line.type`、`line.showArrow`、`line.arrowSize`、`line.distance`。当前五种专用布局并不使用这些参数控制对应的卡片背景、间距、图片位置或箭头，请优先使用上述已支持的配置。

## 画布与内容长度

建议先使用布局的默认尺寸和留白，再调整图片及文字。显式设置 `height` 有助于纵向布局为最后一个节点的正文预留空间。时钟布局需要足够的横向空间容纳轨道两侧的文字；节点较多时，应增大画布或减少单个节点的文字量。

示例使用固定画布尺寸，便于展示完整布局，并使用内嵌 SVG 图片，无需额外下载图片素材。

## 示例

- [横向叙事图](/vchart/demo/extension-chart/storyline-landscape)
- [纵向叙事图](/vchart/demo/extension-chart/storyline-portrait)
- [时钟叙事图](/vchart/demo/extension-chart/storyline-clock)
- [弧形叙事图](/vchart/demo/extension-chart/storyline-arc)
- [翼形叙事图](/vchart/demo/extension-chart/storyline-wing)
