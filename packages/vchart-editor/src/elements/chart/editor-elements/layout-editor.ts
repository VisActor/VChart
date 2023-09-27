import { createRect, type IGraphic } from '@visactor/vrender';
import type { IEditorElement } from '../../../core/interface';
import { BaseEditorElement } from './base-editor-element';
import { getAxisLayoutInRegionRect, transformModelRect } from '../utils/layout';
import { LayoutRectToRect } from '../../../utils/space';
import type { ILayoutAttribute } from '../../../typings/space';
import type { ILayoutItem } from '../interface';
import { MinSize } from '../../../core/const';
import { LayoutEditorComponent } from '../../../component/layout-component';

export class LayoutEditorElement extends BaseEditorElement {
  protected _layoutComponent: LayoutEditorComponent;

  initWithVChart(): void {
    this._chart.vchart.on('pointermove', (e: any) => {
      const el = this._getEditorElement(e.event);
      if (el) {
        this._controller.setOverGraphic(this._getOverGraphic(el), el.id + `${this._layer.id}`, e);
      }
    });
    this._chart.vchart.on('pointerdown', (e: any) => {
      const el = this._getEditorElement(e.event);
      if (!el) {
        return;
      }
      if (el.id === this._currentEl?.id) {
        return;
      }
      this._releaseLast();
      this._currentEl = el;
      this._createEditorGraphic(el, e);
      this._controller.setEditorElements(el, e);
    });
  }
  protected _createEditorGraphic(el: IEditorElement, e: any): IGraphic {
    this._layoutComponent = new LayoutEditorComponent(el, {
      container: this._controller.container,
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
    this._overGraphic = createRect({
      ...el.rect,
      fill: false,
      stroke: 'blue',
      lineWidth: 2,
      // shadowBlur: 4,
      // shadowColor: 'blue',
      pickable: false
    });
    return this._overGraphic;
  }
  protected _getEditorElement(e: PointerEvent): IEditorElement {
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
      editProperties: {
        move: true,
        rotate: false,
        resize: false
      },
      editorFinish: () => {
        if (this._currentEl === element) {
          this._releaseLast();
        }
      },
      updateAttribute: attr => {
        if (attr.layout) {
          const layoutData = attr.layout as Partial<ILayoutAttribute>;
          chart.layout.setModelLayoutData({
            id: layoutMeta.id,
            layout: {
              x: { offset: layoutData.x as number },
              y: { offset: layoutData.y as number },
              width: { offset: layoutData.width as number },
              height: { offset: layoutData.height as number }
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
    this._layoutComponent?.release();
    this._layoutComponent = null;
    this._currentEl = null;
  }
}
