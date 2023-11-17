import type { LayoutMeta } from './../layout/interface';
import type { ILayoutLine } from './../../../core/interface';
import { type IChartModel } from './../interface';
import { createRect, type IGraphic } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../core/interface';
import { BaseEditorElement, CommonChartEditorElement } from './base-editor-element';
import {
  getAxisLayoutInRegionRect,
  getModelGraphicsBounds,
  IgnoreModelTypeInLayout,
  transformModelRect,
  transformModelRectRevert
} from '../utils/layout';
import type { ILayoutAttribute, IRect, ISize } from '../../../typings/space';
import { MinSize, OverGraphicAttribute } from '../../../core/const';
import { LayoutEditorComponent } from '../../../component/layout-component';
import type { EventParams } from '@visactor/vchart';
import { isSameModelInfo } from '../../../utils/spec';
import type { VRenderPointerEvent } from '../../interface';
import type { VChart } from '@visactor/vchart';
import { refreshModelInVChart } from '../utils/common';

const CartesianAxisResize = {
  left: [false, false, false, true, false, false, false, false],
  right: [false, false, false, false, true, false, false, false],
  top: [false, true, false, false, false, false, false, false],
  bottom: [false, false, false, false, false, false, true, false]
};

export class LayoutEditorElement extends BaseEditorElement {
  protected _layoutComponent: LayoutEditorComponent;

  initWithVChart(): void {
    this._chart.event.emitter.on('pickModel', this._pickModel);
    this._chart.event.emitter.on('unPickModel', this._unPickModel);
  }

  private _pickModel = (info: { model: IChartModel; layoutMeta: LayoutMeta }, e: EventParams) => {
    const el = this._getElementWithModel(info, e);
    if (el && el.id !== this._currentEl?.id) {
      this._currentEl = el;
      this.clearLayoutEditorBox();
      this._createEditorGraphic(el, info, e);
    }
  };
  private _unPickModel = (e: PointerEvent) => {
    if (e && this._touchEditorBox(e as VRenderPointerEvent)) {
      return;
    }
    this._currentEl = null;
    this.clearLayoutEditorBox();
    this._layer.getStage().renderNextFrame();
  };
  private _touchEditorBox(e: VRenderPointerEvent) {
    if (!this._layoutComponent) {
      return false;
    }
    let node = e.target;
    while (node && node !== this.layer.getStage().defaultLayer) {
      if (node === (this._layoutComponent.editorBox as any)) {
        return true;
      }
      node = node.parent;
    }
    return false;
  }

  clearLayoutEditorBox() {
    this._layoutComponent?.release();
    this._layoutComponent = null;
  }

  protected _createEditorGraphic(
    el: IEditorElement,
    info: { model: IChartModel; layoutMeta: LayoutMeta },
    e: any
  ): IGraphic {
    const allLayers = this._chart.option.getAllLayers();
    const layoutLines = allLayers.reduce((pre, l) => {
      const tempLine = l.getLayoutLineInLayer();
      if (l === this._layer) {
        tempLine.forEach(line => {
          // @ts-ignore
          if (isSameModelInfo(line, el)) {
            return;
          }
          if (el.model?.type === 'region' && line.specKey.includes('axes')) {
            return;
          }
          pre.push(line);
        });
      } else {
        pre.push(...tempLine);
      }
      return pre;
    }, []) as ILayoutLine[];
    this._layoutComponent = new LayoutEditorComponent(el, {
      container: this._controller.container,
      layoutLines,
      editorEvent: this._chart.option.editorEvent,
      editorGroup: this._layer.editorGroup,
      stage: this._layer.getStage(),
      startHandler: () => {
        this._controller.editorRun('layout');
        // 暂时只清除 marker 。自身不清除，其他编辑模块监听stage，可以自己清除
        this._chart.clearMarkerEditorElement();
        // disable over
        this._chart.option.getAllLayers().forEach(l => {
          l.elements.forEach(e => (e.overAble = false));
        });
        this._chart.option.controller.setOverGraphic(null, null, null);
      },
      updateHandler: data => {
        let hasChange = false;
        if (data.width < MinSize) {
          data.width = MinSize;
          hasChange = true;
        }
        if (data.height < MinSize) {
          data.height = MinSize;
          hasChange = true;
        }
        if (this._overGraphic) {
          this._overGraphic.setAttributes(data);
        }
        if (hasChange) {
          return data;
        }
        return false;
      },
      endHandler: data => {
        this._chart.specProcess.saveSnapshot();
        this._updateLayout(info, data);
        this._controller.setOverGraphic(null, null, null);
        this._controller.editorEnd();
        this._chart.specProcess.pushHistory();
        // enable over
        this._chart.option.getAllLayers().forEach(l => {
          l.elements.forEach(e => (e.overAble = true));
        });
      },
      event: e
    });

    return this._layoutComponent.editorBox as unknown as IGraphic;
  }

