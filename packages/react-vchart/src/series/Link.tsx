import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface LinkProps extends BaseSeriesProps {
  //
}

export const Link = createSeries("Link", ["link"], "link");
