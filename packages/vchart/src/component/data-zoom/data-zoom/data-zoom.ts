import { isFunction, isNil, isNumber, isValid, last, maxInArray, minInArray, uniqArray } from '@visactor/vutils';
import { mergeSpec } from '@visactor/vutils-extension';
import { ComponentTypeEnum, type IComponentOption } from '../../interface';
import { DataFilterBaseComponent } from '../data-filter-base-component';
import { DataZoom as DataZoomComponent, type DataZoomAttributes } from '@visactor/vrender-components';
import { transformToGraphic } from '../../../util/style';
import type { IRectGraphicAttribute, INode, ISymbolGraphicAttribute, IGroup, IGraphic } from '@visactor/vrender-core';
import type { Datum, ILayoutRect, ILayoutType } from '../../../typings';
import { LinearScale, isContinuous, isDiscrete, type ILinearScale, type IBaseScale } from '@visactor/vscale';
import { LayoutLevel, LayoutZIndex } from '../../../constant/layout';
import { ChartEvent } from '../../../constant/event';
import type { IDataZoomSpec } from './interface';
import { Factory } from '../../../core/factory';
import type { CartesianAxis } from '../../axis/cartesian';
import { DataZoomSpecTransformer } from './data-zoom-transformer';
import { getFormatFunction } from '../../util';
import { dataZoom } from '../../../theme/builtin/common/component/data-zoom';
import { isReverse, statePointToData } from '../util';

export class DataZoom<T extends IDataZoomSpec = IDataZoomSpec> extends DataFilterBaseComponent<T> {
  static type = ComponentTypeEnum.dataZoom;
  static readonly transformerConstructor = DataZoomSpecTransformer as any;
  type = ComponentTypeEnum.dataZoom;
  name: string = ComponentTypeEnum.dataZoom;
  readonly transformerConstructor = DataZoomSpecTransformer;

  static readonly builtInTheme = {
    dataZoom
  };
  static specKey = 'dataZoom';
  specKey = 'dataZoom';

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

  protected _isReverseCache: boolean = false;

  protected _cacheRect?: ILayoutRect;

  constructor(spec: T, options: IComponentOption) {
    super(spec, options);

    this._valueField = 'y';
    this._filterMode = spec.filterMode ?? 'filter';
  }

  /*** start: init event and event dispatch ***/
  protected _handleChange(start: number, end: number, updateComponent?: boolean, tag?: string) {
    super._handleChange(start, end, updateComponent);

    if (this._shouldChange) {
      if (updateComponent && this._component) {
        this._component.setStartAndEnd(start, end);
      } else {
        const axis = this._relatedAxisComponent as CartesianAxis<any>;

        this._start = start;
        this._end = end;
        const startValue = statePointToData(start, this._stateScale, isReverse(axis));
        const endValue = statePointToData(end, this._stateScale, isReverse(axis));
        const hasChange = isFunction(this._spec.updateDataAfterChange)
          ? this._spec.updateDataAfterChange(start, end, startValue, endValue)
          : this._handleStateChange(startValue, endValue, tag);
        if (hasChange) {
          this.event.emit(ChartEvent.dataZoomChange, {
            model: this,
            value: {
              filterData: this._filterMode !== 'axis',
              start,
              end,
              startValue: this._startValue,
              endValue: this._endValue,
              newDomain: this._newDomain
            }
          });
        }
      }
    }
  }

  protected _handleDataCollectionChange() {
    const data = this._data.getDataView();
    data.reRunAllTransform();

    const domain = this._computeDomainOfValueScale();

    if (domain) {
      if (!this._valueScale) {
        this._valueScale = new LinearScale();
      }
      this._valueScale.domain(domain);
      if (this._component) {
        this._createOrUpdateComponent(true);
      }
    }
  }
  /*** end: init event and event dispatch ***/

  /*** start: component lifecycle ***/
  created() {
    super.created();
    this._initValueScale();
  }

  updateLayoutAttribute(): void {
    if (this._cacheVisibility !== false) {
      super.updateLayoutAttribute();
    }
  }

  onLayoutEnd(): void {
    super.onLayoutEnd();
    const axis = this._relatedAxisComponent as CartesianAxis<any>;
    // 初始时reverse判断并不准确，导致start和end颠倒, 保险起见在layoutend之后触发该逻辑
    // FIXME: 牺牲了一定性能，有待优化
    if (isReverse(axis) && !this._isReverseCache) {
      this._isReverseCache = isReverse(axis);
      this.effect.onZoomChange();
    }
  }

  clear(): void {
    if (this._component) {
      const container = this.getContainer();
      this._component.removeAllChild();
      if (container) {
        container.removeChild(this._component as unknown as INode);
      }

      this._component = null;
    }
    super.clear();
  }

