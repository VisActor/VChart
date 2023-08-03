import type { IGeoCoordinateHelper } from '../../component/geo/interface';
import type { IPoint } from '../../typings';
import type { IGeoSeries } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import { BaseSeries } from '../base/base-series';
import { isNil } from '../../util';
import type { SeriesData } from '../base/series-data';
import type { DataView } from '@visactor/vdataset';
import { PREFIX } from '../../constant';
import type { IGeoSeriesSpec } from './interface';

export abstract class GeoSeries<T extends IGeoSeriesSpec = IGeoSeriesSpec> extends BaseSeries<T> implements IGeoSeries {
  type = SeriesTypeEnum.geo;
  readonly coordinate = 'geo';

  protected _mapViewData: SeriesData;
  getMapViewData() {
    return this._mapViewData?.getDataView();
  }

  protected _mapViewDataStatistics!: DataView;

  _nameField!: string;
  get nameField() {
    return this._nameField;
  }
  set nameField(f: string) {
    this._nameField = f;
  }

  _valueField!: string;
  get valueField() {
    return this._valueField;
  }
  set valueField(f: string) {
    this._valueField = f;
  }

  _coordinateHelper!: IGeoCoordinateHelper;
  getCoordinateHelper() {
    return this._coordinateHelper;
  }
  setCoordinateHelper(h: IGeoCoordinateHelper) {
    this._coordinateHelper = h;
  }

  getStatisticFields() {
    const fields: { key: string; operations: Array<'max' | 'min' | 'values'> }[] = [];
    fields.push({ key: this._nameField, operations: ['values'] });
    fields.push({ key: this._valueField, operations: ['max', 'min'] });
    return fields;
  }

  getGroupFields(): string[] {
    return null;
  }

  // position
  dataToPosition(datum: any): IPoint | null {
    let result: IPoint | null = null;

    if (!datum) {
      return result;
    }
    const { dataToPosition, latitudeField, longitudeField } = this._coordinateHelper;

    // 从地理数据映射中获取
    result = this.nameToPosition(datum);

    // 从用户传入的经纬度获取
    if (result === null) {
      const lonValue = longitudeField ? datum?.[longitudeField] : Number.NaN;
      const latValue = latitudeField ? datum?.[latitudeField] : Number.NaN;
      result = dataToPosition?.([lonValue, latValue]) ?? null;
    }

    return result;
  }

  protected nameToPosition(datum: any): IPoint | null {
    const name = this._getDatumName(datum);
    if (isNil(name)) {
      return null;
    }

    const mapData = this.getMapViewData()?.latestData?.filter((data: any) => this._getDatumName(data) === name)[0];
    if (isNil(mapData)) {
      return null;
    }

    const { dataToPosition } = this._coordinateHelper;
    const center = this._getDatumCenter(mapData);

    const pos = dataToPosition?.(center);
    if (isNil(pos) || isNaN(pos.x) || isNaN(pos.y)) {
      return null;
    }
    return pos;
  }

  protected abstract _getDatumCenter(datum: any): [number, number];
  protected abstract _getDatumName(datum: any): string;

  dataToLatitude(latValue: number) {
    if (!this._coordinateHelper) {
      return Number.NaN;
    }
    const { dataToLatitude } = this._coordinateHelper;
    return dataToLatitude(latValue);
  }

  dataToLongitude(lonValue: number) {
    if (!this._coordinateHelper) {
      return Number.NaN;
    }
    const { dataToLatitude } = this._coordinateHelper;
    return dataToLatitude(lonValue);
  }

  valueToPosition(lonValue: number, latValue: number): IPoint {
    return {
      x: this.dataToLongitude(lonValue),
      y: this.dataToLatitude(latValue)
    };
  }

  positionToData(p: IPoint) {
    // TODO
  }
  latitudeToData(lat: number) {
    // TODO
  }
  longitudeToData(lon: number) {
    // TODO
  }

  dataToPositionX(data: any): number {
    throw new Error('Method not implemented.');
  }
  dataToPositionY(data: any): number {
    throw new Error('Method not implemented.');
  }
  dataToPositionZ(data: any): number {
    throw new Error('Method not implemented.');
  }

  release() {
    super.release();
    this._mapViewData.release();
    this._mapViewData = this._mapViewDataStatistics = null;
  }

  // TODO: geo 不支持 stack，这些方法没有意义
  getStackGroupFields() {
    return [this._nameField];
  }

  getStackValueField() {
    // TODO: hack
    return this._spec.valueField;
  }

  setValueFieldToStack(): void {
    // do nothing
  }

  setValueFieldToPercent(): void {
    //do nothing
  }

  setValueFieldToStackOffsetSilhouette(): void {
    // do nothing
  }

  compileData() {
    this._mapViewData?.compile();
  }

  protected initStatisticalData(): void {
    super.initStatisticalData();
    if (this._mapViewData) {
      const viewDataName = `${PREFIX}_series_${this.id}_mapViewDataStatic`;
      this._mapViewDataStatistics = this.createStatisticalData(viewDataName, this._mapViewData.getDataView());
      this._mapViewData.getDataView().target.removeListener('change', this._mapViewDataStatistics.reRunAllTransform);
    }
  }

  /** seriesField */
  getSeriesKeys(): string[] {
    if (this._seriesField) {
      return (
        this._mapViewDataStatistics?.latestData[this._seriesField]?.values ??
        this._rawDataStatistics?.latestData[this._seriesField].values ??
        []
      );
    }
    if (this.name) {
      return [this.name];
    }
    if (this.userId) {
      return [`${this.userId}`];
    }
    return [`${this.type}_${this.id}`];
  }

  fillData() {
    super.fillData();
    this._mapViewData.getDataView()?.reRunAllTransform();
    this._mapViewDataStatistics?.reRunAllTransform();
  }
}
