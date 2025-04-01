import type { IMarkAreaLabelPosition, IMarkCommonArcLabelPosition } from '@visactor/vrender-components';
import type { IArcMarkSpec, IPolygonMarkSpec } from '../../../../typings';
import type { IMarkerLabelWithoutRefSpec, IMarkerState } from '../../interface';

export type IMarkAreaLabel = {
  /**
   * label整体 - 相对line的位置
   */
  position?: keyof typeof IMarkAreaLabelPosition | IMarkCommonArcLabelPosition;
} & IMarkerLabelWithoutRefSpec;

export interface IMarkAreaTheme {
  /**
   * 标记区域的样式
   */
  area?: Partial<IMarkerState<IPolygonMarkSpec | IArcMarkSpec>>;
  /**
   * 标记区域的标签样式配置
   */
  label?: IMarkAreaLabel | IMarkAreaLabel[];
}
