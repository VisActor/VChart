import type { VRenderPointerEvent } from './../interface';
import type { IEditorElement, ILayoutLine, IUpdateAttributeParam } from './../../core/interface';
/* eslint-disable no-console */
import { LayoutEditorElement } from './editor-elements/layout-editor';
import { ChartLayout } from './layout/chart-layout';
import type { IBoundsLike } from '@visactor/vutils';
import { VChart } from '@visactor/vchart';
import type { ISpec, IVChart } from '@visactor/vchart';
import type { IRect, IPoint, ILayoutGuideLine } from '../../typings/space';
import { BaseElement } from '../base-element';
import type { IChartLayout } from './layout/interface';
import { SpecProcess } from './spec-process/spec-process';
import type { ISpecProcess } from './spec-process/interface';
import { Data } from './data/data';
import type { IData } from './data/interface';
import type { IChartElementOption, IChartModel } from './interface';
import {
  ValueLineEditor,
  MarkAreaEditor,
  GrowthLineEditor,
  HierarchicalDiffLineEditor
} from './editor-elements/marker';
import { ChartEvent } from './event';
import { CommonModelElement } from './editor-elements/common-model-editor';
import { getDefaultMarkerConfigByType } from './utils/marker';
import { IgnoreModelTypeInLayout, getChartModelWithModelInfo, transformModelRect } from './utils/layout';
import { LayoutRectToRect, getLayoutLine } from '../../utils/space';

export class EditorChart extends BaseElement {
  type = 'chart';
  protected _data: IData;
  get data() {
    return this._data;
  }
  protected _specProcess: ISpecProcess;
  get specProcess() {
    return this._specProcess;
  }
  protected _layout: IChartLayout;
  get layout() {
    return this._layout;
  }

  protected declare _opt: IChartElementOption;
  protected _container: HTMLElement;

  protected _layoutEditor: LayoutEditorElement;
  protected _avgMarkLineEditor: ValueLineEditor;
  protected _markAreaEditor: MarkAreaEditor;
  protected _growthMarkLineEditor: GrowthLineEditor;
  protected _hirarchicalDiffMarkLineEditor: HierarchicalDiffLineEditor;
  protected _commonModelElement: CommonModelElement;

  protected _vchart: IVChart;
  get vchart() {
    return this._vchart;
  }

  protected _event: ChartEvent;
  get event() {
    return this._event;
  }

  constructor(opt: IChartElementOption) {
    super(opt);
    this._event = new ChartEvent(this);
    this._data = new Data();
    this._specProcess = new SpecProcess(this._data, this.onSpecReady);
    this._layout = new ChartLayout(this._specProcess);
    if (this._mode === 'editor') {
      this.initEditors();
    }
  }

  /**
   * init editors
   */
  initEditors() {
    this._layoutEditor = new LayoutEditorElement(this._opt.controller, this, this._opt.layer);
    this._avgMarkLineEditor = new ValueLineEditor(this._opt.controller, this, this._opt.layer);
    this._markAreaEditor = new MarkAreaEditor(this._opt.controller, this, this._opt.layer);
    this._growthMarkLineEditor = new GrowthLineEditor(this._opt.controller, this, this._opt.layer);
    this._hirarchicalDiffMarkLineEditor = new HierarchicalDiffLineEditor(this._opt.controller, this, this._opt.layer);
    // chart editor
    this._commonModelElement = new CommonModelElement(this._opt.controller, this, this._opt.layer);
    this._commonModelElement.emitter.on('chartTypeChange', this._onChartTypeChange);
    this._commonModelElement.emitter.on('chartDataChange', this._onChartDataChange);
    this._commonModelElement.emitter.on('addMarkLine', this._onAddMarkLine);
    this._commonModelElement.emitter.on('addMarkArea', this._onAddMarkArea);
  }

