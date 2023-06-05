import type { IHeatmapSeriesTheme } from '../../../../series/heatmap/interface';

export const heatmap: IHeatmapSeriesTheme = {
  fillOpacity: 1,
  strokeOpacity: 1,
  cell: {
    style: {
      shape: 'square'
    }
  },
  cellBackground: {
    visible: false
  }
};
