import { isNumber } from '@visactor/vutils';
import { StoryCanvas } from '../canvas/canvas';
import { IAction, IChapterElementLink, IChapterSpec } from '../interface';
import { IPlayer } from '../interface/player';
import { IElement } from '../element';

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

  constructor(c: StoryCanvas) {
    this._canvas = c;
    this._chapters = [];
    this._ticker = new Ticker();
    this._currTime = 0;
  }

  addChapter(
    c: IChapterSpec,
    elements: {
      [key: string]: IElement;
    }
  ): void {
    this._chapters.push({
      id: c.id,
      elements: c.elements.map(item => {
        return {
          element: elements[(item as any).elementId],
          actions: item.actions
        };
      })
    });
  }

  setCurrentChapter(id: number | string) {
    if (isNumber(id)) {
      this._currChapter = this._chapters[id];
    } else {
      this._currChapter = this._chapters.filter(item => item.id === id)[0];
    }
  }

  tickTo(t: number) {}

  play(): void {
    if (!this._currChapter) {
      return;
    }
    console.log(this);
    this._ticker.start(t => {
      this._currTime += t;
      this.tickTo(this._currTime);
    });
  }

  pause(): void {
    this._ticker.stop();
  }

  release(): void {}
}
