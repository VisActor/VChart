import type { IMarkCommonArcLabelPosition, IMarkLineLabelPosition } from '@visactor/vrender-components';
import type { IArcMarkSpec, ILineMarkSpec } from '../../../../typings';
import type { IMarkerLabelSpec, IMarkerState, IMarkerSymbol } from '../../interface';

export interface IMarkLineTheme {
  /**
   * 标注线的线样式
   */
  line?: Partial<IMarkerState<ILineMarkSpec | IArcMarkSpec>>;
  /**
   * 标注线的标签样式
   */
  label?: {
    /**
     * label整体 - 相对line的位置
     */
    position?: keyof typeof IMarkLineLabelPosition | IMarkCommonArcLabelPosition;
  } & IMarkerLabelSpec;

  /**
   * 线标注起点symbol样式
   */
  startSymbol?: IMarkerSymbol;
  /**
   * 线标注终点symbol样式
   */
  endSymbol?: IMarkerSymbol;
}
