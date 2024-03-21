import type { IVChartConstructor } from '@visactor/vchart';
import { BaseChartProps, createChart } from './charts/BaseChart';

export type VChartSimpleProps = Omit<BaseChartProps, 'container' | 'data' | 'width' | 'height' | 'vchartConstrouctor'>;

export const VChartSimple = createChart<VChartSimpleProps & { vchartConstrouctor: IVChartConstructor }>('VChartSimple');
