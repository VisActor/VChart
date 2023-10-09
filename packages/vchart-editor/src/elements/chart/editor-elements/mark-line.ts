/**
 * @description 均值线
 * TODO: 保存位置 & 更新 spec
 */
import { createRect, IGroup, type IGraphic, createGroup, vglobal, INode } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../core/interface';
import { BaseEditorElement } from './base-editor-element';
import { IBoundsLike, merge } from '@visactor/vutils';
import { MarkLine as MarkLineComponent, Segment } from '@visactor/vrender-components';
import { EventParams, MarkLine } from '@visactor/vchart';
import { IComponent } from '@visactor/vchart/esm/component/interface';
import { Point } from '@visactor/vrender-components/es/core/type';

export class MarkLineEditor extends BaseEditorElement {
  private _model: MarkLine;
  private _element: MarkLineComponent;
  private _orient: string;

  private _editComponent: IGroup;
  private _selected: boolean = false;
  private _prePos!: number;
  private _preOffset: number = 0;

  initWithVChart(): void {
    const vchart = this._chart.vchart;
    vchart.on('pointermove', { level: 'model', type: 'markLine', consume: true }, this._onHover);
    vchart.on('pointerdown', { level: 'model', type: 'markLine', consume: true }, this._onDragStart);
  }

  private _onHover = (e: any) => {
    const el = this._getEditorElement(e);
    this.showOverGraphic(el, el?.id + `${this._layer.id}`, e);
  };

  private _onDragStart = (e: any) => {
    this._element = e.model.getVRenderComponents()[0];
    this._model = e.model;
    // TODO: hack
    this._orient = this._model.getSpec().x ? 'vertical' : 'horizontal';
    this._selected = true;

    const el = this._getEditorElement(e);
    if (e) {
      this.startEditor(el, e);
    }

    this._prePos = this._orient === 'horizontal' ? e.event.clientY : e.event.clientX;
    this._editComponent.setAttributes({
      cursor: this._orient === 'horizontal' ? 'ns-resize' : 'ew-resize'
    });
    this._preOffset = this._editComponent.attribute[this._orient === 'horizontal' ? 'dy' : 'dx'] ?? 0;
    vglobal.addEventListener('pointermove', this._onDrag);
    vglobal.addEventListener('pointerup', this._onDragEnd);
  };

  private _onDrag = (e: any) => {
    e.stopPropagation();
    this._dragging = true;

    this._editComponent.showAll();
    let currentPos;
    let delta = 0;
    let updateField;
    if (this._orient === 'horizontal') {
      currentPos = e.clientY;
      delta = currentPos - this._prePos;
      updateField = 'dy';
    } else {
      currentPos = e.clientX;
      delta = currentPos - this._prePos;
      updateField = 'dx';
    }
    this._editComponent.setAttribute(updateField, this._preOffset + delta);
  };

  private _onDragEnd = (e: any) => {
    e.preventDefault();
    this._dragging = false;
    this._editComponent.hideAll();

    const offset = (this._editComponent.attribute[this._orient === 'horizontal' ? 'dy' : 'dx'] ?? 0) - this._preOffset;
    const points = this._element.attribute.points;
    const newPoints = points.map(point => {
      const field = this._orient === 'horizontal' ? 'y' : 'x';
      const newPoint = { ...point };
      newPoint[field] = point[field] + offset;
      return newPoint;
    });

    // 计算新的 label 值
    let newText;
    if (this._orient === 'horizontal') {
      const series = this._model.getRelativeSeries();
      const convertPosition = newPoints[0].y - series.getLayoutStartPoint().y;
      newText = parseInt(series.positionToDataY(convertPosition), 10);
    } else {
      const series = this._model.getRelativeSeries();
      const convertPosition = newPoints[0].x - series.getLayoutStartPoint().x;
      newText = series.positionToDataX(convertPosition);
    }

    // TODO: 计算新的 label 值，同时释放事件
    this._element.setAttributes({
      points: newPoints as Point[],
      label: {
        text: newText
      }
    });
    vglobal.removeEventListener('pointermove', this._onDrag);
    vglobal.removeEventListener('pointerup', this._onDragEnd);
  };

