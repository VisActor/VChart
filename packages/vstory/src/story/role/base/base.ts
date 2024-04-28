import { IRoleInitOption } from '../runtime-interface';
import { IRole, IRoleSpec } from '..';
import { IGroup } from '@visactor/vrender-core';

export abstract class RoleBase implements IRole {
  readonly id: string;
  protected _spec: IRoleSpec;
  get spec() {
    return this._spec;
  }

  protected _option: IRoleInitOption;
  get option() {
    return this._option;
  }

  constructor(spec: IRoleSpec, option: IRoleInitOption) {
    this.id = spec.id;
    this._spec = spec;
    this._option = option;
  }

  public init() {
    this._parserSpec();
    this._initGraphics();
  }

  public reset() {
    this.clearRole();
    this.init();
  }

  protected abstract _parserSpec(): void;
  protected abstract _initGraphics(): void;

  abstract show(): void;
  abstract hide(): void;

  public getPositionData() {}

  public abstract getGraphicParent(): IGroup;

  public abstract clearRole(): void;
}
