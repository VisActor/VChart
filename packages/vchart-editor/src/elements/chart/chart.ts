/* eslint-disable promise/no-nesting */
import type { VRenderPointerEvent } from './../interface';
import type { IEditorElement, ILayoutLine, IUpdateAttributeParam } from './../../core/interface';
/* eslint-disable no-console */
import { LayoutEditorElement } from './editor-elements/layout-editor';
import { ChartLayout } from './layout/chart-layout';
import type { IBoundsLike } from '@visactor/vutils';
import { VChart } from '@visactor/vchart';
import type { ISpec, IVChart } from '@visactor/vchart';
import type { IRect, IPoint } from '../../typings/space';
import { BaseElement } from '../base-element';
import type { IChartLayout } from './layout/interface';
import { SpecProcess } from './spec-process/spec-process';
import type { ISpecProcess } from './spec-process/interface';
import { MarkerTypeEnum, type IChartElementOption, type IChartModel } from './interface';
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
    this._specProcess = new SpecProcess(this, this.onSpecReady);
    this._specProcess.emitter.on('beforeTempChange', this.clearDataForChartTypeChange);
    this._layout = new ChartLayout(this, this._specProcess);
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
    this._commonModelElement.emitter.on('chartDataTempChange', this._onChartTempDataChange);
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
    console.log(this._mode === 'editor');
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

  onSpecReady = () => {
    console.log('onSpecReady !');
    this._updateNextTick();
  };

  protected _updateVChartSpec() {
    if (!this._vchart) {
      console.log('onSpecReady init chart');
      this._initVChart(this._specProcess.getVChartSpec());
      // eslint-disable-next-line promise/catch-or-return
      this._vchart.renderSync();
      this._afterRender();
    } else {
      this._isRendered = false;
      // HACK: 屏蔽报错临时修改
      // eslint-disable-next-line promise/catch-or-return
      //@ts-ignore
      this._vchart.updateSpecSync(this._transformVchartSpec(this._specProcess.getVChartSpec()), false, false);
      console.log('onSpecReady update spec', this._vchart);
      this._afterRender();
    }
  }

  protected _afterRender() {
    this._layoutEditor?.checkCurrentEditorElementBounds();
    super._afterRender();
  }

  protected _currentVChartFlow: any = null;
  // async _updateNextTick() {
  //   if (!this._currentVChartFlow) {
  //     this._currentVChartFlow = Promise.resolve().then(() => {
  //       this._updateVChartSpec();
  //       this._currentVChartFlow = null;
  //     });
  //   }
  //   await this._currentVChartFlow;
  //   return this;
  // }
  _updateNextTick() {
    this._updateVChartSpec();
    return this;
  }

  release() {
    super.release();
    this.releaseEditors();

    this._specProcess.clear();
    this._layout.clear();
    this._event.release();
    this._vchart?.release();

    this._specProcess = this._layout = this._vchart = null;
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

  private _onChartTempDataChange = (el: IEditorElement, attr: IUpdateAttributeParam) => {
    this._specProcess.dataTempTransform.updateChartDataTemp(attr.data, attr.chartType);
  };

  clearDataForChartTypeChange = (attr?: IUpdateAttributeParam) => {
    console.log('clear chart data!');
    this._opt.controller.currentEditorElement?.editorFinish();
    this._specProcess.clearMarker();
    if (attr?.clearCurrent) {
      this._specProcess.clearEditorSpec();
      this._layout.clearLayoutData();
    }
  };

  private _onAddMarkLine = (el: IEditorElement, attr: IUpdateAttributeParam) => {
    if (attr.markLine.enable) {
      const defaultMarkLineSpec = getDefaultMarkerConfigByType(this.vchart, attr.markLine.type);

      if (attr.markLine.type === MarkerTypeEnum.totalDiffLine) {
        // 如果是总计差异标注，则需要进行如下场景的调整：
        // 1. 是否与 label 冲撞
        // 2. 是否相同数据点存在不同方向的总计差异标注，存在则调整
        this._growthMarkLineEditor?.autoAdjustTotalDiffLines(defaultMarkLineSpec);
      }

      attr.markLine.spec = defaultMarkLineSpec;
    }
  };
  private _onAddMarkArea = (el: IEditorElement, attr: IUpdateAttributeParam) => {
    if (attr.markArea.enable) {
      const defaultMarkAreaSpec = getDefaultMarkerConfigByType(this.vchart, attr.markArea.type);

      attr.markArea.spec = defaultMarkAreaSpec;
    }
  };

  moveBy(offsetX: number, offsetY: number) {
    // clear editor box
    this._specProcess.saveSnapshot();
    this._layoutEditor.clearLayoutEditorBox();
    // move by
    this._layout?.getLayoutData()?.data?.forEach(_d => {
      _d.layout.x.offset += offsetX;
      _d.layout.y.offset += offsetY;
    });
    this._vchart.getChart().setLayoutTag(true);
    this._specProcess.pushHistory();
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
    this.clearModelEditorElement();
    this.clearMarkerEditorElement();
  }

  clearModelEditorElement() {
    this._event.emitter.emit('unPickModel', null);
  }

  clearMarkerEditorElement() {
    this._avgMarkLineEditor?.clearEditComponent();
    this._markAreaEditor?.clearEditComponent();
    this._growthMarkLineEditor?.clearEditComponent();
    this._hirarchicalDiffMarkLineEditor?.clearEditComponent();
  }

  tryPick(e: VRenderPointerEvent) {
    this._event.tryPick(e);
  }

  updateAttributeFromHistory(att: any) {
    this._specProcess.updateAttributeFromHistory(att);
  }
  saveSnapshot() {
    this._specProcess.saveSnapshot();
  }

  pushHistory() {
    this._specProcess.pushHistory();
  }
}
