import type { IMarkAreaLabelPosition } from '@visactor/vrender-components';
import type { ConvertToMarkStyleSpec, IPolygonMarkSpec } from '../../../../typings';
import type { IMarkerLabelSpec } from '../../interface';

export interface IMarkAreaTheme {
  area?: {
    style?: ConvertToMarkStyleSpec<Omit<IPolygonMarkSpec, 'visible'>>;
  };

  label?: {
    /**
     * label整体 - 相对line的位置
     */
    position?: IMarkAreaLabelPosition;
  } & IMarkerLabelSpec;
}
