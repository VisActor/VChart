import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface LinearProgressProps extends BaseSeriesProps {
  //
}

export const LinearProgress = createSeries(
  "LinearProgress",
  ["linearProgress"],
  "linearProgress"
);
