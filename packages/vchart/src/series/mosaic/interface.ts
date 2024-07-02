import type { Functional } from '@visactor/vrender-components';
import type { ILabelSpec, IMultiLabelSpec } from '../../component/label/interface';
import type { IBarSeriesSpec, IBarSeriesTheme } from '../bar/interface';
import type { SeriesMarkNameEnum } from '../interface/type';

export interface IMosaicSeriesSpec extends Omit<IBarSeriesSpec, 'type' | 'label'> {
  /** 系列类型 */
  type: 'mosaic';
  [SeriesMarkNameEnum.label]?: IMultiLabelSpec<
    Omit<ILabelSpec, 'position'> & {
      filterByGroup?: {
        field: string;
        type?: 'min' | 'max';
        filter?: (d: any) => boolean;
      };

      /**
       * 标签位置
       * @since 1.6.0
       * 支持'top-right' | 'top-left'| 'bottom-right' | 'bottom-left'，以及函数形式配置
       * */
      position?: Functional<
        | 'outside'
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'inside'
        | 'inside-top'
        | 'inside-bottom'
        | 'inside-right'
        | 'inside-left'
        | 'top-right'
        | 'top-left'
        | 'bottom-right'
        | 'bottom-left'
      >;
    }
  >;
}

export type IMosaicSeriesTheme = IBarSeriesTheme;
