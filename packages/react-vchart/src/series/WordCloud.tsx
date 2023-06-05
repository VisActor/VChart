import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface WordCloudProps extends BaseSeriesProps {
  //
}

export const WordCloud = createSeries("WordCloud", ["wordCloud"], "wordCloud");
