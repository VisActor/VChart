import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface ScatterProps extends BaseSeriesProps {
  //
}

export const Scatter = createSeries("Scatter", ["scatter"], "scatter");
