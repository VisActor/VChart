# 视觉测试覆盖与边界

本清单帮助开发者和编码 Agent 选择目录，不参与自动筛选。测试默认 VChart 核心 UMD、Chromium 和确定性最终状态，当前登记 256 个用例。以下覆盖仅指列出的条件，不代表全部功能或所有 spec 参数；准确目的、输入和断言以各模块为准。

## 常用图表及配置分支

| 方向       | 代表用例                                                                                                             | 实际条件与边界                                                                |
| ---------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 柱图       | bar-stack、bar-group、bar-three-level-gap、bar-percent、bar-width-limit                                              | 正负堆叠、两/三层分组、百分比、宽度限制；不枚举所有间距组合                   |
| 折线       | line-gap、line-missing-link、line-step、line-monotone、line-stack-dashed-legend                                      | 缺失值断开/连接、阶梯/单调曲线、堆叠；line-band-invalid-zero 没有真实缺失数据 |
| 面积       | area-horizontal、area-negative、area-stacked、area-unstacked、area-missing、area-invalid-zero                        | 横向、正负值、堆叠开关、缺失值 break/zero；保留来源数据                       |
| 散点       | scatter-symbol、data-fields-domain、scale-domain-replace                                                             | 位置、大小和形状；异常输入过滤；共同比例尺及定义域替换                        |
| 饼/环图    | pie-body、pie-negative、pie-nested、pie-radius-scale、pie-empty-placeholder、pie-zero-placeholder、pie-show-all-zero | 负值、嵌套、半径编码、空数组/全零、占位环；单独验证占位图实际绘制             |
| 瀑布       | waterfall、waterfall-leader-line                                                                                     | 累计/总计/连接线；反向类目轴和变化值堆叠标签；不覆盖所有横向和自动总计模式    |
| 雷达/玫瑰  | radar-series、radar-negative、radar-stacked、rose-stack、rose-group                                                  | 极坐标、负值、堆叠与分组；不将配置了 hover 视为已测 hover                     |
| 进度/仪表  | progress-linear-\*、progress-circular-gradient、gauge-gradient、gauge-tick-segment                                   | 渐变、留白、clamp、指针与刻度分段；不覆盖实时动画                             |
| 标签与标注 | pie-label、label-stack-zero、multi-bar-inside、`mark-line-*`、`mark-area-*`、mark-point-symbol                       | 外标签/引导线、零值堆叠、聚合扩轴、坐标标注、标注点文字及格式回调             |
| 常用交互   | legend-filter、tooltip-hover、datazoom-drag、brush-select                                                            | 实际选择/提示/范围/刷选状态；抑制动作应失败                                   |
| 更新       | update-resize、update-state-scatter-area、update-indicator-visible、update-pie-empty                                 | 数据、尺寸、状态、隐藏到显示及更新为空值；检查最终实例和图元                  |

## 其他图表与核心分支

| 方向                 | 代表用例                                                                                                         | 实际条件与边界                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 区间/分箱/统计       | range-column-horizontal、range-area-horizontal、range-area-missing-bound、histogram-min-height、box-plot-\*      | 双边界、末尾缺失上界、最小柱高、五数集合和分组；末尾缺失不等同于区间内部断点                                                |
| 漏斗                 | funnel-directions、funnel-transform                                                                              | 四区域的上下方向、对齐和外标签；转化形状和转化标签                                                                          |
| 层次/关系            | sankey-horizontal、sankey-vertical、treemap-hierarchy、circle-packing-padding、sunburst-gap、correlation-tooltip | 横纵流图、层次矩形/圆/扇形、层间留白、关联图悬停；sunburst-drill、treemap-drill、circle-packing-drill-\* 分别验证下钻及回退 |
| 热力/词云            | heatmap-correlation、word-cloud-enlarge                                                                          | 原相关矩阵、固定区域、颜色映射；random=false 的词云及放大配置。fontSizeLimitMax 保留源配置但不计为实际字号上限覆盖          |
| 轴                   | axis-log、axis-symlog、axis-time-brush、axis-zero-align、axis-tick-align、axis-break、axis-unit-position         | log/symlog/time、双轴同步、断轴、单位；时间轴 case 保留刷选配置但不宣称执行了刷选                                           |
| 轴标签               | axis-label、axis-auto-hide、axis-polar-multiple-labels、axis-multilevel-wrap                                     | 显式旋转、隐藏、多层极坐标、自动换行；非所有字体/截断/断轴组合                                                              |
| 图例/范围组件        | legend-multiple、legend-symbol-hidden、legend-continuous-filter、scrollbar-axis-range、datazoom-preview          | 多图例、符号隐藏、连续筛选；隐藏滚动条的初始范围；缩窄页面以实际触发 auto dataZoom                                          |
| 布局/主题            | grid-multiple-axes、grid-line-label-layout、combination-line-pie、theme-stack、bar-title                         | 多区域、多系列、多轴绑定、专用主题和标题；不等同于所有布局算法分支                                                          |
| Crosshair/自定义图元 | crosshair-polar-default、custom-mark-click                                                                       | 默认选中的极坐标 crosshair；按 markName 绑定点击并修改目标图元                                                              |

