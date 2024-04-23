import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IWordCloud3dSeriesSpec } from '@visactor/vchart';
import { registerWordCloud3dSeries } from '@visactor/vchart';

export type WordCloud3dProps = BaseSeriesProps & Omit<IWordCloud3dSeriesSpec, 'type'>;

export const WordCloud3d = createSeries<WordCloud3dProps>('WordCloud3d', ['wordCloud'], 'wordCloud3d', [
  registerWordCloud3dSeries
]);
