import type { VChart, IChartSpec, IMarkPointSpec, MarkPoint } from '@visactor/vchart';
import type { IActionContext, IFlickerAction } from '../../types';
import type { CreateMarkPointAction } from '../../types/chart/createComponent';
import { getComponentById } from '../../../util/vchart-api';
import { flickerEffect } from '../../utils/flicker';

export const createMarkPointProcessor = async (
  chartInstance: VChart,
  spec: IChartSpec,
  createMarkPointAction: CreateMarkPointAction
) => {
  const action = createMarkPointAction;
  const markPoint: IMarkPointSpec[] = (spec as any).markPoint ?? [];
  markPoint.push({
    id: action.elementId,
    coordinate: action.data,
    itemContent: action.payload.itemContent,
    itemLine: action.payload.itemLine
  });
  (spec as any).markPoint = markPoint;
  chartInstance.updateSpecSync(spec);
};

export const markPointFlickerProcessor = async (
  chartInstance: VChart,
  spec: any,
  markPointAction: IFlickerAction & IActionContext
) => {
  const { elementId } = markPointAction;
  const vchartMarkPoint = getComponentById(chartInstance, elementId) as MarkPoint;
  if (vchartMarkPoint && vchartMarkPoint._markerComponent) {
    const marker = vchartMarkPoint._markerComponent._item;
    if (marker) {
      flickerEffect(marker);
    }
  }
};
