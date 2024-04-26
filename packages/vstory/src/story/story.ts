import { IRoleSpec } from './role/dsl-interface';
import { isString } from '@visactor/vutils';
import { IStory, IStoryInitOption } from './interface/runtime-interface';
import { IRole } from './role/runtime-interface';
import { StoryCanvas } from './canvas/canvas';
import { IStorySpec, IRoleLink, IActSpec } from './interface';
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

  protected _roles: { [key: string]: IRole } = {};

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
    spec.roles.forEach(e => {
      this._createRole(e);
    });
    // @ts-ignore
    spec.acts.forEach(e => {
      this._createAct(e);
    });
  }

  public getRoles(): { [key: string]: IRole } {
    return this._roles;
  }

  private _createRole(spec: IRoleSpec | IRoleLink) {
    const option = { story: this, canvas: this._canvas, graphicParent: this._canvas.getStage().defaultLayer };
    if ((<IRoleSpec>spec).id) {
      if (!this._roles[(<IRoleSpec>spec).id]) {
        this._roles[(<IRoleSpec>spec).id] = StoryFactory.createRole(<IRoleSpec>spec, option);
      }
      return this._roles[(<IRoleSpec>spec).id];
    } else if ((<IRoleLink>spec).roleId) {
      return this._roles[(<IRoleLink>spec).roleId];
    }
    return null;
  }

  private _createAct(spec: IActSpec) {
    this._player.addAct(spec, this._roles);
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
