import type { IChartModel } from './../interface';
import { isArray, isObject, isEmpty, cloneDeep } from '@visactor/vutils';
import type { IEditorController, IModelInfo, IUpdateAttributeParam } from './../../../core/interface';
import { EditorFactory } from './../../../core/factory';
import type { IData, StandardData } from '../data/interface';
import type { ILayoutData } from '../layout/interface';
import type { IChartTemp } from '../template/interface';
import type { IEditorSpec, IModelSpec, ISpecProcess } from './interface';
// @ts-ignore
import type { ISpec, ITheme } from '@visactor/vchart';
import { diffSpec, isModelInfoMatchSpec, isSameModelInfo } from '../../../utils/spec';
import type { EditorChart } from '../chart';
import { mergeSpec } from '../utils/spec';

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
  get specTemp() {
    return this._specTemp;
  }
  protected _data: IData = null;
  protected _chart: EditorChart = null;

  private _controller: IEditorController;

  constructor(chart: EditorChart, call: () => void) {
    this._chart = chart;
    this._data = chart.data;
    this._onSpecReadyCall = call;
    this._controller = chart.option.controller;
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
    const option = this._data.getSpecOption();
    this._vchartSpec = this._specTemp.getSpec(data, info, option);
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
        mergeSpec(chartSpec, s.spec);
      });
    }

    if (this._editorSpec.marker) {
      Object.keys(this._editorSpec.marker).forEach(key => {
        this._vchartSpec[key] = this._editorSpec.marker[key];
        // if (!this._vchartSpec[key]) {
        //   this._vchartSpec[key] = [];
        // }
        // if (!isArray(this._vchartSpec[key])) {
        //   this._vchartSpec[key] = [this._vchartSpec[key]];
        // }
        // const markers = this._editorSpec.marker[key];
        // markers.forEach((marker: any) => {
        //   const index = this._vchartSpec[key].findIndex((m: any) => m.id === marker.id);
        //   if (index === -1) {
        //     this._vchartSpec[key].push(marker);
        //   } else {
        //     this._vchartSpec[key][index] = merge(this._vchartSpec[key][index] || {}, marker);
        //   }
        // });
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
        spec: mergeSpec({}, spec)
      };
      this._editorSpec.modelSpec = this._editorSpec.modelSpec || [];
      this._editorSpec.modelSpec.push(s);
    }
    s.spec = mergeSpec(s.spec, spec);
  }

  // 更新模块spec
  updateElementAttribute(model: IChartModel, attr: IUpdateAttributeParam, triggerHistory: boolean = true) {
    if (triggerHistory) {
      this.saveSnapshot();
    }
    let hasChange = false;
    if (attr.color) {
      hasChange = true;
      this._editorSpec.color = attr.color;
    }
    if (attr.spec) {
      hasChange = true;
      const modelInfo = { id: model.userId, specKey: model.specKey, specIndex: model.getSpecIndex() };
      this.mergeModelEditorSpec(modelInfo, attr.spec);
      this._chart.layout.resetModelLayoutDataAfterAttributeChanged(modelInfo, model);
    }
    if (attr.modelSpec) {
      hasChange = true;
      attr.modelSpec.forEach(mSpec => {
        this.mergeModelEditorSpec(mSpec, mSpec.spec);
        this._chart.layout.resetModelLayoutDataAfterAttributeChanged(mSpec);
      });
    }

    if (attr.markLine && attr.markLine.spec) {
      hasChange = true;
      this.updateMarker(attr.markLine, 'markLine', model.userId);
    }

    if (attr.markArea && attr.markArea.spec) {
      hasChange = true;
      this.updateMarker(attr.markArea, 'markArea', model.userId);
    }

    this._mergeEditorSpec();
    if (triggerHistory) {
      this.pushHistory();
    }
    return hasChange;
  }

  private updateMarker(config: { spec?: any; enable?: boolean }, key: string, id?: string | number) {
    // 更新编辑器数据
    if (!this._editorSpec.marker) {
      this._editorSpec.marker = {
        markArea: [],
        markLine: []
      };
    }

    const { spec, enable } = config;
    const markersInEditorSpec = this._editorSpec.marker[key];
    if (enable !== false) {
      if (isEmpty(markersInEditorSpec)) {
        this._editorSpec.marker[key] = [spec];
      } else {
        const markerIndex = markersInEditorSpec.findIndex((markerSpec: any) => markerSpec.id === (id || spec.id));
        if (markerIndex === -1) {
          this._editorSpec.marker[key].push(spec);
        } else {
          mergeSpec(this._editorSpec.marker[key][markerIndex], spec);
        }
      }
    } else {
      // 删除逻辑
      const markerIndex = (markersInEditorSpec ?? []).findIndex((markerSpec: any) => markerSpec.id === (id || spec.id));
      if (markerIndex !== -1) {
        this._editorSpec.marker[key].splice(markerIndex, 1);
      }
    }
  }

  clearMarker() {
    delete this._editorSpec.marker;
  }

  protected _snapShot: any = null;
  saveSnapshot() {
    this._snapShot = cloneDeep(this._chart.getData());
  }

  pushHistory() {
    const { from, to } = diffSpec(this._snapShot, this._chart.getData());
    if (Object.keys(from).length === Object.keys(to).length && Object.keys(from).length === 0) {
      return;
    }
    this._chart.option.editorData.pushHistoryNextTick({
      element: this._chart.getElementInfo(),
      from: cloneDeep(from),
      to: cloneDeep(to),
      use: this._chart.option.commonHistoryUse
    });
  }

  updateAttributeFromHistory(att: any) {
    this._chart.layout.setViewBox(att.rect);
    if (att.attribute) {
      if (att.attribute.data) {
        this._data.changeDataSource(att.attribute.data.type, att.attribute.data.value);
      }
      if (att.attribute.layout) {
        this._chart.layout.setLayoutData(att.attribute.layout);
      }
      if (att.attribute) {
        this.updateEditorSpec(mergeSpec(this._editorSpec, att.attribute));
      }
    }

    this._updateEditorBox();
  }

  private _updateEditorBox() {
    // do nothing
  }
}
