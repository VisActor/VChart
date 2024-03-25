import { createComponent } from '../BaseComponent';
import { TooltipProps } from './interface';
import { VChart, registerTooltip, registerCanvasTooltipHandler } from '@visactor/vchart';

VChart.useRegisters([registerTooltip, registerCanvasTooltipHandler]);

export const CanvasTooltip = createComponent<TooltipProps>('CanvasTooltip', 'tooltip', null, true);
