import type { DataView } from '@visactor/vdataset';
import { array, merge } from '@visactor/vutils';
import { AGGR_TYPE } from '../../constant/marker';
import type { IOptionAggr } from '../../data/transforms/aggregation';
import type { IOptionRegr } from '../../data/transforms/regression';
import type { IModelRenderOption } from '../../model/interface';
import type { LayoutItem } from '../../model/layout-item';
import type { IRegion } from '../../region/interface';
import type { ICartesianSeries } from '../../series/interface';
import type { StringOrNumber } from '../../typings';
import { BaseComponent } from '../base';
import type { IAggrType, IDataPointSpec, IDataPos } from './interface';
import type { IRegressType } from './mark-area/interface';
import type { INode } from '@visactor/vrender';

export abstract class BaseMarker extends BaseComponent {
  layoutType: LayoutItem['layoutType'] = 'absolute';

  protected _startRelativeSeries!: ICartesianSeries;
  protected _endRelativeSeries!: ICartesianSeries;
  protected _relativeSeries!: ICartesianSeries;

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

  private _isSpecAggrOrRege(spec: IDataPos) {
    return spec === 'regression' || AGGR_TYPE.includes(spec as any);
  }

  protected _processSpecX(specX: IDataPos) {
    const relativeSeries = this._relativeSeries;
    let processType: IAggrType | IRegressType;
    if (this._isSpecAggrOrRege(specX)) {
      processType = specX as unknown as IAggrType;
      return {
        x: {
          field: relativeSeries.getSpec().xField,
          aggrType: processType
        }
      };
    }
    return { x: specX };
  }

  protected _processSpecY(specY: IDataPos) {
    const relativeSeries = this._relativeSeries;
    let processType: IAggrType | IRegressType;
    if (this._isSpecAggrOrRege(specY)) {
      processType = specY as unknown as IAggrType;
      return {
        y: {
          field: relativeSeries.getSpec().yField,
          aggrType: processType
        }
      };
    }
    return { y: specY };
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
      const option: IOptionAggr | IOptionRegr = { x: null, y: null };
      if (this._isSpecAggrOrRege(coordinateX)) {
        option.x = { field: xField, aggrType: coordinateX as IAggrType };
      } else {
        option.x = coordinateX;
      }

      if (this._isSpecAggrOrRege(coordinateY)) {
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
          this._delegateEvent(this._markerComponent as unknown as INode, event, type)
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
    throw new Error('need at least one series');
  }

  clear(): void {
    if (this._markerComponent) {
      this._container.removeChild(this._markerComponent as unknown as INode);
      this._markerComponent = null;
    }
    super.clear();
  }
}
