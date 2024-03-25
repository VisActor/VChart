import type { ICustomMarkSpec, EnableMarkType } from '@visactor/vchart';
import { BaseComponentProps, createComponent } from './BaseComponent';
import { registerCustomMark, VChart } from '@visactor/vchart';

VChart.useRegisters([registerCustomMark]);

export type MarkProps = ICustomMarkSpec<EnableMarkType> & BaseComponentProps;

export const Mark = createComponent<MarkProps>('Mark', 'customMark');
