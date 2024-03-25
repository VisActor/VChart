import { BaseComponentProps, createComponent } from './BaseComponent';
import type { IIndicatorSpec } from '@visactor/vchart';
import { registerIndicator, VChart } from '@visactor/vchart';

VChart.useRegisters([registerIndicator]);

export type IndicatorProps = IIndicatorSpec & BaseComponentProps;

export const Indicator = createComponent<IndicatorProps>('Indicator', 'indicator', null, true);
