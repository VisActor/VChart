import { isArray, isEmpty, isNil, isNumber } from '@visactor/vutils';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface';
import { DataFilterBaseComponent } from '../data-filter-base-component';
import type { ScrollBarAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { ScrollBar as ScrollBarComponent } from '@visactor/vrender-components';
import { transformToGraphic } from '../../../util/style';
import type { IRectGraphicAttribute, INode } from '@visactor/vrender';
import { ChartEvent, LayoutLevel, LayoutZIndex } from '../../../constant';
import { SCROLL_BAR_DEFAULT_SIZE } from '../../../constant/scroll-bar';
import type { IScrollBarSpec } from './interface';
import type { IZoomable } from '../../../interaction/zoom/zoomable';
import { IFilterMode } from '../constant';

export class ScrollBar<T extends IScrollBarSpec = IScrollBarSpec> extends DataFilterBaseComponent<T> {
  static type = ComponentTypeEnum.scrollBar;
  type = ComponentTypeEnum.scrollBar;
  name: string = ComponentTypeEnum.scrollBar;

  layoutZIndex: number = LayoutZIndex.DataZoom;
  layoutLevel: number = LayoutLevel.DataZoom;

  // datazoom组件
  protected _component!: ScrollBarComponent;

  static createComponent(spec: any, options: IComponentOption) {
    const compSpec = spec.scrollBar || options.defaultSpec;
    if (isNil(compSpec)) {
      return undefined;
    }
    if (!isArray(compSpec)) {
      return new ScrollBar(compSpec, { ...options, specKey: 'scrollBar' });
    }
    const zooms: ScrollBar[] = [];
    compSpec.forEach((s, i: number) => {
      zooms.push(new ScrollBar(s, { ...options, specIndex: i, specKey: 'scrollBar' }));
    });
    return zooms;
  }

  constructor(spec: T, options: IComponentOption) {
    super(spec as any, {
      ...options
    });
    this._filterMode = spec.filterMode ?? IFilterMode.axis;
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

  protected _createOrUpdateComponent() {
    if (!this._component) {
      const container = this.getContainer();
      this._component = new ScrollBarComponent({
        zIndex: this.layoutZIndex,
        x: this.getLayoutStartPoint().x,
        y: this.getLayoutStartPoint().y,
        width: this.getLayoutRect().width,
        height: this.getLayoutRect().height,
        range: [this._start, this._end],
        direction: this._isHorizontal ? 'horizontal' : 'vertical',
        ...this._getComponentAttrs()
      });

      container.add(this._component as unknown as INode);
    }
  }

  protected _handleChange(start: number, end: number, updateComponent?: boolean) {
    if (updateComponent && this._component) {
      this._component.setAttribute('range', [start, end]);
    }

    this._start = start;
    this._end = end;
    const hasChange = this._handleStateChange(this._statePointToData(start), this._statePointToData(end));
    if (hasChange) {
      this.event.emit(ChartEvent.scrollBarChange, {
        model: this,
        value: {
          filterData: this._filterMode !== IFilterMode.axis,
          start: this._start,
          end: this._end,
          startValue: this._startValue,
          endValue: this._endValue,
          newDomain: this._newDomain
        }
      });
    }
  }

  protected _handleDataCollectionChange() {
    // do nothing
  }

  protected _initEvent() {
    if (this._component) {
      this._component.on('scroll', (e: any) => {
        const value = e.detail.value;
        this._handleChange(value[0], value[1]);
      });
    }
  }

  protected _initCommonEvent() {
    if (this._spec.roam) {
      (this as unknown as IZoomable).initScrollEventOfRegions(this._regions, null, this._handleChartScroll);
      (this as unknown as IZoomable).initDragEventOfRegions(this._regions, null, this._handleChartDrag);
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
    return attrs;
  }

  clear(): void {
    if (this._component) {
      this.getContainer()?.removeChild(this._component as unknown as INode);
      this._component = null;
    }
    super.clear();
  }
}
