import type { IMarkLineLabelPosition } from '@visactor/vrender-components';
import type { ConvertToMarkStyleSpec, ILineMarkSpec } from '../../../../typings';
import type { IMarkerLabelSpec, IMarkerSymbol } from '../../interface';

export interface IMarkLineTheme {
  line?: {
    style?: ConvertToMarkStyleSpec<Omit<ILineMarkSpec, 'visible'>>;
  };

  label?: {
    /**
     * label整体 - 相对line的位置
     */
    position?: keyof typeof IMarkLineLabelPosition;
  } & IMarkerLabelSpec;

  startSymbol: IMarkerSymbol;

  endSymbol: IMarkerSymbol;
}
