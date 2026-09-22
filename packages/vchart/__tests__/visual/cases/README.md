# 本地视觉测试用例

按主要验证目的存放，一份 case 一个位置，`index.mjs` 是唯一可执行清单。目录表示用例归属；修改源码时，由开发者或编码 Agent 判断需要测试哪些目录，工具不自动推断影响范围。

当前共 **35 个**用例：原有十例保持不变，另外 25 例从 BugServer 原始配置迁移，均在模块头部保留来源 ID。本轮只迁移有来源证据的用例；自主新增场景另走后续流程。

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

| 目录 | 用例 | 保留的源条件 | 边界 |
| --- | --- | --- | --- |
| `charts/combination` | [bar-area-smooth](./charts/combination/bar-area-smooth.mjs) | 双数据源、bar + area、stack=false、600×600、面积系列 line 的 monotone | 不覆盖缺失值和交互 |
| `components/label` | [multi-bar-inside](./components/label/multi-bar-inside.mjs) | 两个数据源及 dataIndex、两组柱系列、四个分组、内部标签 | 不简化为单系列标签，不覆盖避让 |
| `components/marker` | [mark-line-sum](./components/marker/mark-line-sum.mjs) | 数值横轴、原值求和 150、markLine 数组、autoRange | 不覆盖其他聚合或动态更新 |
| `charts/pie` | [pie-negative](./charts/pie/pie-negative.mjs) | data 数组、1/2/-3、stack、showAllZero、supportNegative、标签 | 不覆盖全零数据或禁用负值支持 |

## 第二批来源迁移

用例来自 21 份独立源码，保留数值、数据顺序及组合配置；通用类目或标题的文本适配见文件头。`update-state-scatter-area` 同时保留来源的两次状态更新，其余按保存源码的静态最终状态验证。网格标签源数据没有零值，双离散轴用例没有缺失数据，不能将其计为相应异常数据覆盖。

| 目录 | 用例 | 验证目的 | 保留条件 |
| --- | --- | --- | --- |
| `charts/bar` | [bar-stack-inverse-value](./charts/bar/bar-stack-inverse-value.mjs) | 堆叠柱图反转数值轴并显示总计标签 | stack、左轴 inverse、totalLabel、15 条原始数据 |
| `charts/line` | [line-band-invalid-zero](./charts/line/line-band-invalid-zero.mjs) | 双离散轴折线保留 invalidType=zero 配置 | common、双 band 轴、字母 y 值、600×600；原文没有缺失数据 |
| `charts/line` | [line-stack-dashed-legend](./charts/line/line-stack-dashed-legend.mjs) | 堆叠折线与底部虚线图例共存 | 36 条原始数据、四组系列、lineH 图例虚线、标题 |
| `api` | [update-state-scatter-area](./api/update-state-scatter-area.mjs) | 散点与面积图分别按数据过滤更新状态 | 双系列、面积连续零值、两次 updateState 及 datumKeys/level |
| `charts/pie` | [pie-body](./charts/pie/pie-body.mjs) | 四项原始数据映射饼图扇区 | 原始数值和顺序、数值类目、data 对象 |
| `charts/range-column` | [range-column-horizontal](./charts/range-column/range-column-horizontal.mjs) | 横向区间柱与端点标签 | 八个原始区间、min/max、双轴及标签 |
| `charts/box-plot` | [box-plot-vertical](./charts/box-plot/box-plot-vertical.mjs) | 纵向箱线图五数概括与线形须线 | 六个原始五数集合、shaftShape=line、lineWidth=2 |
| `charts/box-plot` | [box-plot-grouped](./charts/box-plot/box-plot-grouped.mjs) | 分组箱线图与图例标题及分层轴间距 | 12 个原始集合、双 xField、group、paddingInner、颜色 |
| `charts/progress` | [progress-linear-gradient](./charts/progress/progress-linear-gradient.mjs) | 渐变线性进度图与显式双轴 | 0.6、线性渐变、圆角、bandWidth=30、轴标签 |
| `charts/progress` | [progress-linear-padding](./charts/progress/progress-linear-padding.mjs) | 进度主体上下留白 | 0.7、bandWidth=50、topPadding/bottomPadding=10 |
| `charts/progress` | [progress-linear-clamp](./charts/progress/progress-linear-clamp.mjs) | 超出数值轴上限的进度截断 | 原值 5、数值轴 2..4、clamp=true、圆角及双轴 |
| `charts/progress` | [progress-circular-gradient](./charts/progress/progress-circular-gradient.mjs) | 圆形进度渐变及内外留白 | 原值 1、conical 渐变、roundCap、半径与 inner/outerPadding |
| `layout` | [grid-multiple-axes](./layout/grid-multiple-axes.mjs) | 三区域网格布局中多折线与独立数值轴 | 9×9 网格、三区域五系列八轴、三图例、crosshair 配置 |
| `components/axis` | [axis-auto-hide](./components/axis/axis-auto-hide.mjs) | 窄图表中三个长时间标签自动隐藏 | width=200、sampling=false、greedy、flush、原始时间文本 |
| `components/label` | [label-stack-zero](./components/label/label-stack-zero.mjs) | 零值堆叠柱标签与边界移动避让 | 30 条原始数据、inside、白色描边、bound/moveY 策略 |
| `components/label` | [grid-line-label-layout](./components/label/grid-line-label-layout.mjs) | 三区域折线标签与独立轴布局 | 三区域五系列、八轴、labelLayout=region、末系列 top/overlap=false |
| `components/marker` | [mark-line-value](./components/marker/mark-line-value.mjs) | 折线点标签与水平参考线共存 | 九条原始时间数据、y=9、x=null、红色标注线、标签 |
| `components/marker` | [mark-line-auto-range](./components/marker/mark-line-auto-range.mjs) | 横纵坐标的四条标注线自动扩轴 | x 字符串 2/5、y 数值 20/220、四个 autoRange 开关 |
| `components/marker` | [mark-area-scatter-label](./components/marker/mark-area-scatter-label.mjs) | 隐藏坐标轴时散点标签与三块坐标标注共存 | 30 条原始数据、三组坐标、透明外框及半透明分区、标签 |
| `components/legend` | [legend-multiple](./components/legend/legend-multiple.mjs) | 五个图例在四个方向同时布局 | 两个左侧及上右下图例、padding=30、line 系列名称 |
| `components/title` | [bar-title](./components/title/bar-title.mjs) | 基础柱图显示主标题 | 四个原始月份和值、data 数组、可见主标题；原文无副标题 |

## 后续迁移

先对照 BugServer 原文复核候选的目的和必要条件，再决定保留、合并、改写或暂缓。目录空缺只用于引导检索，不构成创建新用例或宣称覆盖的依据。合并必须保留每个来源的必要条件；无法在一个清晰场景中保留时分开迁移。

此前扩充的 50 个场景已完成纠偏：25 个自主设计项退出本次流程；来源候选中，第一批迁移四例，第二批 18 个旧条目按来源差异拆分为 21 例，另外三个条目暂缓。暂缓来源不计入当前覆盖。历史截图通过不能单独证明来源保真。

新迁移项须通过源码对照、最终状态验证、同构建五轮自比较和针对性变异检查，再与官方基线运行比较。内网 BugServer 继续承担发版前全量测试。
