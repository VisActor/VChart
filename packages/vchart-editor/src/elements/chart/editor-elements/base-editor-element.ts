/* eslint-disable no-console */
import type { IChartModel } from './../interface';
import type { IEditorController, IEditorElement, IEditorLayer, IUpdateAttributeParam } from './../../../core/interface';
import type { EditorChart } from '../chart';
import type { IGraphic } from '@visactor/vrender-core';
import type { EventParams } from '@visactor/vchart';
import type { IRect } from '../../../typings/space';
import { LayoutRectToRect } from '../../../utils/space';
import { merge } from '@visactor/vutils';
import { transformModelRect } from '../utils/layout';

export abstract class BaseEditorElement {
  protected _chart: EditorChart;
  get chart() {
    return this._chart;
  }
  protected _controller: IEditorController;
  protected _layer: IEditorLayer;
  get layer() {
    return this._layer;
  }

  protected _overGraphic: IGraphic;
  protected _currentEl: IEditorElement;
  get currentEditorElement() {
    return this._currentEl;
  }

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
    this.releaseLast();
    this._currentEl = el;
    this._controller.setEditorElements(el, e);
    return true;
  }
  releaseLast() {
    this._currentEl = null;
    this._overGraphic = null;
  }

  release() {
    this.releaseLast();
    this._controller = this._chart = this._layer = null;
  }

  abstract initWithVChart(): void;
  protected abstract _getOverGraphic(el: IEditorElement, e?: PointerEvent): IGraphic;
  protected abstract _getEditorElement(e?: EventParams): IEditorElement;

  updateCommonAttribute(el: IEditorElement, attr: IUpdateAttributeParam, reRender: boolean = false) {
    if (this._chart.specProcess.updateElementAttribute(el, attr) || reRender) {
      this._chart.reRenderWithUpdateSpec();
      this.releaseLast();
    }
    this._controller.editorEnd();
  }
}

export type UpdateAttributeCall = (attr: IUpdateAttributeParam) => false | { [key: string]: unknown };

export class CommonChartEditorElement implements IEditorElement {
  type: 'chart';
  layer: IEditorLayer;
  id: string | number;
  rect?: IRect;
  part?: string;
  model: IChartModel;
  editProperties?: {
    move?: boolean;
    rotate?: boolean;
    resize?: boolean | ([boolean, ...boolean[]] & { length: 8 });
  } & { [key: string]: unknown };
  originSpec?: any;

  protected _updateCall: UpdateAttributeCall;
  protected _finishCall: () => void;

  protected _context: BaseEditorElement;

  constructor(
    context: BaseEditorElement,
    opt: {
      model: IChartModel;
      updateCall?: UpdateAttributeCall;
      finishCall?: () => void;
      id?: string;
      editProperties?: { [key: string]: unknown };
    }
  ) {
    // set attribute
    this._context = context;
    const { model, updateCall, finishCall, id, editProperties } = opt;
    this._updateCall = updateCall;
    this._finishCall = finishCall;
    this.model = model;
    const modelInfo = { id: model.userId, specKey: model.specKey, specIndex: model.getSpecIndex() };
    this.layer = this._context.layer;
    this.id = id ?? model.userId;
    const layoutMeta = this._context.chart.layout.getModelLayoutData(modelInfo);
    this.rect = layoutMeta ? transformModelRect(model, LayoutRectToRect(layoutMeta.layout)) : null;
    this.part = model.type;
    this.editProperties = merge(
      {
        move: true,
        rotate: false,
        resize: true
      },
      editProperties || {}
    );

    this.originSpec = model.getSpec();
  }

  updateAttribute(attr: IUpdateAttributeParam): false | { [key: string]: unknown } {
    console.log(this);
    const result = this._updateCall?.(attr) ?? false;
    const reRender = this._context.chart.specProcess.updateElementAttribute(this.model, attr);
    if (reRender) {
      this._context.chart.reRenderWithUpdateSpec();
      this._context.releaseLast();
    }
    return result;
  }

  editorFinish() {
    if (this._context.currentEditorElement === this) {
      this._context.releaseLast();
    }
  }
}
