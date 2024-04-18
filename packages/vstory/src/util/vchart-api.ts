import { IVChart } from '@visactor/vchart';

export function getAllSeriesMarksWithoutRoot(vchart: IVChart) {
  if (!vchart) {
    return null;
  }
  const chart = vchart.getChart();
  if (!chart) {
    return null;
  }
  return chart
    .getAllSeries()
    .map(s => s.getMarksWithoutRoot())
    .flat();
}

export function getComponentById(vchart: IVChart, id: number) {
  if (!vchart) {
    return null;
  }
  return vchart.getComponents().find(component => component.userId === id);
}
