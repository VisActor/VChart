import { BaseChartProps, createChart } from './charts/BaseChart';

export type VChartProps = Omit<BaseChartProps, 'container' | 'data' | 'width' | 'height'>;

export const VChart = createChart<VChartProps>('VChart');
