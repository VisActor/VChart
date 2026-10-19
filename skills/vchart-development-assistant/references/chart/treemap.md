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
- 标签显示名称、数值或占比由用户需求决定。用实际 `x1-x0` / `y1-y0` 和匹配字体的 Canvas measureText 检查容量，不用金额估算文字面积。多行使用字符串数组；隐藏、换行或省略按需求选择，tooltip 保留完整内容。
- VChart 2.0.21 使用 squarify 时显式提供有效 aspectRatio；未设置可能退化成细条。不能因此声称该枚举不支持，也不擅自升级宿主版本。

可执行 helper 见 [hierarchy-treemap.js](../examples/treemap/hierarchy-treemap.js)，按实际字段和层级传参并复制所需 helper 到交付源码，不依赖安装目录的浏览器相对路径。修改时保留原要求，核对叶子数量、面积、分组颜色、父子文本重叠及真实 tooltip，不能只看 ready 或 canvas。
