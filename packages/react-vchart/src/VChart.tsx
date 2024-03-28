import { BaseChartProps, createChart } from './charts/BaseChart';
import { default as VChartCore } from '@visactor/vchart';
export type VChartProps = Omit<BaseChartProps, 'container' | 'data' | 'width' | 'height' | 'type'>;

export const VChart = createChart<VChartProps>('VChart', {
  vchartConstrouctor: VChartCore
});
