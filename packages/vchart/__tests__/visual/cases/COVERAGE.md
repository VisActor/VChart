# 核心视觉覆盖清单

本轮按默认 VChart UMD、Chromium 和确定性最终状态整理 BugServer 存量。清单帮助开发者或编码 Agent 选择目录，不参与自动测试筛选。每份迁移文件头保留源 ID；以下“覆盖”只指列出的条件，不代表整个模块或全部 spec 参数均已验证。

当前共 100 个用例，其中 90 个来自 BugServer（本轮新增 65 个）。涉及 24 种图表声明类型，含组合类型 `common`。数量不是全量功能覆盖率；实测结果见 [验收记录](./ACCEPTANCE.md)。

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

| 方向                 | 代表用例                                                                                                         | 实际条件与边界                                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 区间/分箱/统计       | range-column-horizontal、range-area-horizontal、range-area-missing-bound、histogram-min-height、box-plot-\*      | 双边界、末尾缺失上界、最小柱高、五数集合和分组；末尾缺失不等同于区间内部断点                                       |
| 漏斗                 | funnel-directions、funnel-transform                                                                              | 四区域的上下方向、对齐和外标签；转化形状和转化标签                                                                 |
| 层次/关系            | sankey-horizontal、sankey-vertical、treemap-hierarchy、circle-packing-padding、sunburst-gap、correlation-tooltip | 横纵流图、层次矩形/圆/扇形、层间留白、关联图悬停；不宣称下钻已经测试                                               |
| 热力/词云            | heatmap-correlation、word-cloud-enlarge                                                                          | 原相关矩阵、固定区域、颜色映射；random=false 的词云及放大配置。fontSizeLimitMax 保留源配置但不计为实际字号上限覆盖 |
| 轴                   | axis-log、axis-symlog、axis-time-brush、axis-zero-align、axis-tick-align、axis-break、axis-unit-position         | log/symlog/time、双轴同步、断轴、单位；时间轴 case 保留刷选配置但不宣称执行了刷选                                  |
| 轴标签               | axis-label、axis-auto-hide、axis-polar-multiple-labels、axis-multilevel-wrap                                     | 显式旋转、隐藏、多层极坐标、自动换行；非所有字体/截断/断轴组合                                                     |
| 图例/范围组件        | legend-multiple、legend-symbol-hidden、legend-continuous-filter、scrollbar-axis-range、datazoom-preview          | 多图例、符号隐藏、连续筛选；隐藏滚动条的初始范围；缩窄页面以实际触发 auto dataZoom                                 |
| 布局/主题            | grid-multiple-axes、grid-line-label-layout、combination-line-pie、theme-stack、bar-title                         | 多区域、多系列、多轴绑定、专用主题和标题；不等同于所有布局算法分支                                                 |
| Crosshair/自定义图元 | crosshair-polar-default、custom-mark-click                                                                       | 默认选中的极坐标 crosshair；按 markName 绑定点击并修改目标图元                                                     |

## 本轮保留的空缺

- 地图/Geo：当前套件不引入地理资源；地图资源、投影及地理标注继续待专项准备。
- sequence：存量代表包含复杂时间关系和业务语境，尚未确认适合公开的完整来源，不用自行合成数据补齐。
- liquid、venn、mosaic：不在本轮默认 UMD 注册范围；需要额外注册契约后再安排。
- 动画过程、3D、外部图片/字体、随机布局、扩展包、多产品及其他浏览器：不在本轮范围。
- 层次下钻、player 播放、poptip、富文本的完整排版分支、更多事件协作及滚动交互：保持待补充。当前套件中的配置出现不算这些行为已覆盖。
- Linux 仍待独立验收；macOS 截图稳定不能替代 Linux 实测。

## 来源和验收约定

同一 BugServer 来源允许改写宿主尺寸或鼠标定位，以便在固定页面中触发原配置条件；必须在文件头和内部记录说明。不保留业务目录/业务数据，也不把配置中偶然出现的字段当作有效覆盖。模型意见只是辅助，源码和实际执行结果决定去向。

配置回调、确定性计算使用 verifySourceSpec 在浏览器中从冻结模块重新构造期望值，避免 Node 转译格式或数学实现差异。普通输入仍可使用 verifySpec。公共绘制检查接受真实的空饼图占位环，但不会仅凭标题/轴线放行空白图。

新增测试的实现不要求重放历史像素坐标。交互改写须保留操作类型、实际效果和失败断言；本套件不据此宣称复现历史缺陷。
