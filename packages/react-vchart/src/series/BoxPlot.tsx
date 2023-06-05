import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface BoxPlotProps extends BaseSeriesProps {
  //
}

export const BoxPlot = createSeries("BoxPlot", ["boxPlot"], "boxPlot");
