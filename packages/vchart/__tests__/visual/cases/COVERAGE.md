# 核心视觉覆盖清单

本轮按默认 VChart UMD、Chromium 和确定性最终状态整理 BugServer 存量。清单帮助开发者或编码 Agent 选择目录，不参与自动测试筛选。每份迁移文件头保留源 ID；以下“覆盖”只指列出的条件，不代表整个模块或全部 spec 参数均已验证。

当前共 201 个用例，其中 191 个来自 BugServer（本轮新增 101 个）。涉及 24 种图表声明类型，含组合类型 `common`。数量不是全量功能覆盖率；实测结果见 [验收记录](./ACCEPTANCE.md)。

## P0：常用图表及配置分支

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

## P1：补充核心分支

| 方向                 | 代表用例                                                                                                         | 实际条件与边界                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 区间/分箱/统计       | range-column-horizontal、range-area-horizontal、range-area-missing-bound、histogram-min-height、box-plot-\*      | 双边界、末尾缺失上界、最小柱高、五数集合和分组；末尾缺失不等同于区间内部断点                                          |
| 漏斗                 | funnel-directions、funnel-transform                                                                              | 四区域的上下方向、对齐和外标签；转化形状和转化标签                                                                    |
| 层次/关系            | sankey-horizontal、sankey-vertical、treemap-hierarchy、circle-packing-padding、sunburst-gap、correlation-tooltip | 横纵流图、层次矩形/圆/扇形、层间留白、关联图悬停；本轮另由 sunburst-drill 验证旭日图下钻；矩形树图/圆打包下钻仍未覆盖 |
| 热力/词云            | heatmap-correlation、word-cloud-enlarge                                                                          | 原相关矩阵、固定区域、颜色映射；random=false 的词云及放大配置。fontSizeLimitMax 保留源配置但不计为实际字号上限覆盖    |
| 轴                   | axis-log、axis-symlog、axis-time-brush、axis-zero-align、axis-tick-align、axis-break、axis-unit-position         | log/symlog/time、双轴同步、断轴、单位；时间轴 case 保留刷选配置但不宣称执行了刷选                                     |
| 轴标签               | axis-label、axis-auto-hide、axis-polar-multiple-labels、axis-multilevel-wrap                                     | 显式旋转、隐藏、多层极坐标、自动换行；非所有字体/截断/断轴组合                                                        |
| 图例/范围组件        | legend-multiple、legend-symbol-hidden、legend-continuous-filter、scrollbar-axis-range、datazoom-preview          | 多图例、符号隐藏、连续筛选；隐藏滚动条的初始范围；缩窄页面以实际触发 auto dataZoom                                    |
| 布局/主题            | grid-multiple-axes、grid-line-label-layout、combination-line-pie、theme-stack、bar-title                         | 多区域、多系列、多轴绑定、专用主题和标题；不等同于所有布局算法分支                                                    |
| Crosshair/自定义图元 | crosshair-polar-default、custom-mark-click                                                                       | 默认选中的极坐标 crosshair；按 markName 绑定点击并修改目标图元                                                        |

## 本轮 spec 分支与交互补充

新增 101 例以真实来源为依据，29 例执行鼠标或公开 API 动作。静态检查不只依赖两份截图相同：源配置/数据核对、有效图元检查以及独立的受控变异共同约束覆盖。配置存在、模型建议和模块数量都不是功能覆盖率。

| 目录                                            | 代表用例 / 配置分支                                                                                                                                                                                | 实际验证及边界                                                                                                                  |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `charts/bar`                                    | bar-stack-corner、bar-min-width、bar-group-gap、bar-gradient-\*                                                                                                                                    | 堆叠圆角、最小宽度、组内间距、渐变和标签；不穷举所有带宽组合                                                                    |
| `charts/area`                                   | area-stream-center、area-step-curve、area-series-mark、area-point-outer-border                                                                                                                     | silhouette 居中偏移、阶梯曲线、point 主图元、点外描边；主图元另查实际 mark 名称                                                 |
| `charts/scatter` / `data`                       | scatter-ordinal-_、scatter-_-callback、scatter-radial-gradient、scale-domain-expand、scale-specified-shape                                                                                         | 离散/回调的形状及大小、径向渐变、共享 scale 定义域扩展、指定形状映射                                                            |
| `charts/box-plot`                               | box-plot-bar-shaft、box-plot-outliers                                                                                                                                                              | 柱形须线及宽度、离群点；API 悬停另见 `api/state`                                                                                |
| `charts/funnel`                                 | funnel-left/right-align-_、funnel-bottom-align-_、funnel-cone-transform                                                                                                                            | 左右/下向对齐和长外标签、锥形转化；不是所有方向与样式的笛卡尔积                                                                 |
| `charts/progress`                               | progress-tick-mask、progress-series-track、progress-vertical-padding、progress-threshold-color                                                                                                     | 刻度遮罩、系列轨道、竖向及边距、阈值颜色；progress-tick-mask 按源 move 记录验证 hover 留白及 indicator 内容                                                  |
| `charts/sankey`                                 | sankey-node-align、sankey-cross-align-start/middle/end                                                                                                                                             | 主方向及交叉方向布局；暂不测试 selected adjacency 的传播行为                                                                    |
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

按 `--dir components/richtext`、`--dir interaction`、`--dir api` 或 `--case sunburst-drill` 选择。文件头的 BugServer ID 是来源唯一登记处。完整存量中的未选项仍保留在 BugServer，不据此判定冗余或删除。

## 本轮保留的空缺

- 地图/Geo：当前套件不引入地理资源；地图资源、投影及地理标注继续待专项准备。
- sequence：存量代表包含复杂时间关系和业务语境，尚未确认适合公开的完整来源，不用自行合成数据补齐。
- liquid、venn、mosaic：不在本轮默认 UMD 注册范围；需要额外注册契约后再安排。
- 动画过程、3D、外部图片/字体、随机布局、扩展包、多产品及其他浏览器：不在本轮范围。
- 矩形树图/圆打包下钻、player 播放、poptip、富文本的完整排版分支、更多事件协作与滚轮/触控手势：保持待补充。当前套件中的配置出现不算这些行为已覆盖。
- Linux 仍待独立验收；macOS 截图稳定不能替代 Linux 实测。

## 来源和验收约定

同一 BugServer 来源允许改写宿主尺寸或鼠标定位，以便在固定页面中触发原配置条件；必须在文件头和内部记录说明。不保留业务目录/业务数据，也不把配置中偶然出现的字段当作有效覆盖。模型意见只是辅助，源码和实际执行结果决定去向。

配置回调、确定性计算使用 verifySourceSpec 在浏览器中从冻结模块重新构造期望值，避免 Node 转译格式或数学实现差异。普通输入仍可使用 verifySpec。公共绘制检查接受真实的空饼图占位环，但不会仅凭标题/轴线放行空白图。

新增测试的实现不要求重放历史像素坐标。交互改写须保留操作类型、实际效果和失败断言；本套件不据此宣称复现历史缺陷。
