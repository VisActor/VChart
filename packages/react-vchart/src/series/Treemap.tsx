import { BaseSeriesProps, createSeries } from './BaseSeries';

import type { ITreemapSeriesSpec } from '@visactor/vchart';
import { registerTreemapSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerTreemapSeries]);

export type TreemapProps = BaseSeriesProps & Omit<ITreemapSeriesSpec, 'type'>;

export const Treemap = createSeries<TreemapProps>('Treemap', ['leaf', 'nonLeaf', 'label', 'nonLeafLabel'], 'treemap');
