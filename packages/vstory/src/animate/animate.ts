import type { IAnimate as IVRenderAnimate, IGraphic } from '@visactor/vrender-core';
import { IContext } from '../interface/type';
import { AbstractTask, ITask, TaskCb } from '../task';

export class GraphicAnimate extends AbstractTask {
  protected _animate: IVRenderAnimate;

  prev: ITask;
  next: ITask;

  protected _target: IGraphic;

  constructor(target: IGraphic) {
    super();
    this._target = target;
    if (this._target) {
      this._animate = this._target.animate().afterAll(Array.from(this._target.animates.values()));
    }
  }

  runCb(cb: TaskCb) {
    if (this._animate) {
      this._animate.runCb(cb);
    }
  }

  // 覆写这个方法
  run(context: Partial<IContext>) {}
}
