import { IRoleSpec } from './role/dsl-interface';
import { isString } from '@visactor/vutils';
import { IStory, IStoryInitOption } from './interface/runtime-interface';
import { IRole } from './role/runtime-interface';
import { StoryCanvas } from './canvas/canvas';
import { IStorySpec, IChapterRoleCopy, IChapterRoleLink, IChapterSpec } from './interface';
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
    spec.chapters.forEach(e => {
      this._createChapter(e);
    });
  }

  public getRoles(): { [key: string]: IRole } {
    return this._roles;
  }

  private _createRole(spec: IRoleSpec | IChapterRoleCopy | IChapterRoleLink) {
    const option = { story: this, canvas: this._canvas, graphicParent: this._canvas.getStage().defaultLayer };
    if ((<IRoleSpec>spec).id) {
      if (!this._roles[(<IRoleSpec>spec).id]) {
        this._roles[(<IRoleSpec>spec).id] = StoryFactory.createRole(<IRoleSpec>spec, option);
      }
      return this._roles[(<IRoleSpec>spec).id];
    } else if ((<IChapterRoleLink>spec).roleId) {
      return this._roles[(<IChapterRoleLink>spec).roleId];
    } else if ((<IChapterRoleCopy>spec).role) {
      this._roles[(<IChapterRoleCopy>spec).role.id] = StoryFactory.createRole((<IChapterRoleCopy>spec).role, option);
      return this._roles[(<IChapterRoleCopy>spec).role.id];
    }
    return null;
  }

  private _createChapter(spec: IChapterSpec) {
    this._player.addChapter(spec, this._roles);
  }

  play(chapterIndex = 0) {
    // player 开始播放
    this._player.setCurrentChapter(chapterIndex);
    this._player.play();
  }

  async encodeToVideo(chapterIndex: number, millsecond: number, fps: number) {
    this._player.setCurrentChapter(chapterIndex);
    return this._player.encodeToVideo(millsecond, fps);
  }

  getPlayer() {
    return this._player;
  }
}
