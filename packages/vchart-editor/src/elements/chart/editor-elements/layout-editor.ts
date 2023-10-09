import { createRect, type IGraphic } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../core/interface';
import { BaseEditorElement } from './base-editor-element';
import { getAxisLayoutInRegionRect, transformModelRect } from '../utils/layout';
import { LayoutRectToRect } from '../../../utils/space';
import type { ILayoutAttribute } from '../../../typings/space';
import type { ILayoutItem } from '../interface';
import { MinSize } from '../../../core/const';
import { LayoutEditorComponent } from '../../../component/layout-component';
import { EventParams } from '@visactor/vchart';

export class LayoutEditorElement extends BaseEditorElement {
  protected _layoutComponent: LayoutEditorComponent;

  initWithVChart(): void {
    this._chart.vchart.on('pointermove', this._overEvent);
    this._chart.vchart.on('pointerdown', this._downEvent);
  }

  private _overEvent = e => {
    const el = this._getEditorElement(e);
    this.showOverGraphic(el, el?.id + `${this._layer.id}`, e);
  };

  private _downEvent = e => {
    if (!this._checkEventEnable(e)) {
      this._releaseLast();
      return;
    }
    const el = this._getEditorElement(e);
    if (e) {
      this.startEditor(el, e);
    }
  };

  private _checkEventEnable(e: any) {
    if (!e.mark) {
      return true;
    }
    if (e.mark.type === 'rect' && e.mark.name === 'regionBackground') {
      return true;
    }

    return false;
  }

  protected startEditor(el: IEditorElement, e?: PointerEvent): boolean {
    if (!super.startEditor(el, e)) {
      return false;
    }
    this._createEditorGraphic(el, e);
    return true;
  }

  protected _createEditorGraphic(el: IEditorElement, e: any): IGraphic {
    this._layoutComponent = new LayoutEditorComponent(el, {
      container: this._controller.container,
      stage: this._layer.getStage(),
      startHandler: () => {
        // do nothing
      },
      updateHandler: data => {
        // TODO: 吸附
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
        this._currentEl.updateAttribute({ layout: data });
        this._controller.editorEnd();
      },
      event: e.event
    });

    this._layer.editorGroup.add(this._layoutComponent.editorBox as unknown as IGraphic);
    return this._layoutComponent.editorBox as unknown as IGraphic;
  }

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
  protected _getEditorElement(eventParams: EventParams): IEditorElement {
    const e = eventParams.event;
    // @ts-ignore
    const point = { x: e.x, y: e.y };
    const chart = this._chart;
    const layoutMeta = chart.layout.getOverModel(point);
    if (!layoutMeta) {
      return null;
    }
    const regions = chart.vchart.getChart().getAllRegions() as any[];
    const items = regions.concat(chart.vchart.getChart().getAllComponents() as any[]);
    const model = items.find((item: any) => item.userId === layoutMeta.id);

    if (model.type.includes('Axis')) {
      return null;
    }
    const element: IEditorElement = {
      type: 'chart',
      layer: this._layer,
      id: layoutMeta.id,
      rect: transformModelRect(model, LayoutRectToRect(layoutMeta.layout)),
      part: model.type,
      model,
      editProperties: {
        move: true,
        rotate: false,
        resize: true
      },
      editorFinish: () => {
        if (this._currentEl === element) {
          this._releaseLast();
        }
      },
      updateAttribute: attr => {
        if (attr.layout) {
          const layoutData = attr.layout as Partial<ILayoutAttribute>;
          const rect = model.computeBoundsInRect(layoutData);
          chart.layout.setModelLayoutData({
            id: layoutMeta.id,
            layout: {
              x: { offset: layoutData.x as number },
              y: { offset: layoutData.y as number },
              width: { offset: rect.width as number },
              height: { offset: rect.height as number }
            }
          });
          if (model.type === 'region' && model.coordinate === 'cartesian') {
            const axes = items.filter(
              (_i: ILayoutItem) =>
                _i.layoutBindRegionID && _i.layoutBindRegionID[0] === model.id && _i.type.includes('Axis')
            );
            axes.forEach((_a: ILayoutItem) => {
              chart.layout.setModelLayoutData({
                id: _a.userId,
                layout: getAxisLayoutInRegionRect(_a, { ..._a.getLayoutRect(), ...layoutData })
              });
            });
          }
          if (rect.width !== layoutData.width || rect.height !== layoutData.height) {
            this._layoutComponent.updateBounds({
              x1: layoutData.x,
              x2: layoutData.x + rect.width,
              y1: layoutData.y,
              y2: layoutData.y + rect.height
            });
          }
          chart.vchart.getChart().setLayoutTag(true);
        }
        if (attr.ani) {
        }
        return false;
      }
    };
    return element;
  }

  protected _releaseLast() {
    super._releaseLast();
    this._layoutComponent?.release();
    this._layoutComponent = null;
  }

  release(): void {
    this._chart.vchart.off('pointermove', this._overEvent);
    this._chart.vchart.off('pointerdown', this._downEvent);
    super.release();
  }
}
