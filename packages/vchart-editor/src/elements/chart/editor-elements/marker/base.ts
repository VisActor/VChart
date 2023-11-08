import type { IGraphic, IGroup } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../../core/interface';
import { BaseEditorElement, CommonChartEditorElement } from '../base-editor-element';
import type { EventParams } from '@visactor/vchart';
import type { IComponent } from '@visactor/vchart';
import { MarkerTypeEnum } from '../../interface';

export abstract class BaseMarkerEditor<T extends IComponent, D> extends BaseEditorElement {
  readonly type: string = 'marker';

  protected _model: T; // vchart 组件模型实例
  protected _element: D; // 组件模型实例对应的 vrender 组件
  protected _modelId: string | number; // // vchart 组件模型实例 id

  protected _editComponent: IGroup; // 标注编辑元素

  protected abstract _getEnableMarkerTypes(): string[];
  protected abstract _createEditorGraphic(el: IEditorElement, e: PointerEvent): IGraphic;
  protected abstract _handlePointerDown(e: EventParams): void;
  protected _handlePointerUp(e: EventParams): void {
    this.endEditor();
  }

  initWithVChart(): void {
    const vchart = this._chart.vchart;
    vchart.on('pointermove', { level: 'model', type: this.type, consume: true }, this._onHover);
    vchart.on('pointerdown', { level: 'model', type: this.type, consume: true }, this._onDown);
    vchart.on('pointerup', { level: 'model', type: this.type, consume: true }, this._onUp);
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
    this._element = (<T>e.model).getVRenderComponents()[0] as unknown as D;
    this._model = e.model as T;
    this._modelId = e.model.userId;

    const el = this._getEditorElement(e);
    this.showOverGraphic(el, el?.id + `${this._layer.id}`, e.event as PointerEvent);
    this._modelId = el.model.userId;
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

  protected _getEditorElement(eventParams: EventParams): IEditorElement {
    const model = eventParams.model;
    const markerBounds = (this._element as unknown as IGroup).AABBBounds;
    const element: IEditorElement = new CommonChartEditorElement(this, {
      model,
      id: this._chart.vchart.id + '-' + this.type + '-' + model.id,
      rect: {
        x: markerBounds.x1,
        y: markerBounds.y1,
        width: markerBounds.width(),
        height: markerBounds.height()
      },
      updateCall: attr => {
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
    root.getChildren().forEach(child => {
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
    root.getChildren().forEach(child => {
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
    // TODO: 需要在这里对当前的编辑元素更新位置属性。外部ui需要使用编辑元素上的最新位置弹出编辑浮窗
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
