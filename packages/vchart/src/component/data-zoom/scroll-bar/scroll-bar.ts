import { isBoolean, isEmpty, isFunction, isNil, isNumber, isValid } from '@visactor/vutils';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface/type';
import { DataFilterBaseComponent } from '../data-filter-base-component';
import type { ScrollBarAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { ScrollBar as ScrollBarComponent } from '@visactor/vrender-components';
import { transformToGraphic } from '../../../util/style';
import type { IRectGraphicAttribute, INode, IGroup, IGraphic } from '@visactor/vrender-core';
import { LayoutLevel, LayoutZIndex } from '../../../constant/layout';
import { ChartEvent } from '../../../constant/event';
import { SCROLL_BAR_DEFAULT_SIZE } from '../../../constant/scroll-bar';
import type { IScrollBarSpec } from './interface';
import { Factory } from '../../../core/factory';
import type { IZoomable } from '../../../interaction/zoom';
import type { ILayoutType } from '../../../typings/layout';
import { isClose } from '../../../util';

export class ScrollBar<T extends IScrollBarSpec = IScrollBarSpec> extends DataFilterBaseComponent<T> {
  static type = ComponentTypeEnum.scrollBar;
  type = ComponentTypeEnum.scrollBar;
  name: string = ComponentTypeEnum.scrollBar;

  static specKey = 'scrollBar';
  specKey = 'scrollBar';

  layoutZIndex: number = LayoutZIndex.DataZoom;
  layoutLevel: number = LayoutLevel.DataZoom;
  layoutType: ILayoutType = 'region-relative';

  // datazoom组件
  protected _component!: ScrollBarComponent;

  constructor(spec: T, options: IComponentOption) {
    super(spec as any, options);
    this._filterMode = spec.filterMode ?? 'axis';
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    // roam兼容逻辑
    if (isBoolean((this._spec as any).roam)) {
      this._zoomAttr.enable = false; // 对于之前的逻辑而言，只要配置了roam，zoom始终不打开
      this._dragAttr.enable = (this._spec as any).roam;
      this._scrollAttr.enable = (this._spec as any).roam;
    }
    if (this._zoomAttr.enable || this._dragAttr.enable || this._scrollAttr.enable) {
      (this as unknown as IZoomable).initZoomable(this.event, this._option.mode);
    }
  }

  /** LifeCycle API**/
  onLayoutEnd(ctx: any): void {
    this._updateScaleRange();
    this.effect.onZoomChange?.();
    super.onLayoutEnd(ctx);
  }

  protected _updateScaleRange() {
    if (this._component) {
      this._component.setAttributes({
        x: this.getLayoutStartPoint().x,
        y: this.getLayoutStartPoint().y,
        width: this.getLayoutRect().width,
        height: this.getLayoutRect().height
      });
    }
  }

  protected _computeWidth(): number {
    if (isNumber(this._spec.width)) {
      return this._spec.width;
    }

    if (this._isHorizontal) {
      return this.getLayoutRect().width;
    }
    // default value
    return SCROLL_BAR_DEFAULT_SIZE;
  }

  protected _computeHeight(): number {
    if (isNumber(this._spec.height)) {
      return this._spec.height;
    }

    // default value
    if (!this._isHorizontal) {
      return this.getLayoutRect().height;
    }

    return SCROLL_BAR_DEFAULT_SIZE;
  }

  private _getAttrs() {
    return {
      zIndex: this.layoutZIndex,
      x: this.getLayoutStartPoint().x,
      y: this.getLayoutStartPoint().y,
      width: this.getLayoutRect().width,
      height: this.getLayoutRect().height,
      range: [this._start, this._end],
      direction: this._isHorizontal ? 'horizontal' : 'vertical',
      delayType: this._spec?.delayType,
      delayTime: isValid(this._spec?.delayType) ? this._spec?.delayTime ?? 30 : 0,
      realTime: this._spec?.realTime ?? true,
      ...this._getComponentAttrs()
    } as ScrollBarAttributes;
  }

  protected _createOrUpdateComponent() {
    const attrs = this._getAttrs();
    if (this._component) {
      this._component.setAttributes(attrs);
    } else {
      const container = this.getContainer();
      this._component = new ScrollBarComponent(attrs);
      // 绑定事件，防抖，防止频繁触发
      this._component.addEventListener('scrollDrag', (e: any) => {
        const value = e.detail.value;
        this._handleChange(value[0], value[1]);
      });
      container.add(this._component as unknown as INode);
    }
  }

  protected _handleChange(start: number, end: number, updateComponent?: boolean) {
    super._handleChange(start, end, updateComponent);
    // filter out scroll event with same scroll value
    const isSameScrollValue = isClose(this._start, start) && isClose(this._end, end);
    if (this._shouldChange && !isSameScrollValue) {
      if (updateComponent && this._component) {
        this._component.setAttribute('range', [start, end]);
      }

      this._start = start;
      this._end = end;
      const startValue = this.statePointToData(start);
      const endValue = this.statePointToData(end);
      const hasChange = isFunction(this._spec.updateDataAfterChange)
        ? this._spec.updateDataAfterChange(start, end, startValue, endValue)
        : this._handleStateChange(this.statePointToData(start), this.statePointToData(end));
      if (hasChange) {
        this.event.emit(ChartEvent.scrollBarChange, {
          model: this,
          value: {
            filterData: this._filterMode !== 'axis',
            start: this._start,
            end: this._end,
            startValue: this._startValue,
            endValue: this._endValue,
            newDomain: this._newDomain
          }
        });
      }
    }
  }

  protected _handleDataCollectionChange() {
    if (this._spec.auto) {
      const data = this._data.getDataView();
      data.reRunAllTransform();
    }
  }

  protected _initCommonEvent() {
    super._initCommonEvent();
    if (this._component) {
      this._component.on('scrollDrag', (e: any) => {
        const value = e.detail.value;
        this._handleChange(value[0], value[1]);
      });
    }
  }

  protected _getComponentAttrs() {
    const { rail, slider, innerPadding } = this._spec;
    const attrs: Partial<ScrollBarAttributes> = {};

    if (!isNil(innerPadding)) {
      attrs.padding = innerPadding;
    }

    if (!isEmpty(rail?.style)) {
      attrs.railStyle = transformToGraphic(rail.style) as unknown as IRectGraphicAttribute;
    }
    if (!isEmpty(slider?.style)) {
      attrs.sliderStyle = transformToGraphic(slider.style) as unknown as IRectGraphicAttribute;
    }
    attrs.disableTriggerEvent = this._option.disableTriggerEvent;
    return attrs;
  }

  protected _getNeedClearVRenderComponents(): IGraphic[] {
    return [this._component] as unknown as IGroup[];
  }
}

export const registerScrollBar = () => {
  Factory.registerComponent(ScrollBar.type, ScrollBar);
};
