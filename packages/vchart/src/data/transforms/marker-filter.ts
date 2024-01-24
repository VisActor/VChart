import type { ICartesianSeries } from '../../series/interface/series';

export interface IMarkerFilterOptions {
  getRelativeSeries: () => ICartesianSeries;
}

export function markerFilter(data: Array<DataView>, options: IMarkerFilterOptions[]) {
  return options.some(option => {
    const series = option.getRelativeSeries();

    if (series) {
      const viewData = series.getViewData();
      return viewData && viewData.latestData && viewData.latestData.length;
    }

    return true;
  })
    ? data
    : [];
}
