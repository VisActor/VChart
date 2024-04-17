import { GraphicText } from './graphic/graphic-text';
import { IElementGraphicsSpec } from '../dsl-interface';
import { ElementBase } from '../base/base';
import { Graphic } from './graphic/graphic';
import { StoryFactory } from '../../factory/factory';

export class ElementGraphics extends ElementBase {
  protected declare _spec: IElementGraphicsSpec;
  get spec() {
    return this._spec;
  }
  protected declare _graphic: Graphic;
  get graphic() {
    return this._graphic;
  }
  protected declare _text: GraphicText;
  get text() {
    return this._text;
  }

  protected _parserSpec(): void {}

  protected _initGraphics(): void {
    this._graphic = StoryFactory.createGraphic(this._spec.config.temp, this);
    this._text = new GraphicText(this);
    this._graphic.init();
    this._text.init();

    this._graphic.applyGraphicAttribute(this._spec.config.graphic);
    this._text.applyGraphicAttribute(this._spec.config.text);

    this._graphic.applyLayoutData(this._spec.widget);
    this._text.applyLayoutData(this._spec.widget);
    this.hide();
  }

  show(): void {
    this._text.show();
    this._graphic.show();
  }
  hide(): void {
    this._text.hide();
    this._graphic.hide();
  }

  getTextLayoutRatio(): { left: number; right: number; top: number; bottom: number } {
    return this._graphic.getTextLayoutRatio();
  }
}
