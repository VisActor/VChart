import { DataSet, DataView } from '@visactor/vdataset';
import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { array, isValid, isNil, isString, isEmpty, isArray, isEqual } from '@visactor/vutils';
import type { IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { ICartesianSeries } from '../../series/interface';
import type { CoordinateType, ILayoutRect, ILayoutType, IRect, StringOrNumber } from '../../typings';
import { BaseComponent } from '../base/base-component';
import type { IAggrType, IDataPos, IDataPosCallback, IMarkerSpec, IMarkerSupportSeries } from './interface';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
import { calcLayoutNumber } from '../../util/space';
import { isAggrSpec } from './utils';
import { getFirstSeries } from '../../util';
import { arrayParser } from '../../data/parser/array';
import type { IOptionWithCoordinates } from '../../data/transforms/aggregation';

export abstract class BaseMarker<T extends IMarkerSpec> extends BaseComponent<T> {
  layoutType: ILayoutType | 'none' = 'none';

  // 下面三个属性需要子组件复写
  static specKey: string;
  static type: string;
  static coordinateType: string;
  coordinateType: CoordinateType;

  protected _startRelativeSeries!: IMarkerSupportSeries;
  protected _endRelativeSeries!: IMarkerSupportSeries;
  protected _relativeSeries!: IMarkerSupportSeries;
  protected _specifiedDataSeries!: IMarkerSupportSeries | IMarkerSupportSeries[];
  getRelativeSeries() {
    return this._relativeSeries;
  }

  // marker 组件数据
  protected _markerData!: DataView;
  getMarkerData() {
    return this._markerData;
  }
  // marker 组件
  protected _markerComponent!: any;

  protected _layoutOffsetX: number = 0;
  protected _layoutOffsetY: number = 0;

  private _firstSeries: ICartesianSeries;

  protected abstract _initDataView(): void;
  protected abstract _createMarkerComponent(): IGroup;
  protected abstract _markerLayout(): void;
  // 该方法需要子组件复写
  static _getMarkerCoordinateType(markerSpec: any): string {
    return 'cartesian';
  }

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const markerSpec = chartSpec[this.specKey];
    if (isEmpty(markerSpec)) {
      return undefined;
    }
    if (
      !isArray(markerSpec) &&
      markerSpec.visible !== false &&
      this._getMarkerCoordinateType(markerSpec) === this.coordinateType
    ) {
      return [
        {
          spec: markerSpec,
          specPath: [this.specKey],
          specInfoPath: ['component', this.specKey, 0],
          type: this.type
        }
      ];
    }
    const specInfos: IModelSpecInfo[] = [];
    array(markerSpec).forEach((m: any, i: number) => {
      if (m.visible !== false && this._getMarkerCoordinateType(m) === this.coordinateType) {
        specInfos.push({
          spec: m,
          specPath: [this.specKey, i],
          specInfoPath: ['component', this.specKey, i],
          type: this.type
        });
      }
    });
    return specInfos;
  }

  created() {
    super.created();
    this._bindSeries();
    this._initDataView();
    this.initEvent();
  }

  protected _getAllRelativeSeries() {
    return {
      getRelativeSeries: () => this._relativeSeries,
      getStartRelativeSeries: () => this._startRelativeSeries,
      getEndRelativeSeries: () => this._endRelativeSeries
    };
  }

  private _getFieldInfoFromSpec(
    dim: 'x' | 'y' | 'angle' | 'radius' | 'areaName',
    spec: IDataPos | IDataPosCallback,
    relativeSeries: IMarkerSupportSeries
  ) {
    const specKeyByDim = {
      x: 'xField',
      y: 'yField',
      radius: 'valueField',
      angle: 'categoryField',
      areaName: 'nameField'
    };

    if (isString(spec) && isAggrSpec(spec)) {
      return {
        field: relativeSeries.getSpec()[specKeyByDim[dim]],
        aggrType: spec as unknown as IAggrType
      };
    }
    return spec;
  }

  protected _processSpecByDims(
    dimSpec: {
      dim: 'x' | 'y' | 'angle' | 'radius' | 'areaName';
      specValue: IDataPos | IDataPosCallback;
    }[]
  ) {
    const relativeSeries = this._relativeSeries;
    const dimMap = {};
    dimSpec.forEach(d => (dimMap[d.dim] = this._getFieldInfoFromSpec(d.dim, d.specValue, relativeSeries)));
    return {
      ...dimMap,
      ...this._getAllRelativeSeries()
    };
  }

  protected _processSpecCoo(spec: any): IOptionWithCoordinates {
    return {
      coordinates: spec.coordinates || spec.coordinate,
      ...this._getAllRelativeSeries(),
      getSeriesByIdOrIndex: (seriesUserId: StringOrNumber, seriesIndex: number) =>
        this._getSeriesByIdOrIndex(seriesUserId, seriesIndex),
      coordinateType: this.coordinateType
    };
  }

  protected _getRelativeDataView() {
    if (this._specifiedDataSeries) {
      let resultData: any[] = [];
      array(this._specifiedDataSeries).forEach(series => {
        resultData = resultData.concat(series.getViewData().latestData);
      });
      const dataSet = new DataSet();
      dataSet.registerParser('array', arrayParser);
      return new DataView(dataSet).parse(resultData, { type: 'array' });
    }
    return this._relativeSeries.getViewData();
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
        this._markerComponent.on('*', (event: any, type: string) => {
          this._delegateEvent(
            this._markerComponent as unknown as IGraphic,
            event,
            type,
            null,
            this.getMarkerData.bind(this)
          );
        });
      }
      this._markerLayout();
    }

    super.updateLayoutAttribute();
  }

  private _getSeriesByIdOrIndex(seriesUserId: StringOrNumber, seriesIndex: number) {
    let series: IMarkerSupportSeries;
    series = this._option.getSeriesInUserIdOrIndex(isValid(seriesUserId) ? [seriesUserId] : [], [
      seriesIndex
    ])?.[0] as IMarkerSupportSeries;
    if (!series) {
      series = this._relativeSeries ?? this._getFirstSeries();
    }
    return series;
  }

  protected _bindSeries() {
    const spec: any = this._spec;
    this._relativeSeries = this._getSeriesByIdOrIndex(spec.relativeSeriesId, spec.relativeSeriesIndex);
    this._startRelativeSeries = this._getSeriesByIdOrIndex(spec.startRelativeSeriesId, spec.startRelativeSeriesIndex);
    this._endRelativeSeries = this._getSeriesByIdOrIndex(spec.endRelativeSeriesId, spec.endRelativeSeriesIndex);
    if (
      (spec.specifiedDataSeriesIndex && spec.specifiedDataSeriesIndex === 'all') ||
      (spec.specifiedDataSeriesId && spec.specifiedDataSeriesId === 'all')
    ) {
      this._specifiedDataSeries = this._option.getAllSeries() as IMarkerSupportSeries[];
    } else if (spec.specifiedDataSeriesIndex || spec.specifiedDataSeriesId) {
      this._specifiedDataSeries = this._getSeriesByIdOrIndex(spec.specifiedDataSeriesId, spec.specifiedDataSeriesIndex);
    }
  }

  protected initEvent() {
    // 在极坐标系/地理坐标系中, 滚动或缩放画布不会update layout, 所以需要通过事件监听来更新标注的位置
    // 在直角坐标系中, update layout中已经更新标注位置, 在这里不需要重复监听
    if (this._relativeSeries.coordinate !== 'cartesian') {
      this._relativeSeries.event.on('zoom', this._markerLayout.bind(this));
      this._relativeSeries.event.on('panmove', this._markerLayout.bind(this));
      this._relativeSeries.event.on('scroll', this._markerLayout.bind(this));
    }
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
    const firstSeries = getFirstSeries(this._regions) as ICartesianSeries;
    if (firstSeries) {
      this._firstSeries = firstSeries;
      return firstSeries;
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

  _compareSpec(spec: T, prevSpec: T) {
    const result = super._compareSpec(spec, prevSpec);
    if (!isEqual(prevSpec, spec)) {
      result.reRender = true;
      result.reMake = true;
      result.change = true;
    }
    return result;
  }
}
