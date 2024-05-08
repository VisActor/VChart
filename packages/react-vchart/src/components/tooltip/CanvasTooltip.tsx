import { createComponent } from '../BaseComponent';
import { TooltipProps } from './interface';
import { registerTooltip, registerCanvasTooltipHandler } from '@visactor/vchart';

export const CanvasTooltip = createComponent<TooltipProps>('CanvasTooltip', 'tooltip', null, true, [
  registerTooltip,
  registerCanvasTooltipHandler
]);
