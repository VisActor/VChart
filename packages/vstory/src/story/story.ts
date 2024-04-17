import { IElementSpec } from './element/dsl-interface';
import { isString } from '@visactor/vutils';
import { IStory, IStoryInitOption } from './interface/runtime-interface';
import { IElement } from './element/runtime-interface';
import { StoryCanvas } from './canvas/canvas';
import { IStorySpec, IChapterElementCopy, IChapterElementLink } from './interface';
import { StoryFactory } from './factory/factory';
export class Story implements IStory {
  static _id_ = 0;

  readonly id: string;

  protected _canvas: StoryCanvas;

  protected _elements: { [key: string]: IElement } = {};

  constructor(spec: IStorySpec, option: IStoryInitOption) {
    this.id = 'test-mvp_' + Story._id_++;
    this._canvas = new StoryCanvas(
      this,
      isString(option.dom) ? (document.getElementById(option.dom) as HTMLDivElement) : option.dom
    );

    if (spec) {
      this.load(spec);
    }
    console.log(this);
  }

  load(spec: IStorySpec) {
    spec.elements.forEach(e => {
      this._getElement(e);
    });
  }

  private _getElement(spec: IElementSpec | IChapterElementCopy | IChapterElementLink) {
    const option = { story: this, canvas: this._canvas };
    if ((<IElementSpec>spec).id) {
      if (!this._elements[(<IElementSpec>spec).id]) {
        this._elements[(<IElementSpec>spec).id] = StoryFactory.createElement(<IElementSpec>spec, option);
      }
      return this._elements[(<IElementSpec>spec).id];
    } else if ((<IChapterElementLink>spec).elementId) {
      return this._elements[(<IChapterElementLink>spec).elementId];
    } else if ((<IChapterElementCopy>spec).element) {
      this._elements[(<IChapterElementCopy>spec).element.id] = StoryFactory.createElement(
        (<IChapterElementCopy>spec).element,
        option
      );
      return this._elements[(<IChapterElementCopy>spec).element.id];
    }
    return null;
  }

  play(chapterIndex = 0) {
    // player 开始播放
  }
}
