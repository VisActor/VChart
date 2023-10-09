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
import type { IChartElementOption } from './interface';
import { MarkLineEditor } from './editor-elements/mark-line';
import { MarkAreaEditor } from './editor-elements/mark-area';

export class EditorChart extends BaseElement {
  type = 'chart';
  protected _data: IData;
  protected _specProcess: ISpecProcess;
  protected _layout: IChartLayout;
  get layout() {
    return this._layout;
  }

  protected declare _opt: IChartElementOption;
  protected _container: HTMLElement;

  protected _layoutEditor: LayoutEditorElement;
  protected _markLineEditor: MarkLineEditor;
  protected _markAreaEditor: MarkAreaEditor;

  protected _vchart: IVChart;
  get vchart() {
    return this._vchart;
  }

  constructor(opt: IChartElementOption) {
    super(opt);

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
    this._markLineEditor = new MarkLineEditor(this._opt.controller, this, this._opt.layer);
    this._markAreaEditor = new MarkAreaEditor(this._opt.controller, this, this._opt.layer);
  }

  bindEditors() {
    // editors maybe null
    this._layoutEditor?.initWithVChart();
    this._markLineEditor?.initWithVChart();
    this._markAreaEditor?.initWithVChart();
  }

  releaseEditors() {
    this._layoutEditor?.release();
    this._markLineEditor?.release();
    this._markAreaEditor?.release();
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
    spec.width = this._rect.width;
    spec.height = this._rect.height;
    spec.background = 'transparent';

    this._vchart = new VChart(spec, {
      renderCanvas: this._opt.layer.getCanvas(),
      stage: this._opt.layer.getStage(),
      animation: false
    });
    this._layout.setVChart(this._vchart);

    // editor init with vchart
    if (this._mode === 'editor') {
      this.bindEditors();
    }
  }

  setTemp(key: string) {
    this._specProcess.updateTemp(key);
  }

  setDataSource(type: string, value: any) {
    this._data.changeDataSource(type, value);
  }

  onSpecReady = () => {
    if (!this._vchart) {
      this._initVChart(this._specProcess.getVChartSpec());
      this._vchart.renderAsync();
    } else {
      this._vchart.updateSpec(this._specProcess.getVChartSpec());
    }
  };

  release() {
    this.releaseEditors();

    this._vchart.release();
    this._data.clear();
    this._specProcess.clear();
    this._layout.clear();

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
  getLayoutGuideLine(): ILayoutGuideLine[] {
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
}
