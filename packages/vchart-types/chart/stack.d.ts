import type { IRegion } from '../region/interface';
import type { IChart } from './interface';
export declare class Stack {
  protected _chart: IChart;
  constructor(chart: IChart);
  init(): void;
  stackAll(): void;
  stackRegion: ({ model }: { model: IRegion }) => void;
}
