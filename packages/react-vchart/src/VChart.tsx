import { BaseChartProps, createChart } from './charts/BaseChart';

export type VChartProps = Omit<BaseChartProps, 'container'>;

export const VChart = createChart<VChartProps>('VChart');
