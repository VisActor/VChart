import { createComponent } from '../BaseComponent';
import { TooltipProps } from './interface';
import { VChart, registerTooltip, registerDomTooltipHandler } from '@visactor/vchart';

VChart.useRegisters([registerTooltip, registerDomTooltipHandler]);

export const Tooltip = createComponent<TooltipProps>('Tooltip', 'tooltip', null, true);
