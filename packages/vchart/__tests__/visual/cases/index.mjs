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
