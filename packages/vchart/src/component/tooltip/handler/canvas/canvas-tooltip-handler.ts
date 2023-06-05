import type { Stage } from '@visactor/vrender';
import type { IToolTipActual } from '../../../../typings/tooltip';
import type { ITooltipSpec, TooltipHandlerParams } from '../../interface';
import { BaseTooltipHandler } from '../base';
import type { Maybe, RenderMode } from '../../../../typings';
import { Tooltip } from '@visactor/vrender-components';
import type { Compiler } from '../../../../compile/compiler';
import { isValid } from '@visactor/vutils';

/**
 * The tooltip handler class.
 */
export class CanvasTooltipHandler extends BaseTooltipHandler {
  private _layer: any;
  protected _el?: HTMLCanvasElement;
  protected _tooltipCanvasId?: string;
  protected _tooltipComponent: Tooltip;

  constructor(
    tooltipSpec: ITooltipSpec,
    tooltipId: string,
    envMode: RenderMode,
    chartContainer: Maybe<HTMLElement>,
    compiler: Compiler,
    options?: any
  ) {
    super(tooltipSpec, tooltipId, envMode, chartContainer, compiler, options);
    this._tooltipCanvasId = options?.modeParams?.tooltipCanvasId;
  }

  private _initTooltipComponent(stage: Stage) {
    const layer = this._getLayer(stage);
    this._tooltipComponent = new Tooltip({
      autoCalculatePosition: false,
      autoMeasure: false
    });
    layer.add(this._tooltipComponent);
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
      this._layer.removeAllChild(false);
      // this._layer.render();
    }
    this._attributeCache = null;
  }

  protected _updateTooltip(visible: boolean, params: TooltipHandlerParams, actualTooltip: IToolTipActual) {
    this._visible = visible;

    const stage = this._compiler.getStage();
    if (!stage) {
      return;
    }

    if (!visible) {
      if (this._tooltipComponent && this._tooltipComponent.attribute.visible) {
        this._tooltipComponent.hideAll();
        stage.renderNextFrame();
      }
      return;
    }

    if (!this._tooltipComponent) {
      this._initTooltipComponent(stage);
    }

    const pos = actualTooltip?.position;
    if (!params.changePositionOnly) {
      this._tooltipComponent.setAttributes({
        visible: true,
        ...this._attributeCache,
        ...pos
      });
    } else if (isValid(pos)) {
      this._tooltipComponent.setAttributes(pos);
    }

    if (!this._tooltipComponent.attribute.visible) {
      this._tooltipComponent.showAll();
    }
  }

  release() {
    this._layer?.release();
  }
}
