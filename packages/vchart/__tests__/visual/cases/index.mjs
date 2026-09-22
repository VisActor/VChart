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
