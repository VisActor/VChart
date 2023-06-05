import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface BarProps extends BaseSeriesProps {
  //
}

export const Bar = createSeries("Bar", ["bar"], "bar");
