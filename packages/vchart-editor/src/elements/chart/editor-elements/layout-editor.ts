import type { ILayoutLine } from './../../../core/interface';
import type { IChartModel } from './../interface';
import { createRect, type IGraphic } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../core/interface';
import { BaseEditorElement, CommonChartEditorElement } from './base-editor-element';
import { getAxisLayoutInRegionRect, transformModelRect, transformModelRectRevert } from '../utils/layout';
import type { ILayoutAttribute, IRect } from '../../../typings/space';
import { MinSize } from '../../../core/const';
import { LayoutEditorComponent } from '../../../component/layout-component';
import type { EventParams } from '@visactor/vchart';
import { isSameModelInfo } from '../../../utils/spec';

const CartesianAxisResize = {
  left: [false, false, false, true, false, false, false, false],
  right: [false, false, false, false, true, false, false, false],
  top: [false, true, false, false, false, false, false, false],
  bottom: [false, false, false, false, false, false, true, false]
};

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
      this.releaseLast();
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
    const allLayers = this._chart.option.getAllLayers();
    const layoutLines = allLayers.reduce((pre, l) => {
      const tempLine = l.getLayoutLineInLayer();
      if (l === this._layer) {
        tempLine.forEach(line => {
          // @ts-ignore
          if (isSameModelInfo(line, el)) {
            return;
          }
          if (this._currentEl?.model?.type === 'region' && line.specKey.includes('axes')) {
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
      editorGroup: this._layer.editorGroup,
      stage: this._layer.getStage(),
      startHandler: () => {
        // do nothing
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
        this._currentEl.updateAttribute({ layout: data });
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
    const layoutMeta = chart.layout.getOverModel(point, this._layer);
    if (!layoutMeta) {
      return null;
    }
    const regions = chart.vchart.getChart().getAllRegions() as any[];
    const items = regions.concat(chart.vchart.getChart().getAllComponents() as any[]);
    const model = items.find((item: any) => item.userId === layoutMeta.id);

    if (model.type.includes('tooltip')) {
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
      if (model.type.includes('cartesian')) {
        editProperties.resize = CartesianAxisResize[model.layoutOrient];
      }
    }
    const element = new CommonChartEditorElement(this, {
      model,
      updateCall: attr => {
        if (attr.layout) {
          const layoutData = attr.layout as Partial<ILayoutAttribute>;
          const rect = { ...model.computeBoundsInRect(layoutData) };
          const bounds = model.getGraphicBounds?.();
          if (bounds) {
            rect.width = Math.max(rect.width, bounds.x2 - bounds.x1);
            rect.height = Math.max(rect.height, bounds.y2 - bounds.y1);
          }
          rect.x = layoutData.x;
          rect.y = layoutData.y;
          transformModelRectRevert(model, layoutData as IRect, rect);
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
          if (model.type === 'region' && model.coordinate === 'cartesian') {
            const axes = items.filter(
              (_i: IChartModel) =>
                _i.layoutBindRegionID && _i.layoutBindRegionID[0] === model.id && _i.type.includes('Axis')
            );
            axes.forEach((_a: IChartModel) => {
              chart.layout.setModelLayoutData({
                id: _a.userId,
                specKey: _a.specKey,
                specIndex: _a.getSpecIndex(),
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
          // updateElement rect
          element.rect = layoutMeta
            ? transformModelRect(model, { x: layoutData.x, y: layoutData.y, width: rect.width, height: rect.height })
            : null;
          chart.vchart.getChart().setLayoutTag(true);
        }
        if (attr.markLine) {
          const spec: any = this._chart.specProcess.getVChartSpec();
          if (!spec.markLine) {
            spec.markLine = [];
          }
          const lastMarkLine = spec.markLine.find(markLine => markLine.y === 'average');
          if (attr.markLine.enable) {
            if (!lastMarkLine) {
              const defaultMarkLineSpec = {
                interactive: true,
                y: 'average',
                endSymbol: {
                  visible: true,
                  size: 12,
                  refX: 6,
                  symbolType: 'triangleLeft',
                  autoRotate: false
                },
                label: {
                  visible: true,
                  autoRotate: false,
                  formatMethod: markData => {
                    return parseInt(markData[0].y, 10);
                  },
                  position: 'end',
                  labelBackground: {
                    visible: false
                  },
                  style: {
                    fill: '#000'
                  },
                  refX: 12,
                  refY: 0
                },
                line: {
                  style: {
                    stroke: '#000'
                  }
                }
              };
              spec.markLine.push(defaultMarkLineSpec);
            }
          } else {
            if (lastMarkLine) {
              spec.markLine.splice(spec.markLine.indexOf(lastMarkLine), 1);
            }
          }
          this._chart.reRenderWithUpdateSpec();
        }
        return false;
      },
      editProperties: editProperties
    });
    return element;
  }

  releaseLast() {
    super.releaseLast();
    this._layoutComponent?.release();
    this._layoutComponent = null;
  }

  release(): void {
    this._chart.vchart.off('pointermove', this._overEvent);
    this._chart.vchart.off('pointerdown', this._downEvent);
    super.release();
  }
}
