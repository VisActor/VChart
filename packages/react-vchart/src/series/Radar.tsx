import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface RadarProps extends BaseSeriesProps {
  //
}

export const Radar = createSeries("Radar", ["radar"], "radar");
