# 本地视觉测试用例

按主要验证目的存放，一份 case 一个位置，`index.mjs` 是唯一可执行清单。目录表示用例归属；修改源码时，由开发者或编码 Agent 判断需要测试哪些目录，工具不自动推断影响范围。

当前共 **201 个**用例：原有十例保持不变，另外 191 例从 BugServer 原始配置迁移，均在模块头部保留来源 ID。本轮只迁移有来源证据的用例；自主新增场景另走后续流程。

## 原有用例

| 目录                  | 用例 ID                                                  | 验证内容与边界                                      |
| --------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| `charts/bar`          | [bar-stack](./charts/bar/bar-stack.mjs)                  | 正负值堆叠和零基准线；不覆盖百分比堆叠              |
| `charts/line`         | [line-gap](./charts/line/line-gap.mjs)                   | `invalidType: 'break'` 缺失值断点；不覆盖连接缺失值 |
| `charts/scatter`      | [scatter-symbol](./charts/scatter/scatter-symbol.mjs)    | 位置、大小和 diamond 符号                           |
| `charts/waterfall`    | [waterfall](./charts/waterfall/waterfall.mjs)            | 累计、总计和连接线；不覆盖横向模式                  |
| `components/axis`     | [axis-label](./components/axis/axis-label.mjs)           | 长标签显式旋转；不覆盖自动旋转阈值                  |
| `components/label`    | [pie-label](./components/label/pie-label.mjs)            | 大小扇区的外侧标签和引导线                          |
| `components/legend`   | [legend-filter](./components/legend/legend-filter.mjs)   | 点击后选择项和实际可视数据均改变                    |
| `components/tooltip`  | [tooltip-hover](./components/tooltip/tooltip-hover.mjs)  | 悬停后 HTML tooltip 可见并含目标值                  |
| `components/datazoom` | [datazoom-drag](./components/datazoom/datazoom-drag.mjs) | 拖动后的范围和过滤结果                              |
| `api`                 | [update-resize](./api/update-resize.mjs)                 | updateData 和 resize 后的数据、画布尺寸             |

例如，测试 pie 标签应选择 `components/label`。`charts/pie` 的主体图形用例不会自动包含本目录的标签用例。图例和 dataZoom 的交互归对应组件，跨组件事件协作再按需建立 `interaction/`。

## 如何选择

从仓库根目录运行：

```sh
node packages/vchart/scripts/visual-test.mjs --list
node packages/vchart/scripts/visual-test.mjs
node packages/vchart/scripts/visual-test.mjs --dir components
node packages/vchart/scripts/visual-test.mjs --dir components/label
node packages/vchart/scripts/visual-test.mjs --case pie-label
```

目录相对于本文件所在的 `cases/`，递归包括子目录；目录和 case ID 互斥。不确定测试范围时运行全部本地用例。完整参数、环境准备和报告说明见 [运行说明](../README.md)。

## 编写约定

清单中填写唯一 `id`、一句话 `purpose` 和 `./目录/文件.mjs`。真实公开示例来源可填写 `sourceExample`；没有时省略。新增文件未经清单登记不会执行，不将 BugServer 内部链接或原始业务数据写入公开代码。

BugServer 迁移项在模块文件头唯一维护 `BugServer case IDs: <id>, <id>`：改写保留原 ID，合并列出全部来源 ID。原有公开示例用例保留 `sourceExample`，不虚构 BugServer ID。来源 ID 便于追溯，运行测试无需连接 BugServer。

每个模块顶部包含以下说明，便于 Agent 文本搜索和维护者审查：

```js
/**
 * 验证目的：大小扇区混合时，外侧标签与引导线正确呈现。
 * 图表类型：pie。
 * 关键配置：label.position、label.visible。
 * 场景条件：保留来源中的大、小扇区数值关系。
 * 迁移说明：记录保留的触发条件、脱敏或宿主适配；迁移项另填真实 BugServer case IDs。
 * 最终检查：核对输入与有效绘制，比较最终页面截图。
 * 覆盖边界：不验证点击，也不代表全部自动避让分支。
 */
```

保留 `createSpec()`、可选 `exercise(page)` 和必需 `verify(page)`。交互必须检查实际结果，不能只等待固定时间；数据和文本固定，网络资源禁用。共享助手位于上级 `helpers.mjs`，根据模块深度使用正确相对路径。

新用例在同一构建下连续五轮自比较稳定，并通过针对自身目的的受控变化验证后，再作为覆盖依据。只使用过某个组件不代表验证了它的所有行为。

## 已完成来源迁移的样本

