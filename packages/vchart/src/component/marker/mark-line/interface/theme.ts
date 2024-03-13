import type { IMarkLineLabelPosition } from '@visactor/vrender-components';
import type { ILineMarkSpec } from '../../../../typings';
import type { IMarkerLabelSpec, IMarkerSymbol } from '../../interface';

export interface IMarkLineTheme {
  line?: {
    style?: ILineMarkSpec;
  };

  label?: {
    /**
     * label整体 - 相对line的位置
     */
    position?: keyof typeof IMarkLineLabelPosition;
  } & IMarkerLabelSpec;

  startSymbol?: IMarkerSymbol;

  endSymbol?: IMarkerSymbol;
}
