import { ICharacterSpec } from './character/dsl-interface';
import { isString } from '@visactor/vutils';
import { IStory, IStoryInitOption } from './interface/runtime-interface';
import { ICharacter } from './character/runtime-interface';
import { StoryCanvas } from './canvas/canvas';
import { IStorySpec, ICharacterLink, IActSpec } from './interface';
import { StoryFactory } from './factory/factory';
import { defaultTicker, defaultTimeline } from '@visactor/vrender-core';
import { IPlayer } from './interface/player';
import { Player } from './player';

defaultTicker.remTimeline(defaultTimeline);

export class Story implements IStory {
  static _id_ = 0;

  protected _player: IPlayer;

  readonly id: string;

  protected _canvas: StoryCanvas;
  get canvas() {
    return this._canvas;
  }

  protected _characters: { [key: string]: ICharacter } = {};

  constructor(spec: IStorySpec, option: IStoryInitOption) {
    this.id = 'test-mvp_' + Story._id_++;
    this._canvas = new StoryCanvas(
      this,
      isString(option.dom) ? (document.getElementById(option.dom) as HTMLDivElement) : option.dom
    );
    this._player = new Player(this._canvas);

    if (spec) {
      this.load(spec);
    }
    console.log(this);
  }

  load(spec: IStorySpec) {
    spec.characters.forEach(e => {
      this._createCharacter(e);
    });
    // @ts-ignore
    spec.acts.forEach(e => {
      this._createAct(e);
    });
  }

  public getCharacters(): { [key: string]: ICharacter } {
    return this._characters;
  }

  private _createCharacter(spec: ICharacterSpec | ICharacterLink) {
    const option = { story: this, canvas: this._canvas, graphicParent: this._canvas.getStage().defaultLayer };
    if ((<ICharacterSpec>spec).id) {
      if (!this._characters[(<ICharacterSpec>spec).id]) {
        this._characters[(<ICharacterSpec>spec).id] = StoryFactory.createCharacter(<ICharacterSpec>spec, option);
      }
      return this._characters[(<ICharacterSpec>spec).id];
    } else if ((<ICharacterLink>spec).characterId) {
      return this._characters[(<ICharacterLink>spec).characterId];
    }
    return null;
  }

  private _createAct(spec: IActSpec) {
    this._player.addAct(spec, this._characters);
  }

  play(actIndex = 0) {
    // player 开始播放
    this._player.setCurrentAct(actIndex);
    this._player.play();
  }

  async encodeToVideo(actIndex: number, millsecond: number, fps: number) {
    this._player.setCurrentAct(actIndex);
    return this._player.encodeToVideo(millsecond, fps);
  }

  getPlayer() {
    return this._player;
  }
}
