import { BaseComponentProps, createComponent } from './BaseComponent';
import type { IBrushSpec } from '@visactor/vchart';

export type BrushProps = IBrushSpec & BaseComponentProps;

export const Brush = createComponent<BrushProps>('Brush', 'brush', null, true);
