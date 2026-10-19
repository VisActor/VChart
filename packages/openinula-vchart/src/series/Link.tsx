import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { ILinkSeriesSpec } from '@visactor/vchart-extension';
import { registerLinkSeries } from '@visactor/vchart-extension';

registerLinkSeries();

export type LinkProps = BaseSeriesProps & Omit<ILinkSeriesSpec, 'type'>;

export const Link = createSeries<LinkProps>('Link', ['link'], 'link');