源 ID 以模块文件头为准。保留源配置中的数据结构、值与顺序、系列关联和开关组合；目前仅替换测试宿主，饼图类目文本做一致匿名化。原始业务内容不进入公开仓库。当前保存源码未记录附加交互，不据此推断所有历史执行细节。

| 目录                 | 用例                                                        | 保留的源条件                                                          | 边界                           |
| -------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------ |
| `charts/combination` | [bar-area-smooth](./charts/combination/bar-area-smooth.mjs) | 双数据源、bar + area、stack=false、600×600、面积系列 line 的 monotone | 不覆盖缺失值和交互             |
| `components/label`   | [multi-bar-inside](./components/label/multi-bar-inside.mjs) | 两个数据源及 dataIndex、两组柱系列、四个分组、内部标签                | 不简化为单系列标签，不覆盖避让 |
| `components/marker`  | [mark-line-sum](./components/marker/mark-line-sum.mjs)      | 数值横轴、原值求和 150、markLine 数组、autoRange                      | 不覆盖其他聚合或动态更新       |
| `charts/pie`         | [pie-negative](./charts/pie/pie-negative.mjs)               | data 数组、1/2/-3、stack、showAllZero、supportNegative、标签          | 不覆盖全零数据或禁用负值支持   |

## 第二批来源迁移

用例来自 21 份独立源码，保留数值、数据顺序及组合配置；通用类目或标题的文本适配见文件头。`update-state-scatter-area` 同时保留来源的两次状态更新，其余按保存源码的静态最终状态验证。网格标签源数据没有零值，双离散轴用例没有缺失数据，不能将其计为相应异常数据覆盖。

| 目录                  | 用例                                                                           | 验证目的                               | 保留条件                                                         |
| --------------------- | ------------------------------------------------------------------------------ | -------------------------------------- | ---------------------------------------------------------------- |
| `charts/bar`          | [bar-stack-inverse-value](./charts/bar/bar-stack-inverse-value.mjs)            | 堆叠柱图反转数值轴并显示总计标签       | stack、左轴 inverse、totalLabel、15 条原始数据                   |
| `charts/line`         | [line-band-invalid-zero](./charts/line/line-band-invalid-zero.mjs)             | 双离散轴折线保留 invalidType=zero 配置 | common、双 band 轴、字母 y 值、600×600；原文没有缺失数据         |
| `charts/line`         | [line-stack-dashed-legend](./charts/line/line-stack-dashed-legend.mjs)         | 堆叠折线与底部虚线图例共存             | 36 条原始数据、四组系列、lineH 图例虚线、标题                    |
| `api`                 | [update-state-scatter-area](./api/update-state-scatter-area.mjs)               | 散点与面积图分别按数据过滤更新状态     | 双系列、面积连续零值、两次 updateState 及 datumKeys/level        |
| `charts/pie`          | [pie-body](./charts/pie/pie-body.mjs)                                          | 四项原始数据映射饼图扇区               | 原始数值和顺序、数值类目、data 对象                              |
| `charts/range-column` | [range-column-horizontal](./charts/range-column/range-column-horizontal.mjs)   | 横向区间柱与端点标签                   | 八个原始区间、min/max、双轴及标签                                |
| `charts/box-plot`     | [box-plot-vertical](./charts/box-plot/box-plot-vertical.mjs)                   | 纵向箱线图五数概括与线形须线           | 六个原始五数集合、shaftShape=line、lineWidth=2                   |
| `charts/box-plot`     | [box-plot-grouped](./charts/box-plot/box-plot-grouped.mjs)                     | 分组箱线图与图例标题及分层轴间距       | 12 个原始集合、双 xField、group、paddingInner、颜色              |
| `charts/progress`     | [progress-linear-gradient](./charts/progress/progress-linear-gradient.mjs)     | 渐变线性进度图与显式双轴               | 0.6、线性渐变、圆角、bandWidth=30、轴标签                        |
| `charts/progress`     | [progress-linear-padding](./charts/progress/progress-linear-padding.mjs)       | 进度主体上下留白                       | 0.7、bandWidth=50、topPadding/bottomPadding=10                   |
| `charts/progress`     | [progress-linear-clamp](./charts/progress/progress-linear-clamp.mjs)           | 超出数值轴上限的进度截断               | 原值 5、数值轴 2..4、clamp=true、圆角及双轴                      |
| `charts/progress`     | [progress-circular-gradient](./charts/progress/progress-circular-gradient.mjs) | 圆形进度渐变及内外留白                 | 原值 1、conical 渐变、roundCap、半径与 inner/outerPadding        |
| `layout`              | [grid-multiple-axes](./layout/grid-multiple-axes.mjs)                          | 三区域网格布局中多折线与独立数值轴     | 9×9 网格、三区域五系列八轴、三图例、crosshair 配置               |
| `components/axis`     | [axis-auto-hide](./components/axis/axis-auto-hide.mjs)                         | 窄图表中三个长时间标签自动隐藏         | width=200、sampling=false、greedy、flush、原始时间文本           |
| `components/label`    | [label-stack-zero](./components/label/label-stack-zero.mjs)                    | 零值堆叠柱标签与边界移动避让           | 30 条原始数据、inside、白色描边、bound/moveY 策略                |
| `components/label`    | [grid-line-label-layout](./components/label/grid-line-label-layout.mjs)        | 三区域折线标签与独立轴布局             | 三区域五系列、八轴、labelLayout=region、末系列 top/overlap=false |
| `components/marker`   | [mark-line-value](./components/marker/mark-line-value.mjs)                     | 折线点标签与水平参考线共存             | 九条原始时间数据、y=9、x=null、红色标注线、标签                  |
| `components/marker`   | [mark-line-auto-range](./components/marker/mark-line-auto-range.mjs)           | 横纵坐标的四条标注线自动扩轴           | x 字符串 2/5、y 数值 20/220、四个 autoRange 开关                 |
| `components/marker`   | [mark-area-scatter-label](./components/marker/mark-area-scatter-label.mjs)     | 隐藏坐标轴时散点标签与三块坐标标注共存 | 30 条原始数据、三组坐标、透明外框及半透明分区、标签              |
| `components/legend`   | [legend-multiple](./components/legend/legend-multiple.mjs)                     | 五个图例在四个方向同时布局             | 两个左侧及上右下图例、padding=30、line 系列名称                  |
| `components/title`    | [bar-title](./components/title/bar-title.mjs)                                  | 基础柱图显示主标题                     | 四个原始月份和值、data 数组、可见主标题；原文无副标题            |

