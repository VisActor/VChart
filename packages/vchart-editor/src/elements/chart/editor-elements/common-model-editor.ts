import type { LayoutMeta } from '../layout/interface';
import type { IChartModel } from '../interface';
import { createRect, type IGraphic } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../core/interface';
import { BaseEditorElement, CommonChartEditorElement } from './base-editor-element';
import { IgnoreModelTypeInCommon } from '../utils/layout';
import { EventEmitter } from '@visactor/vutils';

export class CommonModelElement extends BaseEditorElement {
  emitter: EventEmitter = new EventEmitter();

  initWithVChart(): void {
    this._chart.event.emitter.on('overModel', this._overModel);
    this._chart.event.emitter.on('unOverChart', this._unOverModel);
    this._chart.event.emitter.on('pickModel', this._pickModel);
  }

  private _overModel = (info: { model: IChartModel; layoutMeta: LayoutMeta }, e: PointerEvent) => {
    const el = this._getElementWithModel(info, e);
    this.showOverGraphic(el, el?.id + `${this._layer.id}`, e);
  };

  private _unOverModel = (e: PointerEvent) => {
    this.showOverGraphic(null, null, e);
  };

  private _pickModel = (info: { model: IChartModel; layoutMeta: LayoutMeta }, e: PointerEvent) => {
    const el = this._getElementWithModel(info, e);
    if (el) {
      this.startEditor(el, e);
    }
  };

  protected _getOverGraphic(el: IEditorElement): IGraphic {
    return createRect({
      ...el.rect,
      fill: false,
      stroke: 'blue',
      lineWidth: 2,
      // shadowBlur: 4,
      // shadowColor: 'blue',
      pickable: false
    });
  }

  protected _getElementWithModel(info: { model: IChartModel; layoutMeta: LayoutMeta }, eventParams: PointerEvent) {
    const { model } = info;
    if (IgnoreModelTypeInCommon[model.type]) {
      return null;
    }
    const element = new CommonChartEditorElement(this, {
      model,
      updateCall: attr => {
        if (attr.chartType) {
          this.emitter.emit('chartTypeChange', element, attr);
        }
        if (attr.data) {
          this.emitter.emit('chartDataChange', this, attr);
        }

        if (attr.markLine) {
          this.emitter.emit('addMarkLine', this, attr);
        }

        if (attr.markArea) {
          this.emitter.emit('addMarkArea', this, attr);
        }

        const reRender = this.chart.specProcess.updateElementAttribute(element.model, attr);
        const releaseLast = reRender;
        if (releaseLast) {
          this.releaseLast();
        }
        if (reRender) {
          this.chart.reRenderWithUpdateSpec();
        }

        return false;
      }
    });
    return element;
  }

  releaseLast() {
    super.releaseLast();
  }

  release(): void {
    this._chart.event.emitter.off('overModel', this._overModel);
    this._chart.event.emitter.off('unOverChart', this._unOverModel);
    this._chart.event.emitter.off('pickModel', this._pickModel);
    this.emitter.removeAllListeners();
    this.emitter = null;
    super.release();
  }
}
