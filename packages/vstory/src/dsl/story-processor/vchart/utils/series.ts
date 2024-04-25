import VChart, { ISeries } from '@visactor/vchart';

// 获取所有系列
export const getAllSeries = (instance: VChart) => {
  return instance.getChart().getAllSeries();
};

// 获取一个系列的所有marks
export const getSeriesMarks = (series: ISeries) => {
  return series.getMarksWithoutRoot();
};

// 获取一个系列的所有marks
export const getSeriesMarksByMarkType = (series: ISeries, markType: string) => {
  return series.getMarksWithoutRoot().filter(m => m.type === markType);
};
