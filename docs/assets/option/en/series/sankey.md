{{ target: series-sankey }}

<!-- ISankeySeriesSpec -->

**Sankey Diagram Series**

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

Node style configuration.

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

Edge configuration.

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

Node name field.

#${prefix} valueField(string)

Weight field between nodes.

#${prefix} sourceField(string)

Source node data field.
No need to provide in hierarchical data.

#${prefix} targetField(string)

Target node data field.
No need to provide in hierarchical data.

#${prefix} direction(string) = 'horizontal'

Chart layout direction.

Optional:

- `vertical`
- `horizontal`

#${prefix} nodeAlign(string)

Node alignment type.

Optional:

- `left`
- `right`
- `center`
- `justify`
- `start`
- `end`

#${prefix} nodeGap(number)

Gap size between two nodes in the same layer.

#${prefix} nodeWidth(string|number|Function)

The width of each node, supporting three values:

- 1. Percentage string, e.g.: { nodeWidth: '12%' }
- 2. Simple number with 'px' as a unit, e.g.: { nodeWidth: 20 }
- 3. Function, specifying nodeWidth through custom calculation

#${prefix} linkWidth(number|Function)

Edge width.
Unit px.

#${prefix} minStepWidth(number)

Minimum width sum of nodes and edges.

#${prefix} minNodeHeight(number)

Minimal size of nodes when data is not zero or empty.

- This configuration can be used to avoid too thin nodes when data is too small.
- Suggested to be less than 5px.

#${prefix} minLinkHeight(number)

Minimal size of edges when data is not zero or empty.

- This configuration can be used to avoid too thin links when data is too small.
- Suggested to be less than 5px.
- When both `minNodeHeight` and `minLinkHeight` options are specified, this option should be less than `minNodeHeight`.

#${prefix} iterations(number)

Number of layout iterations.

#${prefix} nodeKey(string|number|Function)

Key value for parsing nodes.

#${prefix} linkSortBy(Function)

Sort edges by this function.

#${prefix} nodeSortBy(Function)

Sort nodes by this function.

#${prefix} setNodeLayer(Function)

Customize the assigned node layer.

#${prefix} emphasis(Object)

Interactive linkage configuration.

##${prefix} enable(boolean) = true

Enable interaction.

##${prefix} trigger(string) = 'click'

Interaction trigger type.

Available:

- `click`
- `hover`

##${prefix} effect(string) = 'self'

Interactive linkage effect.
Sankey Diagram provides 3 interaction linkage effects on nodes:

- `self`: Only highlight the current node.
- `adjacency`: Highlight the upstream and downstream nodes and associated edges of the current node, and dim other graphic elements.
- `related`: Highlight the nodes and edges on the entire path related to the current node, and dim other graphic elements.
