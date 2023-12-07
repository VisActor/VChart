import type { IChartModel } from './../../interface';
import type { IGraphic, IGroup, INode } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../../core/interface';
import { BaseEditorElement, CommonChartEditorElement } from '../base-editor-element';
import type { EventParams, ICartesianSeries, IComponent } from '@visactor/vchart';
import { MarkerTypeEnum } from '../../interface';
import { array, get } from '@visactor/vutils';

export abstract class BaseMarkerEditor<T extends IComponent, D> extends BaseEditorElement {
  readonly type: string = 'marker';

  protected _model: T; // vchart 组件模型实例
  protected _element: D; // 组件模型实例对应的 vrender 组件
  protected _modelId: string | number; // // vchart 组件模型实例 id

  protected _editComponent: IGroup; // 标注编辑元素

  protected abstract _getEnableMarkerTypes(): string[];
  protected abstract _createEditorGraphic(el: IEditorElement, e: PointerEvent): IGraphic;
  protected abstract _handlePointerDown(e: EventParams): void;
  protected abstract _setCursor(e: EventParams): void;
  protected _handlePointerUp(e: EventParams): void {
    this.endEditor();
  }

  initWithVChart(): void {
    const vchart = this._chart.vchart;
    vchart.on('pointermove', { level: 'model', type: this.type }, this._onHover);
    vchart.on('pointerdown', { level: 'model', type: this.type }, this._onDown);
    vchart.on('pointerup', { level: 'model', type: this.type }, this._onUp);
    vchart.on('pointerleave', { level: 'model', type: this.type }, this._onLeave);
  }

  private _checkEventEnable(e: EventParams) {
    if (!this._chart.pickable) {
      return false;
    }
    const markerComponent = (<T>e.model).getVRenderComponents()[0];
    return this._getEnableMarkerTypes().includes(markerComponent?.name);
  }

  protected _onHover = (e: EventParams) => {
    if (!this._checkEventEnable(e) || (this._editComponent && this._editComponent.attribute.visible)) {
      return;
    }

    const el = this._getEditorElement(e);
    this.showOverGraphic(el, el?.id + `${this._layer.id}`, e.event as PointerEvent);
    // this._modelId = el.model.userId;
    this._setCursor(e);
  };

  protected _onDown = (e: EventParams) => {
    if (!this._checkEventEnable(e)) {
      return;
    }
    this._element = (<T>e.model).getVRenderComponents()[0] as unknown as D;
    this._model = e.model as T;
    this._modelId = e.model.userId;

    this._handlePointerDown(e);
  };

  protected _onUp = (e: EventParams) => {
    if (!this._checkEventEnable(e)) {
      return;
    }
    this._element = (<T>e.model).getVRenderComponents()[0] as unknown as D;
    this._model = e.model as T;
    this._modelId = e.model.userId;

    this._handlePointerUp(e);
  };

  protected _onLeave = (e: EventParams) => {
    if (!this._checkEventEnable(e)) {
      return;
    }
    // 恢复 cursor
    this._chart.option.editorEvent.setCursorSyncToTriggerLayer();
  };

  protected _getEditorElement(eventParams: EventParams): IEditorElement {
    const model = eventParams.model as any;
    const marker = model.getVRenderComponents()[0] as unknown as D;
    const markerBounds = (marker as unknown as IGroup).AABBBounds;
    const element: IEditorElement = new CommonChartEditorElement(this, {
      model: model as unknown as IChartModel,
      id: this._chart.vchart.id + '-' + this.type + '-' + model.id,
      rect: {
        x: markerBounds.x1,
        y: markerBounds.y1,
        width: markerBounds.width(),
        height: markerBounds.height()
      },
      updateCall: attr => {
        this._controller.removeOverGraphic();

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

  protected _getSeries() {
    // TODO: 后续要根据 spec 关联的 series 信息来获取
    return this._chart.vchart.getChart().getAllSeries()[0] as ICartesianSeries;
  }

  startEditor(el: IEditorElement, e?: PointerEvent): boolean {
    if (!super.startEditor(el, e)) {
      return false;
    }
    this._startEditor();
    this._createEditorGraphic(el, e);
    return true;
  }

  protected endEditor() {
    this._controller.editorEnd();
  }

  protected _silentAllMarkers() {
    const vchart = this._chart.vchart;
    const root = vchart.getStage().getElementsByName('root')[0];
    const marks: string[] = [
      MarkerTypeEnum.growthLine,
      MarkerTypeEnum.hierarchyDiffLine,
      MarkerTypeEnum.verticalLine,
      MarkerTypeEnum.horizontalLine,
      MarkerTypeEnum.totalDiffLine,
      MarkerTypeEnum.verticalArea,
      MarkerTypeEnum.horizontalArea
    ];
    root.getChildren().forEach((child: INode) => {
      if (marks.includes(child.name)) {
        (child as IGroup).setAttributes({
          pickable: false,
          childrenPickable: false
        });
      }
    });
  }

  protected _activeAllMarkers() {
    const vchart = this._chart.vchart;
    const root = vchart.getStage().getElementsByName('root')[0];
    const marks: string[] = [
      MarkerTypeEnum.growthLine,
      MarkerTypeEnum.hierarchyDiffLine,
      MarkerTypeEnum.verticalLine,
      MarkerTypeEnum.horizontalLine,
      MarkerTypeEnum.totalDiffLine,
      MarkerTypeEnum.verticalArea,
      MarkerTypeEnum.horizontalArea
    ];
    root.getChildren().forEach((child: INode) => {
      if (marks.includes(child.name)) {
        (child as IGroup).setAttributes({
          pickable: true,
          childrenPickable: true
        });
      }
    });
  }

  protected _updateAndSave(spec: any, type: 'markLine' | 'markArea') {
    // 更新
    this._chart.specProcess.updateElementAttribute(this._currentEl.model, {
      [type]: {
        spec
      }
    });
    this._chart.reRenderWithUpdateSpec();

    // 更新更新后的标注的 bounds
    const currentMark = this._chart.vchart.getStage().getElementById(spec.id) as IGraphic;
    const markerBounds = currentMark.AABBBounds;
    this._currentEl.updateRect({
      x: markerBounds.x1,
      y: markerBounds.y1,
      width: markerBounds.width(),
      height: markerBounds.height()
    });

    this._controller.editorEnd();
  }

  protected _startEditor() {
    // 开始编辑
    this._controller.editorRun('mark');
  }

  releaseLast() {
    super.releaseLast();
    this.clearEditComponent();
  }

  clearEditComponent() {
    if (this._editComponent) {
      this._layer.editorGroup.removeChild(this._editComponent as unknown as IGraphic);
      this._editComponent = null;
    }
  }

  release(): void {
    const vchart = this._chart.vchart;

    vchart.off('pointermove', this._onHover);
    vchart.off('pointerdown', this._onDown);
    super.release();
  }
}