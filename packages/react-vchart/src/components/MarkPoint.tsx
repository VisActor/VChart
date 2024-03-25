import { BaseComponentProps, createComponent } from './BaseComponent';
import type { IMarkPointSpec } from '@visactor/vchart';
import { registerMarkPoint, VChart } from '@visactor/vchart';

VChart.useRegisters([registerMarkPoint]);

export type MarkPointProps = IMarkPointSpec & BaseComponentProps;

export const MarkPoint = createComponent<MarkPointProps>('MarkPoint', 'markPoint');
