import { BaseComponentProps, createComponent } from './BaseComponent';
import type { ITitleSpec } from '@visactor/vchart';
import { registerTitle, VChart } from '@visactor/vchart';

VChart.useRegisters([registerTitle]);

export type TitleProps = ITitleSpec & BaseComponentProps;

export const Title = createComponent<TitleProps>('Title', 'title', null, true);
