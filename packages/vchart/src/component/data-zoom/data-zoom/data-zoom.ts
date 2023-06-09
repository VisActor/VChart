import { isArray, isNil, isNumber, merge } from '@visactor/vutils';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface';
import { DataFilterBaseComponent } from '../data-filter-base-component';
// eslint-disable-next-line no-duplicate-imports
import { DataZoom as DataZoomComponent } from '@visactor/vrender-components';
import { transformToGraphic } from '../../../util/style';
import type { IRectGraphicAttribute, INode, ISymbolGraphicAttribute } from '@visactor/vrender';
import type { Datum } from '../../../typings';
import type { ILinearScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { LinearScale } from '@visactor/vscale';
import { ChartEvent, LayoutLevel, LayoutZIndex } from '../../../constant';

export class DataZoom extends DataFilterBaseComponent {
  static type = ComponentTypeEnum.dataZoom;
  type = ComponentTypeEnum.dataZoom;
  name: string = ComponentTypeEnum.dataZoom;

  layoutZIndex: number = LayoutZIndex.DataZoom;
  layoutLevel: number = LayoutLevel.DataZoom;

  // datazoom组件
  protected _component!: DataZoomComponent;

  protected _valueScale!: ILinearScale;

  protected _backgroundSize!: number;
  protected _middleHandlerSize!: number;

  static createComponent(spec: any, options: IComponentOption) {
    const compSpec = spec.dataZoom || options.defaultSpec;
    if (isNil(compSpec)) {
      return undefined;
    }
    if (!isArray(compSpec)) {
      return new DataZoom(compSpec, { ...options, specKey: 'dataZoom' });
    }
    const zooms: DataZoom[] = [];
    compSpec.forEach((s, i: number) => {
      zooms.push(new DataZoom(s, { ...options, specIndex: i, specKey: 'dataZoom' }));
    });
    return zooms;
  }

  constructor(spec: any, options: IComponentOption) {
    super(spec, {
      ...options
    });

    this._valueField = 'y';
  }

  created() {
    super.created();
    this._initValueScale();
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();

    // size相关
    this._backgroundSize = this._spec.background?.size ?? 30;
    this._middleHandlerSize = this._computeMiddleHandlerSize();
    this._width = this._computeWidth();
    this._height = this._computeHeight();
    // startHandler和endHandler size如果没有配置，则默认跟随background宽 or 高
    if (this._originalSpec.startHandler?.style?.size ?? true) {
      this._spec.startHandler.style.size = this._isHorizontal
        ? this._height - this._middleHandlerSize
        : this._width - this._middleHandlerSize;
    }
    if (this._originalSpec.endHandler?.style?.size ?? true) {
      this._spec.endHandler.style.size = this._isHorizontal
        ? this._height - this._middleHandlerSize
        : this._width - this._middleHandlerSize;
    }
  }

  /** LifeCycle API**/
  onLayoutEnd(ctx: any): void {
    this._updateScaleRange();
    super.onLayoutEnd(ctx);
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
    if (!this._stateScale || !this._valueScale) {
      return;
    }
    if (this._isHorizontal) {
      this._stateScale.range([0, this._computeWidth()]);
      this._valueScale.range([this._computeHeight() - this._middleHandlerSize, 0]);
    } else if (this.layoutOrient === 'left') {
      this._stateScale.range([0, this._computeHeight()]);
      this._valueScale.range([this._computeWidth() - this._middleHandlerSize, 0]);
    } else {
      this._stateScale.range([0, this._computeHeight()]);
      this._valueScale.range([0, this._computeWidth() - this._middleHandlerSize]);
    }

    if (this._component) {
      this._component.setAttributes({
        size: {
          width: this._computeWidth(),
          height: this._computeHeight()
        }
      });
    }
  }

  protected _computeDomainOfValueScale() {
    const domain = this._data.getLatestData().map((d: any) => d[this._valueField]);

    return domain.length ? [Math.min.apply(null, domain), Math.max.apply(null, domain)] : null;
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
    if (isNumber(this._spec.width)) {
      return this._spec.width;
    }

    if (this._isHorizontal) {
      return this.getLayoutRect().width;
    }

    return this._backgroundSize + this._middleHandlerSize;
  }

  protected _computeHeight(): number {
    if (isNumber(this._spec.height)) {
      return this._spec.height;
    }

    if (this._isHorizontal) {
      return this._backgroundSize + this._middleHandlerSize;
    }
    return this.getLayoutRect().height;
  }

  protected _dataToPositionX = (datum: Datum): number => {
    const offsetLeft = this._orient === 'left' ? this._middleHandlerSize : 0;
    const xScale = this._isHorizontal ? this._stateScale : this._valueScale;

    return xScale.scale(datum[this._stateField]) + this.getLayoutStartPoint().x + offsetLeft;
  };

  protected _dataToPositionX2 = (datum: Datum): number => {
    const offsetLeft = this._orient === 'left' ? this._middleHandlerSize : 0;
    const xScale = this._isHorizontal ? this._stateScale : this._valueScale;
    const min = xScale.domain()[0];
    return xScale.scale(min) + this.getLayoutStartPoint().x + offsetLeft;
  };

  protected _dataToPositionY = (datum: Datum): number => {
    const offsetTop = this._isHorizontal ? this._middleHandlerSize : 0;
    const yScale = this._isHorizontal ? this._valueScale : this._stateScale;

    return yScale.scale(datum[this._valueField]) + this.getLayoutStartPoint().y + offsetTop;
  };

  protected _dataToPositionY2 = (datum: Datum): number => {
    const offsetTop = this._isHorizontal ? this._middleHandlerSize : 0;
    const yScale = this._isHorizontal ? this._valueScale : this._stateScale;
    const min = yScale.domain()[0];
    return yScale.scale(min) + this.getLayoutStartPoint().y + offsetTop;
  };

  protected _createOrUpdateComponent() {
    if (!this._component) {
      const container = this.getContainer();
      this._component = new DataZoomComponent({
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
        brushSelect: this._spec?.brushSelect ?? true,
        previewData: this._data.getLatestData(),
        previewCallbackX: this._dataToPositionX,
        previewCallbackY: this._dataToPositionY,
        ...(this._getComponentAttrs() as any)
      });

      if (this._isHorizontal) {
        this._component.setPreviewCallbackY1(this._dataToPositionY2);
      } else {
        this._component.setPreviewCallbackX1(this._dataToPositionX2);
      }
      this._component.setStatePointToData((state: number) => this._statePointToData(state));
      this._component.setUpdateStateCallback((start: number, end: number) => {
        this._handleChange(start, end);
      });

      container.add(this._component as unknown as INode);

      this._updateScaleRange();
    }
  }

  protected _handleChange(start: number, end: number, updateComponent?: boolean) {
    if (updateComponent && this._component) {
      this._component.setStartAndEnd(start, end);
    }

    this._start = start;
    this._end = end;
    const hasChange = this._handleStateChange(this._statePointToData(start), this._statePointToData(end));
    if (hasChange) {
      this.event.emit(ChartEvent.dataZoomChange, {
        model: this,
        value: {
          filterData: this._spec.filterMode !== 'axis',
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

  protected _initEvent() {
    // do nothing
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
        line: merge(transformToGraphic(this._spec.backgroundChart?.line?.style), { fill: false }),
        area: {
          curveType: 'basis',
          visible: true,
          ...transformToGraphic(this._spec.backgroundChart?.area?.style)
        }
      },
      selectedBackgroundChartStyle: {
        line: merge(transformToGraphic(this._spec.selectedBackgroundChart?.line?.style), { fill: false }),
        area: {
          curveType: 'basis',
          visible: true,
          ...transformToGraphic(this._spec.selectedBackgroundChart?.area?.style)
        }
      }
    };
  }
}
