import { BaseSeriesProps, createSeries } from './BaseSeries';
import { ILinkSeriesSpec } from '@visactor/vchart';

export type LinkProps = BaseSeriesProps & Omit<ILinkSeriesSpec, 'type'>;

export const Link = createSeries<LinkProps>('Link', ['link'], 'link');
