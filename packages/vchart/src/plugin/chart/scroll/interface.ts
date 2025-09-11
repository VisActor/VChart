import type { ScrollBarAttributes } from '@visactor/vrender-components';
import type { IChartPlugin } from '../interface';

/**
 * IScrollPlugin 接口定义
 * @since 1.0.0
 */
export type IScrollPlugin = IChartPlugin;

export interface IScrollPluginSpec {
  x?: {
    /**
     * 是否支持水平滚动
     */
    enable: boolean;
  } & Omit<ScrollBarAttributes, 'direction' | 'range'>;

  y?: {
    /**
     * 是否支持垂直滚动
     */
    enable: boolean;
  } & Omit<ScrollBarAttributes, 'direction' | 'range'>;
}
