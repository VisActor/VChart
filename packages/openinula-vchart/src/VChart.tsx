import { BaseChartProps, createChart } from './charts/BaseChart';
import VChartCore from '@visactor/vchart';
export { VChartCore };

export type VChartProps = Omit<BaseChartProps, 'container' | 'width' | 'height' | 'type'>;

export const VChart = createChart<VChartProps>('VChart', {
  vchartConstructor: VChartCore
});
