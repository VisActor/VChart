import type { IMarkAreaLabelPosition } from '@visactor/vrender-components';
import type { IPolygonMarkSpec } from '../../../../typings';
import type { IMarkerLabelSpec } from '../../interface';

export interface IMarkAreaTheme {
  area?: {
    style?: Omit<IPolygonMarkSpec, 'visible'>;
  };

  label?: {
    /**
     * label整体 - 相对line的位置
     */
    position?: IMarkAreaLabelPosition;
  } & IMarkerLabelSpec;
}