  /*** end: component lifecycle ***/

  /*** start: set attributes & bind related axis and region ***/
  setAttrFromSpec() {
    super.setAttrFromSpec();

    // size相关
    this._backgroundSize = this._spec.background?.size ?? 30;
    this._middleHandlerSize = this._computeMiddleHandlerSize();
    this._width = this._computeWidth();
    this._height = this._computeHeight();
    // startHandler和endHandler size如果没有配置，则默认跟随background宽 or 高
    if (isNil(this._spec?.startHandler?.style?.size)) {
      this._spec.startHandler.style.size = this._isHorizontal
        ? this._height - this._middleHandlerSize
        : this._width - this._middleHandlerSize;
    }
    if (isNil(this._spec?.endHandler?.style?.size)) {
      this._spec.endHandler.style.size = this._isHorizontal
        ? this._height - this._middleHandlerSize
        : this._width - this._middleHandlerSize;
    }
    const startHandlerVisble = this._spec.startHandler.style.visible ?? true;
    const endHandlerVisble = this._spec.endHandler.style.visible ?? true;
    this._startHandlerSize = startHandlerVisble ? this._spec.startHandler.style.size : 0;
    this._endHandlerSize = endHandlerVisble ? this._spec.endHandler.style.size : 0;
    this._width = this._computeWidth();
    this._height = this._computeHeight();
  }
  /*** end: set attributes & bind related axis and region ***/

  /*** start: scale of background chart ***/
  protected _initValueScale() {
    const domain = this._computeDomainOfValueScale();

    if (domain) {
      const valueScale = new LinearScale();
      valueScale.domain(domain);
      this._valueScale = valueScale;
    }
  }

  protected _updateScaleRange() {
    const handlerSize = this._startHandlerSize + this._endHandlerSize;
    if (!this._stateScale || !this._valueScale) {
      return;
    }

    // visible为false时, 计算stateScale的兜底range
    let stateScaleRange;
    const defaultSize = this._isHorizontal
      ? this.getLayoutRect().width - handlerSize
      : this.getLayoutRect().height - handlerSize;

    const defaultRange = (this._relatedAxisComponent as CartesianAxis<any>)?.getScale().range() ?? [
      this._startHandlerSize / 2,
      defaultSize + this._startHandlerSize / 2
    ];

    const compWidth = this._computeWidth();
    const compHeight = this._computeHeight();

    if (this._isHorizontal) {
      stateScaleRange = this._visible
        ? [this._startHandlerSize / 2, compWidth - handlerSize + this._startHandlerSize / 2]
        : defaultRange;
      this._stateScale.range(stateScaleRange);
      this._valueScale.range([compHeight - this._middleHandlerSize, 0]);
    } else {
      stateScaleRange = this._visible
        ? [this._startHandlerSize / 2, compHeight - handlerSize + this._startHandlerSize / 2]
        : defaultRange;

      this._stateScale.range(stateScaleRange);

      if (this.layoutOrient === 'left') {
        this._valueScale.range([compWidth - this._middleHandlerSize, 0]);
      } else {
        this._valueScale.range([0, compWidth - this._middleHandlerSize]);
      }
    }
  }

  protected _computeDomainOfValueScale() {
    const domain = this._data.getLatestData().map((d: any) => d[this._valueField]);

    const domainNum = domain.map((n: any) => n * 1);
    return domain.length ? [minInArray(domainNum), maxInArray(domainNum)] : null;
  }

