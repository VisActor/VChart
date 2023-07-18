import { BaseComponentProps, createComponent } from './BaseComponent';
import type { ITooltipSpec } from '@visactor/vchart';

export type TooltipProps = ITooltipSpec & BaseComponentProps;

export const Tooltip = createComponent<TooltipProps>('Tooltip', 'tooltip', null, true);