## spec 分支与组件行为

静态检查不只依赖两份截图相同：源配置/数据核对、有效图元检查以及独立的受控变异共同约束覆盖。配置存在、模型建议和模块数量都不是功能覆盖率。

| 目录                                            | 代表用例 / 配置分支                                                                                                                                                                                | 实际验证及边界                                                                                                                  |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `charts/bar`                                    | bar-stack-corner、bar-min-width、bar-group-gap、bar-gradient-\*                                                                                                                                    | 堆叠圆角、最小宽度、组内间距、渐变和标签；不穷举所有带宽组合                                                                    |
| `charts/area`                                   | area-stream-center、area-step-curve、area-series-mark、area-point-outer-border                                                                                                                     | silhouette 居中偏移、阶梯曲线、point 主图元、点外描边；主图元另查实际 mark 名称                                                 |
| `charts/scatter` / `data`                       | scatter-ordinal-_、scatter-_-callback、scatter-radial-gradient、scale-domain-expand、scale-specified-shape                                                                                         | 离散/回调的形状及大小、径向渐变、共享 scale 定义域扩展、指定形状映射                                                            |
| `charts/box-plot`                               | box-plot-bar-shaft、box-plot-outliers                                                                                                                                                              | 柱形须线及宽度、离群点；API 悬停另见 `api/state`                                                                                |
| `charts/funnel`                                 | funnel-left/right-align-_、funnel-bottom-align-_、funnel-cone-transform                                                                                                                            | 左右/下向对齐和长外标签、锥形转化；不是所有方向与样式的笛卡尔积                                                                 |
| `charts/progress`                               | progress-tick-mask、progress-series-track、progress-vertical-padding、progress-threshold-color                                                                                                     | 刻度遮罩、系列轨道、竖向及边距、阈值颜色；progress-tick-mask 按源 move 记录验证 hover 留白及 indicator 内容                     |
| `charts/sankey`                                 | sankey-node-align、sankey-cross-align-start/middle/end                                                                                                                                             | 主方向及交叉方向布局；邻接选择另由 sankey-selected-adjacency / sankey-adjacency 验证                                            |
| `charts/waterfall`                              | waterfall-horizontal-total、waterfall-absolute-label、waterfall-total-tag、waterfall-total-callback、waterfall-summary-total                                                                       | 横向字段总计、绝对值标签、tag-only/custom product、汇总字段与格式回调；clampForce 的边界触发仍为空缺                            |
| `components/axis`                               | axis-end-symbol、axis-explicit-domain、axis-auto-rotate、axis-vertical-text、axis-visible-layers、axis-trim-padding、axis-unit-offset、axis-polar-title-background、axis-label-callback            | 端点、显式域、旋转/竖排/多层、裁剪留白、单位偏移、极轴背景和格式回调；未把旧 band 轴 tickCount 用例计为数值轴刻度覆盖           |
| `components/marker`                             | marker-end-symbols、marker-_-position、marker-monotone-line、marker-polar-coordinates、marker-_-statistics、marker-label-\*、marker-multi-segment、marker-expand-callback、marker-background-shape | 符号、绝对/相对/极坐标、单调曲线、统计/回调、多段连接和自定义背景；保留各源组合，不宣称所有组合已枚举                           |
| `components/richtext`                           | richtext-axis-marker、richtext-funnel-label、richtext-pie-title、richtext-range-label、richtext-line-end-label、richtext-marker-label、richtext-extension-mark                                     | 检查真实 richtext 图元；富文本轴、标注、图表标签、标题、末端及扩展文本。range 用例 position=middle，不计 minLabel/maxLabel 分支 |
| `components/label` / `charts/treemap`           | line-end-label、treemap-nonleaf-label                                                                                                                                                              | 末端标签、非叶节点及富文本；不穷举标签测量与避让策略                                                                            |
| `components/indicator` / `components/crosshair` | indicator-autofit、crosshair-dual-axis-default                                                                                                                                                     | 静态内容自适应、双轴默认选中；不把未执行的 hover 联动计覆盖                                                                     |
| `components/datazoom`                           | datazoom-vertical-initial-range                                                                                                                                                                    | 纵向初始窗口及轴布局；保留源 maxSpan，但未验证拖动上限                                                                          |
| `components/legend` / `components/scrollbar`    | legend-clear-selection、legend-single-selection、scrollbar-drag-\*、scrollbar-range-mode                                                                                                           | 图例全清后恢复、单选过滤，横/纵向拖动真实改变范围及图元位置，percent/value 混合范围。空图状态只断言，最终截图为恢复后的有效图   |
| `components/tooltip`                            | tooltip-click、tooltip-trigger-off-none、tooltip-canvas-click/hover、tooltip-disabled、tooltip-title-hidden、tooltip-position-\*                                                                   | 实际点击/悬停、HTML/Canvas 可见内容、关闭/不关闭、隐藏标题及五种 mark 定位；不含外部图片和动画过渡                              |
| `interaction`                                   | area-selected-state、combination-hover-reverse、line-hover/selected-reverse、radar-selected-reverse、rose-selected-state、treemap-selection-persist、treemap-label-state、sunburst-drill           | 点/扇区状态和反向状态、triggerOff=none 保留选择、标签状态、旭日图实际下钻；不声称重放来源全部历史坐标或所有子例                 |
| `api/update` / `api/state`                      | update-axis-sampling、update-legend-data、box-plot-api-hover                                                                                                                                       | updateSpecSync 切换 sampling、先选择图例再 updateDataSync、setHovered 的真实最终状态                                            |

