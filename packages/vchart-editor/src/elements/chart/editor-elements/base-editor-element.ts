import type { IEditorController, IEditorElement, IEditorLayer, IUpdateAttributeParam } from './../../../core/interface';
import type { EditorChart } from '../chart';
import type { IGraphic } from '@visactor/vrender-core';
import type { EventParams } from '@visactor/vchart';

export abstract class BaseEditorElement {
  protected _chart: EditorChart;
  protected _controller: IEditorController;
  protected _layer: IEditorLayer;

  protected _overGraphic: IGraphic;
  protected _currentEl: IEditorElement;

  constructor(controller: IEditorController, chart: EditorChart, layer: IEditorLayer) {
    this._controller = controller;
    this._chart = chart;
    this._layer = layer;
  }

  protected showOverGraphic(el: IEditorElement, id: string, e?: PointerEvent) {
    if (!el) {
      return;
    }
    this._overGraphic = this._getOverGraphic(el);
    this._controller.setOverGraphic(this._overGraphic, id, e);
  }

  protected startEditor(el: IEditorElement, e?: PointerEvent): boolean {
    if (!el) {
      return false;
    }
    if (el.id === this._currentEl?.id) {
      return false;
    }
    this._releaseLast();
    this._currentEl = el;
    this._controller.setEditorElements(el, e);
    return true;
  }
  protected _releaseLast() {
    this._currentEl = null;
    this._overGraphic = null;
  }

  release() {
    this._releaseLast();
    this._controller = this._chart = this._layer = null;
  }

  abstract initWithVChart(): void;
  protected abstract _getOverGraphic(el: IEditorElement, e?: PointerEvent): IGraphic;
  protected abstract _getEditorElement(e?: EventParams): IEditorElement;

  updateCommonAttribute(el: IEditorElement, attr: IUpdateAttributeParam, reRender: boolean = false) {
    if (this._chart.specProcess.updateElementAttribute(el, attr) || reRender) {
      this._chart.reRenderWithUpdateSpec();
      this._releaseLast();
    }
    this._controller.editorEnd();
  }
}
