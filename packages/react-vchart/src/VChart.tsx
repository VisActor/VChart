import { BaseChartProps, createChart } from './charts/BaseChart';
import {
  LegendEventProps,
  ScrollBarEventProps,
  BrushEventProps,
  DataZoomEventProps,
  PlayerEventProps
} from './eventsUtils';

export type VChartProps = Omit<
  BaseChartProps & LegendEventProps & ScrollBarEventProps & BrushEventProps & DataZoomEventProps & PlayerEventProps,
  'container'
>;

export const VChart = createChart<VChartProps>('VChart');
