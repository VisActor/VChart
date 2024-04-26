import { IVisactorGraphic } from '../../visactor/interface';
import type { IBoundsLike } from '@visactor/vutils';
import type { ISpec, IVChart } from '@visactor/vchart';
import type { GraphicType, IGroupGraphicAttribute, ITicker } from '@visactor/vrender-core';
import { genNumberType, Group } from '@visactor/vrender-core';

export interface IChartGraphicAttribute extends IGroupGraphicAttribute {
  renderCanvas: HTMLCanvasRole;
  spec: any;
  ClassType: any;
  vchart: IVChart;
  mode: string;
  modeParams?: any;
  dpr: number;
  interactive: boolean;
  animation: boolean;
  disableTriggerEvent: boolean;
  disableDirtyBounds: boolean;
  viewBox: IBoundsLike;
  ticker?: ITicker;
}

export const CHART_NUMBER_TYPE = genNumberType();

// @ts-ignore
export class Chart extends Group implements IVisactorGraphic {
  type: GraphicType = 'chart' as any;
  declare attribute: IChartGraphicAttribute;
  protected _vchart: IVChart;
  get vchart() {
    return this._vchart;
  }
  get vProduct() {
    return this._vchart;
  }

  drawTag = false;

  constructor(params: IChartGraphicAttribute) {
    super(params);
    this.numberType = CHART_NUMBER_TYPE;

    // 创建chart
    if (!params.vchart) {
      params.vchart = this._vchart = new params.ClassType(params.spec, {
        renderCanvas: params.renderCanvas,
        mode: params.mode,
        modeParams: params.modeParams,
        canvasControled: false,
        // viewBox: params.vi
        dpr: params.dpr,
        interactive: params.interactive,
        animation: params.animation,
        autoFit: false,
        disableTriggerEvent: params.disableTriggerEvent,
        disableDirtyBounds: params.disableDirtyBounds,
        ticker: params.ticker,
        beforeRender: () => {
          if (!this.stage) {
            return;
          }
          const chartStage = this._vchart.getStage();
          if (!(chartStage as any)._editor_needRender) {
            chartStage.pauseRender();
            this.stage.dirtyBounds?.union(this.globalAABBBounds);
            this.stage.renderNextFrame();
          }
        },
        afterRender: () => {
          if (!this._vchart) {
            return;
          }
          if (!this.stage) {
            return;
          }
          // @ts-ignore
          this._vchart.getStage()._editor_needRender = false;
          this._vchart.getStage().stage.resumeRender();
        }
      });
    } else {
      this._vchart = params.vchart;
    }
    this._vchart.renderSync();
    // 背景设置为false后，不会擦除画布内容，可以实现元素正常堆叠绘制
    this._vchart.getStage() && (this._vchart.getStage().background = false);
    if (params.viewBox) {
      this.updateViewBox(params.viewBox);
    }
  }

  updateSpec(spec: ISpec, forceMerge = false, morphConfig = false) {
    this._vchart.updateSpecSync(spec, forceMerge, morphConfig as any);
  }

  updateViewBox(viewBox: IBoundsLike) {
    this._updateViewBox(viewBox);
  }

  private _updateViewBox(_viewBox: IBoundsLike) {
    const viewBox = { ..._viewBox };
    this.setAttributes({
      x: viewBox.x1,
      y: viewBox.y1,
      width: viewBox.x2 - viewBox.x1,
      height: viewBox.y2 - viewBox.y1
    });
    //
    viewBox.x2 -= viewBox.x1;
    viewBox.y2 -= viewBox.y1;
    viewBox.x1 = 0;
    viewBox.y1 = 0;
    this._vchart.resize(viewBox.x2 - viewBox.x1, viewBox.y2 - viewBox.y1);
    this._vchart.updateViewBox(viewBox);
  }
}
