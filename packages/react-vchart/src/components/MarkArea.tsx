import { BaseComponentProps, createComponent } from './BaseComponent';
import type { IMarkAreaSpec } from '@visactor/vchart';
import { registerMarkArea, VChart } from '@visactor/vchart';

VChart.useRegisters([registerMarkArea]);

export type MarkAreaProps = IMarkAreaSpec & BaseComponentProps;

export const MarkArea = createComponent<MarkAreaProps>('MarkArea', 'markArea');
