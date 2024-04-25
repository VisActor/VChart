import VChart, { ISeries } from '@visactor/vchart';

// 获取所有系列的Marks
export const getAllSeriesMarksWithoutRoot = (instance: VChart) => {
  if (!instance) {
    return null;
  }
  const chart = instance.getChart();
  if (!chart) {
    return null;
  }
  return chart
    .getAllSeries()
    .map(s => s.getMarksWithoutRoot())
    .flat();
};

// 根据图元类型获取Marks
export const getAllSeriesMarksByMarkType = (instance: VChart, markType: 'rect' | 'line' | 'symbol') => {
  const marks = getAllSeriesMarksWithoutRoot(instance);
  return marks.filter(m => m.type === markType);
};
