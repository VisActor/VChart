import type { DataView } from '@visactor/vdataset';
import { array } from '@visactor/vutils';
import { AGGR_TYPE } from '../../constant/marker';
import type { IOptionAggr } from '../../data/transforms/aggregation';
import type { IModelRenderOption } from '../../model/interface';
import type { LayoutItem } from '../../model/layout-item';
import type { IRegion } from '../../region/interface';
import type { ICartesianSeries } from '../../series/interface';
import type { StringOrNumber } from '../../typings';
import { BaseComponent } from '../base';
import type { IAggrType, IDataPointSpec, IDataPos, IDataPosCallback, IMarkerAxisSpec, IMarkerSpec } from './interface';
import type { IRegressType } from './mark-area/interface';
import type { IGraphic, INode, IGroup } from '@visactor/vrender-core';

export abstract class BaseMarker<T extends IMarkerSpec & IMarkerAxisSpec> extends BaseComponent<T> {
  layoutType: LayoutItem['layoutType'] = 'absolute';

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

  created() {
    super.created();
    // event
    this.initEvent();
    this._bindSeries();
    this._initDataView();
  }

  private _isSpecAggr(spec: IDataPos | IDataPosCallback) {
    return AGGR_TYPE.includes(spec as any);
  }

  private _getAllRelativeSeries() {
    return {
      getRelativeSeries: () => this._relativeSeries,
      getStartRelativeSeries: () => this._startRelativeSeries,
      getEndRelativeSeries: () => this._endRelativeSeries
    };
  }

  protected _processSpecX(specX: IDataPos | IDataPosCallback) {
    const relativeSeries = this._relativeSeries;
    let processType: IAggrType | IRegressType;
    if (this._isSpecAggr(specX)) {
      processType = specX as unknown as IAggrType;
      return {
        x: {
          field: relativeSeries.getSpec().xField,
          aggrType: processType
        },
        ...this._getAllRelativeSeries()
      };
    }
    return { x: specX, ...this._getAllRelativeSeries() };
  }

  protected _processSpecY(specY: IDataPos | IDataPosCallback) {
    const relativeSeries = this._relativeSeries;
    let processType: IAggrType | IRegressType;
    if (this._isSpecAggr(specY)) {
      processType = specY as unknown as IAggrType;
      return {
        y: {
          field: relativeSeries.getSpec().yField,
          aggrType: processType
        },
        ...this._getAllRelativeSeries()
      };
    }
    return { y: specY, ...this._getAllRelativeSeries() };
  }

  protected _processSpecCoo(spec: any) {
    const coordinates = spec.coordinates ?? array(spec.coordinate);
    return coordinates.map((coordinate: IDataPointSpec) => {
      const refRelativeSeries = this._getSeriesByIdOrIndex(
        coordinate.refRelativeSeriesId,
        coordinate.refRelativeSeriesIndex
      );

      const { xField, yField } = refRelativeSeries.getSpec();
      const { [xField]: coordinateX, [yField]: coordinateY } = coordinate;
      const option: IOptionAggr = {
        x: undefined,
        y: undefined,
        ...this._getAllRelativeSeries()
      };
      if (this._isSpecAggr(coordinateX)) {
        option.x = { field: xField, aggrType: coordinateX as IAggrType };
      } else {
        option.x = coordinateX;
      }

      if (this._isSpecAggr(coordinateY)) {
        option.y = { field: yField, aggrType: coordinateY as IAggrType };
      } else {
        option.y = coordinateY;
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
        this._createMarkerComponent();
        // 代理 marker 组件上的事件
        this._markerComponent.on('*', (event: any, type: string) =>
          this._delegateEvent(this._markerComponent as unknown as IGraphic, event, type)
        );
      }
      this._markerLayout();
    }

    super.updateLayoutAttribute();
  }

  protected _getSeriesByIdOrIndex(seriesUserId: StringOrNumber, seriesIndex: number) {
    let series: ICartesianSeries;
    series = this._option.getSeriesInUserIdOrIndex(array(seriesUserId), [seriesIndex])?.[0] as ICartesianSeries;
    if (!series) {
      series = this._relativeSeries ?? this.getFirstSeries();
    }
    return series;
  }

  protected _bindSeries() {
    const spec = this._spec;
    this._relativeSeries = this._getSeriesByIdOrIndex(spec.relativeSeriesId, spec.relativeSeriesIndex);
    this._startRelativeSeries = this._getSeriesByIdOrIndex(spec.startRelativeSeriesId, spec.startRelativeSeriesIndex);
    this._endRelativeSeries = this._getSeriesByIdOrIndex(spec.endRelativeSeriesId, spec.endRelativeSeriesIndex);
  }

  protected _computeClipRange(regions: IRegion[]) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    regions.forEach((region: IRegion) => {
      if (region.getLayoutStartPoint().x < minX) {
        minX = region.getLayoutStartPoint().x;
      }
      if (region.getLayoutStartPoint().x + region.getLayoutRect().width > maxX) {
        maxX = region.getLayoutStartPoint().x + region.getLayoutRect().width;
      }
      if (region.getLayoutStartPoint().y < minY) {
        minY = region.getLayoutStartPoint().y;
      }
      if (region.getLayoutStartPoint().y + region.getLayoutRect().height > maxY) {
        maxY = region.getLayoutStartPoint().y + region.getLayoutRect().height;
      }
    });
    return { minX, maxX, minY, maxY };
  }

  protected abstract _initDataView(): void;
  protected abstract _createMarkerComponent(): void;
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

  protected getFirstSeries(): ICartesianSeries {
    for (let i = 0; i < this._regions.length; i++) {
      const r = this._regions[i];
      const series = r.getSeries();
      for (let j = 0; j < series.length; j++) {
        const s = series[j];
        if (s) {
          return s as ICartesianSeries;
        }
      }
    }
    this._option?.onError('need at least one series');
    return null;
  }

  getVRenderComponents(): IGraphic[] {
    return [this._markerComponent] as unknown as IGroup[];
  }
}
