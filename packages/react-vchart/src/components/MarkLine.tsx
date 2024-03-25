import { BaseComponentProps, createComponent } from './BaseComponent';
import type { IMarkLineSpec } from '@visactor/vchart';
import { registerMarkLine, VChart } from '@visactor/vchart';

VChart.useRegisters([registerMarkLine]);

export type MarkLineProps = IMarkLineSpec & BaseComponentProps;

export const MarkLine = createComponent<MarkLineProps>('MarkLine', 'markLine');