  protected _getOverGraphic(el: IEditorElement): IGraphic {
    const model = el.model;
    const markLine = (model as IComponent).getVRenderComponents()[0];
    const lineShape = (markLine as unknown as MarkLineComponent).getLine();
    const overlayLine = new Segment(
      merge({}, lineShape.attribute, {
        lineStyle: {
          stroke: '#3073F2'
        },
        startSymbol: {
          style: {
            fill: '#3073F2'
          }
        },
        endSymbol: {
          style: {
            fill: '#3073F2'
          }
        },
        pickable: false,
        childrenPickable: false
      })
    );
    overlayLine.name = 'overlay-mark-line-line';

    return overlayLine as unknown as IGraphic;
  }

  protected _getEditorElement(eventParams: EventParams): IEditorElement {
    const model = eventParams.model;
    const element: IEditorElement = {
      type: 'chart',
      layer: this._layer,
      id: this._chart.vchart.id + '-markLine-' + model.id + (this._selected ? '-selected' : ''),
      // rect: transformModelRect(model, LayoutRectToRect(layoutMeta.layout)),
      part: model.type,
      editProperties: {
        // move: true,
        // rotate: false,
        // resize: true
      },
      editorFinish: () => {
        if (this._currentEl === element) {
          this._releaseLast();
        }
      },
      updateAttribute: attr => {
        return false;
      },
      model
    };
    return element;
  }

  protected startEditor(el: IEditorElement, e?: PointerEvent): boolean {
    if (!super.startEditor(el, e)) {
      return false;
    }
    this._createEditorGraphic(el, e);
    return true;
  }

  protected _createEditorGraphic(el: IEditorElement, e: any): IGraphic {
    if (this._editComponent) {
      return this._editComponent;
    }
    const model = el.model;
    const markLine = (model as IComponent).getVRenderComponents()[0];
    const lineShape = (markLine as unknown as MarkLineComponent).getLine();
    const labelShape = (markLine as unknown as MarkLineComponent).getLabel();

    const overlayGraphic = createGroup({
      pickable: false,
      childrenPickable: false
    });

    const overlayLine = new Segment(
      merge({}, lineShape.attribute, {
        lineStyle: {
          stroke: '#3073F2'
        },
        startSymbol: {
          style: {
            fill: '#3073F2'
          }
        },
        endSymbol: {
          style: {
            fill: '#3073F2'
          }
        }
      })
    );
    overlayLine.name = 'overlay-mark-line-line';
    overlayGraphic.add(overlayLine as unknown as INode);

    const overlayLabel = createRect({
      x: labelShape.AABBBounds.x1 + (this._orient === 'horizontal' ? 2 : 0),
      y: labelShape.AABBBounds.y1 + (this._orient === 'horizontal' ? 0 : -2),
      width: labelShape.AABBBounds.width(),
      height: labelShape.AABBBounds.height(),
      fill: '#3073F2',
      fillOpacity: 0.3,
      visible: false
    });
    overlayLabel.name = 'overlay-mark-line-label';
    overlayGraphic.add(overlayLabel);

    this._layer.editorGroup.add(overlayGraphic as unknown as IGraphic);
    this._editComponent = overlayGraphic;

    return this._editComponent as unknown as IGraphic;
  }

  protected _releaseLast() {
    super._releaseLast();
    if (this._editComponent) {
      this._layer.editorGroup.removeChild(this._editComponent as unknown as IGraphic);
      this._editComponent = null;
    }
  }

  release(): void {
    const vchart = this._chart.vchart;

    vchart.off('pointermove', this._onHover);
    vchart.off('pointerdown', this._onDragStart);
    super.release();
  }
}
