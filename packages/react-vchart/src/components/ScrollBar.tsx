import { SCROLLBAR_CUSTOMIZED_EVENTS, ScrollBarEventProps } from '../eventsUtils';
import { BaseComponentProps, createComponent } from './BaseComponent';
import type { IScrollBarSpec } from '@visactor/vchart';
import { registerScrollBar, VChart } from '@visactor/vchart';

VChart.useRegisters([registerScrollBar]);

export type ScrollBarProps = IScrollBarSpec & BaseComponentProps & ScrollBarEventProps;

export const ScrollBar = createComponent<ScrollBarProps>('ScrollBar', 'scrollBar', SCROLLBAR_CUSTOMIZED_EVENTS);
