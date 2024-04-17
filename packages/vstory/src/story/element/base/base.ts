import { IElementInitOption } from './../runtime-interface';
import { IElement, IElementSpec } from '..';

export abstract class ElementBase implements IElement {
  readonly id: string;
  protected _spec: IElementSpec;
  get spec() {
    return this._spec;
  }

  protected _option: IElementInitOption;
  get option() {
    return this._option;
  }

  constructor(spec: IElementSpec, option: IElementInitOption) {
    this.id = spec.id;
    this._spec = spec;
    this._option = option;
  }

  public init() {
    this._parserSpec();
    this._initGraphics();
  }

  protected abstract _parserSpec(): void;
  protected abstract _initGraphics(): void;

  abstract show(): void;
  abstract hide(): void;

  public getLayoutData() {}

  public geElementRootMark() {
    return this._option.canvas.getStage().defaultLayer;
  }
}
