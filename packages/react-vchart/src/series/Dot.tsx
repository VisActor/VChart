import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface DotProps extends BaseSeriesProps {
  //
}

export const Dot = createSeries("Dot", ["dot"], "dot");
