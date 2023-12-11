import type { DataView } from '@visactor/vdataset';
import { array, isValid, isNil, isString } from '@visactor/vutils';
import type { IModelRenderOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { ICartesianSeries } from '../../series/interface';
import type { ILayoutRect, ILayoutType, IRect, StringOrNumber } from '../../typings';
import { BaseComponent } from '../base/base-component';
import type {
  IAggrType,
  ICoordinateOption,
  IDataPointSpec,
  IDataPos,
  IDataPosCallback,
  IMarkerSpec
} from './interface';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
import { calcLayoutNumber } from '../../util/space';
import { isAggrSpec } from './utils';

export abstract class BaseMarker<T extends IMarkerSpec> extends BaseComponent<T> {
  layoutType: ILayoutType | 'none' = 'none';

  protected _startRelativeSeries!: ICartesianSeries;
  protected _endRelativeSeries!: ICartesianSeries;
  protected _relativeSeries!: ICartesianSeries;
  getRelativeSeries() {
    return this._relativeSeries;
  }

  // marker 组件数据
  protected _markerData!: DataView;
  // marker 组件
  protected _markerComponent!: any;

  protected _layoutOffsetX: number = 0;
  protected _layoutOffsetY: number = 0;

  private _firstSeries: ICartesianSeries;

  created() {
    super.created();
    // event
    this.initEvent();
    this._bindSeries();
    this._initDataView();
  }

  private _getAllRelativeSeries() {
    return {
      getRelativeSeries: () => this._relativeSeries,
      getStartRelativeSeries: () => this._startRelativeSeries,
      getEndRelativeSeries: () => this._endRelativeSeries
    };
  }

  private _getFieldInfoFromSpec(dim: 'x' | 'y', spec: IDataPos | IDataPosCallback, relativeSeries: ICartesianSeries) {
    const field = dim === 'x' ? relativeSeries.getSpec().xField : relativeSeries.getSpec().yField;
    if (isString(spec) && isAggrSpec(spec)) {
      return {
        field,
        aggrType: spec as unknown as IAggrType
      };
    }
    return spec;
  }

  protected _processSpecX(specX: IDataPos | IDataPosCallback) {
    const relativeSeries = this._relativeSeries;
    return {
      x: this._getFieldInfoFromSpec('x', specX, relativeSeries),
      ...this._getAllRelativeSeries()
    };
  }

  protected _processSpecY(specY: IDataPos | IDataPosCallback) {
    const relativeSeries = this._relativeSeries;
    return {
      y: this._getFieldInfoFromSpec('y', specY, relativeSeries),
      ...this._getAllRelativeSeries()
    };
  }

  protected _processSpecXY(specX: IDataPos | IDataPosCallback, specY: IDataPos | IDataPosCallback) {
    const relativeSeries = this._relativeSeries;

    return {
      x: this._getFieldInfoFromSpec('x', specX, relativeSeries),
      y: this._getFieldInfoFromSpec('y', specY, relativeSeries),
      ...this._getAllRelativeSeries()
    };
  }

  protected _processSpecCoo(spec: any) {
    const coordinates = spec.coordinates ?? array(spec.coordinate);
    return coordinates.map((coordinate: IDataPointSpec) => {
      const refRelativeSeries = this._getSeriesByIdOrIndex(
        coordinate.refRelativeSeriesId,
        coordinate.refRelativeSeriesIndex
      );

      const { xField, yField } = refRelativeSeries.getSpec();
      const { xFieldDim, xFieldIndex, yFieldDim, yFieldIndex } = coordinate;
      let bindXField = xField;
      if (isValid(xFieldIndex)) {
        bindXField = array(xField)[xFieldIndex];
      }
      if (xFieldDim && array(xField).includes(xFieldDim)) {
        bindXField = xFieldDim;
      }

      let bindYField = yField;
      if (isValid(yFieldIndex)) {
        bindYField = array(yField)[yFieldIndex];
      }
      if (yFieldDim && array(yField).includes(yFieldDim)) {
        bindYField = yFieldDim;
      }

      const option: ICoordinateOption = {
        x: undefined,
        y: undefined,
        ...this._getAllRelativeSeries()
      };

      if (isString(coordinate[bindXField]) && isAggrSpec(coordinate[bindXField] as IDataPos)) {
        option.x = { field: bindXField, aggrType: coordinate[bindXField] as IAggrType };
      } else {
        option.x = array(bindXField).map(field => coordinate[field]);
      }

      if (isString(coordinate[bindYField]) && isAggrSpec(coordinate[bindYField] as IDataPos)) {
        option.y = { field: bindYField, aggrType: coordinate[bindYField] as IAggrType };
      } else {
        option.y = array(bindYField).map(field => coordinate[field]);
      }
      option.getRefRelativeSeries = () => refRelativeSeries;
      return option;
    });
  }

  updateLayoutAttribute(): void {
    const markerVisible = this._spec.visible ?? true;
    if (markerVisible) {
      // 创建marker组件
      if (!this._markerComponent) {
        const markerComponent = this._createMarkerComponent();
        markerComponent.name = this._spec.name ?? this.type;
        markerComponent.id = this._spec.id ?? `${this.type}-${this.id}`;
        this._markerComponent = markerComponent;

        this.getContainer().add(this._markerComponent);
        // 代理 marker 组件上的事件
        this._markerComponent.on('*', (event: any, type: string) =>
          this._delegateEvent(this._markerComponent as unknown as IGraphic, event, type)
        );
      }
      this._markerLayout();
    }

    super.updateLayoutAttribute();
  }

  private _getSeriesByIdOrIndex(seriesUserId: StringOrNumber, seriesIndex: number) {
    let series: ICartesianSeries;
    series = this._option.getSeriesInUserIdOrIndex(isValid(seriesUserId) ? [seriesUserId] : [], [
      seriesIndex
    ])?.[0] as ICartesianSeries;
    if (!series) {
      series = this._relativeSeries ?? this._getFirstSeries();
    }
    return series;
  }

  protected _bindSeries() {
    const spec = this._spec;
    this._relativeSeries = this._getSeriesByIdOrIndex(spec.relativeSeriesId, spec.relativeSeriesIndex);
    this._startRelativeSeries = this._getSeriesByIdOrIndex(
      (spec as any).startRelativeSeriesId,
      (spec as any).startRelativeSeriesIndex
    );
    this._endRelativeSeries = this._getSeriesByIdOrIndex(
      (spec as any).endRelativeSeriesId,
      (spec as any).endRelativeSeriesIndex
    );
  }

  protected abstract _initDataView(): void;
  protected abstract _createMarkerComponent(): IGroup;
  protected abstract _markerLayout(): void;

  protected initEvent() {
    // do nothing
  }
  onRender(ctx: IModelRenderOption): void {
    // do nothing
  }
  changeRegions(regions: IRegion[]): void {
    // do nothing
  }

  clear(): void {
    super.clear();
    this._firstSeries = null;
  }

  private _getFirstSeries(): ICartesianSeries {
    if (this._firstSeries) {
      return this._firstSeries;
    }
    for (let i = 0; i < this._regions.length; i++) {
      const r = this._regions[i];
      const series = r.getSeries();
      for (let j = 0; j < series.length; j++) {
        const s = series[j];
        if (s) {
          this._firstSeries = s as ICartesianSeries;
          return s as ICartesianSeries;
        }
      }
    }
    this._option?.onError('need at least one series');
    return null;
  }

  protected _getNeedClearVRenderComponents(): IGraphic[] {
    return [this._markerComponent] as unknown as IGroup[];
  }

  onLayoutStart(layoutRect: IRect, chartViewRect: ILayoutRect, ctx: any): void {
    // offset
    if (!isNil(this._spec.offsetX)) {
      this._layoutOffsetX = calcLayoutNumber(this._spec.offsetX, chartViewRect.width, chartViewRect);
    }
    if (!isNil(this._spec.offsetY)) {
      this._layoutOffsetY = calcLayoutNumber(this._spec.offsetY, chartViewRect.height, chartViewRect);
    }
    super.onLayoutStart(layoutRect, chartViewRect, ctx);
  }
}
