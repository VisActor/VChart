import type { DataView } from '@visactor/vdataset';
import type { IGrammarItem } from '../interface';
export interface ICompilableData extends IGrammarItem {
    getDataView: () => DataView;
    setDataView: (d?: DataView) => void;
    getLatestData: () => any[];
    updateData: (noRender?: boolean) => Promise<any>;
}
