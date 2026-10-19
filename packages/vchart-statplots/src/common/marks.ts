import type { IScatterSeriesSpec, ILineSeriesSpec, IRangeAreaSeriesSpec } from '@visactor/vchart';
import { semanticTooltip } from './tooltip';
export function points(
  id: string,
  values: object[],
  x: string | string[],
  y: string | string[],
  fields: string[],
  labels: Record<string, string | undefined> = {}
): IScatterSeriesSpec {
  return {
    type: 'scatter',
    id,
    data: { id, values },
    xField: x,
    yField: y,
    seriesField: 'series',
    size: 7,
    tooltip: semanticTooltip(fields, labels)
  };
}
export function curve(
  id: string,
  values: object[],
  x: string,
  y: string,
  fields: string[],
  labels: Record<string, string | undefined> = {}
): ILineSeriesSpec {
  return {
    type: 'line',
    id,
    data: { id, values },
    xField: x,
    yField: y,
    seriesField: 'series',
    point: { visible: true, style: { size: 5 } },
    line: { style: { curveType: 'linear', lineWidth: 2 } },
    tooltip: semanticTooltip(fields, labels)
  };
}
export function band(id: string, values: object[], x: string): IRangeAreaSeriesSpec {
  return {
    type: 'rangeArea',
    stack: false,
    id,
    data: { id, values },
    xField: x,
    yField: ['lower', 'upper'],
    seriesField: 'series',
    area: { style: { fillOpacity: 0.18 } },
    tooltip: { visible: false }
  };
}
export const diagonal = (x: string, y: string, relativeSeriesId: string) => ({
  relativeSeriesId,
  coordinates: [
    { [x]: 0, [y]: 0 },
    { [x]: 1, [y]: 1 }
  ],
  endSymbol: { visible: false },
  line: { style: { lineDash: [4, 4] } }
});
export const zeroLine = {
  y: 0,
  endSymbol: { visible: false },
  line: { style: { lineDash: [4, 4] } }
};