  protected _isScaleValid(scale: IBaseScale | ILinearScale) {
    if (!scale || !scale.domain()) {
      return false;
    }
    const domain = scale.domain();
    if (isContinuous(scale.type) && domain[0] === last(domain)) {
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
  /*** end: scale of background chart ***/

  /** start: component layout attr ***/
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

    return (
      Math.max(this._startHandlerSize || 0, this._endHandlerSize || 0, this._backgroundSize || 0) +
      this._middleHandlerSize
    );
  }

  protected _computeHeight(): number {
    if (this._visible === false) {
      return 0;
    }

    if (isNumber(this._spec.height)) {
      return this._spec.height;
    }

    if (this._isHorizontal) {
      return (
        Math.max(this._startHandlerSize || 0, this._endHandlerSize || 0, this._backgroundSize || 0) +
        this._middleHandlerSize
      );
    }
    return this.getLayoutRect().height;
  }
  /** end: component layout attr ***/

  /** start: datazoom component attr ***/
  private _getAttrs(isNeedPreview: boolean) {
    const spec = this._spec ?? ({} as T);
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
        width: this._computeWidth(),
        height: this._computeHeight()
      },
      showDetail: spec.showDetail,
      brushSelect: spec.brushSelect ?? false,
      zoomLock: spec.zoomLock ?? false,
      minSpan: this._minSpan,
      maxSpan: this._maxSpan,
      delayType: spec.delayType,
      delayTime: isValid(spec.delayType) ? (spec.delayTime ?? 30) : 0,
      realTime: spec.realTime ?? true,
      previewData: isNeedPreview && this._data.getLatestData(),
      previewPointsX: isNeedPreview && this._dataToPositionX,
      previewPointsY: isNeedPreview && this._dataToPositionY,
      tolerance: this._spec.tolerance,
      ...(this._getComponentAttrs(isNeedPreview) as any)
    } as DataZoomAttributes;
  }

  protected _createOrUpdateComponent(changeData?: boolean) {
    if (this._visible) {
      const xScale = this._isHorizontal ? this._stateScale : this._valueScale;
      const yScale = this._isHorizontal ? this._valueScale : this._stateScale;
      const isNeedPreview =
        this._isScaleValid(xScale) && this._isScaleValid(yScale) && this._spec.showBackgroundChart !== false;
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
        const axis = this._relatedAxisComponent as CartesianAxis<any>;
        this._component.setStatePointToData((state: number) =>
          statePointToData(state, this._stateScale, isReverse(axis))
        );

        this._component.addEventListener('dataZoomChange', (e: any) => {
          const { start, end, tag } = e.detail;
          this._handleChange(start, end, undefined, tag);
        });
        container.add(this._component as unknown as INode);

        this._updateScaleRange();
      }
    }
  }

  protected _getComponentAttrs(isNeedPreview: boolean) {
    const {
      middleHandler = {},
      startText = {},
      endText = {},
      backgroundChart = {},
      selectedBackgroundChart = {}
    } = this._spec as T;
    return {
      backgroundStyle: transformToGraphic(this._spec.background?.style) as unknown as IRectGraphicAttribute,
      startHandlerStyle: transformToGraphic(this._spec.startHandler?.style) as unknown as ISymbolGraphicAttribute,
      middleHandlerStyle: middleHandler.visible
        ? {
            visible: true,
            icon: transformToGraphic(middleHandler.icon?.style) as unknown as ISymbolGraphicAttribute,
            background: {
              size: middleHandler.background?.size,
              style: transformToGraphic(middleHandler.background?.style)
            } as any
          }
        : { visible: false },
      endHandlerStyle: transformToGraphic(this._spec.endHandler?.style) as unknown as ISymbolGraphicAttribute,
      startTextStyle: {
        padding: startText.padding,
        formatMethod: this._getHandlerTextFormatMethod(startText),
        textStyle: transformToGraphic(startText.style)
      } as unknown,
      endTextStyle: {
        padding: endText.padding,
        formatMethod: this._getHandlerTextFormatMethod(endText),
        textStyle: transformToGraphic(endText.style)
      } as unknown,
      selectedBackgroundStyle: transformToGraphic(
        this._spec.selectedBackground.style
      ) as unknown as IRectGraphicAttribute,
      dragMaskStyle: transformToGraphic(this._spec.dragMask?.style) as unknown as IRectGraphicAttribute,
      backgroundChartStyle: isNeedPreview
        ? {
            line: mergeSpec(transformToGraphic(backgroundChart.line?.style), { fill: false }),
            area: {
              curveType: 'basis',
              visible: true,
              ...transformToGraphic(backgroundChart.area?.style)
            }
          }
        : {
            line: { visible: false },
            area: { visible: false }
          },
      selectedBackgroundChartStyle: isNeedPreview
        ? {
            line: mergeSpec(transformToGraphic(selectedBackgroundChart.line?.style), { fill: false }),
            area: {
              curveType: 'basis',
              visible: true,
              ...transformToGraphic(selectedBackgroundChart.area?.style)
            }
          }
        : {
            line: { visible: false },
            area: { visible: false }
          },
      disableTriggerEvent: this._option.disableTriggerEvent
    };
  }

  protected _getHandlerTextFormatMethod(spec: IDataZoomSpec['startText']) {
    const { formatMethod, formatter } = spec;
    const { formatFunc } = getFormatFunction(formatMethod, formatter);
    return formatFunc ? (text: any) => formatFunc(text, { label: text }, formatter) : undefined;
  }
  /** end: datazoom component attr ***/

  protected _getNeedClearVRenderComponents(): IGraphic[] {
    return [this._component] as unknown as IGroup[];
  }
}

export const registerDataZoom = () => {
  Factory.registerComponent(DataZoom.type, DataZoom);
};
