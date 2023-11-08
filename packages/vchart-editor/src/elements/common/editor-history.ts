import type { VChartEditor } from '../../core/vchart-editor';
import type { HistorySnapshot, ElementInfo, IHistory } from './../../core/interface';

export function getCommonHistoryUse(ctx: VChartEditor, updateCall?: (to: HistorySnapshot) => void) {
  const commonHistoryUse: IHistory['use'] = (element: ElementInfo, from: HistorySnapshot, to: HistorySnapshot) => {
    const layer = ctx.getLayers().find(l => l.id === element.layerId);
    if (!layer) {
      return;
    }
    const el = layer.elements.find(e => e.id === element.id);
    if (!el) {
      // 没找到
      if (from) {
        console.warn('The element to be edited was not found！', { ...element });
        return;
      }
      // 新增
      if (to) {
        ctx.addElements(element.type, to, false);
        return;
      }
    }
    if (el) {
      // 删除
      if (!to) {
        ctx.deleteElement(el.id as string, false);
      }
      // 修改
      if (to) {
        updateCall ? updateCall(to) : el.updateAttributeFromHistory(to);
      }
    }
  };
  return commonHistoryUse;
}
