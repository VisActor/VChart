import { EditorFactory } from './../../../core/factory';
import type { IData, StandardData } from '../data/interface';
import type { ILayoutData } from '../layout/interface';
import type { IChartTemp } from '../template/interface';
import type { IEditorSpec, ISpecProcess } from './interface';
// @ts-ignore
import type { ISpec, ITheme } from '@visactor/vchart';

const DefaultEditorSpec: IEditorSpec = {
  theme: null,
  temp: null,
  layout: { viewBox: { x: 0, y: 0, width: 0, height: 0 }, data: [] }
};

export class SpecProcess implements ISpecProcess {
  protected _editorSpec: IEditorSpec = {
    ...DefaultEditorSpec
  };
  protected _onSpecReadyCall: () => void = null;
  protected _vchartSpec: ISpec = {} as any;
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
    if (this._editorSpec.layout) {
      this.updateLayout(this._editorSpec.layout);
    }
    if (this._editorSpec.theme) {
      this.updateTheme(this._editorSpec.theme);
    }
    if (this._editorSpec.temp) {
      this.updateTemp(this._editorSpec.temp);
    }
  }
  updateTheme(theme: ITheme) {
    this._editorSpec.theme = theme;
    this.transformSpec();
  }
  updateTemp(key: string) {
    const tCreate = EditorFactory.getTemp(key);
    if (!tCreate) {
      return;
    }
    this._specTemp = new tCreate();
    this._editorSpec.temp = key;
    this._checkSpecReady();
  }
  updateLayout(layout: ILayoutData) {
    this._editorSpec.layout = layout;
  }
  getVChartSpec() {
    return this._vchartSpec;
  }

  dataReady = (_d: StandardData) => {
    this._checkSpecReady();
  };
  protected transformSpec() {
    const data = this._data.getData();
    const info = this._data.getDataInfo();
    this._vchartSpec = this._specTemp.getSpec(data, info);
    this._onSpecReadyCall();
  }

  protected _checkSpecReady() {
    const data = this._data.getData();
    const info = this._data.getDataInfo();
    if (!data) {
      return false;
    }
    if (!this._specTemp) {
      return false;
    }
    if (this._specTemp.checkDataEnable(data, info)) {
      this.transformSpec();
    }
    return true;
  }

  clear() {
    this._onSpecReadyCall = null;
    this._specTemp.clear();
    this._specTemp = null;
    this._editorSpec = null;
    this._vchartSpec = null;
    this._data = null;
  }
}
