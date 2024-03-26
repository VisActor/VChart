import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IWordCloudSeriesSpec } from '@visactor/vchart';
import { registerWordCloudSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerWordCloudSeries]);

export type WordCloudProps = BaseSeriesProps & Omit<IWordCloudSeriesSpec, 'type'>;

export const WordCloud = createSeries<WordCloudProps>('WordCloud', ['wordCloud'], 'wordCloud');
