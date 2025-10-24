import { isValidNumber, merge } from '@visactor/vutils';
import type { IGroup, IRectGraphicAttribute } from '@visactor/vrender-core';
import { BasePlugin } from '../../base/base-plugin';
import type { IChartPluginService } from '../interface';
import { registerChartPlugin } from '../register';
import type { IScrollPlugin, IScrollPluginSpec } from './interface';
import { ScrollBar as ScrollBarComponent } from '@visactor/vrender-components';
import { Event } from '../../../event/event';
import type { ExtendEventParam } from '../../../event/interface';

// 由vrender透出, 接入新版本后需修改
const SCROLLBAR_EVENT = 'scrollDrag';
const SCROLLBAR_END_EVENT = 'scrollUp';

const DefaultTheme: {
  size?: number;
  railStyle?: Omit<IRectGraphicAttribute, 'width' | 'height'>;
  sliderStyle?: Omit<IRectGraphicAttribute, 'width' | 'height'>;
} = {
  size: 10,
  railStyle: undefined,
  sliderStyle: undefined
};
/**
 * ScrollPlugin 类
 * @since 1.0.0
 */
export class ScrollPlugin extends BasePlugin implements IScrollPlugin {
  static readonly pluginType: 'chart' = 'chart';
  static readonly type: string = 'chartScroll';
  readonly type: string = 'chartScroll';
  readonly name: string = ScrollPlugin.type;

  private _service: IChartPluginService;

  private _spec: IScrollPluginSpec;
  private _lastScrollX = 0;
  get lastScrollX() {
    return this._lastScrollX;
  }
  private _lastScrollY = 0;
  get lastScrollY() {
    return this._lastScrollY;
  }

  private _scrollLimit = {
    x: {
      min: 0,
      max: 0,
      size: 0,
      percent: 0
    },
    y: {
      min: 0,
      max: 0,
      size: 0,
      percent: 0
    }
  };

  private _xScrollComponent: ScrollBarComponent;
  private _yScrollComponent: ScrollBarComponent;
  private _event: Event;

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
    this._scrollLimit.x.size = viewBoxSize.width;
    this._scrollLimit.y.min = Math.min(canvasSize.height - viewBoxSize.height, 0);
    this._scrollLimit.y.percent = Math.abs(canvasSize.height / viewBoxSize.height);
    this._scrollLimit.y.size = viewBoxSize.height;

    if (!this._event) {
      this._event = new Event(this._service.globalInstance.getChart().getOption().eventDispatcher, null);
    }

