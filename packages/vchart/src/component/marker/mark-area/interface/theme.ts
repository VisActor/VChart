import type { IMarkAreaLabelPosition } from '@visactor/vrender-components';
import type { IPolygonMarkSpec } from '../../../../typings';
import type { IMarkerLabelWithoutRefSpec } from '../../interface';

export interface IMarkAreaTheme {
  area?: {
    style?: IPolygonMarkSpec;
  };

  label?: {
    /**
     * label整体 - 相对line的位置
     */
    position?: keyof typeof IMarkAreaLabelPosition;
  } & IMarkerLabelWithoutRefSpec;
}