  bindEditors() {
    // editors maybe null
    this._avgMarkLineEditor?.initWithVChart();
    this._markAreaEditor?.initWithVChart();
    this._growthMarkLineEditor?.initWithVChart();
    this._hirarchicalDiffMarkLineEditor?.initWithVChart();
    this._commonModelElement?.initWithVChart();
    this._layoutEditor?.initWithVChart();
  }

  releaseEditors() {
    this._layoutEditor?.release();
    this._avgMarkLineEditor?.release();
    this._markAreaEditor?.release();
    this._growthMarkLineEditor?.release();
    this._hirarchicalDiffMarkLineEditor?.release();
    this._commonModelElement?.release();
  }

  initWithOption(): void {
    super.initWithOption();
    this._layout.setViewBox(this._opt.rect);
    if (this._opt.attribute) {
      if (this._opt.attribute.data) {
        this._data.changeDataSource(this._opt.attribute.data.type, this._opt.attribute.data.value);
      }
      if (this._opt.attribute.layout) {
        this._layout.setLayoutData(this._opt.attribute.layout);
      }
      if (this._opt.attribute) {
        this._specProcess.updateEditorSpec(this._opt.attribute as any);
      }
    }
  }

  protected _initVChart(spec: ISpec) {
    spec = this._transformVchartSpec(spec);

    this._vchart = new VChart(spec, {
      renderCanvas: this._opt.layer.getCanvas(),
      stage: this._opt.layer.getStage(),
      animation: false,
      disableTriggerEvent: this._mode === 'editor'
    }) as any;
    this._event.initWithVChart();
    this._layout.setVChart(this._vchart);

    // editor init with vchart
    if (this._mode === 'editor') {
      this.bindEditors();
    }
  }

  protected _transformVchartSpec(spec: ISpec) {
    spec.width = this._rect.width;
    spec.height = this._rect.height;
    spec.background = 'transparent';
    if (this._vchart?.getChart()?.getSpec()) {
      spec.width = this._vchart.getChart().getSpec().width;
      spec.height = this._vchart.getChart().getSpec().height;
    }
    return spec;
  }

  setTemp(key: string) {
    this._specProcess.updateTemp(key);
  }

  setDataSource(type: string, value: any) {
    this._data.changeDataSource(type, value);
  }

  onSpecReady = () => {
    console.log('onSpecReady !');
    if (!this._vchart) {
      console.log('onSpecReady init chart');
      this._initVChart(this._specProcess.getVChartSpec());
      // eslint-disable-next-line promise/catch-or-return
      this._vchart.renderAsync().then(() => {
        this._afterRender();
      });
    } else {
      console.log('onSpecReady update spec');
      this._isRendered = false;
      // eslint-disable-next-line promise/catch-or-return
      this._vchart.updateSpec(this._transformVchartSpec(this._specProcess.getVChartSpec())).then(() => {
        this._afterRender();
      });
    }
  };

  release() {
    super.release();
    this.releaseEditors();

    this._data.clear();
    this._specProcess.clear();
    this._layout.clear();
    this._event.release();
    this._vchart?.release();

    this._data = this._specProcess = this._layout = this._vchart = null;
  }

  resize(rect: IRect): void {
    throw new Error('Method not implemented.');
  }
  move(pos: IPoint): void {
    throw new Error('Method not implemented.');
  }
  getBounds(): IBoundsLike {
    throw new Error('Method not implemented.');
  }

  getData() {
    const data = super.getData();
    data.attribute = { ...this._specProcess.getEditorSpec() };
    data.attribute.data = this._data.getSave();
    return data;
  }

  _changeModel() {
    if (this._mode === 'editor') {
      this.initEditors();
      if (this._vchart) {
        this.bindEditors();
      }
    } else {
      this.releaseEditors();
    }
  }

  reRenderWithUpdateSpec() {
    if (!this._vchart) {
      return;
    }
    this.onSpecReady();
  }

