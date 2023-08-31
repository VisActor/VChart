import type { IData, StandardData } from '../data/interface';
import type { ILayoutData } from '../layout/interface';
import type { IChartTemp } from '../temp/interface';
import type { IEditorSpec, ISpecProcess } from './interface';
// @ts-ignore
import type { IChartSpec, ITheme } from '@visactor/vchart';

const DefaultEditorSpec: IEditorSpec = {
  theme: null,
  temp: null,
  layout: { viewBox: { x1: 0, y1: 0, x2: 0, y2: 0 }, data: [] }
};

export class SpecProcess implements ISpecProcess {
  protected _editorSpec: IEditorSpec = {
    ...DefaultEditorSpec
  };
  protected _onSpecReadyCall: () => void = null;
  protected _vchartSpec: IChartSpec = {};
  protected _specTemp: IChartTemp = null;
  protected _data: IData = null;

  constructor(data: IData, call: () => void) {
    this._data = data;
    this._onSpecReadyCall = call;
    this._data.addDataUpdateListener(this.dataReady);
  }
  getEditorSpec() {
    return this._editorSpec;
  }
  updateEditorSpec(spec: IEditorSpec) {
    this._editorSpec = spec;
    if (!this._editorSpec) {
      this._editorSpec = {
        ...DefaultEditorSpec
      };
    }
  }
  updateTheme(theme: ITheme) {
    this._editorSpec.theme = theme;
    this.transformSpec();
  }
  updateTemp(temp: IChartTemp) {
    this._specTemp = temp;
    this._checkSpecReady();
  }
  updateLayout(layout: ILayoutData) {
    this._editorSpec.layout = layout;
    this.transformSpec();
  }
  getVChartSpec() {
    return this._vchartSpec;
  }

  dataReady = (_d: StandardData) => {
    this._checkSpecReady();
  };
  protected transformSpec() {
    const data = this._data.getData();
    this._vchartSpec = this._specTemp.getSpec(data, data.getFields());
    this._onSpecReadyCall();
  }

  protected _checkSpecReady() {
    const data = this._data.getData();
    if (!data) {
      return false;
    }
    if (!this._specTemp) {
      return false;
    }
    if (this._specTemp.checkDataEnable(data, data.getFields())) {
      this.transformSpec();
    }
  }

  clear() {
    this._onSpecReadyCall = null;
    this._specTemp = null;
    this._editorSpec = null;
    this._vchartSpec = null;
    this._data = null;
  }
}
