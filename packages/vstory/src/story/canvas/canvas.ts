import { Story } from './../story';
import { IStage, createStage, vglobal, container, preLoadAllModule } from '@visactor/vrender-core';
import { loadBrowserEnv } from '@visactor/vrender-kits';

preLoadAllModule();
loadBrowserEnv(container);
vglobal.setEnv('browser');

export class StoryCanvas {
  protected _story: Story;
  protected _canvas: HTMLCanvasElement;
  protected _stage: IStage;
  getStage() {
    return this._stage;
  }

  getCanvas() {
    return this._canvas;
  }

  protected _container: HTMLDivElement;
  get container() {
    return this._container;
  }

  constructor(story: Story, container: HTMLDivElement) {
    this._story = story;
    this._container = container;
    this._initCanvas();
  }
  protected _initCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = this._container.clientWidth * window.devicePixelRatio;
    canvas.height = this._container.clientHeight * window.devicePixelRatio;
    canvas.style.width = this._container.clientWidth + 'px';
    canvas.style.height = this._container.clientHeight + 'px';
    canvas.style.position = 'absolute';
    canvas.id = `_visactor_story_canvas_${this._story.id}`;
    this._container.appendChild(canvas);
    this._canvas = canvas;
    const stage = createStage({
      canvas: this._canvas,
      width: this._canvas.clientWidth,
      height: this._canvas.clientHeight,
      canvasControled: true,
      autoRender: true,
      disableDirtyBounds: true,
      dpr: window.devicePixelRatio,
      event: {
        clickInterval: 300
      }
    });
    // @ts-ignore
    this._stage = stage;
  }
}
