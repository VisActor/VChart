import { DataSet, DataView } from '@visactor/vdataset';
import { array, isValid, isNil, isString, Maybe, isEmpty, isArray } from '@visactor/vutils';
import type { IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { ICartesianSeries, IGeoSeries, IPolarSeries, ISeries } from '../../series/interface';
import type { CoordinateType, ILayoutRect, ILayoutType, IRect, StringOrNumber } from '../../typings';
import { BaseComponent } from '../base/base-component';
import type {
  IAggrType,
  ICoordinateOption,
  IDataPointSpec,
  IDataPos,
  IDataPosCallback,
  IMarkerSpec,
  IMarkerSupportSeries
} from './interface';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
import { calcLayoutNumber } from '../../util/space';
import { isAggrSpec } from './utils';
import { getFirstSeries } from '../../util';
import { arrayParser } from '../../data/parser/array';

export abstract class BaseMarker<T extends IMarkerSpec> extends BaseComponent<T> {
  layoutType: ILayoutType | 'none' = 'none';

  // 下面三个属性需要子组件复写
  static specKey: string;
  static type: string;
  static coordinateType: string;
  coordinateType: string;

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
    markerSpec.forEach((m: any, i: number) => {
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
    dim: 'x' | 'y' | 'angle' | 'radius' | 'name',
    spec: IDataPos | IDataPosCallback,
    relativeSeries: IMarkerSupportSeries
  ) {
    let field;
    switch (dim) {
      case 'x':
        field = relativeSeries.getSpec().xField;
        break;
      case 'y':
        field = relativeSeries.getSpec().yField;
        break;
      case 'radius':
        field = relativeSeries.getSpec().valueField;
        break;
      case 'angle':
        field = relativeSeries.getSpec().categoryField;
        break;
      case 'name':
        field = relativeSeries.getSpec().nameField;
        break;
      default:
        field = relativeSeries.getSpec().yField;
    }

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

  protected _processSpecAngle(specAngle: IDataPos | IDataPosCallback) {
    const relativeSeries = this._relativeSeries;
    return {
      angle: this._getFieldInfoFromSpec('angle', specAngle, relativeSeries),
      ...this._getAllRelativeSeries()
    };
  }

  protected _processSpecRadius(specRadius: IDataPos | IDataPosCallback) {
    const relativeSeries = this._relativeSeries;
    return {
      radius: this._getFieldInfoFromSpec('radius', specRadius, relativeSeries),
      ...this._getAllRelativeSeries()
    };
  }

  protected _processSpecAngRad(specAngle: IDataPos | IDataPosCallback, specRadius: IDataPos | IDataPosCallback) {
    const relativeSeries = this._relativeSeries;
    return {
      angle: this._getFieldInfoFromSpec('angle', specAngle, relativeSeries),
      radius: this._getFieldInfoFromSpec('radius', specRadius, relativeSeries),
      ...this._getAllRelativeSeries()
    };
  }

  protected _processSpecName(specName: IDataPos | IDataPosCallback) {
    const relativeSeries = this._relativeSeries;
    return {
      name: this._getFieldInfoFromSpec('name', specName, relativeSeries),
      ...this._getAllRelativeSeries()
    };
  }

  protected _processSpecCoo(spec: any) {
    const coordinates = spec.coordinates ?? array(spec.coordinate);
    let option: ICoordinateOption;
    return coordinates.map((coordinate: IDataPointSpec) => {
      const refRelativeSeries = this._getSeriesByIdOrIndex(
        coordinate.refRelativeSeriesId,
        coordinate.refRelativeSeriesIndex
      );

      if (this.coordinateType === 'cartesian') {
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

        option = {
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
      } else if (this.coordinateType === 'polar') {
        const { valueField: radiusField, categoryField: angleField } = refRelativeSeries.getSpec();
        const { angleFieldDim, angleFieldIndex } = coordinate;
        let bindAngleField = angleField;
        if (isValid(angleFieldIndex)) {
          bindAngleField = array(angleField)[angleFieldIndex];
        }
        if (angleFieldDim && array(angleField).includes(angleFieldDim)) {
          bindAngleField = angleFieldDim;
        }

        const bindRadiusField = radiusField;

        option = {
          angle: undefined,
          radius: undefined,
          ...this._getAllRelativeSeries()
        };

        if (isString(coordinate[bindAngleField]) && isAggrSpec(coordinate[bindAngleField] as IDataPos)) {
          option.angle = { field: bindAngleField, aggrType: coordinate[bindAngleField] as IAggrType };
        } else {
          option.angle = array(bindAngleField).map(field => coordinate[field]);
        }

        if (isString(coordinate[bindRadiusField]) && isAggrSpec(coordinate[bindRadiusField] as IDataPos)) {
          option.radius = { field: bindRadiusField, aggrType: coordinate[bindRadiusField] as IAggrType };
        } else {
          option.radius = array(bindRadiusField).map(field => coordinate[field]);
        }
      }

      option.getRefRelativeSeries = () => refRelativeSeries;
      return option;
    });
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
}