按 `--dir components/richtext`、`--dir interaction`、`--dir api` 或 `--case sunburst-drill` 选择。完整选择以 `index.mjs` 和 `--list` 为准。

## 交互、布局及 API 的具体用例

| 目录 / 用例                                                                            | 验证目的                                         |
| -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [axis-force-tick-count](./components/axis/axis-force-tick-count.mjs)                   | 多个数值轴的 tickCount 与 forceTickCount 组合    |
| [range-area-vertical](./charts/range-area/range-area-vertical.mjs)                     | 纵向区间面积的上下界及半透明填充                 |
| [range-area-average-line](./charts/range-area/range-area-average-line.mjs)             | 独立数据源的区间面积与平均值折线组合             |
| [axis-inside-four-sides](./components/axis/axis-inside-four-sides.mjs)                 | 四方向轴的内侧刻度、标签格式与轴线组合           |
| [marker-extension-quadrants](./components/marker/marker-extension-quadrants.mjs)       | 散点象限标区与依赖 region 布局的扩展图元         |
| [marker-richtext-position](./components/richtext/marker-richtext-position.mjs)         | 起止点富文本标注的尺寸与偏移                     |
| [axis-time-layer-step](./components/axis/axis-time-layer-step.mjs)                     | 时间轴 layers 的 tickStep 与混合范围数据         |
| [axis-tick-count-callback](./components/axis/axis-tick-count-callback.mjs)             | 依据轴长和字体计算数值轴刻度数量                 |
| [marker-richtext-content](./components/richtext/marker-richtext-content.mjs)           | 富文本标注的行内样式与独立末端内容               |
| [marker-area-richtext](./components/richtext/marker-area-richtext.mjs)                 | 标区内部富文本标签的排版                         |
| [marker-coordinate-callbacks](./components/marker/marker-coordinate-callbacks.mjs)     | 依据轴域和数据计算线、区、点坐标                 |
| [axis-region-overlap](./components/axis/axis-region-overlap.mjs)                       | 关联不同系列的 region-relative-overlap 多轴布局  |
| [bar-stack-sort-min-height](./charts/bar/bar-stack-sort-min-height.mjs)                | 多数据源堆叠排序、逆序与最小柱高                 |
| [axis-sync-scrollbar](./components/axis/axis-sync-scrollbar.mjs)                       | 横向柱图的双数值轴刻度同步与滚动条               |
| [pie-label-custom-path](./components/label/pie-label-custom-path.mjs)                  | 外标签引导线自定义折角路径                       |
| [area-mark-hover](./interaction/area-mark-hover.mjs)                                   | 面积图点与面积分别悬停的真实状态                 |
| [tooltip-content-reduce](./components/tooltip/tooltip-content-reduce.mjs)              | Tooltip 配置、实际提示内容及移出隐藏             |
| [tooltip-dimension-style](./components/tooltip/tooltip-dimension-style.mjs)            | Tooltip 配置、实际提示内容及移出隐藏             |
| [axis-richtext-tooltip](./components/tooltip/axis-richtext-tooltip.mjs)                | Tooltip 配置、实际提示内容及移出隐藏             |
| [tooltip-series-dimension](./components/tooltip/tooltip-series-dimension.mjs)          | Tooltip 配置、实际提示内容及移出隐藏             |
| [axis-poptip-flush](./components/axis/axis-poptip-flush.mjs)                           | 截断轴标签悬停后显示完整文本（源录制 poptip）    |
| [axis-poptip-rotated](./components/axis/axis-poptip-rotated.mjs)                       | 截断轴标签悬停后显示完整文本（源录制 poptip）    |
| [legend-hover-state](./components/legend/legend-hover-state.mjs)                       | 图例悬停反向状态、移出恢复与单选筛选             |
| [legend-hover-no-filter](./components/legend/legend-hover-no-filter.mjs)               | 图例悬停反向状态、移出恢复                       |
| [hover-series-api](./interaction/hover-series-api.mjs)                                 | 源 pointerover 回调按 Age 更新同组及反向状态     |
| [update-full-data-marker](./api/update/update-full-data-marker.mjs)                    | updateFullDataSync 原始更新值与标记组件          |
| [pie-update-zero](./api/update/pie-update-zero.mjs)                                    | 全零饼图经原始 updateData 更新为有效扇区         |
| [dimension-index-area](./api/state/dimension-index-area.mjs)                           | setDimensionIndex 定位指定维度的十字线           |
| [custom-mark-text-click](./interaction/custom-mark-text-click.mjs)                     | customMark 点击回调修改实际图元                  |
| [custom-mark-fill-click](./interaction/custom-mark-fill-click.mjs)                     | customMark 点击回调修改实际图元                  |
| [datazoom-min-max-span](./components/datazoom/datazoom-min-max-span.mjs)               | DataZoom 拖动及有效范围约束                      |
| [datazoom-vertical-fixed-span](./components/datazoom/datazoom-vertical-fixed-span.mjs) | DataZoom 拖动及有效范围约束                      |
| [datazoom-time-span](./components/datazoom/datazoom-time-span.mjs)                     | DataZoom 拖动及有效范围约束                      |
| [datazoom-preview-brush](./components/datazoom/datazoom-preview-brush.mjs)             | DataZoom 拖动及有效范围约束                      |
| [scrollbar-auto](./components/scrollbar/scrollbar-auto.mjs)                            | 滚动条拖动与实际可视范围                         |
| [scrollbar-crosshair](./components/scrollbar/scrollbar-crosshair.mjs)                  | 滚动条拖动与实际可视范围                         |
| [scrollbar-axis-click-update](./components/scrollbar/scrollbar-axis-click-update.mjs)  | 滚动条拖动后点击轴标签更新柱颜色                 |
| [sankey-selected-adjacency](./charts/sankey/sankey-selected-adjacency.mjs)             | 点击桑基节点时仅高亮相邻节点与连接，空白点击恢复 |
| [sankey-adjacency](./charts/sankey/sankey-adjacency.mjs)                               | 点击桑基节点时仅高亮相邻节点与连接，空白点击恢复 |
| [sankey-node-state](./charts/sankey/sankey-node-state.mjs)                             | 桑基节点悬停与点击状态                           |
| [circle-packing-drill-rooted](./charts/circle-packing/circle-packing-drill-rooted.mjs) | 层级图下钻与空白回退的路径和实际布局             |
| [circle-packing-drill-forest](./charts/circle-packing/circle-packing-drill-forest.mjs) | 层级图下钻与空白回退的路径和实际布局             |
| [circle-packing-drill-event](./charts/circle-packing/circle-packing-drill-event.mjs)   | 层级图下钻与空白回退的路径和实际布局             |
| [treemap-drill](./charts/treemap/treemap-drill.mjs)                                    | 层级图下钻与空白回退的路径和实际布局             |
| [brush-polygon](./interaction/brush-polygon.mjs)                                       | 多边形刷选的实际命中及排除状态                   |
| [brush-region-link](./interaction/brush-region-link.mjs)                               | 跨区域刷选联动的实际命中及排除状态               |
| [indicator-richtext-click](./components/indicator/indicator-richtext-click.mjs)        | 饼图选择触发富文本指标及对应数值                 |
| [pie-label-hover](./charts/pie/pie-label-hover.mjs)                                    | 半圆饼图悬停状态及标签引导线布局                 |
| [funnel-outer-label-line](./charts/funnel/funnel-outer-label-line.mjs)                 | 漏斗外标签对齐、虚线与悬停                       |
| [legend-custom-value](./components/legend/legend-custom-value.mjs)                     | 自定义图例值与点击后的真实数据筛选               |
| [crosshair-polar-formatters](./components/crosshair/crosshair-polar-formatters.mjs)    | 极坐标十字线分类和数值 formatter 的真实悬停输出  |
| [theme-runtime-switch](./theme/theme-runtime-switch.mjs)                               | 主题注册和实例切换后的圆角与配色                 |
| [theme-chart-components](./theme/theme-chart-components.mjs)                           | 图表主题启用柱标签并定位左侧图例                 |
| [funnel-extension-select](./charts/funnel/funnel-extension-select.mjs)                 | 漏斗扩展图元、初始选择和后续点击选择切换         |
| [media-query-width](./layout/media-query-width.mjs)                                    | 媒体查询注册、缩窄后隐藏左侧坐标轴标签           |