## 后续迁移

先对照 BugServer 原文复核候选的目的和必要条件，再决定保留、合并、改写或暂缓。目录空缺只用于引导检索，不构成创建新用例或宣称覆盖的依据。合并必须保留每个来源的必要条件；无法在一个清晰场景中保留时分开迁移。

此前扩充的 50 个场景已完成纠偏：25 个自主设计项退出本次流程；来源候选中，第一批迁移四例，第二批 18 个旧条目按来源差异拆分为 21 例，另外三个条目暂缓。暂缓来源不计入当前覆盖。历史截图通过不能单独证明来源保真。

新迁移项须通过源码对照、最终状态验证、同构建五轮自比较和针对性变异检查，再与官方基线运行比较。内网 BugServer 继续承担发版前全量测试。

## 核心补齐集合

新增 65 例按主要目的归档。覆盖优先级、配置分支和明确空缺见 [覆盖清单](./COVERAGE.md)。来源文件头保留迁移说明；下表不构成自动影响分析规则。

| 目录                  | 用例                                                                           | 目的                                     |
| --------------------- | ------------------------------------------------------------------------------ | ---------------------------------------- |
| charts/area           | [area-horizontal](./charts/area/area-horizontal.mjs)                           | 横向面积图的数据映射与坐标布局           |
| charts/area           | [area-negative](./charts/area/area-negative.mjs)                               | 面积图正负值与零基线                     |
| charts/area           | [area-missing](./charts/area/area-missing.mjs)                                 | 面积图缺失值及源无效数据策略             |
| charts/area           | [area-stacked](./charts/area/area-stacked.mjs)                                 | 多组面积图堆叠与图例                     |
| charts/area           | [area-unstacked](./charts/area/area-unstacked.mjs)                             | 多组面积图关闭堆叠后的相交布局           |
| charts/line           | [line-step](./charts/line/line-step.mjs)                                       | 阶梯折线的曲线类型与点布局               |
| charts/line           | [line-monotone](./charts/line/line-monotone.mjs)                               | 单调平滑折线与点布局                     |
| charts/bar            | [bar-group](./charts/bar/bar-group.mjs)                                        | 分组柱图的双分类字段与系列               |
| charts/bar            | [bar-three-level-gap](./charts/bar/bar-three-level-gap.mjs)                    | 三层分组柱图的组内间距                   |
| charts/bar            | [bar-width-limit](./charts/bar/bar-width-limit.mjs)                            | 柱宽与最大柱宽共同配置                   |
| charts/histogram      | [histogram-min-height](./charts/histogram/histogram-min-height.mjs)            | 直方图区间边界与最小柱高                 |
| charts/funnel         | [funnel-directions](./charts/funnel/funnel-directions.mjs)                     | 四区域漏斗的方向、对齐与外侧标签         |
| charts/funnel         | [funnel-transform](./charts/funnel/funnel-transform.mjs)                       | 转化漏斗的转化标签与外侧标签             |
| charts/gauge          | [gauge-gradient](./charts/gauge/gauge-gradient.mjs)                            | 仪表盘渐变圆弧和指针组件                 |
| charts/gauge          | [gauge-tick-segment](./charts/gauge/gauge-tick-segment.mjs)                    | 仪表盘刻度分段和指针                     |
| charts/rose           | [rose-stack](./charts/rose/rose-stack.mjs)                                     | 玫瑰图分组数据的堆叠                     |
| charts/rose           | [rose-group](./charts/rose/rose-group.mjs)                                     | 玫瑰图分组与极坐标轴                     |
| charts/sankey         | [sankey-horizontal](./charts/sankey/sankey-horizontal.mjs)                     | 横向桑基图节点和连接布局                 |
| charts/sankey         | [sankey-vertical](./charts/sankey/sankey-vertical.mjs)                         | 纵向桑基图节点和连接布局                 |
| components/axis       | [axis-log](./components/axis/axis-log.mjs)                                     | 对数坐标轴的刻度与折线位置               |
| components/axis       | [axis-zero-align](./components/axis/axis-zero-align.mjs)                       | 双数值轴在零点两侧对齐                   |
| components/axis       | [axis-tick-align](./components/axis/axis-tick-align.mjs)                       | 双数值轴的刻度对齐                       |
| components/axis       | [axis-polar-multiple-labels](./components/axis/axis-polar-multiple-labels.mjs) | 极坐标多层标签布局                       |
| components/axis       | [axis-multilevel-wrap](./components/axis/axis-multilevel-wrap.mjs)             | 多层分类轴标签自动换行                   |
| components/axis       | [axis-break](./components/axis/axis-break.mjs)                                 | 数值轴断轴及柱图分段                     |
| components/axis       | [axis-unit-position](./components/axis/axis-unit-position.mjs)                 | 轴单位在指定位置显示                     |
| components/marker     | [mark-area-multiple](./components/marker/mark-area-multiple.mjs)               | 多块标注区域与折线坐标映射               |
| components/marker     | [mark-line-coordinates](./components/marker/mark-line-coordinates.mjs)         | 坐标点定位标注线                         |
| data                  | [scale-domain-replace](./data/scale-domain-replace.mjs)                        | 公共比例尺替换定义域后作用于双散点系列   |
| data                  | [data-fields-domain](./data/data-fields-domain.mjs)                            | 数据字段定义域与散点编码                 |
| charts/combination    | [combination-line-pie](./charts/combination/combination-line-pie.mjs)          | 折线和饼图在独立区域共存                 |
| charts/pie            | [pie-nested](./charts/pie/pie-nested.mjs)                                      | 多系列嵌套环形饼图                       |
| charts/pie            | [pie-radius-scale](./charts/pie/pie-radius-scale.mjs)                          | 饼图半径字段编码                         |
| theme                 | [theme-stack](./theme/theme-stack.mjs)                                         | 堆叠面积图的专用主题样式                 |
| components/legend     | [legend-symbol-hidden](./components/legend/legend-symbol-hidden.mjs)           | 图例项隐藏符号后的文本布局               |
| components/scrollbar  | [scrollbar-axis-range](./components/scrollbar/scrollbar-axis-range.mjs)        | 隐藏滚动条的初始范围及分类轴显示         |
| components/datazoom   | [datazoom-preview](./components/datazoom/datazoom-preview.mjs)                 | dataZoom 预览图的初始范围和布局          |
| charts/waterfall      | [waterfall-leader-line](./charts/waterfall/waterfall-leader-line.mjs)          | 反向类目轴瀑布图的连接线与变化值堆叠标签 |
| components/label      | [label-smart-invert](./components/label/label-smart-invert.mjs)                | 柱图外侧标签的智能反色配置               |
| charts/radar          | [radar-series](./charts/radar/radar-series.mjs)                                | 雷达图多系列与角度和半径轴               |
| charts/radar          | [radar-negative](./charts/radar/radar-negative.mjs)                            | 雷达图负值与面积区域                     |
| charts/radar          | [radar-stacked](./charts/radar/radar-stacked.mjs)                              | 雷达面积堆叠与圆形径向网格               |
| charts/range-area     | [range-area-horizontal](./charts/range-area/range-area-horizontal.mjs)         | 横向区间面积图的上下界                   |
| charts/range-area     | [range-area-missing-bound](./charts/range-area/range-area-missing-bound.mjs)   | 区间面积上界缺失并叠加两条折线           |
| charts/pie            | [pie-empty-placeholder](./charts/pie/pie-empty-placeholder.mjs)                | 空数据时显示自定义饼图占位环             |
| charts/pie            | [pie-zero-placeholder](./charts/pie/pie-zero-placeholder.mjs)                  | 全零数据时显示饼图占位环                 |
| charts/pie            | [pie-show-all-zero](./charts/pie/pie-show-all-zero.mjs)                        | showAllZero 下全零数据的扇区及外侧标签   |
| charts/word-cloud     | [word-cloud-enlarge](./charts/word-cloud/word-cloud-enlarge.mjs)               | 词云的确定性布局与放大配置               |
| charts/sunburst       | [sunburst-gap](./charts/sunburst/sunburst-gap.mjs)                             | 旭日图分层间隙和径向标签                 |
| charts/circle-packing | [circle-packing-padding](./charts/circle-packing/circle-packing-padding.mjs)   | 圆打包分层留白和按深度显示标签           |
| charts/treemap        | [treemap-hierarchy](./charts/treemap/treemap-hierarchy.mjs)                    | 矩形树图的层次数据与标签                 |
| charts/heatmap        | [heatmap-correlation](./charts/heatmap/heatmap-correlation.mjs)                | 相关矩阵热力图与固定区域及旋转标签       |
| charts/bar            | [bar-percent](./charts/bar/bar-percent.mjs)                                    | 百分比堆叠柱图与百分数刻度格式           |
| components/axis       | [axis-symlog](./components/axis/axis-symlog.mjs)                               | 相同正负数据在线性轴和对称对数轴的布局   |
| components/marker     | [mark-point-symbol](./components/marker/mark-point-symbol.mjs)                 | 标注点文字、端点配置与动态轴标签         |
| components/crosshair  | [crosshair-polar-default](./components/crosshair/crosshair-polar-default.mjs)  | 极坐标默认选中的径向和角度 crosshair     |
| api                   | [update-indicator-visible](./api/update-indicator-visible.mjs)                 | updateSpecSync 后显示仪表指标文字        |
| api                   | [update-pie-empty](./api/update-pie-empty.mjs)                                 | 更新饼图数据为 null 和零后切换占位图     |
| components/brush      | [brush-select](./components/brush/brush-select.mjs)                            | 拖拽矩形刷选后区分命中和未命中的散点     |
| interaction           | [custom-mark-click](./interaction/custom-mark-click.mjs)                       | 按 markName 绑定的自定义图元点击更新     |
| components/legend     | [legend-continuous-filter](./components/legend/legend-continuous-filter.mjs)   | 拖动连续颜色图例后筛选矩形树图数据       |
| charts/line           | [line-missing-link](./charts/line/line-missing-link.mjs)                       | 连接缺失值的折线与多系列数据             |
| charts/area           | [area-invalid-zero](./charts/area/area-invalid-zero.mjs)                       | 缺失值按零处理的堆叠面积与标签           |
| components/axis       | [axis-time-brush](./components/axis/axis-time-brush.mjs)                       | 时间轴和 dataZoom 及刷选配置共存         |
| charts/correlation    | [correlation-tooltip](./charts/correlation/correlation-tooltip.mjs)            | 关联图布局与悬停后的 tooltip             |

本轮实测、耗时和来源审核结论见 [验收记录](./ACCEPTANCE.md)。

## spec 分支与交互扩展

本轮补充 101 个真实 BugServer 来源用例，详细分支和未覆盖边界见 [覆盖清单](./COVERAGE.md)。新增 `components/richtext`、`api/update` 和 `api/state` 子目录；原 `api/` 用例不迁移，`--dir api` 会递归运行全部 API 用例。

选用例时先看主要目的与文件头说明，再看 `createSpec()` 中的具体分支；例如相同图表类型的富文本、状态、轴与总计应分别考虑。工具只支持全量、目录和单例，不自动推断源码影响范围。

新迁移的 28 个交互用例按实际图元或公开 API 操作，保留来源操作类型及目标状态，替换旧宿主坐标。空图图例检查后恢复有效数据再截图；source 的 `triggerOff: 'none'` 用例检查保留选中，不错误断言空白点击取消。极坐标定位共用 `seriesGraphicCenter()`，取环内点并执行正向矩阵变换。
