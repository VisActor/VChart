import type { IGraphic } from '@visactor/vrender-core';
/* eslint-disable promise/no-nesting */
import type { VRenderPointerEvent } from './../interface';
import type {
  IEditorElement,
  IElementPathEnd,
  IElementPathRoot,
  ILayoutLine,
  IUpdateAttributeParam
} from './../../core/interface';
/* eslint-disable no-console */
import { LayoutEditorElement } from './editor-elements/layout-editor';
import { ChartLayout } from './layout/chart-layout';
import { array, get, isArray, type IBoundsLike } from '@visactor/vutils';
import { VChart } from '@visactor/vchart';
import type { ISpec, IVChart, IMarkAreaSpec, IMarkLineSpec } from '@visactor/vchart';
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
import { LayoutRectToRect, getLayoutLine, transformPointWithMatrix } from '../../utils/space';
import { addRectToPathElement, getEndPathWithNode, getPosInClient } from '../../utils/element';

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
    this._specProcess.emitter.on('beforeTempChange', (willPushHistory: boolean) => {
      willPushHistory && this.clearDataForChartTypeChange();
    });
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

  // 用于处理默认模板 spec 有变化，已保存的图表的 spec 更改
  protected _compactSpec(spec: ISpec) {
    // 图例默认关闭交互
    if (isArray(spec.legends)) {
      spec.legends = spec.legends.map(legend => {
        return {
          ...legend,
          interactive: false
        };
      });
    } else {
      spec.legends = {
        ...spec.legends,
        interactive: false
      };
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
      const chartSpec = this._specProcess.getVChartSpec();
      console.log('onSpecReady init chart', chartSpec);
      this._initVChart(chartSpec);
      // eslint-disable-next-line promise/catch-or-return
      this._vchart.renderSync();
      this._afterRender();
    } else {
      const chartUpdateSpec = this._transformVchartSpec(this._specProcess.getVChartSpec());
      console.log('_updateVChartSpec', chartUpdateSpec);
      this._isRendered = false;
      // HACK: 屏蔽报错临时修改
      // eslint-disable-next-line promise/catch-or-return
      //@ts-ignore
      this._vchart.updateSpecSync(chartUpdateSpec, false, false);
      this._layout.resetAxisLayoutAfterTempChange();
      this._afterRender();
    }
  }

  protected _afterRender() {
    this._layoutEditor?.checkCurrentEditorElementBounds();

    const spec = this._specProcess.getVChartSpec();
    // 如果是总计差异标注，则需要进行如下场景的调整：
    // 1. 是否与 label 冲撞
    // 2. 是否相同数据点存在不同方向的总计差异标注，存在则调整
    const totalDiffs = array(get(spec, 'markLine', [])).filter(s => s.name === MarkerTypeEnum.totalDiffLine);
    if (totalDiffs && totalDiffs.length) {
      this._growthMarkLineEditor?.autoAdjustTotalDiffLines();
      // @ts-ignore
      this._vchart.updateSpecSync(spec, false, false);
    }
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
    this._opt.controller.currentEditorElement?.editorFinish();
    this._specProcess.clearMarker();
    if (attr?.clearCurrent) {
      this._specProcess.clearEditorSpec();
      this._layout.clearLayoutData();
    }
  };

  private _onAddMarkLine = (el: IEditorElement, attr: IUpdateAttributeParam) => {
    if (attr.markLine.enable) {
      const defaultMarkLineSpec = getDefaultMarkerConfigByType(this.vchart, attr.markLine.type) as IMarkLineSpec;
      defaultMarkLineSpec.zIndex = 510;
      attr.markLine.spec = defaultMarkLineSpec;
    }
  };
  private _onAddMarkArea = (el: IEditorElement, attr: IUpdateAttributeParam) => {
    if (attr.markArea.enable) {
      const defaultMarkAreaSpec = getDefaultMarkerConfigByType(this.vchart, attr.markArea.type) as IMarkAreaSpec;
      defaultMarkAreaSpec.zIndex = 500;

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

  updateAttributeFromHistory(att: any, fromAttribute: any) {
    this._specProcess.updateAttributeFromHistory(att, fromAttribute);
  }
  saveSnapshot() {
    this._specProcess.saveSnapshot();
  }

  pushHistory() {
    this._specProcess.pushHistory();
  }

  getTargetWithPos(pos: IPoint): IElementPathRoot {
    const modelInfo = this.layout.getOverModel(pos, this._opt.layer);
    if (!modelInfo) {
      return this._pickElement(pos);
    }
    if (modelInfo.specKey === 'region') {
    }
    const model = getChartModelWithModelInfo(this._vchart, modelInfo);
    if (!model) {
      return null;
    }
    if (model.type !== 'region') {
      const boundsComponent = (<any>model).getVRenderComponents()?.[0];
      if (!boundsComponent) {
        return null;
      }
      const endPath = getEndPathWithNode(pos, boundsComponent);
      return {
        elementId: this.id,
        opt: {
          type: 'layoutModel',
          id: modelInfo.id,
          specKey: modelInfo.specKey,
          specIndex: modelInfo.specIndex
        },
        index: 0,
        child: endPath,
        rect: addRectToPathElement(boundsComponent)
      };
    }

    return this._pickElement(pos);
  }

  private _pickElement(pos: IPoint): IElementPathRoot {
    const el = this._opt.layer.getStage().pick(pos.x, pos.y);
    if (!el || !el.graphic) {
      return null;
    }
    const result = this._checkPickMarker(el.graphic, pos);
    if (result) {
      return result;
    }
    return this._checkPickDatumMark(el.graphic, pos);
  }

  private _checkPickMarker(el: IGraphic, pos: IPoint): IElementPathRoot {
    if (!this._specProcess.getEditorSpec().marker) {
      return null;
    }
    let idEl = el;
    while (idEl && !(idEl.id && idEl.type === 'group')) {
      idEl = idEl.parent;
    }
    if (!idEl) {
      return null;
    }
    let marker = this._specProcess.getEditorSpec().marker.markLine?.find(s => s.id === idEl.id) as any;
    if (!marker) {
      marker = this._specProcess.getEditorSpec().marker.markArea?.find(s => s.id === idEl.id) as any;
    }
    if (!marker) {
      return null;
    }
    const endPath = getEndPathWithNode(pos, idEl);
    return {
      elementId: this.id,
      opt: {
        type: 'marker',
        id: idEl.id
      },
      index: 0,
      child: endPath,
      rect: addRectToPathElement(idEl)
    };
  }

  private _checkPickDatumMark(el: IGraphic, pos: IPoint): IElementPathRoot {
    const elMarkId = el.parent._uid;
    if (!elMarkId) {
      return null;
    }
    const series = this._vchart.getChart().getAllSeries();
    for (let i = 0; i < series.length; i++) {
      const s = series[i];
      for (let j = 0; j < s.getMarks().length; j++) {
        const mark = s.getMarks()[j];
        const product = mark.getProduct();
        if (product?.graphicItem?._uid === elMarkId) {
          let index = 0;
          // eslint-disable-next-line no-loop-func
          el.parent.forEachChildren((n, i) => {
            if (n === el) {
              index = i;
              return true;
            }
            return false;
          });
          return {
            elementId: this.id,
            opt: {
              type: 'series',
              seriesType: s.type,
              seriesIndex: s.getSpecIndex(),
              markType: mark.type,
              markIndex: j
            },
            index,
            child: getEndPathWithNode(pos, el),
            rect: addRectToPathElement(el)
          };
        }
      }
    }
    return null;
  }

  getPosWithPath(path: IElementPathRoot): IPoint {
    if (path.opt.type === 'layoutModel' || path.opt.type === 'marker') {
      const model = getChartModelWithModelInfo(this._vchart, path.opt);
      if (!model) {
        return null;
      }
      if (model.type !== 'region') {
        const boundsComponent = (<any>model).getVRenderComponents()?.[0];
        if (!boundsComponent) {
          return null;
        }
        const end = path.child;
        return getPosInClient(end as IElementPathEnd, boundsComponent);
      }
      return null;
    } else if (path.opt.type === 'series') {
      const series = this._vchart.getChart().getAllSeries();
      let _s = series.find((s: any) => s.type === path.opt.seriesType && s.getSpecIndex() === path.opt.seriesIndex);
      if (!_s) {
        _s = series.find((s: any) => s.type === path.opt.seriesType);
      }
      if (!_s) {
        return null;
      }
      const marks = _s.getMarks();
      let _m = marks.find((m: any, j: number) => m.type === path.opt.markType && j === path.opt.markIndex);
      if (!_m) {
        _m = marks.find((m: any) => m.type === path.opt.markType);
      }
      if (!_m) {
        return null;
      }
      const el = _m.getProduct()?.graphicItem?.getChildAt?.(path.index) as IGraphic;
      if (!el) {
        return null;
      }

      const end = path.child;
      return getPosInClient(end as IElementPathEnd, el);
    } else if (path.opt.type === 'region') {
      const region = this._vchart.getChart().getAllRegions()[0];
      const node = region.getGroupMark().getProduct().elements[0].graphicItem;
      const end = path.child;
      return getPosInClient(end as IElementPathEnd, node);
    }
    return null;
  }

  getTargetWithPosBackup(pos: IPoint): IElementPathRoot {
    const region = this._vchart.getChart().getAllRegions()[0];
    const node = region.getGroupMark().getProduct().elements[0].graphicItem;
    const endPath = getEndPathWithNode(pos, node);
    return {
      elementId: this.id,
      opt: {
        type: 'region',
        index: 0
      },
      index: 0,
      isBackup: true,
      child: endPath,
      rect: addRectToPathElement(node)
    };
  }
}
