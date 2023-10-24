{{ target: series-sankey }}

<!-- ISankeySeriesSpec -->

**桑基图系列**

{{ use: common-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  isHierarchy = true,
  seriesType = 'sankey',
  seriesMarks = ['node','link'],
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  preset = 'growIn' + '|' + 'fadeIn',
  defaultPreset = 'growIn'
) }}

#${prefix} node(Object)

node 节点样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'node'
) }}

{{ use: mark-rect(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} link(Object)

边配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'link'
) }}

{{ use: mark-link-path(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} categoryField(string)

节点名称字段。

#${prefix} valueField(string)

节点之间关系的权重字段。

#${prefix} sourceField(string)

来源节点数据字段。
层级数据无须提供。

#${prefix} targetField(string)

目标节点数据字段。
层级数据无须提供。

#${prefix} direction(string) = 'horizontal'

图表布局方向。

可选：

- `vertical`
- `horizontal`

#${prefix} nodeAlign(string)

节点的对齐类型。

可选：

- `left`
- `right`
- `center`
- `justify`
- `start`
- `end`

#${prefix} nodeGap(number)

同一层中两个节点之间的间隙大小。

#${prefix} nodeWidth(string|number|Function)

每个节点的宽度，支持三种取值

- 1. 百分比字符串，例如：{ nodeWidth: '12%' }
- 2. 以'px'为单位的简单数字，eg: { nodeWidth: 20 }
- 3. Function，通过自定义计算指定 nodeWidth

#${prefix} linkWidth(number|Function)

边宽度。
单位 px。

#${prefix} minStepWidth(number)

节点与边的最小宽度总和

#${prefix} minNodeHeight(number)

数据不为零或空时节点的最小大小。

- 这个配置可以用来避免数据太小时看不到太细的节点
- 建议小于 5px

#${prefix} minLinkHeight(number)

数据不为零或空时边的最小大小。

- 这个配置可以用来避免数据太小的时候看不到太细的链接
- 建议小于 5px
- 当同时指定 `minNodeHeight` 和 `minLinkHeight` 两个选项时，此选项应小于 `minNodeHeight`

#${prefix} iterations(number)

布局的迭代次数。

#${prefix} nodeKey(string|number|Function)

解析节点的 key 值。

#${prefix} linkSortBy(Function)

按此 funtion 排序边。

#${prefix} nodeSortBy(Function)

按此 funtion 排序节点。

#${prefix} setNodeLayer(Function)

自定义指定节点层。

#${prefix} emphasis(Object)

联动交互配置。

##${prefix} enable(boolean) = true

是否开启交互。

##${prefix} trigger(string) = 'click'

交互触发类型。

可取：

- `click`
- `hover`

##${prefix} effect(string) = 'self'

交互联动效果。
桑基图提供 3 种在节点上的交互联动效果:

- `self`: 仅高亮当前节点。
- `adjacency`: 高亮当前节点上下游节点和关联的边，淡化其它图形元素。
- `related`： 高亮与当前节点相关的整条路径上的节点和边，淡化其它图形元素。
