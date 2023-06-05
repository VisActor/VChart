import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface MapProps extends BaseSeriesProps {
  //
}

export const Map = createSeries("Map", ["map"], "map");
