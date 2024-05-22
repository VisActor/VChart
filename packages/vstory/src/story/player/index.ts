import { isNumber } from '@visactor/vutils';
import { StoryCanvas } from '../canvas/canvas';
import { IActSpec, IAction } from '../interface';
import { IPlayer } from '../interface/player';
import { processorMap, ActionProcessor } from '../../dsl/story-processor';
import { Encoder } from './encode';
import { ICharacter } from '../character';

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
  scenes: Array<
    {
      character: ICharacter;
      action: IAction;
    }[]
  >;
  characters: ICharacter[];
};

export class Player implements IPlayer {
  protected _canvas: StoryCanvas;
  protected _acts: IChapterInstanceItem[];
  protected _currAct: IChapterInstanceItem;
  protected _ticker: Ticker;
  protected _currTime: number;
  protected _encoder: Encoder;
  protected _actionProcessor: ActionProcessor;

  constructor(c: StoryCanvas) {
    this._canvas = c;
    this._acts = [];
    this._ticker = new Ticker();
    this._currTime = 0;
    this._encoder = new Encoder();
    this._actionProcessor = new ActionProcessor(processorMap);
  }

  addAct(
    c: IActSpec,
    characters: {
      [key: string]: ICharacter;
    }
  ): void {
    const scenes: IChapterInstanceItem['scenes'] = [];
    const characterSet: Set<ICharacter> = new Set();
    c.scenes.forEach(item => {
      const scene: IChapterInstanceItem['scenes'][0] = [];
      item.actions.forEach(({ characterActions, characterId }) => {
        const _actions = characterActions.slice();
        _actions.sort((a, b) => a.startTime - b.startTime);
        _actions.forEach(action => {
          const character = characters[characterId];
          scene.push({
            character,
            action: action
          });
          characterSet.add(character);
        });
      });
      scenes.push(scene);
    });
    this._acts.push({
      id: c.id,
      scenes: scenes,
      characters: Array.from(characterSet.values())
    });
  }

  setCurrentAct(id: number | string) {
    if (isNumber(id)) {
      this._currAct = this._acts[id];
    } else {
      this._currAct = this._acts.filter(item => item.id === id)[0];
    }
  }

  // 清除当前状态，一般用于回放操作
  reset() {
    this._currAct.characters.forEach(item => {
      item.reset();
    });
  }

  tickTo(t: number) {
    const lastTime = this._currTime;
    if (lastTime > t) {
      console.log('abcdefg');
      // 如果时间回退，那就重新走一遍
      this.reset();
      this._currTime = 0;
      this.tickTo(0);
    }
    const characterSet = new Set<ICharacter>();

    let baseStartTime = 0;
    for (let i = 0; i < this._currAct.scenes.length; i++) {
      const scene = this._currAct.scenes[i];
      scene.forEach(({ character, action }) => {
        const { startTime: st } = action;
        const startTime = st + baseStartTime;
        if (startTime > t) {
          return;
        }
        characterSet.add(character);
        // 之前没走过，现在走
        if (startTime > lastTime && startTime <= t) {
          const { type } = character.spec;
          this._actionProcessor.doAction(type, action.action, [character, {}, action]);
        }
        character.show();
      });
      let sceneTime = 0;
      scene.forEach(({ action }) => {
        const { startTime, duration } = action;
        sceneTime = Math.max(startTime + duration, startTime);
      });
      baseStartTime += sceneTime;
      if (baseStartTime > t) {
        break;
      }
    }

    // roleSet.forEach(r => {
    //   r.tickTo && r.tickTo(t);
    // });

    this._currTime = t;
    this._canvas.getStage().ticker.tickAt(t);
    this._canvas.getStage().render();
  }

  play(): void {
    if (!this._currAct) {
      return;
    }
    this._ticker.stop();
    this._currTime = 0;
    this.reset();
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

  resume(): void {
    this._ticker._tick(this._currTime);
  }

  release(): void {}
}