    // 重新设置滚动条位置
    if (this._xScrollComponent) {
      this._xScrollComponent.setAttributes({
        width: canvasSize.width,
        y: canvasSize.height - DefaultTheme.size
      });
      this._xScrollComponent.setAttributes({
        visible: this._scrollLimit.x.percent < 1
      });
    }
    if (this._yScrollComponent) {
      this._yScrollComponent.setAttributes({
        height: canvasSize.height,
        x: canvasSize.width - DefaultTheme.size
      });

      this._yScrollComponent.setAttributes({
        visible: this._scrollLimit.y.percent < 1
      });
    }
    // this.scrollTo({ x: 0, y: 0 });
  }

  onAfterRender() {
    // const rootMark = this.getRootMark();
    // if (rootMark) {
    //   if (!this._xScrollComponent) {
    //     this._updateScrollX(rootMark, 0, 0);
    //   }
    //   if (!this._yScrollComponent) {
    //     this._updateScrollY(rootMark, 0, 0);
    //   }
    // }
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
    if (this._spec.preventDefault !== false) {
      e.preventDefault();
      e.stopPropagation();
    }
    const scrollX = e.deltaX;
    const scrollY = e.deltaY;
    const rootMark = this.getRootMark();
    if (!rootMark) {
      return;
    }
    const { percent: yPercent, y } = this._computeFinalScrollY(rootMark.attribute.y - scrollY) ?? {};
    const { percent: xPercent, x } = this._computeFinalScrollX(rootMark.attribute.x - scrollX) ?? {};
    const eventResult: { x?: number; y?: number } = {};
    if (isValidNumber(x)) {
      this._updateScrollX(rootMark, x, xPercent);
      eventResult.x = x;
    }
    if (isValidNumber(y)) {
      this._updateScrollY(rootMark, y, yPercent);
      eventResult.y = y;
    }

    this._event.emit('chartScroll', eventResult as ExtendEventParam);
  };

  private _computeFinalScrollY(y: number) {
    if (this._lastScrollY === y) {
      return null;
    }
    this._lastScrollY = y;
    if (this._spec.y?.enable === false) {
      return null;
    }
    const finalY = Math.max(this._scrollLimit.y.min, Math.min(y, this._scrollLimit.y.max));
    const percent = Math.abs(finalY / this._scrollLimit.y.size);
    return {
      y: finalY,
      percent
    };
  }
  private _computeFinalScrollX(x: number) {
    if (this._lastScrollX === x) {
      return null;
    }
    this._lastScrollX = x;
    if (this._spec.x?.enable === false) {
      return null;
    }
    const finalX = Math.max(this._scrollLimit.x.min, Math.min(x, this._scrollLimit.x.max));
    const percent = Math.abs(finalX / this._scrollLimit.x.size);
    return {
      x: finalX,
      percent
    };
  }

  private _updateScrollY(rootMark: IGroup, y: number, percent: number) {
    const yScrollComponent = this._getYScrollComponent();
    yScrollComponent.setAttribute('range', [percent, percent + this._scrollLimit.y.percent]);
    rootMark.setAttributes({
      y: y
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
        x: canvasSize.width - DefaultTheme.size,
        y: 0,
        width: DefaultTheme.size,
        height: canvasSize.height,
        range: [0, canvasSize.height / viewSize.height],
        direction: 'vertical',
        delayTime: rest?.delayTime ?? 30,
        realTime: rest?.realTime ?? true,
        railStyle: DefaultTheme.railStyle,
        sliderStyle: DefaultTheme.sliderStyle,
        visible: canvasSize.height < viewSize.height
      });
      // 绑定事件，防抖，防止频繁触发
      this._yScrollComponent.addEventListener(SCROLLBAR_EVENT, (e: any) => {
        const value = e.detail.value;
        const { percent, y } = this._computeFinalScrollY(-value[0] * this._scrollLimit.y.size) ?? {};
        if (percent !== undefined && y !== undefined) {
          this._updateScrollY(this.getRootMark(), y, percent);
          this._event.emit('chartScroll', { y } as ExtendEventParam);
        }
      });
      this._yScrollComponent.addEventListener(SCROLLBAR_END_EVENT, (e: any) => {
        const value = e.detail.value;
        const { percent, y } = this._computeFinalScrollY(-value[0] * this._scrollLimit.y.size) ?? {};
        if (percent !== undefined && y !== undefined) {
          this._updateScrollY(this.getRootMark(), y, percent);
          this._event.emit('chartScroll', { y } as ExtendEventParam);
        }
      });
      this.getRootMark().parent?.addChild(this._yScrollComponent);
    }
    return this._yScrollComponent;
  }

  private _updateScrollX(rootMark: IGroup, x: number, percent: number) {
    const xScrollComponent = this._getXScrollComponent();
    xScrollComponent.setAttribute('range', [percent, percent + this._scrollLimit.x.percent]);
    rootMark.setAttributes({
      x: x
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
        y: canvasSize.height - DefaultTheme.size,
        width: canvasSize.width,
        height: DefaultTheme.size,
        range: [0, canvasSize.width / viewSize.width],
        direction: 'horizontal',
        delayTime: rest?.delayTime ?? 30,
        realTime: rest?.realTime ?? true,
        sliderStyle: DefaultTheme.sliderStyle,
        railStyle: DefaultTheme.railStyle,
        visible: canvasSize.width < viewSize.width
      });
      // 绑定事件，防抖，防止频繁触发
      this._xScrollComponent.addEventListener(SCROLLBAR_EVENT, (e: any) => {
        const value = e.detail.value;
        const { percent, x } = this._computeFinalScrollX(-value[0] * this._scrollLimit.x.size) ?? {};
        if (percent !== undefined && x !== undefined) {
          this._updateScrollX(this.getRootMark(), x, percent);
          this._event.emit('chartScroll', { x } as ExtendEventParam);
        }
      });
      this._xScrollComponent.addEventListener(SCROLLBAR_END_EVENT, (e: any) => {
        const value = e.detail.value;
        const { percent, x } = this._computeFinalScrollX(-value[0] * this._scrollLimit.x.size) ?? {};
        if (percent !== undefined && x !== undefined) {
          this._updateScrollX(this.getRootMark(), x, percent);
          this._event.emit('chartScroll', { x } as ExtendEventParam);
        }
      });
      this.getRootMark().parent?.addChild(this._xScrollComponent);
    }
    return this._xScrollComponent;
  }

  /**
   * api
   */
  scrollTo({ x, y }: { x?: number; y?: number }) {
    const rootMark = this.getRootMark();
    if (rootMark) {
      if (x !== undefined) {
        const { x: finalX, percent } = this._computeFinalScrollX(x) ?? {};
        if (finalX !== undefined && percent !== undefined) {
          this._updateScrollX(rootMark, finalX, percent);
        }
      }
      if (y !== undefined) {
        const { y: finalY, percent } = this._computeFinalScrollY(y) ?? {};
        if (finalY !== undefined && percent !== undefined) {
          this._updateScrollY(rootMark, finalY, percent);
        }
      }
    }
  }
}

/**
 * 注册 ScrollPlugin
 * @since 1.0.0
 */
export const registerScrollPlugin = (theme?: {
  size?: number;
  railStyle?: Omit<IRectGraphicAttribute, 'width' | 'height'>;
  sliderStyle?: Omit<IRectGraphicAttribute, 'width' | 'height'>;
}) => {
  DefaultTheme.size = theme?.size ?? DefaultTheme.size;
  DefaultTheme.railStyle = merge({}, DefaultTheme.railStyle ?? {}, theme?.railStyle ?? {});
  DefaultTheme.sliderStyle = merge({}, DefaultTheme.sliderStyle ?? {}, theme?.sliderStyle ?? {});
  registerChartPlugin(ScrollPlugin);
};
