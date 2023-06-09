// import type { IDiscreteLegendSpec } from '@visactor/vchart'
import { LEGEND_CUSTOMIZED_EVENTS } from '../eventsUtils';
import { BaseComponentProps, createComponent } from './BaseComponent';

export interface LegendProps extends BaseComponentProps {
  onLegendItemHover: (e: any) => void;
  onLegendItemUnHover: (e: any) => void;
  onLegendItemClick: (e: any) => void;
}

export const Legend = createComponent('Legend', 'legends', LEGEND_CUSTOMIZED_EVENTS);
