import { BaseSeriesProps, createSeries } from './BaseSeries';

import type { ISankeySeriesSpec } from '@visactor/vchart';

export type SankeyProps = BaseSeriesProps & Omit<ISankeySeriesSpec, 'type'>;

export const Sankey = createSeries<SankeyProps>('Sankey', ['node', 'link'], 'sankey');
