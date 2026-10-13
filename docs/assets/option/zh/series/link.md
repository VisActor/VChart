{{ target: series-link }}

<!-- ILinkSeriesSpec -->

**link 系列**，可用于绘制时序图，需要配合 dot 系列使用。**仅适用于直角坐标系**。

{{ use: common-cartesian-series(
  prefix = ${prefix},
  noType = ${noType},
  noData = ${noData},
  noMorph = ${noMorph},
  useInChart = ${useInChart},
  seriesType = 'link',
) }}

#${prefix} fromField(string)

起点字段，用于绘制 link 的起点。
注: 该字段提供的数据需要和被关联的 dot 系列事件中的 `node_name` 字段值保持一致，起点的定位跟随 dot 系列的节点。

#${prefix} toField(string)
终点字段，用于绘制 link 的终点。
注: 该字段提供的数据需要和被关联的 dot 系列事件中的 `node_name` 字段值保持一致，终点的定位跟随 dot 系列的节点。

#${prefix} dotSeriesIndex(number)

被关联的 dot 系列索引。

#${prefix} dotTypeField(string)

被关联的事件类型。用于区分 link 的 stroke 逻辑。如果没有配置，则每条 link 都使用相同的 stroke。

#${prefix} linkType(string) = 'line'

连接线类型：`'line'` 为直线，`'curve'` 为三次贝塞尔曲线。曲线仍使用公开的 `link` 图元配置控制 visible、style 和 state，无需配置 curveLink。相同端点的重复连接会按当前数据顺序分配不同曲率。

#${prefix} allowExtend(boolean) = false

是否允许连接在分类带两侧延伸。开启后可通过数据的 isExtend 指定 `'left'` 或 `'right'`；省略字段时延伸两端。接口中的 `'all'` 当前未按双侧处理。

#${prefix} imageLabelField(string)

连接中点头像对应的数据字段，值为图片地址或 data URL。未设置时不创建头像图元。

#${prefix} imageLabel(Object)

头像图元配置，可设置 visible、style 和 state；style.width / style.height 默认各为 40 像素。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

头像图元样式，如 `{ width: 32, height: 32 }`。未覆盖位置时居中显示在连接两端之间。

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} link(Object)
线图元样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'link'
) }}

{{ use: mark-line(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}

#${prefix} arrow(Object)

arrow 图元样式配置。

{{ use: common-mark(
  prefix = '#' + ${prefix}
) }}

##${prefix} style(Object)

{{ use: mark-style(
  markName = 'arrow'
) }}

{{ use: mark-symbol(
  prefix = '##' + ${prefix}
) }}

##${prefix} state(Object)

{{ use: mark-state-style() }}
