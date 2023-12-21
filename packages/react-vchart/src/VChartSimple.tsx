import { BaseChartProps, createChart } from './charts/BaseChart';

export type VChartSimpleProps = Omit<BaseChartProps, 'container' | 'data' | 'width' | 'height'>;

export const VChartSimple = createChart<VChartSimpleProps>('VChartSimple');
