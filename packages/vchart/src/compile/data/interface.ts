import type { DataView } from '@visactor/vdataset';
import type { IGrammarItem } from '../interface';

export interface ICompilableData extends IGrammarItem {
  getDataView: () => DataView;
  setDataView: (d?: DataView) => void;
  getLatestData: () => any[];
  /** 更新数据并默认重新渲染 */
  updateData: (noRender?: boolean) => void;
}
