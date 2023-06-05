import { CSSProperties } from 'react';
import { IOptions } from './IOptions';
import { IVChart, ISpec } from './IVChart';
import { IEvent } from './IEvent';

interface IChartProps {
  canvasId: string;
  spec: ISpec;
  style?: CSSProperties;
  options?: IOptions;
  events?: IEvent[];
  onChartReady?: (chart: IVChart) => void;
  onChartInit?: (chart: IVChart) => void;
  onChartUpdate?: (chart: IVChart) => void;
}

export { IChartProps };