## 必要触发条件与限制

- 来源宿主尺寸不全的鼠标录制，改为实际图元定位；不宣称逐像素重放历史坐标，也不宣称复现原缺陷。
- 截断标签 Poptip：一例由 350×200 缩窄到 180×200 后悬停；另一例选择避开轴交点的实际截断标签。
- 自动滚动条：九个类别在 800px 下不溢出，缩窄到 360px 后验证滚动。带 crosshair 的来源当前未把拖动后的十字线行为计为覆盖。
- 缩放：保留来源 minSpan/maxSpan、固定跨度和预览刷选配置，核验实际范围及图元变化；预览刷选保留 throttle，等待范围事件到达终点后再松开。不是所有上下限/滚轮/触控组合均已测试。
- 跨区域刷选：在三份原始数据共同拥有的 x=5 上刷选；对每个关联系列检查命中与未命中。原第三份数据从 x=5 开始，不能要求它命中 x=0。
- updateSpec：先保存实际滚动中间态，再核验轴标签点击后的原始配置更新及红色柱；更新恢复初始范围是来源代码行为。
- 媒体查询：注册插件后重建实例，再缩窄到 160×160，验证 maxWidth 条件隐藏左轴。探索性增宽未观察到标签恢复，保留为待调查路径，不纳入通过结论。
- 主题：保留“注册并激活后创建实例”与“实例切换主题”两种来源顺序。
- 无鼠标录制但带 drill:true 的来源增加实际下钻检查，不称为录制重放。下钻/回退均核验事件路径与布局变化。
- 范围面积图的双来源合并只覆盖共同静态条件；strokeWidth/lineWidth 的 hover 差异仍未覆盖。

