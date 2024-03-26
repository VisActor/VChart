import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { ILinkSeriesSpec } from '@visactor/vchart';
import { registerLinkSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerLinkSeries]);

export type LinkProps = BaseSeriesProps & Omit<ILinkSeriesSpec, 'type'>;

export const Link = createSeries<LinkProps>('Link', ['link'], 'link');