  private _updateLayout(info: { model: IChartModel; layoutMeta: LayoutMeta }, layoutData: ILayoutAttribute) {
    const { layoutMeta } = info;
    const model = refreshModelInVChart(info.model, this._chart.vchart as VChart);
    const chart = this._chart;
    // get new rect after layout
    const rect = this._getRectAfterLayout(model as IChartModel, layoutData);
    // update layoutData
    chart.layout.setModelLayoutData({
      id: layoutMeta.id,
      specKey: layoutMeta.specKey,
      specIndex: layoutMeta.specIndex,
      layout: {
        x: { offset: rect.x as number },
        y: { offset: rect.y as number },
        width: { offset: rect.width as number },
        height: { offset: rect.height as number }
      }
    });
    if (model.type === 'region' && (<any>model).coordinate === 'cartesian') {
      const regions = chart.vchart.getChart().getAllRegions() as any[];
      const items = regions.concat(chart.vchart.getChart().getAllComponents() as any[]);
      const axes = items.filter(
        (_i: IChartModel) => (<any>_i)._regions && (<any>_i)._regions[0] === model && _i.type.includes('Axis')
      );
      axes.forEach((_a: IChartModel) => {
        chart.layout.setModelLayoutData({
          id: _a.userId,
          specKey: _a.specKey,
          specIndex: _a.getSpecIndex(),
          layout: getAxisLayoutInRegionRect(_a.layout, { ..._a.getLayoutRect(), ...layoutData })
        });
      });
    }
    // 更新当前编辑元素的bounds
    this._updateLayoutComponent(model as IChartModel, rect, info, layoutData);
    chart.vchart.getChart().setLayoutTag(true);
  }

  private _getRectAfterLayout(model: IChartModel, layoutData: ILayoutAttribute) {
    let rect: IRect;
    if (model.layout) {
      if ((<IChartModel>model)._clearLayoutCache) {
        (<IChartModel>model)._clearLayoutCache();
      }
      // @ts-ignore
      rect = model.layout.computeBoundsInRect(layoutData);
    } else {
      const b = (<IChartModel>model).getBoundsInRect(layoutData, { width: 9999, height: 9999 });
      rect = { x: b.x1, y: b.x2, width: b.x2 - b.x1, height: b.y2 - b.y1 };
      const bounds = getModelGraphicsBounds(model as IChartModel);
      if (model.type !== 'region' && bounds) {
        rect.width = Math.max(rect.width, bounds.x2 - bounds.x1);
        rect.height = Math.max(rect.height, bounds.y2 - bounds.y1);
      }
    }
    rect.x = layoutData.x;
    rect.y = layoutData.y;
    transformModelRectRevert(<IChartModel>model, layoutData as IRect, rect);
    if (model.type.startsWith('cartesianAxis')) {
      if ((<IChartModel>model).layoutOrient === 'left' || (<IChartModel>model).layoutOrient === 'right') {
        rect.height = layoutData.height;
      } else {
        rect.width = layoutData.width;
      }
    }
    return rect;
  }

