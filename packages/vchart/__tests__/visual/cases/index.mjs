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
  { id: 'area-horizontal', purpose: '横向面积图的数据映射与坐标布局', file: './charts/area/area-horizontal.mjs' },
  { id: 'area-negative', purpose: '面积图正负值与零基线', file: './charts/area/area-negative.mjs' },
  { id: 'area-missing', purpose: '面积图缺失值及源无效数据策略', file: './charts/area/area-missing.mjs' },
  { id: 'area-stacked', purpose: '多组面积图堆叠与图例', file: './charts/area/area-stacked.mjs' },
  { id: 'area-unstacked', purpose: '多组面积图关闭堆叠后的相交布局', file: './charts/area/area-unstacked.mjs' },
  { id: 'line-step', purpose: '阶梯折线的曲线类型与点布局', file: './charts/line/line-step.mjs' },
  { id: 'line-monotone', purpose: '单调平滑折线与点布局', file: './charts/line/line-monotone.mjs' },
  { id: 'bar-group', purpose: '分组柱图的双分类字段与系列', file: './charts/bar/bar-group.mjs' },
  { id: 'bar-three-level-gap', purpose: '三层分组柱图的组内间距', file: './charts/bar/bar-three-level-gap.mjs' },
  { id: 'bar-width-limit', purpose: '柱宽与最大柱宽共同配置', file: './charts/bar/bar-width-limit.mjs' },
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
  { id: 'funnel-transform', purpose: '转化漏斗的转化标签与外侧标签', file: './charts/funnel/funnel-transform.mjs' },
  { id: 'gauge-gradient', purpose: '仪表盘渐变圆弧和指针组件', file: './charts/gauge/gauge-gradient.mjs' },
  { id: 'gauge-tick-segment', purpose: '仪表盘刻度分段和指针', file: './charts/gauge/gauge-tick-segment.mjs' },
  { id: 'rose-stack', purpose: '玫瑰图分组数据的堆叠', file: './charts/rose/rose-stack.mjs' },
  { id: 'rose-group', purpose: '玫瑰图分组与极坐标轴', file: './charts/rose/rose-group.mjs' },
  { id: 'sankey-horizontal', purpose: '横向桑基图节点和连接布局', file: './charts/sankey/sankey-horizontal.mjs' },
  { id: 'sankey-vertical', purpose: '纵向桑基图节点和连接布局', file: './charts/sankey/sankey-vertical.mjs' },
  { id: 'axis-log', purpose: '对数坐标轴的刻度与折线位置', file: './components/axis/axis-log.mjs' },
  { id: 'axis-zero-align', purpose: '双数值轴在零点两侧对齐', file: './components/axis/axis-zero-align.mjs' },
  { id: 'axis-tick-align', purpose: '双数值轴的刻度对齐', file: './components/axis/axis-tick-align.mjs' },
  {
    id: 'axis-polar-multiple-labels',
    purpose: '极坐标多层标签布局',
    file: './components/axis/axis-polar-multiple-labels.mjs'
  },
  { id: 'axis-multilevel-wrap', purpose: '多层分类轴标签自动换行', file: './components/axis/axis-multilevel-wrap.mjs' },
  { id: 'axis-break', purpose: '数值轴断轴及柱图分段', file: './components/axis/axis-break.mjs' },
  { id: 'axis-unit-position', purpose: '轴单位在指定位置显示', file: './components/axis/axis-unit-position.mjs' },
  {
    id: 'mark-area-multiple',
    purpose: '多块标注区域与折线坐标映射',
    file: './components/marker/mark-area-multiple.mjs'
  },
  { id: 'mark-line-coordinates', purpose: '坐标点定位标注线', file: './components/marker/mark-line-coordinates.mjs' },
  {
    id: 'scale-domain-replace',
    purpose: '公共比例尺替换定义域后作用于双散点系列',
    file: './data/scale-domain-replace.mjs'
  },
  { id: 'data-fields-domain', purpose: '数据字段定义域与散点编码', file: './data/data-fields-domain.mjs' },
  {
    id: 'combination-line-pie',
    purpose: '折线和饼图在独立区域共存',
    file: './charts/combination/combination-line-pie.mjs'
  },
  { id: 'pie-nested', purpose: '多系列嵌套环形饼图', file: './charts/pie/pie-nested.mjs' },
  { id: 'pie-radius-scale', purpose: '饼图半径字段编码', file: './charts/pie/pie-radius-scale.mjs' },
  { id: 'theme-stack', purpose: '堆叠面积图的专用主题样式', file: './theme/theme-stack.mjs' },
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
  { id: 'radar-series', purpose: '雷达图多系列与角度和半径轴', file: './charts/radar/radar-series.mjs' },
  { id: 'radar-negative', purpose: '雷达图负值与面积区域', file: './charts/radar/radar-negative.mjs' },
  { id: 'radar-stacked', purpose: '雷达面积堆叠与圆形径向网格', file: './charts/radar/radar-stacked.mjs' },
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
  { id: 'pie-zero-placeholder', purpose: '全零数据时显示饼图占位环', file: './charts/pie/pie-zero-placeholder.mjs' },
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
  { id: 'sunburst-gap', purpose: '旭日图分层间隙和径向标签', file: './charts/sunburst/sunburst-gap.mjs' },
  {
    id: 'circle-packing-padding',
    purpose: '圆打包分层留白和按深度显示标签',
    file: './charts/circle-packing/circle-packing-padding.mjs'
  },
  { id: 'treemap-hierarchy', purpose: '矩形树图的层次数据与标签', file: './charts/treemap/treemap-hierarchy.mjs' },
  {
    id: 'heatmap-correlation',
    purpose: '相关矩阵热力图与固定区域及旋转标签',
    file: './charts/heatmap/heatmap-correlation.mjs'
  },
  { id: 'bar-percent', purpose: '百分比堆叠柱图与百分数刻度格式', file: './charts/bar/bar-percent.mjs' },
  { id: 'axis-symlog', purpose: '相同正负数据在线性轴和对称对数轴的布局', file: './components/axis/axis-symlog.mjs' },
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
  { id: 'update-pie-empty', purpose: '更新饼图数据为 null 和零后切换占位图', file: './api/update-pie-empty.mjs' },
  { id: 'brush-select', purpose: '拖拽矩形刷选后区分命中和未命中的散点', file: './components/brush/brush-select.mjs' },
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
  { id: 'line-missing-link', purpose: '连接缺失值的折线与多系列数据', file: './charts/line/line-missing-link.mjs' },
  { id: 'area-invalid-zero', purpose: '缺失值按零处理的堆叠面积与标签', file: './charts/area/area-invalid-zero.mjs' },
  { id: 'axis-time-brush', purpose: '时间轴和 dataZoom 及刷选配置共存', file: './components/axis/axis-time-brush.mjs' },
  {
    id: 'correlation-tooltip',
    purpose: '关联图布局与悬停后的 tooltip',
    file: './charts/correlation/correlation-tooltip.mjs'
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
