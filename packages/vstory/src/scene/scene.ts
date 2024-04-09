import type { IContext } from 'src/interface/type';
import { Template } from '../template/base-template';
import { INode, IStage, container, createStage, preLoadAllModule } from '@visactor/vrender-core';
import { calculateSize } from '../util/size';
import { CreateID } from '../util/common';
import { loadBrowserEnv } from '@visactor/vrender-kits';
import { AbstractComponent } from '@visactor/vrender-components';
import { ITask, TaskManager } from '../task';
import { Action, Wait } from './action';

export class Scene {
  readonly id = CreateID();

  protected template: Template;

  protected _stage: IStage;

  protected _container: HTMLElement;

  protected _canvas: HTMLCanvasElement;

  protected _context: IContext;

  private _taskManager = new TaskManager();

  constructor(options: any = {}) {
    const { dom, width, height } = options;
    if (document) {
      this._container = document.getElementById(dom) as HTMLCanvasElement;
    }
    if (!this._container) {
      throw Error('Container Not Found');
    }

    const { width: _width, height: _height } = calculateSize(this._container, { width, height });

    const canvas = document.createElement('canvas');
    canvas.width = _width * window.devicePixelRatio;
    canvas.height = _height * window.devicePixelRatio;
    canvas.style.width = _width + 'px';
    canvas.style.height = _height + 'px';

    canvas.id = `_story_chart_${this.id}_canvas`;
    this._canvas = canvas;
    this._container.append(canvas);

    const stage = this._initStage(_width, _height);
    this._stage = stage;

    this._context = {
      dom: this._container,
      canvas: this._canvas,
      width: _width,
      height: _height,
      stage
    };
    this._taskManager.setContext(this._context);
  }

  protected _initStage(width: number, height: number) {
    preLoadAllModule();
    loadBrowserEnv(container);
    const params = {
      width: width,
      height: height,
      disableDirtyBounds: true,
      autoRender: true,
      canvas: this._canvas,
      canvasControled: true,
      dpr: window.devicePixelRatio
    };
    return createStage(params) as unknown as IStage;
  }

  add(entity: Template | AbstractComponent) {
    let task: ITask;
    if (entity instanceof Template) {
      this.template = entity;
      task = new Action(entity, (entity: any) => {
        entity.render(this._context);
      });
    } else if (entity instanceof AbstractComponent && this._stage) {
      task = new Action(entity, (entity: any) => {
        this._stage.defaultLayer.add(entity as unknown as INode);
      });
    }

    if (task) {
      this._taskManager.next(task);
    }

    return this;
  }

  remove(entity: Template | AbstractComponent) {
    let task: ITask;
    if (entity instanceof Template) {
      this.template = entity;
      task = new Action(entity, (entity: any) => {
        entity.release();
      });
    } else if (entity instanceof AbstractComponent && this._stage) {
      task = new Action(entity, (entity: any) => {
        this._stage.defaultLayer.removeChild(entity as unknown as INode);
      });
    }

    if (task) {
      this._taskManager.next(task);
    }

    return this;
  }

  wait(duration: number) {
    if (duration > 0) {
      const wait = new Wait(duration);
      this._taskManager.next(wait);
    }
  }

  play(animate: ITask) {
    if (animate) {
      this._taskManager.next(animate);
    }
  }

  release() {}
}
