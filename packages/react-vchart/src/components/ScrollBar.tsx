import { BaseComponentProps, createComponent } from './BaseComponent';
import type { IScrollBarSpec } from '@visactor/vchart';

export type ScrollBarProps = IScrollBarSpec & BaseComponentProps;

export const ScrollBar = createComponent<ScrollBarProps>('ScrollBar', 'scrollBar');
