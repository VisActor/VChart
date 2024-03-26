import type { ICustomMarkSpec, EnableMarkType } from '@visactor/vchart';
import { BaseComponentProps, createComponent } from './BaseComponent';
import { registerCustomMark } from '@visactor/vchart';

export type MarkProps = ICustomMarkSpec<EnableMarkType> & BaseComponentProps;

export const Mark = createComponent<MarkProps>('Mark', 'customMark', null, false, [registerCustomMark]);
