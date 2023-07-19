import { BaseSeriesProps, createSeries } from './BaseSeries';
import { IWordCloudSeriesSpec } from '@visactor/vchart';

export type WordCloudProps = BaseSeriesProps & Omit<IWordCloudSeriesSpec, 'type'>;

export const WordCloud = createSeries<WordCloudProps>('WordCloud', ['wordCloud'], 'wordCloud');
