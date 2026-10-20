# Treemap 数据与回调

生成或修改矩形树图时使用；保留当前交付目标与用户的数据要求。

数据源使用 `data: { values: [root] }`，按实际字段组织 `children`，保留所有叶子与业务字段。

以下布局与标签说明为 Treemap 专用。VChart 2.0.21 的布局节点 datum 是祖先链数组，末项才是当前原始记录；标签、配色和 tooltip 应使用一致的取值方式：

```js
function originalDatum(node) {
  if (Array.isArray(node?.datum)) return node.datum[node.datum.length - 1] ?? node;
  return node?.datum && typeof node.datum === 'object' ? node.datum : node;
}
```

- 标签回调为 `(text, node)`；使用原始字段而非内部 key 映射名称和颜色，不用灰色兜底掩盖缺失分类。
- Treemap 默认不添加 `legends` 配置（省略即不显示图例），指定分组颜色不代表要求显示图例。仅在用户明确要求时启用，并核对图例项、颜色与实际分组一致；可点击图例还需验证筛选行为，不能直接开启只代表包装根节点的默认图例。
- 父矩形包含子节点。启用 nonLeafLabel 时为父标题分配独立空间，不能仅凭父矩形面积判断标签不重叠；没有空间时不强行显示。图表标题使用 title。
- 标签内容按用户需求选择，并避免超出矩形或与父标题重叠。优先使用内置标签布局；需要自定义容量判断时，可结合节点边界与文本测量。多行文本使用字符串数组；省略的内容可由 tooltip 补充。
- VChart 2.0.21 使用 squarify 时显式提供有效 aspectRatio；未设置可能退化成细条。不能因此声称该枚举不支持，也不擅自升级宿主版本。

[最小层级示例](../examples/treemap/hierarchy-treemap.js) 默认使用内置标签和 tooltip；其中 `createTreemapTooltip` 演示按需自定义内容时的取值方式。按实际字段与层级使用，所需 helper 随交付源码保留。配色、占比、标签裁剪按任务需求添加，不是生成矩形树图的必需步骤。

## 按需自定义颜色

需要按业务分组指定叶子颜色时，使用 `leaf.style.fill` 的图元回调；顶层 `color` 不是逐节点样式回调。先从布局节点取原始记录，再查实际分组的颜色映射：

```js
leaf: { style: { fill: node => palette[originalDatum(node)[groupField]] } }
```

`palette`、`groupField` 来自当前任务的分组与配色要求；没有此要求时使用默认配色，无需额外建立映射。
