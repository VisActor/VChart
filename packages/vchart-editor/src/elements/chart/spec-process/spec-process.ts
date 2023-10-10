import { merge, isArray, isObject } from '@visactor/vutils';
import type { IEditorElement, IUpdateAttributeParam } from './../../../core/interface';
import { EditorFactory } from './../../../core/factory';
import type { IData, StandardData } from '../data/interface';
import type { ILayoutData } from '../layout/interface';
import type { IChartTemp } from '../template/interface';
import type { IEditorSpec, IModelSpec, ISpecProcess } from './interface';
// @ts-ignore
import type { ISpec, ITheme } from '@visactor/vchart';

const DefaultEditorSpec: IEditorSpec = {
  theme: null,
  temp: null,
  color: null,
  modelSpec: null,
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
    this._mergeEditorSpec();
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

  private _mergeEditorSpec() {
    this._vchartSpec;
    // 色板
    if (this._editorSpec.color) {
      this._vchartSpec.color = this._editorSpec.color;
    }
    // 模块样式
    if (this._editorSpec.modelSpec) {
      this._editorSpec.modelSpec.forEach(s => {
        const chartSpec = this.findChartSpec(s, this._vchartSpec);
        if (!chartSpec) {
          return;
        }
        merge(chartSpec, s.spec);
      });
    }
  }

  private findChartSpec(s: IModelSpec, vchartSpec: ISpec) {
    const chartSpec = this._vchartSpec[s.specKey];
    if (!chartSpec) {
      return null;
    }
    if (isArray(chartSpec)) {
      return chartSpec.find((_s, index) => {
        if (s.id) {
          if (_s.id === s.id) {
            return true;
          }
          return false;
        } else if (s.index === index) {
          return true;
        }
        return false;
      });
    } else if (isObject(chartSpec)) {
      if (s.id) {
        if (chartSpec.id === s.id) {
          return chartSpec;
        }
        return null;
      } else if (s.index === 0) {
        return chartSpec;
      }
    }
    return null;
  }

  private getModelSpecEditorSpec(model: { userId: string; _specIndex: number; specKey: string }): IModelSpec {
    if (!this._editorSpec.modelSpec) {
      return null;
    }
    return this._editorSpec.modelSpec.find(
      s => (s.id && s.id === model.userId) || (s.specKey === model.specKey && s.index === model._specIndex)
    );
  }

  private mergeModelEditorSpec(model: { userId: string; _specIndex: number; specKey: string }, spec: any) {
    let s = this.getModelSpecEditorSpec(model);
    if (!s) {
      s = {
        specKey: model.specKey,
        id: model.userId,
        index: model._specIndex,
        spec: merge({}, spec)
      };
      this._editorSpec.modelSpec = this._editorSpec.modelSpec || [];
      this._editorSpec.modelSpec.push(s);
    }
    s.spec = merge(s.spec, spec);
  }

  updateElementAttribute(el: IEditorElement, attr: IUpdateAttributeParam) {
    let hasChange = false;
    if (attr.color) {
      hasChange = true;
      this._editorSpec.color = attr.color;
    }
    if (attr.spec) {
      hasChange = true;
      this.mergeModelEditorSpec(el.model, attr.spec);
    }
    this._mergeEditorSpec();
    return hasChange;
  }
}
