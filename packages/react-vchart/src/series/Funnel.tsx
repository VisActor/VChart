import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface FunnelProps extends BaseSeriesProps {
  //
}

export const Funnel = createSeries("Funnel", ["funnel"], "funnel");
