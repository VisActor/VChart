import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface RoseProps extends BaseSeriesProps {
  //
}

export const Rose = createSeries("Rose", ["rose"], "rose");
