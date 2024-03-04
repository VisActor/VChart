import type { ILayer, INode, Stage } from '@visactor/vrender-core';
import type { ITooltipActual } from '../../../../typings/tooltip';
import { BaseTooltipHandler } from '../base';
import { Tooltip as TooltipComponent } from '@visactor/vrender-components';
import { isValid } from '@visactor/vutils';
import { TooltipHandlerType } from '../constants';
import type { TooltipHandlerParams } from '../../../../component/tooltip';
import type { IComponentPluginService } from '../../interface';
import { registerComponentPlugin } from '../../register';

/**
 * The tooltip handler class.
 */
export class CanvasTooltipHandler extends BaseTooltipHandler {
  static readonly type = TooltipHandlerType.canvas;
  readonly type = TooltipHandlerType.canvas;

  private _layer: ILayer;
  protected _el?: HTMLCanvasElement;
  protected _tooltipCanvasId?: string;
  protected _tooltipComponent: TooltipComponent;

  constructor() {
    super(CanvasTooltipHandler.type);
  }

  onAdd(service: IComponentPluginService<any>): void {
    super.onAdd(service);
    this._tooltipCanvasId = (this._chartOption.modeParams as any)?.tooltipCanvasId;
  }

  private _initTooltipComponent(stage: Stage) {
    const layer = this._getLayer(stage);
    this._tooltipComponent = new TooltipComponent({
      autoCalculatePosition: false,
      autoMeasure: false
    });
    layer.add(this._tooltipComponent as unknown as INode);
  }

  private _getLayer(stage: Stage) {
    if (this._layer) {
      return this._layer;
    }

    this._layer = stage.createLayer(this._tooltipCanvasId);

    // 需要关闭 layer 对应的 canvas 的事件
    const layerCanvas = this._layer.layerHandler.canvas.nativeCanvas as HTMLCanvasElement;
    // TODO：待 vrender 支持
    if (layerCanvas && layerCanvas.style) {
      layerCanvas.style.touchAction = 'none';
      layerCanvas.style.pointerEvents = 'none';
    }

    return this._layer;
  }

  protected _removeTooltip() {
    if (this._layer) {
      this._layer.removeAllChild();
      // this._layer.render();
    }
    this._attributes = null;
  }

  protected _updateTooltip(visible: boolean, params: TooltipHandlerParams, actualTooltip: ITooltipActual) {
    this._visible = visible;

    const stage = this._compiler.getStage();
    if (!stage) {
      return;
    }

    if (!visible) {
      if (this._tooltipComponent && this._tooltipComponent.attribute.visible) {
        this._tooltipComponent.hideAll();
        this._tooltipComponent.setAttributes({
          visibleAll: false
        });
      }
      return;
    }

    if (!this._tooltipComponent) {
      this._initTooltipComponent(stage);
    }

    const pos = actualTooltip?.position;
    if (!params.changePositionOnly) {
      this._tooltipComponent.setAttributes({
        ...this._attributes,
        ...pos
      });
    } else if (isValid(pos)) {
      this._tooltipComponent.setAttributes(pos);
    }

    if (!this._tooltipComponent.attribute.visible) {
      this._tooltipComponent.showAll();
      this._tooltipComponent.setAttributes({
        visibleAll: true
      });
    }
  }

  isTooltipShown() {
    return this._tooltipComponent?.attribute.visibleAll;
  }

  release() {
    super.release();
    this._layer?.release();
  }
}

export const registerCanvasTooltipHandler = () => {
  registerComponentPlugin(CanvasTooltipHandler);
};
