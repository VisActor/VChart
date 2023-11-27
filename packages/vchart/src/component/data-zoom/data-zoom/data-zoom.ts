import { isArray, isBoolean, isNil, isNumber, isValid, maxInArray, minInArray, uniqArray } from '@visactor/vutils';
import { mergeSpec } from '../../../util/spec/merge-spec';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface/type';
import { DataFilterBaseComponent } from '../data-filter-base-component';
// eslint-disable-next-line no-duplicate-imports
import type { DataZoomAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { DataZoom as DataZoomComponent } from '@visactor/vrender-components';
import { transformToGraphic } from '../../../util/style';
import type { IRectGraphicAttribute, INode, ISymbolGraphicAttribute, IGroup, IGraphic } from '@visactor/vrender-core';
import type { Datum, ILayoutType } from '../../../typings';
import type { ILinearScale, IBaseScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { LinearScale, isContinuous, isDiscrete } from '@visactor/vscale';
import { ChartEvent, LayoutLevel, LayoutZIndex } from '../../../constant';
import type { IDataZoomSpec } from './interface';
import { IFilterMode } from '../constant';
import { Factory } from '../../../core/factory';
import type { IZoomable } from '../../../interaction/zoom';
import type { CartesianAxis } from '../../axis/cartesian';

export class DataZoom<T extends IDataZoomSpec = IDataZoomSpec> extends DataFilterBaseComponent<T> {
  static type = ComponentTypeEnum.dataZoom;
  type = ComponentTypeEnum.dataZoom;
  name: string = ComponentTypeEnum.dataZoom;

  layoutZIndex: number = LayoutZIndex.DataZoom;
  layoutLevel: number = LayoutLevel.DataZoom;
  layoutType: ILayoutType = 'region-relative';

  // datazoom组件
  protected _component!: DataZoomComponent;

  protected _valueScale!: ILinearScale;

  protected _backgroundSize!: number;
  protected _middleHandlerSize!: number;
  protected _startHandlerSize!: number;
  protected _endHandlerSize!: number;

  static createComponent(spec: any, options: IComponentOption) {
    const compSpec = spec.dataZoom;
    if (isNil(compSpec)) {
      return undefined;
    }
    if (!isArray(compSpec)) {
      return new DataZoom(compSpec, options);
    }
    const zooms: DataZoom[] = [];
    compSpec.forEach((s, i: number) => {
      zooms.push(new DataZoom(s, { ...options, specIndex: i }));
    });
    return zooms;
  }

  constructor(spec: T, options: IComponentOption) {
    super(spec, options);

    this._valueField = 'y';
    this._filterMode = spec.filterMode ?? IFilterMode.filter;
  }

  created() {
    super.created();
    this._initValueScale();
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();

    if (isBoolean((this._spec as any).roam)) {
      this._zoomAttr.enable = (this._spec as any).roam;
      this._dragAttr.enable = (this._spec as any).roam;
      this._scrollAttr.enable = (this._spec as any).roam;
    }

    if (this._zoomAttr.enable || this._dragAttr.enable || this._scrollAttr.enable) {
      (this as unknown as IZoomable).initZoomable(this.event, this._option.mode);
    }

    // size相关
    this._backgroundSize = this._spec.background?.size ?? 30;
    this._middleHandlerSize = this._computeMiddleHandlerSize();
    this._width = this._computeWidth();
    this._height = this._computeHeight();
    // startHandler和endHandler size如果没有配置，则默认跟随background宽 or 高
    if (isNil(this._originalSpec?.startHandler?.style?.size)) {
      this._spec.startHandler.style.size = this._isHorizontal
        ? this._height - this._middleHandlerSize
        : this._width - this._middleHandlerSize;
    }
    if (isNil(this._originalSpec?.endHandler?.style?.size)) {
      this._spec.endHandler.style.size = this._isHorizontal
        ? this._height - this._middleHandlerSize
        : this._width - this._middleHandlerSize;
    }
    const startHandlerVisble = this._spec.startHandler.style.visible ?? true;
    const endHandlerVisble = this._spec.endHandler.style.visible ?? true;
    this._startHandlerSize = startHandlerVisble ? this._spec.startHandler.style.size : 0;
    this._endHandlerSize = endHandlerVisble ? this._spec.endHandler.style.size : 0;
  }

  protected _prepareSpecBeforeMergingTheme(originalSpec: T): T {
    const newSpec: T = {
      ...originalSpec
    };
    // 为了减少主题更改造成的影响，如果用户在 spec 配置了主题默认关闭的 mark，则自动加上 visible: true
    const { selectedBackgroundChart = {} } = newSpec;
    const { line, area } = selectedBackgroundChart;
    if (line || area) {
      newSpec.selectedBackgroundChart = {
        ...selectedBackgroundChart,
        line:
          line && line.visible !== false
            ? {
                ...line,
                style: {
                  ...line.style,
                  visible: true // FIXME: visible 应该提到更上面，等 datazoom 支持
                }
              }
            : line,
        area:
          area && area.visible !== false
            ? {
                ...area,
                style: {
                  ...area.style,
                  visible: true // FIXME: visible 应该提到更上面，等 datazoom 支持
                }
              }
            : area
      };
    }
    return newSpec;
  }

  /** LifeCycle API**/
  onLayoutEnd(ctx: any): void {
    this._updateScaleRange();
    if (this._cacheVisibility !== false) {
      super.onLayoutEnd(ctx);
    }
  }

  protected _initValueScale() {
    const domain = this._computeDomainOfValueScale();

    if (domain) {
      const valueScale = new LinearScale();
      valueScale.domain(domain);
      this._valueScale = valueScale;
    }
  }

  protected _updateScaleRange() {
    const handlerSize = (this._startHandlerSize + this._endHandlerSize) / 2;
    if (!this._stateScale || !this._valueScale) {
      return;
    }

    // visible为false时, 计算stateScale的兜底range
    let stateScaleRange;
    const defaultSize = this._isHorizontal
      ? this.getLayoutRect().width - handlerSize
      : this.getLayoutRect().height - handlerSize;
    const defaultRange = (this._relatedAxisComponent as CartesianAxis<any>)?.getScale().range() ?? [0, defaultSize];

    if (this._isHorizontal) {
      stateScaleRange = this._visible ? [0, this._computeWidth() - handlerSize] : defaultRange;
      this._stateScale.range(stateScaleRange);
      this._valueScale.range([this._computeHeight() - this._middleHandlerSize, 0]);
    } else if (this.layoutOrient === 'left') {
      stateScaleRange = this._visible ? [0, this._computeHeight() - handlerSize] : defaultRange;
      this._stateScale.range(stateScaleRange);
      this._valueScale.range([this._computeWidth() - this._middleHandlerSize, 0]);
    } else {
      stateScaleRange = this._visible ? [0, this._computeHeight() - handlerSize] : defaultRange;
      this._stateScale.range(stateScaleRange);
      this._valueScale.range([0, this._computeWidth() - this._middleHandlerSize]);
    }

    if (this._component && this._cacheVisibility !== false) {
      this._component.setAttributes({
        size: {
          width: this._computeWidth(),
          height: this._computeHeight()
        },
        position: {
          x: this.getLayoutStartPoint().x,
          y: this.getLayoutStartPoint().y
        }
      });
    }
  }

  protected _computeDomainOfValueScale() {
    const domain = this._data.getLatestData().map((d: any) => d[this._valueField]);

    const domainNum = domain.map((n: any) => n * 1);
    return domain.length ? [minInArray(domainNum), maxInArray(domainNum)] : null;
  }

  protected _computeMiddleHandlerSize(): number {
    let size = 0;
    if (this._spec?.middleHandler?.visible) {
      const middleHandlerIconSize = this._spec.middleHandler.icon.style.size ?? 8;
      const middleHandlerBackSize = this._spec.middleHandler.background.size ?? 40;
      size += Math.max(middleHandlerIconSize as number, middleHandlerBackSize);
    }
    return size;
  }

  protected _computeWidth(): number {
    if (this._visible === false) {
      return 0;
    }

    if (isNumber(this._spec.width)) {
      return this._spec.width;
    }

    if (this._isHorizontal) {
      return this.getLayoutRect().width;
    }

    return this._backgroundSize + this._middleHandlerSize;
  }

  protected _computeHeight(): number {
    if (this._visible === false) {
      return 0;
    }

    if (isNumber(this._spec.height)) {
      return this._spec.height;
    }

    if (this._isHorizontal) {
      return this._backgroundSize + this._middleHandlerSize;
    }
    return this.getLayoutRect().height - (this._startHandlerSize + this._endHandlerSize) / 2;
  }

  protected _isScaleValid(scale: IBaseScale | ILinearScale) {
    if (!scale || !scale.domain()) {
      return false;
    }
    const domain = scale.domain();
    if (isContinuous(scale.type) && domain[0] === domain[1]) {
      return false;
    }
    if (isDiscrete(scale.type) && uniqArray(domain).length === 1) {
      return false;
    }
    return true;
  }

  protected _dataToPositionX = (datum: Datum): number => {
    const offsetLeft = this._orient === 'left' ? this._middleHandlerSize : 0;
    const offsetHandler = this._isHorizontal ? this._startHandlerSize / 2 : 0;
    const xScale = this._isHorizontal ? this._stateScale : this._valueScale;
    const xField = this._isHorizontal ? this._stateField : this._valueField;
    return xScale.scale(datum[xField]) + this.getLayoutStartPoint().x + offsetLeft + offsetHandler;
  };

  protected _dataToPositionX2 = (datum: Datum): number => {
    const offsetLeft = this._orient === 'left' ? this._middleHandlerSize : 0;
    const offsetHandler = this._isHorizontal ? this._startHandlerSize / 2 : 0;
    const xScale = this._isHorizontal ? this._stateScale : this._valueScale;
    const min = xScale.domain()[0];
    return xScale.scale(min) + this.getLayoutStartPoint().x + offsetLeft + offsetHandler;
  };

  protected _dataToPositionY = (datum: Datum): number => {
    const offsetTop = this._isHorizontal ? this._middleHandlerSize : 0;
    const offsetHandler = this._isHorizontal ? 0 : this._startHandlerSize / 2;
    const yScale = this._isHorizontal ? this._valueScale : this._stateScale;
    const yField = this._isHorizontal ? this._valueField : this._stateField;
    return yScale.scale(datum[yField]) + this.getLayoutStartPoint().y + offsetTop + offsetHandler;
  };

  protected _dataToPositionY2 = (datum: Datum): number => {
    const offsetTop = this._isHorizontal ? this._middleHandlerSize : 0;
    const offsetHandler = this._isHorizontal ? 0 : this._startHandlerSize / 2;
    const yScale = this._isHorizontal ? this._valueScale : this._stateScale;
    const min = yScale.domain()[0];
    return yScale.scale(min) + this.getLayoutStartPoint().y + offsetTop + offsetHandler;
  };

  private _getAttrs(isNeedPreview: boolean) {
    return {
      zIndex: this.layoutZIndex,
      start: this._start,
      end: this._end,
      position: {
        x: this.getLayoutStartPoint().x,
        y: this.getLayoutStartPoint().y
      },
      orient: this._orient,
      size: {
        width: this.getLayoutRect().width,
        height: this.getLayoutRect().height
      },
      showDetail: this._spec?.showDetail,
      brushSelect: this._spec?.brushSelect ?? false,
      zoomLock: this._spec?.zoomLock ?? false,
      minSpan: this._minSpan,
      maxSpan: this._maxSpan,
      delayType: this._spec?.delayType,
      delayTime: isValid(this._spec?.delayType) ? this._spec?.delayTime ?? 30 : 0,
      realTime: this._spec?.realTime ?? true,
      previewData: isNeedPreview && this._data.getLatestData(),
      previewPointsX: isNeedPreview && this._dataToPositionX,
      previewPointsY: isNeedPreview && this._dataToPositionY,
      ...(this._getComponentAttrs() as any)
    } as DataZoomAttributes;
  }

  protected _createOrUpdateComponent() {
    if (this._visible) {
      const xScale = this._isHorizontal ? this._stateScale : this._valueScale;
      const yScale = this._isHorizontal ? this._valueScale : this._stateScale;
      const isNeedPreview = this._isScaleValid(xScale) && this._isScaleValid(yScale);
      const attrs = this._getAttrs(isNeedPreview);
      if (this._component) {
        this._component.setAttributes(attrs);
      } else {
        const container = this.getContainer();
        this._component = new DataZoomComponent(attrs);

        if (this._isHorizontal) {
          isNeedPreview && this._component.setPreviewPointsY1(this._dataToPositionY2);
        } else {
          isNeedPreview && this._component.setPreviewPointsX1(this._dataToPositionX2);
        }
        this._component.setStatePointToData((state: number) => this._statePointToData(state));
        this._component.setUpdateStateCallback((start: number, end: number, tag?: string) => {
          this._handleChange(start, end, undefined, tag);
        });

        container.add(this._component as unknown as INode);

        this._updateScaleRange();
      }
    }
  }

  protected _handleChange(start: number, end: number, updateComponent?: boolean, tag?: string) {
    super._handleChange(start, end, updateComponent);
    if (updateComponent && this._component) {
      this._component.setStartAndEnd(start, end);
    }

    this._start = start;
    this._end = end;
    const hasChange = this._handleStateChange(this._statePointToData(start), this._statePointToData(end), tag);
    if (hasChange) {
      this.event.emit(ChartEvent.dataZoomChange, {
        model: this,
        value: {
          filterData: this._filterMode !== IFilterMode.axis,
          start,
          end,
          startValue: this._startValue,
          endValue: this._endValue,
          newDomain: this._newDomain
        }
      });
    }
  }

  protected _handleDataCollectionChange() {
    const data = this._data.getDataView();
    data.reRunAllTransform();
    this._component?.setPreviewData(data.latestData);

    if (this._valueScale) {
      const domain = this._computeDomainOfValueScale();

      if (domain) {
        this._valueScale.domain(domain);
      }
    }
  }

  protected _getComponentAttrs() {
    return {
      backgroundStyle: transformToGraphic(this._spec.background?.style) as unknown as IRectGraphicAttribute,
      startHandlerStyle: transformToGraphic(this._spec.startHandler?.style) as unknown as ISymbolGraphicAttribute,
      middleHandlerStyle: {
        visible: this._spec.middleHandler?.visible ?? false,
        icon: transformToGraphic(this._spec.middleHandler?.icon?.style) as unknown as ISymbolGraphicAttribute,
        background: {
          size: this._spec.middleHandler?.background?.size,
          style: transformToGraphic(this._spec.middleHandler.background?.style)
        } as any
      },
      endHandlerStyle: transformToGraphic(this._spec.endHandler?.style) as unknown as ISymbolGraphicAttribute,
      startTextStyle: {
        padding: this._spec.startText?.padding,
        formatMethod: this._spec.startText?.formatMethod,
        textStyle: transformToGraphic(this._spec.startText?.style)
      } as unknown,
      endTextStyle: {
        padding: this._spec.endText?.padding,
        formatMethod: this._spec.endText?.formatMethod,
        textStyle: transformToGraphic(this._spec.endText?.style)
      } as unknown,
      selectedBackgroundStyle: transformToGraphic(
        this._spec.selectedBackground.style
      ) as unknown as IRectGraphicAttribute,
      dragMaskStyle: transformToGraphic(this._spec.dragMask?.style) as unknown as IRectGraphicAttribute,
      backgroundChartStyle: {
        line: mergeSpec(transformToGraphic(this._spec.backgroundChart?.line?.style), { fill: false }),
        area: {
          curveType: 'basis',
          visible: true,
          ...transformToGraphic(this._spec.backgroundChart?.area?.style)
        }
      },
      selectedBackgroundChartStyle: {
        line: mergeSpec(transformToGraphic(this._spec.selectedBackgroundChart?.line?.style), { fill: false }),
        area: {
          curveType: 'basis',
          visible: true,
          ...transformToGraphic(this._spec.selectedBackgroundChart?.area?.style)
        }
      },
      disableTriggerEvent: this._option.disableTriggerEvent
    };
  }

  getVRenderComponents(): IGraphic[] {
    return [this._component] as unknown as IGroup[];
  }
}

export const registerDataZoom = () => {
  Factory.registerComponent(DataZoom.type, DataZoom);
};