### 图元状态与多步交互

点/线/面积按真实图元分别检查 hover、selected 及反向状态；面积图没有独立 line 图元时，不把 line 配置出现当作另一条已测路径。Canvas Tooltip 检查两个 datum、隐藏和恢复；刷选检查创建、空白清除、重新创建；旭日图检查下钻/回退/另一分支；矩形树图检查切换选择后空白点击仍保留。既有图例清空并恢复实现保留，仍参加反例验证。

## 未覆盖与范围外场景

- 地图/Geo：尚未准备地理资源、投影及地理标注专项用例。
- sequence：尚无本地有效覆盖，需独立准备公开、确定性的时间关系用例。
- liquid、venn、mosaic：不在当前默认 UMD 注册范围，需要先明确注册契约。
- 动画过程、3D、外部图片/字体、随机布局、扩展包、多产品及其他浏览器不在当前范围。
- Player 播放、富文本完整排版分支、更多事件协作及滚轮/触控手势未全面覆盖；配置出现不代表行为已执行。
- rangeArea 区间内部缺失上下界、rangeColumn 富文本 minLabel/maxLabel 端点分支仍未覆盖；现有末尾缺值与 middle 标签不能替代。
- 媒体查询增宽后的标签恢复未纳入通过结论；仅覆盖当前缩窄触发。
- 旧 dimension 状态缺少有效触发、无效分类值的 setDimensionIndex 未产生目标效果，不用普通 hover 或有效维度用例冒充覆盖。
- 瀑布 stackLabel.clampForce 尚无有效越界触发的验证；保留该字段的用例不算覆盖其截断行为。
- ManualTicker、manual 模式、autoRender:false 和手动 tick 时序需要独立宿主契约。

开发者可以依据新功能或缺陷独立补充有效用例，遵循 [编写与来源约定](./README.md)。未迁移的 BugServer 用例不能据此判为冗余或删除。平台状态见 [验收摘要](./ACCEPTANCE.md)。
