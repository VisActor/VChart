{{ target: component-data-filter-base }}

#${prefix} visible(boolean) = true

是否显示组件。

#${prefix} orient(string) = 'left'

组件位置。

可选值：

- 'left'
- 'top'
- 'right'
- 'bottom'

#${prefix} width(string | number) = 'auto'

组件宽度。

#${prefix} height(string | number) = 'auto'

组件高度。

#${prefix} field(string)

声明关联的映射字段。

#${prefix} axisId(string)

关联的轴 ID。

#${prefix} axisIndex(number)

关联的轴序号。

#${prefix} regionId(string)

关联的 region ID。

组件关联的 region 索引，与 axis 关联的 region 取交集

- 未配置：默认跟随 axis 控制的 region
- 已配置：用户配置与 axis 关联的 region 取交集
- 配置优先级：regionIndex > regionId

#${prefix} regionIndex(number)

关联的 region 序号。

组件关联的 region 索引，与 axis 关联的 region 取交集

- 未配置：默认跟随 axis 控制的 region
- 已配置：用户配置与 axis 关联的 region 取交集
- 配置优先级：regionIndex > regionId

#${prefix} filterMode(string) = 'filter'

数据过滤模式。

可选值:

- 'filter'
- 'axis'

#${prefix} start(number) = 0

起点配置（比例）：范围[0, 1]。

#${prefix} end(number) = 1

终点配置（比例）：范围[0, 1]。

#${prefix} startValue(string | number)

起点数据配置：没有配置的时候根据 start 进行转换。

#${prefix} endValue(string | number)

终点数据配置：没有配置的时候根据 end 进行转换。

#${prefix} rangeMode([string | string])

起点和终点的配置模式：只有模式和配置匹配时才生效，比如 rangeMode: ['percent', 'value']，那么必须 start 和 endValue 都配置才可以生效。

#${prefix} autoIndent(boolean)

是否进行自动缩进。

#${prefix} roam(boolean) = false

是否开启鼠标缩放和平移漫游。

#${prefix} auto(boolean) = false

是否为自动模式。开启以后，组件不会导致轴 scale 缩放，end、roam 等可能导致缩放的配置将被忽略，且组件可以自动消失。自 `1.4.0` 版本开始支持。

{{ use: common-layout-item(
  prefix = ${prefix},
  defaultLayoutType = 'region-relative',
  defaultLayoutLevel = 40,
  defaultLayoutZIndex = 500,
  noOrient = true
) }}
