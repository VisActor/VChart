import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface CircularProgressProps extends BaseSeriesProps {
  //
}

export const CircularProgress = createSeries(
  "CircularProgress",
  ["circularProgress"],
  "circularProgress"
);
