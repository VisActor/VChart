import type { IMarkCommonArcLabelPosition, IMarkLineLabelPosition } from '@visactor/vrender-components';
import type { IArcMarkSpec, ILineMarkSpec } from '../../../../typings';
import type { IMarkerLabelSpec, IMarkerState, IMarkerSymbol } from '../../interface';

export interface IMarkLineTheme {
  line?: Partial<IMarkerState<ILineMarkSpec | IArcMarkSpec>>;

  label?: {
    /**
     * label整体 - 相对line的位置
     */
    position?: keyof typeof IMarkLineLabelPosition | IMarkCommonArcLabelPosition;
  } & IMarkerLabelSpec;

  startSymbol?: IMarkerSymbol;

  endSymbol?: IMarkerSymbol;
}
