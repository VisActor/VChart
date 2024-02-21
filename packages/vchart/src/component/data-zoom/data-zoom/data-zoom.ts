import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import {
  isArray,
  isBoolean,
  isFunction,
  isNil,
  isNumber,
  isValid,
  maxInArray,
  minInArray,
  uniqArray
} from '@visactor/vutils';
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
import type { IModelSpecInfo } from '../../../model/interface';
import { DataZoomSpecTransformer } from './data-zoom-transformer';

export class DataZoom<T extends IDataZoomSpec = IDataZoomSpec> extends DataFilterBaseComponent<T> {
  static type = ComponentTypeEnum.dataZoom;
  static readonly transformerConstructor = DataZoomSpecTransformer as any;
  type = ComponentTypeEnum.dataZoom;
  name: string = ComponentTypeEnum.dataZoom;
  readonly transformerConstructor = DataZoomSpecTransformer;

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
  // stateScale: any;

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const compSpec = chartSpec[this.specKey];
    if (isNil(compSpec)) {
      return undefined;
    }
    if (!isArray(compSpec)) {
      return [
        {
          spec: compSpec,
          specPath: [this.specKey],
          specInfoPath: ['component', this.specKey, 0],
          type: ComponentTypeEnum.dataZoom
        }
      ];
    }
    const specInfos: IModelSpecInfo[] = [];
    compSpec.forEach((s, i: number) => {
      specInfos.push({
        spec: s,
        specPath: [this.specKey, i],
        specInfoPath: ['component', this.specKey, i],
        type: ComponentTypeEnum.dataZoom
      });
    });
    return specInfos;
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

    const defaultRange = (this._relatedAxisComponent as CartesianAxis<any>)?.getScale().range() ?? [
      this._startHandlerSize / 2,
      defaultSize - this._endHandlerSize / 2
    ];

    if (this._isHorizontal) {
      stateScaleRange = this._visible
        ? [this._startHandlerSize / 2, this._computeWidth() - this._endHandlerSize / 2]
        : defaultRange;
      this._stateScale.range(stateScaleRange);
      this._valueScale.range([this._computeHeight() - this._middleHandlerSize, 0]);
    } else if (this.layoutOrient === 'left') {
      stateScaleRange = this._visible
        ? [this._startHandlerSize / 2, this._computeHeight() - this._endHandlerSize / 2]
        : defaultRange;
      this._stateScale.range(stateScaleRange);
      this._valueScale.range([this._computeWidth() - this._middleHandlerSize, 0]);
    } else {
      stateScaleRange = this._visible
        ? [this._startHandlerSize / 2, this._computeHeight() - this._endHandlerSize / 2]
        : defaultRange;
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
        width: this.getLayoutRect().width,
        height: this.getLayoutRect().height
      },
      showDetail: spec.showDetail,
      brushSelect: spec.brushSelect ?? false,
      zoomLock: spec.zoomLock ?? false,
      minSpan: this._minSpan,
      maxSpan: this._maxSpan,
      delayType: spec.delayType,
      delayTime: isValid(spec.delayType) ? spec.delayTime ?? 30 : 0,
      realTime: spec.realTime ?? true,
      previewData: isNeedPreview && this._data.getLatestData(),
      previewPointsX: isNeedPreview && this._dataToPositionX,
      previewPointsY: isNeedPreview && this._dataToPositionY,
      tolerance: this._spec.tolerance,
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

        this._component.addEventListener('change', (e: any) => {
          const { start, end, tag } = e.detail;
          this._handleChange(start, end, undefined, tag);
        });
        container.add(this._component as unknown as INode);

        this._updateScaleRange();
      }
    }
  }

  protected _handleChange(start: number, end: number, updateComponent?: boolean, tag?: string) {
    super._handleChange(start, end, updateComponent);

    if (this._shouldChange) {
      if (updateComponent && this._component) {
        this._component.setStartAndEnd(start, end);
      }

      this._start = start;
      this._end = end;
      const startValue = this._statePointToData(start);
      const endValue = this._statePointToData(end);
      const hasChange = isFunction(this._spec.updateDataAfterChange)
        ? this._spec.updateDataAfterChange(start, end, startValue, endValue)
        : this._handleStateChange(startValue, endValue, tag);
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
        formatMethod: startText.formatMethod,
        textStyle: transformToGraphic(startText.style)
      } as unknown,
      endTextStyle: {
        padding: endText.padding,
        formatMethod: endText.formatMethod,
        textStyle: transformToGraphic(endText.style)
      } as unknown,
      selectedBackgroundStyle: transformToGraphic(
        this._spec.selectedBackground.style
      ) as unknown as IRectGraphicAttribute,
      dragMaskStyle: transformToGraphic(this._spec.dragMask?.style) as unknown as IRectGraphicAttribute,
      backgroundChartStyle: {
        line: mergeSpec(transformToGraphic(backgroundChart.line?.style), { fill: false }),
        area: {
          curveType: 'basis',
          visible: true,
          ...transformToGraphic(backgroundChart.area?.style)
        }
      },
      selectedBackgroundChartStyle: {
        line: mergeSpec(transformToGraphic(selectedBackgroundChart.line?.style), { fill: false }),
        area: {
          curveType: 'basis',
          visible: true,
          ...transformToGraphic(selectedBackgroundChart.area?.style)
        }
      },
      disableTriggerEvent: this._option.disableTriggerEvent
    };
  }

  protected _getNeedClearVRenderComponents(): IGraphic[] {
    return [this._component] as unknown as IGroup[];
  }
}

export const registerDataZoom = () => {
  Factory.registerComponent(DataZoom.type, DataZoom);
};
