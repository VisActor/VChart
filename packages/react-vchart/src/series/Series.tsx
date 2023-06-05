import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface SeriesProps extends BaseSeriesProps {
  type: string;
}

export const Series = createSeries("Series", ["bar", "line", "area"]);
