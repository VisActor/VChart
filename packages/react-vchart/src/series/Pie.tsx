import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface PieProps extends BaseSeriesProps {
  //
}

export const Pie = createSeries("Pie", ["pie"], "pie");
