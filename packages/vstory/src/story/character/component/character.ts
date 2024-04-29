import { IGroup, createGroup } from '@visactor/vrender-core';
import { GraphicText } from './graphic/graphic-text';
import { IComponentCharacterSpec } from '../dsl-interface';
import { CharacterBase } from '../base/base';
import { Graphic } from './graphic/graphic';
import { getLayoutFromWidget } from '../../utils/layout';

export abstract class CharacterComponent extends CharacterBase {
  protected declare _spec: IComponentCharacterSpec;
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

  protected declare _group: IGroup;
  get group() {
    return this._group;
  }

  readonly graphicType: string = 'rect';

  protected _parserSpec(): void {}

  protected _initGraphics(): void {
    this._group = createGroup({ ...getLayoutFromWidget(this._spec.position), angle: this._spec.options.angle });
    this.option.graphicParent.add(this._group);

    this._graphic = this._createGraphic();
    this._text = new GraphicText(this);
    this._graphic.init();
    this._text.init();

    this._graphic.applyGraphicAttribute(this._spec.options.graphic);
    this._text.applyGraphicAttribute(this._spec.options.text);

    this._graphic.applyLayoutData(this._spec.position);
    this._text.applyLayoutData(this._spec.position);
    this.hide();
  }

  protected abstract _createGraphic(): Graphic;

  show(): void {
    this._group.setAttributes({ visible: true });
    this._text.show();
    this._graphic.show();
  }
  hide(): void {
    this._group.setAttributes({ visible: false });
    this._text.hide();
    this._graphic.hide();
  }

  getTextLayoutRatio(): { left: number; right: number; top: number; bottom: number } {
    return this._graphic.getTextLayoutRatio();
  }

  public clearCharacter(): void {
    this._group?.parent.removeChild(this._group);
    this._group = null;
  }

  public getGraphicParent() {
    return this._group;
  }
}

export abstract class CharacterGraphicComponent extends CharacterBase {
  protected declare _spec: IComponentCharacterSpec;

  get spec() {
    return this._spec;
  }
  protected declare _graphic: Graphic;
  get graphic() {
    return this._graphic;
  }

  protected declare _group: IGroup;
  get group() {
    return this._group;
  }

  protected abstract _createGraphic(): Graphic;

  protected _parserSpec(): void {}

  protected _initGraphics(): void {
    this._group = createGroup({ ...getLayoutFromWidget(this._spec.position), angle: this._spec.options.angle });
    this.option.graphicParent.add(this._group);

    this._graphic = this._createGraphic();
    this._graphic.init();

    this._graphic.applyGraphicAttribute(this._spec.options.graphic);

    this._graphic.applyLayoutData(this._spec.position);
    this.hide();
  }

  show(): void {
    this._graphic?.show();
  }
  hide(): void {
    this._graphic?.hide();
  }

  public getGraphicParent() {
    return this._group;
  }

  public clearCharacter(): void {
    if (this._group) {
      this._group.parent.removeChild(this._group);
      this._graphic = null;
    }
  }
}
