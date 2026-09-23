/**
 * @typedef {{id: string, purpose: string, file: string, sourceExample?: string}} CaseMetadata
 * @typedef {{createSpec: () => object, exercise?: (page: import('@playwright/test').Page) => Promise<void>, verify: (page: import('@playwright/test').Page) => Promise<void>}} VisualCase
 */
/** 本地用例元数据的唯一清单；模块必须保持浏览器和 Node 均可导入。 */
export const cases = [
  {
    id: 'bar-stack',
    purpose: '正负值、堆叠与零基准线（bar）',
    file: './charts/bar/bar-stack.mjs',
    sourceExample: 'packages/vchart/__tests__/runtime/browser/test-page/bar.ts'
  },
  {
    id: 'line-gap',
    purpose: '缺失值与折线连接（data-zoom-brush-line）',
    file: './charts/line/line-gap.mjs',
    sourceExample: 'packages/vchart/__tests__/runtime/browser/test-page/data-zoom-brush-line.ts'
  },
  {
    id: 'scatter-symbol',
    purpose: '散点位置、大小及符号（scatter）',
    file: './charts/scatter/scatter-symbol.mjs',
    sourceExample: 'packages/vchart/__tests__/runtime/browser/test-page/scatter.ts'
  },
  {
    id: 'pie-label',
    purpose: '外侧标签与引导线（pie-label）',
    file: './components/label/pie-label.mjs',
    sourceExample: 'packages/vchart/__tests__/runtime/browser/test-page/pie-label.ts'
  },
  {
    id: 'axis-label',
    purpose: '长文本、旋转和轴布局（axis-label-layout）',
    file: './components/axis/axis-label.mjs',
    sourceExample: 'packages/vchart/__tests__/runtime/browser/test-page/axis-label-layout.ts'
  },
  {
    id: 'waterfall',
    purpose: '累计、总计与连接线（waterfall）',
    file: './charts/waterfall/waterfall.mjs',
    sourceExample: 'packages/vchart/__tests__/runtime/browser/test-page/waterfall.ts'
  },
  {
    id: 'legend-filter',
    purpose: '图例点击筛选（multiple-legend-layout）',
    file: './components/legend/legend-filter.mjs',
    sourceExample: 'packages/vchart/__tests__/runtime/browser/test-page/multiple-legend-layout.ts'
  },
  {
    id: 'tooltip-hover',
    purpose: '鼠标悬停后的 HTML tooltip（tooltip）',
    file: './components/tooltip/tooltip-hover.mjs',
    sourceExample: 'packages/vchart/__tests__/runtime/browser/test-page/tooltip.ts'
  },
  {
    id: 'datazoom-drag',
    purpose: '拖动后的可视范围（datazoom）',
    file: './components/datazoom/datazoom-drag.mjs',
    sourceExample: 'packages/vchart/__tests__/runtime/browser/test-page/datazoom.ts'
  },
  {
    id: 'update-resize',
    purpose: '数据更新与尺寸调整（event-update-spec）',
    file: './api/update-resize.mjs',
    sourceExample: 'packages/vchart/__tests__/runtime/browser/test-page/event-update-spec.ts'
  },
  {
    id: 'bar-area-smooth',
    purpose: '同一区域的柱图与平滑轮廓面积图叠加',
    file: './charts/combination/bar-area-smooth.mjs'
  },
  {
    id: 'multi-bar-inside',
    purpose: '两份数据中的四个分组使用两个柱系列并显示内部标签',
    file: './components/label/multi-bar-inside.mjs'
  },
  {
    id: 'mark-line-sum',
    purpose: '求和标注线扩展数据范围',
    file: './components/marker/mark-line-sum.mjs'
  },
  {
    id: 'pie-negative',
    purpose: '混合正负值饼图同时开启全零显示和负值支持',
    file: './charts/pie/pie-negative.mjs'
  },
  {
    id: 'bar-stack-inverse-value',
    purpose: '堆叠柱图反转数值轴并显示总计标签',
    file: './charts/bar/bar-stack-inverse-value.mjs'
  },
  {
    id: 'line-band-invalid-zero',
    purpose: '双离散轴折线保留 invalidType=zero 配置',
    file: './charts/line/line-band-invalid-zero.mjs'
  },
  {
    id: 'line-stack-dashed-legend',
    purpose: '堆叠折线与底部虚线图例共存',
    file: './charts/line/line-stack-dashed-legend.mjs'
  },
  {
    id: 'update-state-scatter-area',
    purpose: '散点与面积图分别按数据过滤更新状态',
    file: './api/update-state-scatter-area.mjs'
  },
  {
    id: 'pie-body',
    purpose: '四项原始数据映射饼图扇区',
    file: './charts/pie/pie-body.mjs'
  },
  {
    id: 'range-column-horizontal',
    purpose: '横向区间柱与端点标签',
    file: './charts/range-column/range-column-horizontal.mjs'
  },
  {
    id: 'box-plot-vertical',
    purpose: '纵向箱线图五数概括与线形须线',
    file: './charts/box-plot/box-plot-vertical.mjs'
  },
  {
    id: 'box-plot-grouped',
    purpose: '分组箱线图与图例标题及分层轴间距',
    file: './charts/box-plot/box-plot-grouped.mjs'
  },
  {
    id: 'progress-linear-gradient',
    purpose: '渐变线性进度图与显式双轴',
    file: './charts/progress/progress-linear-gradient.mjs'
  },
  {
    id: 'progress-linear-padding',
    purpose: '进度主体上下留白',
    file: './charts/progress/progress-linear-padding.mjs'
  },
  {
    id: 'progress-linear-clamp',
    purpose: '超出数值轴上限的进度截断',
    file: './charts/progress/progress-linear-clamp.mjs'
  },
  {
    id: 'progress-circular-gradient',
    purpose: '圆形进度渐变及内外留白',
    file: './charts/progress/progress-circular-gradient.mjs'
  },
  {
    id: 'grid-multiple-axes',
    purpose: '三区域网格布局中多折线与独立数值轴',
    file: './layout/grid-multiple-axes.mjs'
  },
  {
    id: 'axis-auto-hide',
    purpose: '窄图表中三个长时间标签自动隐藏',
    file: './components/axis/axis-auto-hide.mjs'
  },
  {
    id: 'label-stack-zero',
    purpose: '零值堆叠柱标签与边界移动避让',
    file: './components/label/label-stack-zero.mjs'
  },
  {
    id: 'grid-line-label-layout',
    purpose: '三区域折线标签与独立轴布局',
    file: './components/label/grid-line-label-layout.mjs'
  },
  {
    id: 'mark-line-value',
    purpose: '折线点标签与水平参考线共存',
    file: './components/marker/mark-line-value.mjs'
  },
  {
    id: 'mark-line-auto-range',
    purpose: '横纵坐标的四条标注线自动扩轴',
    file: './components/marker/mark-line-auto-range.mjs'
  },
  {
    id: 'mark-area-scatter-label',
    purpose: '隐藏坐标轴时散点标签与三块坐标标注共存',
    file: './components/marker/mark-area-scatter-label.mjs'
  },
  {
    id: 'legend-multiple',
    purpose: '五个图例在四个方向同时布局',
    file: './components/legend/legend-multiple.mjs'
  },
  {
    id: 'bar-title',
    purpose: '基础柱图显示主标题',
    file: './components/title/bar-title.mjs'
  },
  {
    id: 'area-horizontal',
    purpose: '横向面积图的数据映射与坐标布局',
    file: './charts/area/area-horizontal.mjs'
  },
  {
    id: 'area-negative',
    purpose: '面积图正负值与零基线',
    file: './charts/area/area-negative.mjs'
  },
  {
    id: 'area-missing',
    purpose: '面积图缺失值及源无效数据策略',
    file: './charts/area/area-missing.mjs'
  },
  {
    id: 'area-stacked',
    purpose: '多组面积图堆叠与图例',
    file: './charts/area/area-stacked.mjs'
  },
  {
    id: 'area-unstacked',
    purpose: '多组面积图关闭堆叠后的相交布局',
    file: './charts/area/area-unstacked.mjs'
  },
  {
    id: 'line-step',
    purpose: '阶梯折线的曲线类型与点布局',
    file: './charts/line/line-step.mjs'
  },
  {
    id: 'line-monotone',
    purpose: '单调平滑折线与点布局',
    file: './charts/line/line-monotone.mjs'
  },
  {
    id: 'bar-group',
    purpose: '分组柱图的双分类字段与系列',
    file: './charts/bar/bar-group.mjs'
  },
  {
    id: 'bar-three-level-gap',
    purpose: '三层分组柱图的组内间距',
    file: './charts/bar/bar-three-level-gap.mjs'
  },
  {
    id: 'bar-width-limit',
    purpose: '柱宽与最大柱宽共同配置',
    file: './charts/bar/bar-width-limit.mjs'
  },
  {
    id: 'histogram-min-height',
    purpose: '直方图区间边界与最小柱高',
    file: './charts/histogram/histogram-min-height.mjs'
  },
  {
    id: 'funnel-directions',
    purpose: '四区域漏斗的方向、对齐与外侧标签',
    file: './charts/funnel/funnel-directions.mjs'
  },
  {
    id: 'funnel-transform',
    purpose: '转化漏斗的转化标签与外侧标签',
    file: './charts/funnel/funnel-transform.mjs'
  },
  {
    id: 'gauge-gradient',
    purpose: '仪表盘渐变圆弧和指针组件',
    file: './charts/gauge/gauge-gradient.mjs'
  },
  {
    id: 'gauge-tick-segment',
    purpose: '仪表盘刻度分段和指针',
    file: './charts/gauge/gauge-tick-segment.mjs'
  },
  {
    id: 'rose-stack',
    purpose: '玫瑰图分组数据的堆叠',
    file: './charts/rose/rose-stack.mjs'
  },
  {
    id: 'rose-group',
    purpose: '玫瑰图分组与极坐标轴',
    file: './charts/rose/rose-group.mjs'
  },
  {
    id: 'sankey-horizontal',
    purpose: '横向桑基图节点和连接布局',
    file: './charts/sankey/sankey-horizontal.mjs'
  },
  {
    id: 'sankey-vertical',
    purpose: '纵向桑基图节点和连接布局',
    file: './charts/sankey/sankey-vertical.mjs'
  },
  {
    id: 'axis-log',
    purpose: '对数坐标轴的刻度与折线位置',
    file: './components/axis/axis-log.mjs'
  },
  {
    id: 'axis-zero-align',
    purpose: '双数值轴在零点两侧对齐',
    file: './components/axis/axis-zero-align.mjs'
  },
  {
    id: 'axis-tick-align',
    purpose: '双数值轴的刻度对齐',
    file: './components/axis/axis-tick-align.mjs'
  },
  {
    id: 'axis-polar-multiple-labels',
    purpose: '极坐标多层标签布局',
    file: './components/axis/axis-polar-multiple-labels.mjs'
  },
  {
    id: 'axis-multilevel-wrap',
    purpose: '多层分类轴标签自动换行',
    file: './components/axis/axis-multilevel-wrap.mjs'
  },
  {
    id: 'axis-break',
    purpose: '数值轴断轴及柱图分段',
    file: './components/axis/axis-break.mjs'
  },
  {
    id: 'axis-unit-position',
    purpose: '轴单位在指定位置显示',
    file: './components/axis/axis-unit-position.mjs'
  },
  {
    id: 'mark-area-multiple',
    purpose: '多块标注区域与折线坐标映射',
    file: './components/marker/mark-area-multiple.mjs'
  },
  {
    id: 'mark-line-coordinates',
    purpose: '坐标点定位标注线',
    file: './components/marker/mark-line-coordinates.mjs'
  },
  {
    id: 'scale-domain-replace',
    purpose: '公共比例尺替换定义域后作用于双散点系列',
    file: './data/scale-domain-replace.mjs'
  },
  {
    id: 'data-fields-domain',
    purpose: '数据字段定义域与散点编码',
    file: './data/data-fields-domain.mjs'
  },
  {
    id: 'combination-line-pie',
    purpose: '折线和饼图在独立区域共存',
    file: './charts/combination/combination-line-pie.mjs'
  },
  {
    id: 'pie-nested',
    purpose: '多系列嵌套环形饼图',
    file: './charts/pie/pie-nested.mjs'
  },
  {
    id: 'pie-radius-scale',
    purpose: '饼图半径字段编码',
    file: './charts/pie/pie-radius-scale.mjs'
  },
  {
    id: 'theme-stack',
    purpose: '堆叠面积图的专用主题样式',
    file: './theme/theme-stack.mjs'
  },
  {
    id: 'legend-symbol-hidden',
    purpose: '图例项隐藏符号后的文本布局',
    file: './components/legend/legend-symbol-hidden.mjs'
  },
  {
    id: 'scrollbar-axis-range',
    purpose: '隐藏滚动条的初始范围及分类轴显示',
    file: './components/scrollbar/scrollbar-axis-range.mjs'
  },
  {
    id: 'datazoom-preview',
    purpose: 'dataZoom 预览图的初始范围和布局',
    file: './components/datazoom/datazoom-preview.mjs'
  },
  {
    id: 'waterfall-leader-line',
    purpose: '反向类目轴瀑布图的连接线与变化值堆叠标签',
    file: './charts/waterfall/waterfall-leader-line.mjs'
  },
  {
    id: 'label-smart-invert',
    purpose: '柱图外侧标签的智能反色配置',
    file: './components/label/label-smart-invert.mjs'
  },
  {
    id: 'radar-series',
    purpose: '雷达图多系列与角度和半径轴',
    file: './charts/radar/radar-series.mjs'
  },
  {
    id: 'radar-negative',
    purpose: '雷达图负值与面积区域',
    file: './charts/radar/radar-negative.mjs'
  },
  {
    id: 'radar-stacked',
    purpose: '雷达面积堆叠与圆形径向网格',
    file: './charts/radar/radar-stacked.mjs'
  },
  {
    id: 'range-area-horizontal',
    purpose: '横向区间面积图的上下界',
    file: './charts/range-area/range-area-horizontal.mjs'
  },
  {
    id: 'range-area-missing-bound',
    purpose: '区间面积上界缺失并叠加两条折线',
    file: './charts/range-area/range-area-missing-bound.mjs'
  },
  {
    id: 'pie-empty-placeholder',
    purpose: '空数据时显示自定义饼图占位环',
    file: './charts/pie/pie-empty-placeholder.mjs'
  },
  {
    id: 'pie-zero-placeholder',
    purpose: '全零数据时显示饼图占位环',
    file: './charts/pie/pie-zero-placeholder.mjs'
  },
  {
    id: 'pie-show-all-zero',
    purpose: 'showAllZero 下全零数据的扇区及外侧标签',
    file: './charts/pie/pie-show-all-zero.mjs'
  },
  {
    id: 'word-cloud-enlarge',
    purpose: '词云的确定性布局与放大配置',
    file: './charts/word-cloud/word-cloud-enlarge.mjs'
  },
  {
    id: 'sunburst-gap',
    purpose: '旭日图分层间隙和径向标签',
    file: './charts/sunburst/sunburst-gap.mjs'
  },
  {
    id: 'circle-packing-padding',
    purpose: '圆打包分层留白和按深度显示标签',
    file: './charts/circle-packing/circle-packing-padding.mjs'
  },
  {
    id: 'treemap-hierarchy',
    purpose: '矩形树图的层次数据与标签',
    file: './charts/treemap/treemap-hierarchy.mjs'
  },
  {
    id: 'heatmap-correlation',
    purpose: '相关矩阵热力图与固定区域及旋转标签',
    file: './charts/heatmap/heatmap-correlation.mjs'
  },
  {
    id: 'bar-percent',
    purpose: '百分比堆叠柱图与百分数刻度格式',
    file: './charts/bar/bar-percent.mjs'
  },
  {
    id: 'axis-symlog',
    purpose: '相同正负数据在线性轴和对称对数轴的布局',
    file: './components/axis/axis-symlog.mjs'
  },
  {
    id: 'mark-point-symbol',
    purpose: '标注点文字、端点配置与动态轴标签',
    file: './components/marker/mark-point-symbol.mjs'
  },
  {
    id: 'crosshair-polar-default',
    purpose: '极坐标默认选中的径向和角度 crosshair',
    file: './components/crosshair/crosshair-polar-default.mjs'
  },
  {
    id: 'update-indicator-visible',
    purpose: 'updateSpecSync 后显示仪表指标文字',
    file: './api/update-indicator-visible.mjs'
  },
  {
    id: 'update-pie-empty',
    purpose: '更新饼图数据为 null 和零后切换占位图',
    file: './api/update-pie-empty.mjs'
  },
  {
    id: 'brush-select',
    purpose: '拖拽矩形刷选后区分命中和未命中的散点',
    file: './components/brush/brush-select.mjs'
  },
  {
    id: 'custom-mark-click',
    purpose: '按 markName 绑定的自定义图元点击更新',
    file: './interaction/custom-mark-click.mjs'
  },
  {
    id: 'legend-continuous-filter',
    purpose: '拖动连续颜色图例后筛选矩形树图数据',
    file: './components/legend/legend-continuous-filter.mjs'
  },
  {
    id: 'line-missing-link',
    purpose: '连接缺失值的折线与多系列数据',
    file: './charts/line/line-missing-link.mjs'
  },
  {
    id: 'area-invalid-zero',
    purpose: '缺失值按零处理的堆叠面积与标签',
    file: './charts/area/area-invalid-zero.mjs'
  },
  {
    id: 'axis-time-brush',
    purpose: '时间轴和 dataZoom 及刷选配置共存',
    file: './components/axis/axis-time-brush.mjs'
  },
  {
    id: 'correlation-tooltip',
    purpose: '关联图布局与悬停后的 tooltip',
    file: './charts/correlation/correlation-tooltip.mjs'
  },
  {
    id: 'marker-end-symbols',
    purpose: '标注线端点符号与显隐组合',
    file: './components/marker/marker-end-symbols.mjs'
  },
  {
    id: 'marker-label-background',
    purpose: '标注线标签背景与偏移布局',
    file: './components/marker/marker-label-background.mjs'
  },
  {
    id: 'marker-statistics',
    purpose: '最小最大和平均值标注线',
    file: './components/marker/marker-statistics.mjs'
  },
  {
    id: 'marker-absolute-position',
    purpose: '绝对像素坐标标注线',
    file: './components/marker/marker-absolute-position.mjs'
  },
  {
    id: 'marker-region-position',
    purpose: '区域相对百分比坐标标注线',
    file: './components/marker/marker-region-position.mjs'
  },
  {
    id: 'marker-monotone-line',
    purpose: '标注线单调曲线路径',
    file: './components/marker/marker-monotone-line.mjs'
  },
  {
    id: 'marker-polar-coordinates',
    purpose: '极坐标角度半径标注线和标注点',
    file: './components/marker/marker-polar-coordinates.mjs'
  },
  {
    id: 'scatter-ordinal-shape',
    purpose: '散点形状与线性大小编码',
    file: './charts/scatter/scatter-ordinal-shape.mjs'
  },
  {
    id: 'scatter-ordinal-size',
    purpose: '散点离散大小编码',
    file: './charts/scatter/scatter-ordinal-size.mjs'
  },
  {
    id: 'scale-domain-expand',
    purpose: '多系列比例尺定义域扩展',
    file: './data/scale-domain-expand.mjs'
  },
  {
    id: 'scale-specified-shape',
    purpose: '公共比例尺指定值形状映射',
    file: './data/scale-specified-shape.mjs'
  },
  {
    id: 'area-stream-center',
    purpose: '流图堆叠偏移和面积布局',
    file: './charts/area/area-stream-center.mjs'
  },
  {
    id: 'axis-end-symbol',
    purpose: '坐标轴端点符号',
    file: './components/axis/axis-end-symbol.mjs'
  },
  {
    id: 'axis-explicit-domain',
    purpose: '显式轴定义域与多系列',
    file: './components/axis/axis-explicit-domain.mjs'
  },
  {
    id: 'axis-auto-rotate',
    purpose: '分类轴标签自动旋转',
    file: './components/axis/axis-auto-rotate.mjs'
  },
  {
    id: 'axis-vertical-text',
    purpose: '坐标轴标签竖排文字',
    file: './components/axis/axis-vertical-text.mjs'
  },
  {
    id: 'axis-visible-layers',
    purpose: '分类轴多层标签显示',
    file: './components/axis/axis-visible-layers.mjs'
  },
  {
    id: 'axis-trim-padding',
    purpose: '面积图分类轴两端留白裁剪',
    file: './components/axis/axis-trim-padding.mjs'
  },
  {
    id: 'axis-unit-offset',
    purpose: '自动缩进与单位文本偏移',
    file: './components/axis/axis-unit-offset.mjs'
  },
  {
    id: 'bar-stack-corner',
    purpose: '堆叠柱整体圆角和自动带宽',
    file: './charts/bar/bar-stack-corner.mjs'
  },
  {
    id: 'bar-min-width',
    purpose: '最小柱宽与自动带宽',
    file: './charts/bar/bar-min-width.mjs'
  },
  {
    id: 'bar-group-gap',
    purpose: '分组柱的组内间距',
    file: './charts/bar/bar-group-gap.mjs'
  },
  {
    id: 'bar-gradient-corner',
    purpose: '渐变柱形与圆角',
    file: './charts/bar/bar-gradient-corner.mjs'
  },
  {
    id: 'bar-gradient-label',
    purpose: '透明渐变柱与标签布局',
    file: './components/label/bar-gradient-label.mjs'
  },
  {
    id: 'box-plot-bar-shaft',
    purpose: '箱线图柱形须线和宽度',
    file: './charts/box-plot/box-plot-bar-shaft.mjs'
  },
  {
    id: 'area-series-mark',
    purpose: '面积图指定主图元',
    file: './charts/area/area-series-mark.mjs'
  },
  {
    id: 'area-step-curve',
    purpose: '面积图阶梯曲线',
    file: './charts/area/area-step-curve.mjs'
  },
  {
    id: 'area-point-outer-border',
    purpose: '面积图数据点外描边',
    file: './charts/area/area-point-outer-border.mjs'
  },
  {
    id: 'sankey-node-align',
    purpose: '桑基节点左对齐',
    file: './charts/sankey/sankey-node-align.mjs'
  },
  {
    id: 'sankey-cross-align-start',
    purpose: '桑基节点交叉方向起点对齐',
    file: './charts/sankey/sankey-cross-align-start.mjs'
  },
  {
    id: 'sankey-cross-align-end',
    purpose: '桑基节点交叉方向末端对齐',
    file: './charts/sankey/sankey-cross-align-end.mjs'
  },
  {
    id: 'sankey-cross-align-middle',
    purpose: '桑基节点交叉方向中间对齐',
    file: './charts/sankey/sankey-cross-align-middle.mjs'
  },
  {
    id: 'progress-tick-mask',
    purpose: '环形进度刻度遮罩、强制对齐及悬停指标',
    file: './charts/progress/progress-tick-mask.mjs'
  },
  {
    id: 'progress-series-track',
    purpose: '环形进度系列级轨道配置',
    file: './charts/progress/progress-series-track.mjs'
  },
  {
    id: 'scatter-radial-gradient',
    purpose: '散点径向渐变填充',
    file: './charts/scatter/scatter-radial-gradient.mjs'
  },
  {
    id: 'crosshair-dual-axis-default',
    purpose: '双轴绑定的默认选中十字线',
    file: './components/crosshair/crosshair-dual-axis-default.mjs'
  },
  {
    id: 'datazoom-vertical-initial-range',
    purpose: '纵向 dataZoom 初始范围与轴窗口',
    file: './components/datazoom/datazoom-vertical-initial-range.mjs'
  },
  {
    id: 'scrollbar-range-mode',
    purpose: '滚动条值和比例混合范围',
    file: './components/scrollbar/scrollbar-range-mode.mjs'
  },
  {
    id: 'line-end-label',
    purpose: '折线末端标签',
    file: './components/label/line-end-label.mjs'
  },
  {
    id: 'waterfall-horizontal-total',
    purpose: '横向瀑布图字段总计与累计连接',
    file: './charts/waterfall/waterfall-horizontal-total.mjs'
  },
  {
    id: 'waterfall-absolute-label',
    purpose: '瀑布图绝对值堆叠标签与字段总计',
    file: './charts/waterfall/waterfall-absolute-label.mjs'
  },
  {
    id: 'waterfall-total-tag',
    purpose: '瀑布图仅通过标记字段识别总计',
    file: './charts/waterfall/waterfall-total-tag.mjs'
  },
  {
    id: 'richtext-axis-marker',
    purpose: '轴标题标签及标注区域富文本',
    file: './components/richtext/richtext-axis-marker.mjs'
  },
  {
    id: 'richtext-funnel-label',
    purpose: '漏斗内外标签富文本和装饰',
    file: './components/richtext/richtext-funnel-label.mjs'
  },
  {
    id: 'richtext-pie-title',
    purpose: '饼图富文本标题副标题及标签',
    file: './components/richtext/richtext-pie-title.mjs'
  },
  {
    id: 'richtext-range-label',
    purpose: '区间柱富文本标签',
    file: './components/richtext/richtext-range-label.mjs'
  },
  {
    id: 'richtext-line-end-label',
    purpose: '折线末端富文本标签',
    file: './components/richtext/richtext-line-end-label.mjs'
  },
  {
    id: 'richtext-marker-label',
    purpose: '散点标注线富文本标签',
    file: './components/richtext/richtext-marker-label.mjs'
  },
  {
    id: 'richtext-extension-mark',
    purpose: '组合图自定义富文本图元',
    file: './components/richtext/richtext-extension-mark.mjs'
  },
  {
    id: 'treemap-nonleaf-label',
    purpose: '矩形树图父节点显示与标签格式化',
    file: './charts/treemap/treemap-nonleaf-label.mjs'
  },
  {
    id: 'axis-polar-title-background',
    purpose: '极坐标轴标题背景与内部刻度',
    file: './components/axis/axis-polar-title-background.mjs'
  },
  {
    id: 'indicator-autofit',
    purpose: '环图指标文字自动适应',
    file: './components/indicator/indicator-autofit.mjs'
  },
  {
    id: 'marker-format-statistics',
    purpose: '统计标注区域与标注线标签回调',
    file: './components/marker/marker-format-statistics.mjs'
  },
  {
    id: 'marker-label-confine',
    purpose: '标注线标签边界约束与端点符号',
    file: './components/marker/marker-label-confine.mjs'
  },
  {
    id: 'marker-multi-segment',
    purpose: '多段标注线连接方向及扩展距离',
    file: './components/marker/marker-multi-segment.mjs'
  },
  {
    id: 'marker-expand-callback',
    purpose: '多段标注线扩展距离回调',
    file: './components/marker/marker-expand-callback.mjs'
  },
  {
    id: 'marker-background-shape',
    purpose: '标注线标签自定义背景路径',
    file: './components/marker/marker-background-shape.mjs'
  },
  {
    id: 'waterfall-total-callback',
    purpose: '瀑布图总计计算回调',
    file: './charts/waterfall/waterfall-total-callback.mjs'
  },
  {
    id: 'waterfall-summary-total',
    purpose: '瀑布图自动汇总与标签格式化',
    file: './charts/waterfall/waterfall-summary-total.mjs'
  },
  {
    id: 'axis-label-callback',
    purpose: '坐标轴标签格式化回调',
    file: './components/axis/axis-label-callback.mjs'
  },
  {
    id: 'scatter-size-callback',
    purpose: '反向坐标轴与散点大小回调',
    file: './charts/scatter/scatter-size-callback.mjs'
  },
  {
    id: 'scatter-shape-callback',
    purpose: '散点形状大小回调编码',
    file: './charts/scatter/scatter-shape-callback.mjs'
  },
  {
    id: 'area-selected-state',
    purpose: '面积图数据点点击选中',
    file: './interaction/area-selected-state.mjs'
  },
  {
    id: 'combination-hover-reverse',
    purpose: '混合系列悬停与反向弱化状态',
    file: './interaction/combination-hover-reverse.mjs'
  },
  {
    id: 'line-hover-reverse',
    purpose: '折线点悬停与反向弱化',
    file: './interaction/line-hover-reverse.mjs'
  },
  {
    id: 'line-selected-reverse',
    purpose: '关闭悬停后折线点选中与反向状态',
    file: './interaction/line-selected-reverse.mjs'
  },
  {
    id: 'radar-selected-reverse',
    purpose: '关闭悬停后雷达点选中与反向状态',
    file: './interaction/radar-selected-reverse.mjs'
  },
  {
    id: 'rose-selected-state',
    purpose: '关闭悬停后玫瑰扇区选中',
    file: './interaction/rose-selected-state.mjs'
  },
  {
    id: 'legend-clear-selection',
    purpose: '图例全部取消后恢复选择（空态检查不截图）',
    file: './components/legend/legend-clear-selection.mjs'
  },
  {
    id: 'legend-single-selection',
    purpose: '单选图例切换与数据过滤',
    file: './components/legend/legend-single-selection.mjs'
  },
  {
    id: 'scrollbar-drag-window',
    purpose: '拖动横向滚动条改变可视窗口',
    file: './components/scrollbar/scrollbar-drag-window.mjs'
  },
  {
    id: 'scrollbar-drag-axis',
    purpose: '拖动滚动条调整轴范围',
    file: './components/scrollbar/scrollbar-drag-axis.mjs'
  },
  {
    id: 'scrollbar-drag-vertical',
    purpose: '拖动纵向滚动条改变范围',
    file: './components/scrollbar/scrollbar-drag-vertical.mjs'
  },
  {
    id: 'treemap-selection-persist',
    purpose: '矩形树图 triggerOff=none 时空白点击保留选择',
    file: './interaction/treemap-selection-persist.mjs'
  },
  {
    id: 'treemap-label-state',
    purpose: '矩形树图标签同步选中状态',
    file: './interaction/treemap-label-state.mjs'
  },
  {
    id: 'funnel-right-align-top',
    purpose: '右向漏斗顶部对齐与长外标签',
    file: './charts/funnel/funnel-right-align-top.mjs'
  },
  {
    id: 'funnel-right-align-bottom',
    purpose: '右向漏斗底部对齐与长外标签',
    file: './charts/funnel/funnel-right-align-bottom.mjs'
  },
  {
    id: 'funnel-bottom-align-left',
    purpose: '下向漏斗左对齐',
    file: './charts/funnel/funnel-bottom-align-left.mjs'
  },
  {
    id: 'funnel-bottom-align-right',
    purpose: '下向漏斗右对齐',
    file: './charts/funnel/funnel-bottom-align-right.mjs'
  },
  {
    id: 'funnel-cone-transform',
    purpose: '锥形漏斗与转化区域标签',
    file: './charts/funnel/funnel-cone-transform.mjs'
  },
  {
    id: 'progress-vertical-padding',
    purpose: '纵向线性进度左右内边距',
    file: './charts/progress/progress-vertical-padding.mjs'
  },
  {
    id: 'progress-threshold-color',
    purpose: '线性进度阈值颜色映射',
    file: './charts/progress/progress-threshold-color.mjs'
  },
  {
    id: 'box-plot-outliers',
    purpose: '横向箱线图正负异常点',
    file: './charts/box-plot/box-plot-outliers.mjs'
  },
  {
    id: 'line-percent-negative',
    purpose: '正负数据百分比堆叠折线',
    file: './charts/line/line-percent-negative.mjs'
  },
  {
    id: 'tooltip-click',
    purpose: '点击触发HTML提示框',
    file: './components/tooltip/tooltip-click.mjs'
  },
  {
    id: 'tooltip-trigger-off-none',
    purpose: '移出图元后保持提示框',
    file: './components/tooltip/tooltip-trigger-off-none.mjs'
  },
  {
    id: 'tooltip-canvas-click',
    purpose: '点击触发Canvas提示框',
    file: './components/tooltip/tooltip-canvas-click.mjs'
  },
  {
    id: 'tooltip-disabled',
    purpose: '关闭提示框时鼠标事件仍实际发生',
    file: './components/tooltip/tooltip-disabled.mjs'
  },
  {
    id: 'tooltip-canvas-hover',
    purpose: '悬停柱形显示Canvas提示框',
    file: './components/tooltip/tooltip-canvas-hover.mjs'
  },
  {
    id: 'tooltip-title-hidden',
    purpose: '隐藏mark提示框标题',
    file: './components/tooltip/tooltip-title-hidden.mjs'
  },
  {
    id: 'tooltip-position-top',
    purpose: 'mark提示框顶部定位',
    file: './components/tooltip/tooltip-position-top.mjs'
  },
  {
    id: 'tooltip-position-left',
    purpose: 'mark提示框左侧定位',
    file: './components/tooltip/tooltip-position-left.mjs'
  },
  {
    id: 'tooltip-position-right',
    purpose: 'mark提示框右侧定位',
    file: './components/tooltip/tooltip-position-right.mjs'
  },
  {
    id: 'tooltip-position-bottom',
    purpose: 'mark提示框底部定位',
    file: './components/tooltip/tooltip-position-bottom.mjs'
  },
  {
    id: 'tooltip-position-inside',
    purpose: 'mark提示框图元内部定位',
    file: './components/tooltip/tooltip-position-inside.mjs'
  },
  {
    id: 'update-axis-sampling',
    purpose: '更新轴 sampling 开关后保留旋转标签',
    file: './api/update/update-axis-sampling.mjs'
  },
  {
    id: 'box-plot-api-hover',
    purpose: '分组箱线图公开 API 设置悬停状态',
    file: './api/state/box-plot-api-hover.mjs'
  },
  {
    id: 'update-legend-data',
    purpose: '图例选择后更新分类数据',
    file: './api/update/update-legend-data.mjs'
  },
  {
    id: 'sunburst-drill',
    purpose: '点击旭日图父节点下钻',
    file: './interaction/sunburst-drill.mjs'
  },
  {
    id: 'funnel-left-align-top',
    purpose: '左向漏斗顶部对齐与外标签',
    file: './charts/funnel/funnel-left-align-top.mjs'
  },
  {
    id: 'funnel-left-align-bottom',
    purpose: '左向漏斗底部对齐与外标签',
    file: './charts/funnel/funnel-left-align-bottom.mjs'
  },
  {
    id: 'axis-force-tick-count',
    purpose: '多个数值轴的 tickCount 与 forceTickCount 组合',
    file: './components/axis/axis-force-tick-count.mjs'
  },
  {
    id: 'range-area-vertical',
    purpose: '纵向区间面积的上下界及半透明填充',
    file: './charts/range-area/range-area-vertical.mjs'
  },
  {
    id: 'range-area-average-line',
    purpose: '独立数据源的区间面积与平均值折线组合',
    file: './charts/range-area/range-area-average-line.mjs'
  },
  {
    id: 'axis-inside-four-sides',
    purpose: '四方向轴的内侧刻度、标签格式与轴线组合',
    file: './components/axis/axis-inside-four-sides.mjs'
  },
  {
    id: 'marker-extension-quadrants',
    purpose: '散点象限标区与依赖 region 布局的扩展图元',
    file: './components/marker/marker-extension-quadrants.mjs'
  },
  {
    id: 'marker-richtext-position',
    purpose: '起止点富文本标注的尺寸与偏移',
    file: './components/richtext/marker-richtext-position.mjs'
  },
  {
    id: 'axis-time-layer-step',
    purpose: '时间轴 layers 的 tickStep 与混合范围数据',
    file: './components/axis/axis-time-layer-step.mjs'
  },
  {
    id: 'axis-tick-count-callback',
    purpose: '依据轴长和字体计算数值轴刻度数量',
    file: './components/axis/axis-tick-count-callback.mjs'
  },
  {
    id: 'marker-richtext-content',
    purpose: '富文本标注的行内样式与独立末端内容',
    file: './components/richtext/marker-richtext-content.mjs'
  },
  {
    id: 'marker-area-richtext',
    purpose: '标区内部富文本标签的排版',
    file: './components/richtext/marker-area-richtext.mjs'
  },
  {
    id: 'marker-coordinate-callbacks',
    purpose: '依据轴域和数据计算线、区、点坐标',
    file: './components/marker/marker-coordinate-callbacks.mjs'
  },
  {
    id: 'axis-region-overlap',
    purpose: '关联不同系列的 region-relative-overlap 多轴布局',
    file: './components/axis/axis-region-overlap.mjs'
  },
  {
    id: 'bar-stack-sort-min-height',
    purpose: '多数据源堆叠排序、逆序与最小柱高',
    file: './charts/bar/bar-stack-sort-min-height.mjs'
  },
  {
    id: 'axis-sync-scrollbar',
    purpose: '横向柱图的双数值轴刻度同步与滚动条',
    file: './components/axis/axis-sync-scrollbar.mjs'
  },
  {
    id: 'pie-label-custom-path',
    purpose: '外标签引导线自定义折角路径',
    file: './components/label/pie-label-custom-path.mjs'
  },
  {
    id: 'area-mark-hover',
    purpose: '面积图点与面积分别悬停的真实状态',
    file: './interaction/area-mark-hover.mjs'
  },
  {
    id: 'tooltip-content-reduce',
    purpose: '来源 Tooltip 配置、实际提示内容及移出隐藏',
    file: './components/tooltip/tooltip-content-reduce.mjs'
  },
  {
    id: 'tooltip-dimension-style',
    purpose: '来源 Tooltip 配置、实际提示内容及移出隐藏',
    file: './components/tooltip/tooltip-dimension-style.mjs'
  },
  {
    id: 'axis-richtext-tooltip',
    purpose: '来源 Tooltip 配置、实际提示内容及移出隐藏',
    file: './components/tooltip/axis-richtext-tooltip.mjs'
  },
  {
    id: 'tooltip-series-dimension',
    purpose: '来源 Tooltip 配置、实际提示内容及移出隐藏',
    file: './components/tooltip/tooltip-series-dimension.mjs'
  },
  {
    id: 'axis-poptip-flush',
    purpose: '截断轴标签悬停后显示完整文本（源录制 poptip）',
    file: './components/axis/axis-poptip-flush.mjs'
  },
  {
    id: 'axis-poptip-rotated',
    purpose: '截断轴标签悬停后显示完整文本（源录制 poptip）',
    file: './components/axis/axis-poptip-rotated.mjs'
  },
  {
    id: 'legend-hover-state',
    purpose: '图例悬停反向状态、移出恢复与单选筛选',
    file: './components/legend/legend-hover-state.mjs'
  },
  {
    id: 'legend-hover-no-filter',
    purpose: '图例悬停反向状态、移出恢复',
    file: './components/legend/legend-hover-no-filter.mjs'
  },
  {
    id: 'hover-series-api',
    purpose: '源 pointerover 回调按 Age 更新同组及反向状态',
    file: './interaction/hover-series-api.mjs'
  },
  {
    id: 'update-full-data-marker',
    purpose: 'updateFullDataSync 原始更新值与标记组件',
    file: './api/update/update-full-data-marker.mjs'
  },
  {
    id: 'pie-update-zero',
    purpose: '全零饼图经原始 updateData 更新为有效扇区',
    file: './api/update/pie-update-zero.mjs'
  },
  {
    id: 'dimension-index-area',
    purpose: 'setDimensionIndex 定位来源指定维度的十字线',
    file: './api/state/dimension-index-area.mjs'
  },
  {
    id: 'custom-mark-text-click',
    purpose: '来源 customMark 点击回调修改实际图元',
    file: './interaction/custom-mark-text-click.mjs'
  },
  {
    id: 'custom-mark-fill-click',
    purpose: '来源 customMark 点击回调修改实际图元',
    file: './interaction/custom-mark-fill-click.mjs'
  },
  {
    id: 'datazoom-min-max-span',
    purpose: '来源 DataZoom 拖动及有效范围约束',
    file: './components/datazoom/datazoom-min-max-span.mjs'
  },
  {
    id: 'datazoom-vertical-fixed-span',
    purpose: '来源 DataZoom 拖动及有效范围约束',
    file: './components/datazoom/datazoom-vertical-fixed-span.mjs'
  },
  {
    id: 'datazoom-time-span',
    purpose: '来源 DataZoom 拖动及有效范围约束',
    file: './components/datazoom/datazoom-time-span.mjs'
  },
  {
    id: 'datazoom-preview-brush',
    purpose: '来源 DataZoom 拖动及有效范围约束',
    file: './components/datazoom/datazoom-preview-brush.mjs'
  },
  {
    id: 'scrollbar-auto',
    purpose: '来源滚动条拖动与实际可视范围',
    file: './components/scrollbar/scrollbar-auto.mjs'
  },
  {
    id: 'scrollbar-crosshair',
    purpose: '来源滚动条拖动与实际可视范围',
    file: './components/scrollbar/scrollbar-crosshair.mjs'
  },
  {
    id: 'scrollbar-axis-click-update',
    purpose: '来源滚动条拖动后点击轴标签更新柱颜色',
    file: './components/scrollbar/scrollbar-axis-click-update.mjs'
  },
  {
    id: 'sankey-selected-adjacency',
    purpose: '点击桑基节点时仅高亮相邻节点与连接，空白点击恢复',
    file: './charts/sankey/sankey-selected-adjacency.mjs'
  },
  {
    id: 'sankey-adjacency',
    purpose: '点击桑基节点时仅高亮相邻节点与连接，空白点击恢复',
    file: './charts/sankey/sankey-adjacency.mjs'
  },
  {
    id: 'sankey-node-state',
    purpose: '来源桑基节点悬停与点击状态',
    file: './charts/sankey/sankey-node-state.mjs'
  },
  {
    id: 'circle-packing-drill-rooted',
    purpose: '来源层级图下钻与空白回退的路径和实际布局',
    file: './charts/circle-packing/circle-packing-drill-rooted.mjs'
  },
  {
    id: 'circle-packing-drill-forest',
    purpose: '来源层级图下钻与空白回退的路径和实际布局',
    file: './charts/circle-packing/circle-packing-drill-forest.mjs'
  },
  {
    id: 'circle-packing-drill-event',
    purpose: '来源层级图下钻与空白回退的路径和实际布局',
    file: './charts/circle-packing/circle-packing-drill-event.mjs'
  },
  {
    id: 'treemap-drill',
    purpose: '来源层级图下钻与空白回退的路径和实际布局',
    file: './charts/treemap/treemap-drill.mjs'
  },
  {
    id: 'brush-polygon',
    purpose: '来源多边形刷选的实际命中及排除状态',
    file: './interaction/brush-polygon.mjs'
  },
  {
    id: 'brush-region-link',
    purpose: '来源跨区域刷选联动的实际命中及排除状态',
    file: './interaction/brush-region-link.mjs'
  },
  {
    id: 'indicator-richtext-click',
    purpose: '饼图选择触发富文本指标及对应数值',
    file: './components/indicator/indicator-richtext-click.mjs'
  },
  {
    id: 'pie-label-hover',
    purpose: '半圆饼图悬停状态及标签引导线布局',
    file: './charts/pie/pie-label-hover.mjs'
  },
  {
    id: 'funnel-outer-label-line',
    purpose: '来源漏斗外标签对齐、虚线与悬停',
    file: './charts/funnel/funnel-outer-label-line.mjs'
  },
  {
    id: 'legend-custom-value',
    purpose: '自定义图例值与点击后的真实数据筛选',
    file: './components/legend/legend-custom-value.mjs'
  },
  {
    id: 'crosshair-polar-formatters',
    purpose: '极坐标十字线分类和数值 formatter 的真实悬停输出',
    file: './components/crosshair/crosshair-polar-formatters.mjs'
  },
  {
    id: 'theme-runtime-switch',
    purpose: '来源主题注册和实例切换后的圆角与配色',
    file: './theme/theme-runtime-switch.mjs'
  },
  {
    id: 'theme-chart-components',
    purpose: '来源图表主题启用柱标签并定位左侧图例',
    file: './theme/theme-chart-components.mjs'
  },
  {
    id: 'funnel-extension-select',
    purpose: '来源漏斗扩展图元、初始选择和后续点击选择切换',
    file: './charts/funnel/funnel-extension-select.mjs'
  },
  {
    id: 'media-query-width',
    purpose: '来源媒体查询注册、缩窄后隐藏左侧坐标轴标签',
    file: './layout/media-query-width.mjs'
  }
];

/**
 * 从当前清单所在目录加载用例，冻结副本不回到工作区取代码。
 * @param {CaseMetadata} item
 * @returns {Promise<VisualCase>}
 */
export async function loadCase(item) {
  return (await import(new URL(item.file, import.meta.url))).default;
}
