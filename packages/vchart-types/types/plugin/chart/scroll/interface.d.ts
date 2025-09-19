import type { ScrollBarAttributes } from '@visactor/vrender-components';
import type { IChartPlugin } from '../interface';
export type IScrollPlugin = IChartPlugin;
export interface IScrollPluginSpec {
    x?: {
        enable: boolean;
    } & Omit<ScrollBarAttributes, 'direction' | 'range'>;
    y?: {
        enable: boolean;
    } & Omit<ScrollBarAttributes, 'direction' | 'range'>;
}
