import type { IPoint } from '@visactor/vutils';
import {
  inject,
  injectable,
  getTheme,
  CircleRender,
  getScaledStroke,
  CIRCLE_NUMBER_TYPE
} from '@visactor/vrender-core';
import type {
  IGraphicAttribute,
  ICircle,
  IContext2d,
  IMarkAttribute,
  IThemeAttribute,
  IGraphicPicker,
  IGraphicRender,
  IPickParams
} from '@visactor/vrender-core';
import { CHART_NUMBER_TYPE, Chart } from './vchart-graphic';

@injectable()
export class VChartPicker implements IGraphicPicker {
  type = 'chart';
  numberType: number = CHART_NUMBER_TYPE;

  constructor() {}

  contains(chart: any, point: any, params?: IPickParams): boolean {
    const vChart = (chart as Chart).vchart;
    const chartStage = vChart.getStage();
    // @ts-ignore
    chartStage._editor_needRender = true;
    const matrix = chart.globalTransMatrix.clone();
    const stageMatrix = chart.stage.window.getViewBoxTransform();
    matrix.multiply(stageMatrix.a, stageMatrix.b, stageMatrix.c, stageMatrix.d, stageMatrix.e, stageMatrix.f);
    chartStage.window.setViewBoxTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
    chartStage.dirtyBounds?.clear();
    const graphic = chartStage.pick(point.x, point.y);

    console.log('graphic', graphic);

    // 详细形状判断
    const picked = false;

    return picked;
  }
}
