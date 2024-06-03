import type { IBarSeriesSpec, IBarSeriesTheme } from '../bar/interface';

export interface IMosaicSeriesSpec extends Omit<IBarSeriesSpec, 'type'> {
  /** 系列类型 */
  type: 'mosaic';
}

export type IMosaicSeriesTheme = IBarSeriesTheme;
