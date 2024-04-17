/* eslint-disable no-console */
import { IElementSpec } from 'src/story/element/dsl-interface';
import { ElementBase } from '../base/base';
import type { ISpecProcess, IElementVisactor, IVisactorGraphic } from './interface';
import { IElementInitOption } from '../../element/runtime-interface';

export abstract class ElementVisactor extends ElementBase implements IElementVisactor {
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

  get dataSourceType() {
    return this._specProcess.dataTempTransform.dataParser?.type;
  }

  protected declare _graphic: IVisactorGraphic;

  constructor(spec: IElementSpec, option: IElementInitOption) {
    super(spec, option);
    this._initSpecProcess();
  }

  clearConfig(opt: { clearCurrent: false | { [key: string]: any } }) {
    // do nothing
  }

  protected abstract _initSpecProcess(): void;

  onSpecReady = () => {
    console.log('onSpecReady !');
    this._updateVisactorSpec();
    this._afterRender();
  };

  protected abstract _afterRender(): void;

  protected abstract _updateVisactorSpec(): void;

  release() {
    this._specProcess.release();
    this._graphic?.parent?.removeChild(this._graphic);
    this._specProcess = this._graphic = null;
  }
}
