import type VChart from '@visactor/vchart';
import { IContext } from '../interface/type';
import { IGraphic } from '@visactor/vrender-core';
import { TaskManager } from '../task';
import { forEachGraphicItem } from '../util/vrender-api';

export abstract class Template {
  declare spec: Record<string, any>;
  protected _chartInstance: VChart;
  vchartInstance() {
    return this._chartInstance;
  }

  // protected _graphicAnimationManager = new Map<IGraphic, TaskManager>();

  constructor(spec: Record<string, any>) {
    this.spec = spec;
  }

  protected abstract isValid(): boolean;

  protected abstract setUp(): Record<string, any>;

  abstract render(context: Partial<IContext>): void;

  onRenderEnd(context: Partial<IContext>) {
    // const { stage } = context;
    // if (stage && this._chartInstance) {
    //   forEachGraphicItem(stage as unknown as IGraphic, graphic => {
    //     if (!this._graphicAnimationManager.get(graphic)) {
    //       const manager = new TaskManager();
    //       this._graphicAnimationManager.set(graphic, manager);
    //     }
    //   });
    // }
  }

  release() {
    this._chartInstance.release();
    this._chartInstance = null;
    // this._graphicAnimationManager.clear();
    // this._graphicAnimationManager = null;
  }
}
