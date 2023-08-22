import type { IInitOption } from '@visactor/vchart';
import type VChart from '@visactor/vchart';
import type { IDomActorConfig } from '../dom/inderface';

export interface IVChartActorConfig extends IDomActorConfig {
  defaultSpec?: any;
  initOption?: Partial<IInitOption>;
}

export interface IVChartActorAvatar {
  dom: HTMLDivElement;
  vchart: VChart;
}
