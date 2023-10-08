import type { IEditorController, IEditorElement, IEditorLayer } from './../../../core/interface';
import type { EditorChart } from '../chart';
import type { IGraphic } from '@visactor/vrender-core';

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

  abstract initWithVChart(): void;
  protected abstract _createEditorGraphic(el: IEditorElement, e?: PointerEvent): IGraphic;
  protected abstract _getOverGraphic(el: IEditorElement, e?: PointerEvent): IGraphic;
  protected abstract _getEditorElement(e?: PointerEvent): IEditorElement;
}
