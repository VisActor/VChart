import type { IGroup } from '@visactor/vrender-core';
import { BasePlugin } from '../../base/base-plugin';
import type { IChartPluginService } from '../interface';
import { registerChartPlugin } from '../register';
import type { IScrollPlugin, IScrollPluginSpec } from './interface';
import { ScrollBar as ScrollBarComponent } from '@visactor/vrender-components';

const scrollBarSize = 10;

/**
 * ScrollPlugin 类
 * @since 1.0.0
 */
export class ScrollPlugin extends BasePlugin implements IScrollPlugin {
  static readonly pluginType: 'chart' = 'chart';
  static readonly type: string = 'chartScroll';
  readonly type: string = 'chartScroll';

  private _service: IChartPluginService;

  private _spec: IScrollPluginSpec;

  private _scrollLimit = {
    x: {
      min: 0,
      max: 0,
      percent: 0
    },
    y: {
      min: 0,
      max: 0,
      percent: 0
    }
  };

  private _xScrollComponent: ScrollBarComponent;
  private _yScrollComponent: ScrollBarComponent;

  constructor() {
    super(ScrollPlugin.type);
  }

  /**
   * 初始化插件
   * @param service
   * @param chartSpec
   */
  onInit(service: IChartPluginService, chartSpec: any) {
    this._spec = chartSpec[ScrollPlugin.type] ?? {};
    this._service = service;
    this._bindEvent(service);
  }

  onLayoutRectUpdate(service: IChartPluginService) {
    const viewBoxSize = service.globalInstance.getChart().getViewRect();
    const canvasSize = service.globalInstance.getChart().getCanvasRect();
    this._scrollLimit.x.min = Math.min(canvasSize.width - viewBoxSize.width, 0);
    this._scrollLimit.x.percent = Math.abs(canvasSize.width / viewBoxSize.width);
    this._scrollLimit.y.min = Math.min(canvasSize.height - viewBoxSize.height, 0);
    this._scrollLimit.y.percent = Math.abs(canvasSize.height / viewBoxSize.height);
  }

  onAfterRender() {
    const rootMark = this.getRootMark();
    if (rootMark) {
      if (!this._xScrollComponent) {
        this._updateScrollX(rootMark, 0);
      }
      if (!this._yScrollComponent) {
        this._updateScrollY(rootMark, 0);
      }
    }
  }

  /**
   * 释放插件资源
   */
  release() {
    this._service.globalInstance.getStage()?.off('wheel', this.onWheel);
  }

  protected _bindEvent(service: IChartPluginService) {
    service.globalInstance.getStage()?.on('wheel', this.onWheel);
  }

  protected getRootMark() {
    return this._service.globalInstance.getStage()?.find(node => node.name === 'root', true) as IGroup;
  }

  protected onWheel = (e: WheelEvent) => {
    const scrollX = e.deltaX;
    const scrollY = e.deltaY;
    const rootMark = this.getRootMark();
    if (!rootMark) {
      return;
    }
    this._updateScrollX(rootMark, rootMark.attribute.x - scrollX);
    this._updateScrollY(rootMark, rootMark.attribute.y - scrollY);
  };

  private _updateScrollY(rootMark: IGroup, y: number) {
    if (this._spec.y?.enable === false) {
      return;
    }
    const finalY = Math.max(this._scrollLimit.y.min, Math.min(y, this._scrollLimit.y.max));
    const percent = Math.abs(finalY / this._scrollLimit.y.min);
    const yScrollComponent = this._getYScrollComponent();
    yScrollComponent.setAttribute('range', [percent, percent + this._scrollLimit.y.percent]);
    rootMark.setAttributes({
      y: finalY
    });
  }

  private _getYScrollComponent() {
    if (!this._yScrollComponent) {
      const canvasSize = this._service.globalInstance.getChart().getCanvasRect();
      const viewSize = this._service.globalInstance.getChart().getViewRect();
      const { enable, ...rest } = this._spec?.y ?? ({} as IScrollPluginSpec['y']);
      this._yScrollComponent = new ScrollBarComponent({
        ...rest,
        zIndex: 9999,
        x: canvasSize.width - scrollBarSize,
        y: 0,
        width: scrollBarSize,
        height: canvasSize.height,
        range: [0, canvasSize.height / viewSize.height],
        direction: 'vertical',
        delayTime: rest?.delayTime ?? 30,
        realTime: rest?.realTime ?? true,
        sliderStyle: { fill: 'rgba(0,0,0,0.3)' }
      });
      this.getRootMark().parent?.addChild(this._yScrollComponent);
    }
    return this._yScrollComponent;
  }

  private _updateScrollX(rootMark: IGroup, x: number) {
    if (this._spec.x?.enable === false) {
      return;
    }
    const finalX = Math.max(this._scrollLimit.x.min, Math.min(x, this._scrollLimit.x.max));
    const percent = Math.abs(finalX / this._scrollLimit.x.min);
    const xScrollComponent = this._getXScrollComponent();
    xScrollComponent.setAttribute('range', [percent, percent + this._scrollLimit.x.percent]);

    rootMark.setAttributes({
      x: finalX
    });
  }

  private _getXScrollComponent() {
    if (!this._xScrollComponent) {
      const canvasSize = this._service.globalInstance.getChart().getCanvasRect();
      const viewSize = this._service.globalInstance.getChart().getViewRect();
      const { enable, ...rest } = this._spec?.x ?? ({} as IScrollPluginSpec['x']);
      this._xScrollComponent = new ScrollBarComponent({
        ...rest,
        zIndex: 9999,
        x: 0,
        y: canvasSize.height - scrollBarSize,
        width: canvasSize.width,
        height: scrollBarSize,
        range: [0, canvasSize.width / viewSize.width],
        direction: 'horizontal',
        delayTime: rest?.delayTime ?? 30,
        realTime: rest?.realTime ?? true
      });
      this.getRootMark().parent?.addChild(this._xScrollComponent);
    }
    return this._xScrollComponent;
  }
}

/**
 * 注册 ScrollPlugin
 * @since 1.0.0
 */
export const registerScrollPlugin = () => {
  registerChartPlugin(ScrollPlugin);
};
