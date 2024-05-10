import type {
  IContext2d,
  IDrawContext,
  IGraphicAttribute,
  IGraphicRender,
  IGraphicRenderDrawParams,
  IMarkAttribute,
  IRenderService,
  IThemeAttribute,
  IGraphic
} from '@visactor/vrender-core';
import { injectable, DefaultCanvasRectRender } from '@visactor/vrender-core';
import type { Chart } from './vchart-graphic';
import { CHART_NUMBER_TYPE } from './vchart-graphic';

export const ChartRender = Symbol.for('ChartRender');
export const ChartRenderContribution = Symbol.for('ChartRenderContribution');

@injectable()
export class VChartRender extends DefaultCanvasRectRender implements IGraphicRender {
  type: 'chart';
  numberType: number = CHART_NUMBER_TYPE;

  drawShape(
    chart: any,
    context: IContext2d,
    x: number,
    y: number,
    drawContext: IDrawContext,
    params?: IGraphicRenderDrawParams,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean
  ) {
    const { baseOpacity = 0.1 } = chart.attribute;
    context.baseGlobalAlpha *= baseOpacity;
    super.drawShape(chart, context, x, y, drawContext, params, fillCb, strokeCb);
    context.baseGlobalAlpha /= baseOpacity;
    const vChart = (chart as Chart).vchart;
    const chartStage = vChart.getStage();
    const chartCtx = chartStage.window.getContext();
    chartCtx.baseGlobalAlpha *= baseOpacity;
    // @ts-ignore
    chartStage._editor_needRender = true;
    const matrix = chart.globalTransMatrix.clone();
    const stageMatrix = chart.stage.window.getViewBoxTransform();
    matrix.multiply(stageMatrix.a, stageMatrix.b, stageMatrix.c, stageMatrix.d, stageMatrix.e, stageMatrix.f);
    chartStage.window.setViewBoxTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
    chartStage.dirtyBounds?.clear();
    chartStage.render();
    chartCtx.baseGlobalAlpha /= baseOpacity;
    // const ctx = chartStage.window.getContext();
    // ctx.fillStyle = 'green';
    // ctx.fillRect(0, 0, 100, 100);
  }

  draw(chart: any, renderService: IRenderService, drawContext: IDrawContext, params?: IGraphicRenderDrawParams) {
    // const chartAttribute = getTheme(chart, params?.theme).circle;
    this._draw(chart, {} as any, false, drawContext, params);
  }
}
