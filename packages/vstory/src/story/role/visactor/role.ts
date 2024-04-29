/* eslint-disable no-console */
import { IRoleSpec } from 'src/story/role/dsl-interface';
import { RoleBase } from '../base/base';
import type { ISpecProcess, IRoleVisactor, IVisactorGraphic } from './interface';
import { IRoleInitOption } from '../runtime-interface';
import { IChartRoleRuntime } from '../chart/runtime/interface';

export abstract class RoleVisactor extends RoleBase implements IRoleVisactor {
  protected declare _specProcess: ISpecProcess;
  get specProcess() {
    return this._specProcess;
  }
  get dataTempTransform() {
    return this._specProcess.dataTempTransform;
  }

  get chartType() {
    return this._specProcess.dataTempTransform.specTemp?.getChartType();
  }

  get tempType() {
    return this._specProcess.dataTempTransform.specTemp?.type;
  }

  protected declare _graphic: IVisactorGraphic;
  get graphic() {
    return this._graphic;
  }

  protected _runtime: IChartRoleRuntime[] = [];

  constructor(spec: IRoleSpec, option: IRoleInitOption) {
    super(spec, option);
    this._initSpecProcess();
  }

  protected _initRuntime(): void {}

  clearConfig(opt: { clearCurrent: false | { [key: string]: any } }) {
    // do nothing
  }

  protected abstract _initSpecProcess(): void;

  onSpecReady = () => {
    console.log('onSpecReady !');
    this._runtime.forEach(r => r.onSpecReady?.());
    this._specProcess.dataTempTransform.specTemp?.standardizedSpec(this._specProcess.getVisSpec(), { role: this });
    this._updateVisactorSpec();
    this._afterRender();
  };

  protected abstract _afterRender(): void;

  protected abstract _updateVisactorSpec(): void;

  show(): void {
    this._graphic.setAttribute('visibleAll', true);
  }
  hide(): void {
    this._graphic.setAttribute('visibleAll', false);
  }

  getGraphicParent() {
    return this._graphic;
  }

  tickTo(t: number): void {
    return;
  }

  release() {
    this._specProcess.release();
    this._graphic?.parent?.removeChild(this._graphic);
    this._specProcess = this._graphic = null;
  }
}
