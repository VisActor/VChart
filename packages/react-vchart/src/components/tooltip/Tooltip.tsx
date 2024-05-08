import { createComponent } from '../BaseComponent';
import { TooltipProps } from './interface';
import { registerTooltip, registerDomTooltipHandler } from '@visactor/vchart';

export const Tooltip = createComponent<TooltipProps>('Tooltip', 'tooltip', null, true, [
  registerTooltip,
  registerDomTooltipHandler
]);
