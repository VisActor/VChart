import { isNumber, last } from '@visactor/vutils';
import { StoryCanvas } from '../canvas/canvas';
import { IAction, IChapterElementLink, IChapterSpec } from '../interface';
import { IPlayer } from '../interface/player';
import { IElement } from '../element';
import { processorMap } from '../../dsl/story-processor';
import { Encoder } from './encode';

export class Ticker {
  cb?: (delta: number) => void;
  rafIdx = 0;
  start(cb: (t: number) => void) {
    this.stop();
    this.cb = cb;
    this._tick(0);
  }

  _tick = (lt: number) => {
    const ct = Date.now();
    this.cb && this.cb(lt === 0 ? 0 : ct - lt);
    this.rafIdx = requestAnimationFrame(() => this._tick(ct));
  };

  stop() {
    this.rafIdx && cancelAnimationFrame(this.rafIdx);
    this.rafIdx = 0;
  }
}

type IChapterInstanceItem = {
  id: string;
  elements: {
    element: IElement;
    actions: IAction[];
  }[];
};

export class Player implements IPlayer {
  protected _canvas: StoryCanvas;
  protected _chapters: IChapterInstanceItem[];
  protected _currChapter: IChapterInstanceItem;
  protected _ticker: Ticker;
  protected _currTime: number;
  protected _encoder: Encoder;

  constructor(c: StoryCanvas) {
    this._canvas = c;
    this._chapters = [];
    this._ticker = new Ticker();
    this._currTime = 0;
    this._encoder = new Encoder();
  }

  addChapter(
    c: IChapterSpec,
    elements: {
      [key: string]: IElement;
    }
  ): void {
    const e: { element: IElement; actions: IAction[] }[] = [];
    c.steps.forEach(item => {
      item.elements.forEach(item => {
        e.push({
          element: elements[(item as any).elementId],
          actions: item.actions.sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0))
        });
      });
    });
    this._chapters.push({
      id: c.id,
      elements: e
    });
  }

  setCurrentChapter(id: number | string) {
    if (isNumber(id)) {
      this._currChapter = this._chapters[id];
    } else {
      this._currChapter = this._chapters.filter(item => item.id === id)[0];
    }
  }

  tickTo(t: number) {
    const lastTime = this._currTime;
    if (lastTime > t) {
      // 如果时间回退，那就重新走一遍
    }
    this._currChapter.elements.forEach(({ actions, element }) => {
      actions.forEach(action => {
        const { startTime } = action;
        if (startTime > t) {
          return;
        }
        // 之前没走过，现在走
        if (startTime > lastTime && startTime <= t) {
          const { temp } = element.spec.config;
          const process = processorMap[temp];
          if (process) {
            const func = process[action.action];
            func && func(element, action);
          }
        }
        element.show();
      });
    });
    this._currTime = t;
    this._canvas.getStage().ticker.tickAt(t);
    this._currChapter.elements.forEach(({ element }) => {
      element.hide;
    });
    this._canvas.getStage().render();
  }

  play(): void {
    if (!this._currChapter) {
      return;
    }
    console.log(this);
    this._ticker.start(t => {
      this.tickTo(this._currTime + t);
    });
  }

  async encodeToVideo(millsecond: number, fps: number) {
    // if (!this._currChapter) {
    //   return;
    // }
    const frameNum = (millsecond / 1000) * fps;
    const deltaT = 1000 / fps;
    this.tickTo(0);
    const objUrl = await this._encoder.exportVideo(frameNum, fps, async i => {
      const t = deltaT * i;
      this.tickTo(t);
      return new Promise((resolve, reject) => {
        this._canvas
          .getStage()
          .window.getContext()
          .canvas.nativeCanvas.toBlob((blob: any) => {
            if (blob) {
              resolve(blob);
            } else {
              console.log('no blob');
              reject('no blob');
            }
          }, `image/png`);
      });
    });

    return objUrl;
  }

  pause(): void {
    this._ticker.stop();
  }

  release(): void {}
}
