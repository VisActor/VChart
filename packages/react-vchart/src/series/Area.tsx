import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface AreaProps extends BaseSeriesProps {
  //
}

export const Area = createSeries("Area", ["area"], "area");
