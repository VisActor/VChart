import type { IChartModel } from './../interface';
import { merge, isArray, isObject, isEmpty, array } from '@visactor/vutils';
import type { IModelInfo, IUpdateAttributeParam } from './../../../core/interface';
import { EditorFactory } from './../../../core/factory';
import type { IData, StandardData } from '../data/interface';
import type { ILayoutData } from '../layout/interface';
import type { IChartTemp } from '../template/interface';
import type { IEditorSpec, IModelSpec, ISpecProcess } from './interface';
// @ts-ignore
import type { ISpec, ITheme } from '@visactor/vchart';
import { isModelInfoMatchSpec, isSameModelInfo } from '../../../utils/spec';

const DefaultEditorSpec: IEditorSpec = {
  theme: null,
  temp: null,
  color: null,
  modelSpec: null,
  layout: { viewBox: { x: 0, y: 0, width: 0, height: 0 }, data: [] },
  marker: {
    markLine: [],
    markArea: []
  }
};

export class SpecProcess implements ISpecProcess {
  // 编辑器spec 存储和加载都是这个数据结构
  // 保证结构可序列化。
  protected _editorSpec: IEditorSpec = {
    ...DefaultEditorSpec
  };
  protected _onSpecReadyCall: () => void = null;
  // vchartSpec 只作为临时转换结果，传递给vchart，不会存储。
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
    // transform spec 的过程
    // 色板 考虑模版可能有配置 color 。还是放到 spec 的 color 中处理
    if (this._editorSpec.color) {
      if (isArray(this._vchartSpec.color) || !isObject(this._vchartSpec.color)) {
        this._vchartSpec.color = this._editorSpec.color;
      } else {
        this._vchartSpec.color.range = this._editorSpec.color;
      }
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

    if (this._editorSpec.marker) {
      Object.keys(this._editorSpec.marker).forEach(key => {
        if (!this._vchartSpec[key]) {
          this._vchartSpec[key] = [];
        }
        const markers = this._editorSpec.marker[key];
        markers.forEach((marker: any) => {
          const index = this._vchartSpec[key].findIndex((m: any) => m.id === marker.id);
          if (index === -1) {
            this._vchartSpec[key].push(marker);
          } else {
            this._vchartSpec[key][index] = merge(this._vchartSpec[key][index] || {}, marker);
          }
        });
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
        return isModelInfoMatchSpec(s, _s, s.specKey, index);
      });
    } else if (isObject(chartSpec)) {
      return isModelInfoMatchSpec(s, chartSpec as { id: string | number }, s.specKey, 0) ? chartSpec : null;
    }
    return null;
  }

  private getModelSpecEditorSpec(model: IModelInfo): IModelSpec {
    if (!this._editorSpec.modelSpec) {
      return null;
    }
    return this._editorSpec.modelSpec.find(s => isSameModelInfo(model, s));
  }

  private mergeModelEditorSpec(model: IModelInfo, spec: any) {
    let s = this.getModelSpecEditorSpec(model);
    if (!s) {
      s = {
        id: model.id,
        specKey: model.specKey,
        specIndex: model.specIndex,
        spec: merge({}, spec)
      };
      this._editorSpec.modelSpec = this._editorSpec.modelSpec || [];
      this._editorSpec.modelSpec.push(s);
    }
    s.spec = merge(s.spec, spec);
  }

  // 更新模块spec
  updateElementAttribute(model: IChartModel, attr: IUpdateAttributeParam) {
    let hasChange = false;
    if (attr.color) {
      hasChange = true;
      this._editorSpec.color = attr.color;
    }
    if (attr.spec) {
      hasChange = true;
      this.mergeModelEditorSpec(
        { id: model.userId, specKey: model.specKey, specIndex: model.getSpecIndex() },
        attr.spec
      );
    }
    if (attr.modelSpec) {
      hasChange = true;
      attr.modelSpec.forEach(mSpec => {
        this.mergeModelEditorSpec(mSpec, mSpec.spec);
      });
    }

    if (attr.markLine && attr.markLine.spec) {
      hasChange = true;
      this.updateMarker(attr.markLine.spec, 'markLine', model.userId);
    }

    if (attr.markArea && attr.markArea.spec) {
      hasChange = true;
      this.updateMarker(attr.markArea.spec, 'markArea', model.userId);
    }

    this._mergeEditorSpec();
    return hasChange;
  }

  updateMarker(spec: any, key: string, id?: string | number) {
    // 更新编辑器数据
    if (!this._editorSpec.marker) {
      this._editorSpec.marker = {
        markArea: [],
        markLine: []
      };
    }

    if (isEmpty(this._editorSpec.marker[key])) {
      this._editorSpec.marker[key] = [spec];
    } else {
      const markerIndex = this._editorSpec.marker[key].findIndex(
        (markerSpec: any) => markerSpec.id === (id || spec.id)
      );
      if (markerIndex === -1) {
        this._editorSpec.marker[key].push(spec);
      } else {
        merge(this._editorSpec.marker[key][markerIndex], spec);
      }
    }
    // save
    // this._editorSpec.markLine =  {}
  }

  clearMarker() {
    delete this._editorSpec.marker;
  }
}