  private _updateLayoutComponent(
    model: IChartModel,
    rect: IRect,
    info: { model: IChartModel; layoutMeta: LayoutMeta },
    layoutData: ILayoutAttribute
  ) {
    if (rect.width !== layoutData.width || rect.height !== layoutData.height) {
      this._layoutComponent.updateBounds({
        x1: layoutData.x,
        x2: layoutData.x + rect.width,
        y1: layoutData.y,
        y2: layoutData.y + rect.height
      });
    }

    if (this.chart.option.controller.currentEditorElement?.model === model) {
      // updateElement rect
      this.chart.option.controller.currentEditorElement.rect = info.layoutMeta
        ? transformModelRect(model, { x: layoutData.x, y: layoutData.y, width: rect.width, height: rect.height })
        : null;
    }
  }

  protected _getOverGraphic(el: IEditorElement): IGraphic {
    return createRect({
      ...el.rect,
      ...OverGraphicAttribute
    });
  }

  protected _getElementWithModel(info: { model: IChartModel; layoutMeta: LayoutMeta }, eventParams: EventParams) {
    const { model } = info;
    if (IgnoreModelTypeInLayout[model.type]) {
      return null;
    }

    const editProperties: IEditorElement['editProperties'] = {
      move: true,
      rotate: false,
      resize: true
    };
    if (model.type.includes('Axis')) {
      editProperties.move = false;
      editProperties.resize = false;
    }
    const element = new CommonChartEditorElement(this, {
      model,
      editProperties: editProperties,
      finishCall: () => {
        this._currentEl = null;
      }
    });
    return element;
  }

  checkCurrentEditorElementBounds() {
    if (!this._layoutComponent?.editorBox) {
      return;
    }
    if (!this._chart.option.editorEvent.isCurrentLayoutEditorBox(this._layoutComponent.editorBox)) {
      return;
    }
    if (!this._currentEl?.model) {
      return;
    }
    if (this._currentEl.model.type === 'title' || this._currentEl.model.type === 'discreteLegend') {
      const model = refreshModelInVChart(this._currentEl.model, this._chart.vchart as VChart);
      const bounds = getModelGraphicsBounds(model as IChartModel);
      this._layoutComponent.updateBounds({
        ...bounds
      });
      // update layout data
      this._chart.layout.setModelLayoutData({
        id: model.userId,
        specKey: model.specKey,
        specIndex: model.getSpecIndex(),
        layout: {
          x: { offset: (<IChartModel>model).getLayoutStartPoint().x },
          y: { offset: (<IChartModel>model).getLayoutStartPoint().y },
          width: { offset: bounds.x2 - (<IChartModel>model).getLayoutStartPoint().x },
          height: { offset: bounds.y2 - (<IChartModel>model).getLayoutStartPoint().y }
        }
      });
      if (!(<IChartModel>model).getVisible()) {
        // 删除当前编辑框
        this.clearLayoutEditorBox();
      }
    } else if (this._currentEl.model.type.startsWith('cartesianAxis')) {
      const model = refreshModelInVChart(this._currentEl.model, this._chart.vchart as VChart) as any;
      const region = model._regions[0];
      const rect = getAxisLayoutInRegionRect(model, { ...region.getLayoutStartPoint(), ...region.getLayoutRect() });
      this._layoutComponent.updateBounds({
        x1: rect.x.offset,
        y1: rect.y.offset,
        x2: rect.x.offset + rect.width.offset,
        y2: rect.y.offset + rect.height.offset
      });
      // update layout data
      this._chart.layout.setModelLayoutData({
        id: model.userId,
        specKey: model.specKey,
        specIndex: model.getSpecIndex(),
        layout: rect
      });
      if (!model.getVisible()) {
        // 删除当前编辑框
        this.clearLayoutEditorBox();
      }
      this._chart.vchart.getChart().setLayoutTag(true);
      this._chart.vchart.renderSync();
    }
  }

  releaseLast() {
    super.releaseLast();
    this._layoutComponent?.release();
    this._layoutComponent = null;
  }

  release(): void {
    this._chart.event.emitter.off('pickModel', this._pickModel);
    this._chart.event.emitter.off('unPickModel', this._unPickModel);
    super.release();
  }
}
