# Sankey 数据与配置

生成或修改 Sankey 时先核对数据结构、端点标识和聚合口径，再添加样式。推荐的普通图写法中，`values` 是只含一个图对象的数组，不能直接放平铺边，也不能写成 `values: {nodes, links}`。

```js
const rawRows = [
  { from: 'Search', to: 'Landing', count: 27 },
  { from: 'Landing', to: 'Signup', count: 19 },
  { from: 'Landing', to: 'Exit', count: 8 }
];
const nodes = [...new Set(rawRows.flatMap(row => [row.from, row.to]))].map(id => ({ id }));
const spec = {
  type: 'sankey',
  data: { values: [{ nodes, links: rawRows }] },
  nodeKey: 'id', categoryField: 'id',
  sourceField: 'from', targetField: 'to', valueField: 'count',
  label: { visible: true },
  tooltip: { visible: true }
};
```

`nodeKey` 与连线端点使用同一标识；`categoryField` 只控制显示内容。整数索引端点保留原节点顺序。字段名使用实际数据，不要求改成示例中的名字。数据既可挂在根配置，也可挂在系列中；移动挂载位置不会转换平铺数据。

只有用户要求时才合并重复边；按要求的字段分组和计算，保留原始输入并核对聚合前后总量。节点从处理后的端点派生，已有元信息保留。没有额外交互需求时优先使用内置标签和 tooltip。

## 其他合法输入

- 一个数据源的 `values` 中放两条命名记录，id 分别为 `nodes` 和 `links`，见下例。
- 层级 Sankey 可用 `values: [{nodes: [root]}]`，根节点带 `children`，例如下例。
- 空输入可用 `values: []` 或空图，不补造占位数据。

```js
const root = {
  name: 'Total',
  children: [{ name: 'One', value: 3 }, { name: 'Two', value: 7 }]
};
const spec = {
  type: 'sankey',
  data: { values: [{ nodes: [root] }] },
  categoryField: 'name', valueField: 'value',
  label: { visible: true }
};
```

已有两份节点/边数据时，可在**同一个数据源的 `values`** 中放两条命名记录；各记录的 `values` 是对应数组。不要把它们直接拆成两个根 `data` 数据集，系列默认只选择其中一个：

```js
const spec = {
  type: 'sankey',
  data: { values: [
    { id: 'nodes', values: [{ key: 'Browse' }, { key: 'Order' }] },
    { id: 'links', values: [{ from: 'Browse', to: 'Order', amount: 12 }] }
  ] },
  nodeKey: 'key', categoryField: 'key',
  sourceField: 'from', targetField: 'to', valueField: 'amount',
  label: { visible: true }
};
```

生成 HTML 时，使用生成脚本校验实际交付的配置源文件；独立校验可用 `node scripts/validate_spec.cjs <spec文件路径>`。`SANKEY_GRAPH_REQUIRED` 表示直接内联数据的形状不合法，按上述结构修正后重新校验。parser、transform 或引用数据的最终形状仍需运行时检查；校验通过不代表已经正确绘制。

## 回调与交互

- VChart 2.0.21 的标签回调为 `(text, originalNode)`，不要把文本当对象。只显示 categoryField 时不需要回调。
- `node.style.fill` 收到布局节点，原始字段在 `layoutNode.datum`；`setNodeLayer` 接收原始节点，只在业务明确规定阶段时使用。
- 自定义 tooltip 时分别核对节点与边：节点名称从原始数据取，流量可由布局计算；边按实际 source/target/value 取值。不要假定所有回调都是原始行。
- 完整相关路径用 `emphasis: {enable: true, trigger: 'hover', effect: 'related'}`；`adjacency` 和普通 hover 不等价。离散图例的 `legends.data` 是转换函数，不是静态数组。

**已知版本边界：** VChart 2.0.21 的普通图 `related` 交互可能在 `_handleNodeRelatedClick` / `_handleLinkRelatedClick` 抛库内异常。记录版本与堆栈，不修改私有方法、伪造 parents、擅自升级依赖或用 adjacency 冒充 related。其他版本必须实际验证。

核对实际节点、边及权重，悬停节点和边检查文字；标题、canvas 或无报错不能证明图数据正确。按 [HTML](../../../workflows/scenario-2-html-generation.md) 或 [spec](../../../workflows/scenario-2-spec-generation.md) 流程交付。