  private _onChartTypeChange = (el: IEditorElement, attr: IUpdateAttributeParam) => {
    el.editorFinish();
    // do not clear layoutData
    // this.layout.setLayoutData({
    //   viewBox: this.layout.getLayoutData().viewBox,
    //   data: []
    // });
    this._specProcess.clearMarker();
    this.specProcess.updateTemp(attr.chartType);
  };
  private _onChartDataChange = (el: IEditorElement, attr: IUpdateAttributeParam) => {
    this.data.changeDataSource(attr.data.type, attr.data.value);
  };

  private _onAddMarkLine = (el: IEditorElement, attr: IUpdateAttributeParam) => {
    const spec: any = this.specProcess.getVChartSpec();
    if (!spec.markLine) {
      spec.markLine = [];
    }
    // TODO: 没搞懂这个逻辑
    if (attr.markLine.enable) {
      const defaultMarkLineSpec = getDefaultMarkerConfigByType(this.vchart, attr.markLine.type);
      spec.markLine.push(defaultMarkLineSpec);
      this.specProcess.updateMarker(defaultMarkLineSpec, 'markLine');
    } else {
      const lastMarkLine = spec.markLine.find((markLine: any) => markLine.id === attr.markLine.spec.id);
      if (lastMarkLine) {
        spec.markLine.splice(spec.markLine.indexOf(lastMarkLine), 1);
      }
    }
    this.reRenderWithUpdateSpec();
  };
  private _onAddMarkArea = (el: IEditorElement, attr: IUpdateAttributeParam) => {
    const spec: any = this.specProcess.getVChartSpec();
    if (!spec.markArea) {
      spec.markArea = [];
    }
    // TODO: 没搞懂这个逻辑
    if (attr.markArea.enable) {
      const defaultMarkAreaSpec = getDefaultMarkerConfigByType(this.vchart, attr.markArea.type);
      spec.markArea.push(defaultMarkAreaSpec);
      this.specProcess.updateMarker(defaultMarkAreaSpec, 'markArea');
    } else {
      const lastMarkArea = spec.markArea.find((markArea: any) => markArea.id === attr.markArea.spec.id);
      if (lastMarkArea) {
        spec.markArea.splice(spec.markArea.indexOf(lastMarkArea), 1);
      }
    }
    this.reRenderWithUpdateSpec();
  };

  moveBy(offsetX: number, offsetY: number) {
    // clear editor box
    this._layoutEditor.clearLayoutEditorBox();
    // move by
    this._layout?.getLayoutData()?.data?.forEach(_d => {
      _d.layout.x.offset += offsetX;
      _d.layout.y.offset += offsetY;
    });
    this._vchart.getChart().setLayoutTag(true);
  }

  getLayoutGuideLine(): ILayoutLine[] {
    const result: ILayoutLine[] = [];
    const layoutData = this.layout.getLayoutData();
    layoutData.data.forEach(d => {
      const model = getChartModelWithModelInfo(this.vchart, d);
      if (!model || IgnoreModelTypeInLayout[model.type]) {
        return;
      }
      const rect = transformModelRect(model as unknown as IChartModel, LayoutRectToRect(d.layout));
      result.push(
        ...getLayoutLine(rect, {
          id: d.id,
          specKey: d.specKey,
          specIndex: d.specIndex
        })
      );
    });
    return result;
  }

  getEditorElementsConnectBox(rect: IRect): IEditorElement[] {
    const mathModel = this._layout.getBoxConnectModel(rect);
    return mathModel.map(info => this._commonModelElement.getElementWithModel(info)).filter(e => !!e);
  }

  startEditorElement(el: IEditorElement, e: PointerEvent) {
    if (!el.model) {
      return;
    }
    const modelInfo = { id: el.model.userId, specKey: el.model.specKey, specIndex: el.model.getSpecIndex() };
    const info = {
      model: el.model,
      layoutMeta: this._layout.getModelLayoutData(modelInfo)
    };
    this._event.emitter.emit('pickModel', info, e);
  }

  clearCurrentEditorElement() {
    this._event.emitter.emit('unPickModel', null);
  }

  tryPick(e: VRenderPointerEvent) {
    this._event.tryPick(e);
  }
}
