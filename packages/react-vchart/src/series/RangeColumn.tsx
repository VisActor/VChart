import { BaseSeriesProps, createSeries } from "./BaseSeries";

export interface RangeColumnProps extends BaseSeriesProps {
  //
}

export const RangeColumn = createSeries(
  "RangeColumn",
  ["rangeColumn"],
  "rangeColumn"
);
