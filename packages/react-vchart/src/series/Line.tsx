import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface LineProps extends BaseSeriesProps {
  //
}

export const Line = createSeries("Line", ["line"], "line");
