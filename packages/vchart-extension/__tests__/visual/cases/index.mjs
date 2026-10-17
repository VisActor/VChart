export const cases = [
  {
    id: 'sequence-preview-filter',
    purpose: '时序图缩略图不累加用户 ID，连线随 dataZoom 时间选区过滤',
    file: './components/datazoom/sequence-preview-filter.mjs'
  },
  {
    id: 'sequence-link-data',
    purpose: 'dot 嵌套原始数据与更新后的连接端点',
    file: './api/update/sequence-link-data.mjs'
  },
  {
    id: 'sequence-curve-link',
    purpose: '曲线连接在配置与数据更新后保持路径稳定并应用公开 link 配置',
    file: './api/update/sequence-curve-link.mjs'
  }
];

/** 从冻结清单所在目录加载用例，与核心套件共用同一加载契约。 */
export async function loadCase(item) {
  return (await import(new URL(item.file, import.meta.url))).default;
}
