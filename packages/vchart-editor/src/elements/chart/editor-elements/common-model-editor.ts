import type { LayoutMeta } from '../layout/interface';
import type { IChartModel } from '../interface';
import { createRect, type IGraphic } from '@visactor/vrender';
import type { IEditorElement } from '../../../core/interface';
import { BaseEditorElement, CommonChartEditorElement } from './base-editor-element';
import { IgnoreModelTypeInCommon } from '../utils/layout';
import { EventEmitter, isValid } from '@visactor/vutils';

export class CommonModelElement extends BaseEditorElement {
  emitter: EventEmitter = new EventEmitter();

  initWithVChart(): void {
    this._chart.event.emitter.on('overModel', this._overModel);
    this._chart.event.emitter.on('unOverChart', this._unOverModel);
    this._chart.event.emitter.on('pickModel', this._pickModel);
  }

  private _overModel = (info: { model: IChartModel; layoutMeta: LayoutMeta }, e: PointerEvent) => {
    if (info.model) {
      if (this._controller.currentOverGraphicId === info.model.userId + `${this._layer.id}`) {
        return;
      }
    }
    const el = this.getElementWithModel(info);
    this.showOverGraphic(el, el?.id + `${this._layer.id}`, e);
  };

  private _unOverModel = (e: PointerEvent) => {
    this.showOverGraphic(null, null, e);
  };

  private _pickModel = (info: { model: IChartModel; layoutMeta: LayoutMeta }, e: PointerEvent) => {
    const el = this.getElementWithModel(info);
    if (el) {
      this.startEditor(el, e);
    }
  };

  protected _getOverGraphic(el: IEditorElement): IGraphic {
    return createRect({
      ...el.rect,
      fill: false,
      stroke: 'rgb(174 216 230 / 60%)',
      lineWidth: 2,
      // shadowBlur: 4,
      // shadowColor: 'blue',
      pickable: false
    });
  }

  getElementWithModel(info: { model: IChartModel; layoutMeta: LayoutMeta }) {
    const { model } = info;
    if (!model || IgnoreModelTypeInCommon[model.type]) {
      return null;
    }
    const element = new CommonChartEditorElement(this, {
      model,
      updateCall: (attr, option = { triggerHistory: true }) => {
        let reRender = false;
        if (option.triggerHistory !== false) {
          this.chart.specProcess.saveSnapshot();
        }
        if (attr.data || attr.chartType) {
          this.emitter.emit('chartDataTempChange', this, attr, option.actionType);
        }

        if (attr.markLine) {
          this.emitter.emit('addMarkLine', this, attr);
        }

        if (attr.markArea) {
          this.emitter.emit('addMarkArea', this, attr);
        }

        if (attr.zIndex) {
          if (model.type === 'region') {
            this.chart.option.layer.changeElementLayoutZIndex(this.chart.id as string, { action: attr.zIndex });
          } else {
            this.chart.changeModelLayoutZIndex(info.layoutMeta, null, { action: attr.zIndex });
          }
          reRender = true;
        }

        if (attr.layout) {
          const newLayout = { ...info.layoutMeta };
          isValid(attr.layout.dx) && (newLayout.layout.x.offset += attr.layout.dx);
          isValid(attr.layout.dy) && (newLayout.layout.y.offset += attr.layout.dy);
          this._chart.layout.setModelLayoutData(newLayout);
          reRender = true;
        }
        reRender = this.chart.specProcess.updateElementAttribute(element.model, attr, false) || reRender;

        const releaseLast = reRender;
        if (releaseLast) {
          this.releaseLast();
        }
        if (reRender) {
          this.chart.reRenderWithUpdateSpec();
        }
        if (option.triggerHistory !== false) {
          this.chart.specProcess.pushHistory();
        }
        this._controller.editorEnd();
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
