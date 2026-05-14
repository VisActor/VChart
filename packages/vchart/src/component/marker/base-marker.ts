import { DataSet, DataView } from '@visactor/vdataset';
import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { array, isValid, isNil, isString, isEqual } from '@visactor/vutils';
import type { IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { ICartesianSeries } from '../../series/interface';
import type { CoordinateType, ILayoutRect, ILayoutType, IRect, StringOrNumber } from '../../typings';
import { BaseComponent } from '../base/base-component';
import type {
  IAggrType,
  IDataPos,
  IDataPosCallback,
  IMarkerAttributeContext,
  IMarkerSpec,
  IMarkerSupportSeries,
  IMarkProcessOptions
} from './interface';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
import { calcLayoutNumber } from '../../util/space';
import { isAggrSpec } from './utils';
import { getFirstSeries } from '../../util';
import { arrayParser } from '../../data/parser/array';
import { getSpecInfo } from '../util';
import type { IOptionWithCoordinates } from '../../data/transforms/interface';
import { registerDataSetInstanceTransform } from '../../data/register';
import { markerAggregation } from '../../data/transforms/aggregation';
import { markerFilter } from '../../data/transforms/marker-filter';
import { releaseDataViewWithDependencies } from '../../data/data-view-utils';

const MARKER_FORMAT_METHOD_PLACEHOLDER = '__vchart_marker_format_method__';

const normalizeMarkerLabelFormatMethod = (label: any): any => {
  if (Array.isArray(label)) {
    return label.map(normalizeMarkerLabelFormatMethod);
  }
  if (!label || typeof label !== 'object') {
    return label;
  }
  if (typeof label.formatMethod !== 'function') {
    return label;
  }
  return {
    ...label,
    formatMethod: MARKER_FORMAT_METHOD_PLACEHOLDER
  };
};

const normalizeMarkerSpecLabelFormatMethod = (spec: any) => {
  if (!spec || typeof spec !== 'object') {
    return spec;
  }

  const normalized = { ...spec };
  if ('label' in normalized) {
    normalized.label = normalizeMarkerLabelFormatMethod(normalized.label);
  }

  const text = normalized.itemContent?.text;
  if (text && typeof text === 'object') {
    normalized.itemContent = {
      ...normalized.itemContent,
      text: normalizeMarkerLabelFormatMethod(text)
    };
  }

  return normalized;
};

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
  private _markerDataChangeHandler: (() => void) | null = null;
  private _markerDataOwned: boolean = false;
  // marker 组件
  protected _markerComponent!: any;

  protected _layoutOffsetX: number = 0;
  protected _layoutOffsetY: number = 0;

  private _firstSeries: ICartesianSeries;

  protected abstract _initDataView(): void;
  protected abstract _createMarkerComponent(): IGroup;
  protected abstract _markerLayout(): void;
  protected abstract _computeOptions(): IMarkProcessOptions;
  // 该方法需要子组件复写
  static _getMarkerCoordinateType(markerSpec: any): string {
    return 'cartesian';
  }

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    return getSpecInfo<IMarkerSpec>(chartSpec, this.specKey, this.type, (s: IMarkerSpec) => {
      return s.visible !== false && this._getMarkerCoordinateType(s) === this.coordinateType;
    });
  }

  protected _markAttributeContext: IMarkerAttributeContext;
  getMarkAttributeContext() {
    return this._markAttributeContext;
  }

  protected _buildMarkerAttributeContext() {
    this._markAttributeContext = {
      relativeSeries: this._relativeSeries,
      startRelativeSeries: this._startRelativeSeries,
      endRelativeSeries: this._endRelativeSeries,
      vchart: this._option.globalInstance
    };
  }

  created() {
    super.created();
    this._bindSeries();
    this._initDataView();
    this.initEvent();
    this._buildMarkerAttributeContext();
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

  protected _setMarkerData(data: DataView, owned: boolean = false) {
    this._releaseMarkerData();
    this._markerData = data;
    this._markerDataOwned = owned;
  }

  protected _bindMarkerDataChange() {
    if (!this._markerData?.target) {
      return;
    }

    this._markerDataChangeHandler = () => {
      this._markerLayout();
    };
    this._markerData.target.on('change', this._markerDataChangeHandler);
  }

  private _releaseMarkerData() {
    const markerData = this._markerData;

    if (markerData?.target && this._markerDataChangeHandler) {
      markerData.target.removeListener('change', this._markerDataChangeHandler);
    }
    this._markerDataChangeHandler = null;

    if (this._markerDataOwned) {
      releaseDataViewWithDependencies(markerData, dataView => dataView.name === `${this.type}_${this.id}_data`);
    }
    this._markerData = null as unknown as DataView;
    this._markerDataOwned = false;
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

  clear(): void {
    super.clear();
    this._markerComponent = null;
    this._firstSeries = null;
  }

  release(): void {
    this._releaseMarkerData();
    super.release();
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

  onLayoutStart(layoutRect: IRect, chartViewRect: ILayoutRect): void {
    // offset
    if (!isNil(this._spec.offsetX)) {
      this._layoutOffsetX = calcLayoutNumber(this._spec.offsetX, chartViewRect.width, chartViewRect);
    }
    if (!isNil(this._spec.offsetY)) {
      this._layoutOffsetY = calcLayoutNumber(this._spec.offsetY, chartViewRect.height, chartViewRect);
    }
    super.onLayoutStart(layoutRect, chartViewRect);
  }

  _compareSpec(spec: T, prevSpec: T) {
    const result = super._compareSpec(spec, prevSpec);
    if (!isEqual(prevSpec, spec)) {
      result.reRender = true;
      result.change = true;
      if (!result.reMake && !result.reCompile && this._isComponentOnlySpecChange(spec, prevSpec)) {
        result.effects = {
          ...result.effects,
          component: true,
          layout: true,
          render: true
        };
      } else {
        result.reMake = true;
      }
    }
    return result;
  }

  protected _isComponentOnlySpecChange(spec: T, prevSpec: T) {
    return isEqual(normalizeMarkerSpecLabelFormatMethod(prevSpec), normalizeMarkerSpecLabelFormatMethod(spec));
  }

  reInit(spec?: T) {
    super.reInit(spec);
    if (this._markerComponent && this._markerData) {
      this._markerLayout();
    }
  }

  _initCommonDataView() {
    const { options } = this._computeOptions();

    const seriesData = this._getRelativeDataView();
    registerDataSetInstanceTransform(this._option.dataSet, 'markerAggregation', markerAggregation);
    registerDataSetInstanceTransform(this._option.dataSet, 'markerFilter', markerFilter);
    const data = new DataView(this._option.dataSet, { name: `${this.type}_${this.id}_data` });
    data.parse([seriesData], {
      type: 'dataview'
    });
    data.transform({
      type: 'markerAggregation',
      options
    });

    data.transform({
      type: 'markerFilter',
      options: this._getAllRelativeSeries()
    });

    this._setMarkerData(data, true);
    this._bindMarkerDataChange();
  }
}
