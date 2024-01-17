import { Matrix, isValid, isValidNumber } from '@visactor/vutils';
/* eslint-disable no-duplicate-imports */
import type { FeatureData } from '@visactor/vgrammar-core';
import { registerProjection } from '@visactor/vgrammar-projection';
import { DataView } from '@visactor/vdataset';
import type { IPathMark } from '../../mark/path';
import { geoSourceMap, registerMapSource, unregisterMapSource } from './geo-source';
import { lookup } from '../../data/transforms/lookup';
import type { Maybe, Datum, StringOrNumber } from '../../typings';
import { GeoSeries } from '../geo/geo';
import { DEFAULT_MAP_LOOK_UP_KEY, map } from '../../data/transforms/map';
import { copyDataView } from '../../data/transforms/copy-data-view';
import { registerDataSetInstanceTransform } from '../../data/register';
import { MapSeriesTooltipHelper } from './tooltip-helper';
import { AttributeLevel, DEFAULT_DATA_SERIES_FIELD, DEFAULT_DATA_INDEX } from '../../constant/index';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { IMapSeriesSpec, IMapSeriesTheme } from './interface';
import { SeriesData } from '../base/series-data';
import type { PanEventParam, ZoomEventParam } from '../../event/interface';
import { animationConfig, shouldMarkDoMorph, userAnimationConfig } from '../../animation/utils';
import { registerFadeInOutAnimation } from '../../animation/config';
import { PathMark, registerPathMark } from '../../mark/path';
import { mapSeriesMark } from './constant';
import type { ILabelMark } from '../../mark/label';
import { Factory } from '../../core/factory';
import { registerGeoCoordinate } from '../../component/geo';
import type { IMark } from '../../mark/interface';
import { TransformLevel } from '../../data/initialize';
import { MapSeriesSpecTransformer } from './map-transformer';

export class MapSeries<T extends IMapSeriesSpec = IMapSeriesSpec> extends GeoSeries<T> {
  static readonly type: string = SeriesTypeEnum.map;
  type = SeriesTypeEnum.map;

  static readonly mark: SeriesMarkMap = mapSeriesMark;
  static readonly transformerConstructor = MapSeriesSpecTransformer as any;
  readonly transformerConstructor = MapSeriesSpecTransformer;

  map!: string;

  protected _nameMap!: { [key: StringOrNumber]: StringOrNumber };
  getNameMap() {
    return this._nameMap;
  }

  private _areaCache: Map<string, { shape: string }> = new Map();
  get areaPath() {
    return this._areaCache;
  }

  private _pathMark: IPathMark;
  private _labelMark: ILabelMark;

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this.map = this._spec.map;
    this._nameMap = this._spec.nameMap;
    this._nameField = this._spec.nameField;
    this._valueField = this._spec.valueField;
    this._spec.nameProperty && (this._nameProperty = this._spec.nameProperty);
    this._spec.centroidProperty && (this._centroidProperty = this._spec.centroidProperty);

    if (!this.map) {
      this._option?.onError(`map type '${this.map}' is not specified !`);
    }

    if (!geoSourceMap.get(this.map)) {
      this._option?.onError(`'${this.map}' data is not registered !`);
    }
  }

  // data
  initData(): void {
    super.initData();

    registerDataSetInstanceTransform(this._dataSet, 'copyDataView', copyDataView);
    registerDataSetInstanceTransform(this._dataSet, 'map', map);
    registerDataSetInstanceTransform(this._dataSet, 'lookup', lookup);

    // 初始化地图数据
    const features = geoSourceMap.get(this.map);
    if (!features) {
      this._option?.onError('no valid map data found!');
    }
    const mapData = new DataView(this._dataSet, { name: `map_${this.id}_data` });

    mapData
      .parse([features], {
        type: 'dataview'
      })
      .transform({ type: 'copyDataView', options: { deep: true }, level: TransformLevel.copyDataView })
      .transform({
        type: 'map',
        options: {
          nameMap: this._nameMap,
          nameProperty: this._nameProperty
        }
      })
      .transform({
        type: 'lookup',
        options: {
          from: () => this._data?.getLatestData(),
          key: DEFAULT_MAP_LOOK_UP_KEY,
          fields: this._nameField,
          set: (feature: FeatureData, datum: Datum) => {
            if (datum) {
              Object.keys(datum).forEach(key => {
                if (!(key in feature)) {
                  feature[key] = datum[key];
                }
              });
            }
          }
        }
      });
    this._data?.getDataView().target.addListener('change', mapData.reRunAllTransform);
    this._mapViewData = new SeriesData(this._option, mapData);
  }

  // mark
  initMark() {
    this._pathMark = this._createMark(MapSeries.mark.area, {
      morph: shouldMarkDoMorph(this._spec, MapSeries.mark.area.name),
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this.getDimensionField()[0],
      isSeriesMark: true,
      skipBeforeLayouted: true,
      dataView: this._mapViewData.getDataView(),
      dataProductId: this._mapViewData.getProductId()
    }) as IPathMark;
  }

  initMarkStyle() {
    const pathMark = this._pathMark;
    if (pathMark) {
      this.setMarkStyle(
        pathMark,
        {
          fill: (datum: any) => {
            if (isValid(datum[this._seriesField ?? DEFAULT_DATA_SERIES_FIELD])) {
              return (this._option.globalScale.getScale('color') ?? this._getDefaultColorScale()).scale(
                datum[this._seriesField ?? DEFAULT_DATA_SERIES_FIELD]
              );
            }
            return this._spec?.defaultFillColor;
          },
          path: this.getPath.bind(this)
        },
        'normal',
        AttributeLevel.Series
      );

      pathMark.setPostProcess('fill', result => {
        if (!isValid(result)) {
          return this._spec.defaultFillColor;
        }
        return result;
      });

      this.setMarkStyle(
        pathMark,
        {
          smoothScale: true
        },
        'normal',
        AttributeLevel.Built_In
      );
      this._trigger.registerMark(pathMark);
    }
  }

  initLabelMarkStyle(labelMark: ILabelMark) {
    if (!labelMark) {
      return;
    }
    this._labelMark = labelMark;
    this.setMarkStyle(labelMark, {
      text: (datum: Datum) => {
        const text = this.getDatumName(datum);
        return text;
      },
      x: (datum: Datum) => this.dataToPosition(datum)?.x,
      y: (datum: Datum) => this.dataToPosition(datum)?.y
    });
  }

  initAnimation() {
    this._pathMark.setAnimationConfig(
      animationConfig(
        Factory.getAnimationInKey('fadeInOut')?.(),
        userAnimationConfig(SeriesMarkNameEnum.area, this._spec, this._markAttributeContext)
      )
    );
  }

  protected initTooltip() {
    this._tooltipHelper = new MapSeriesTooltipHelper(this);
    this._pathMark && this._tooltipHelper.activeTriggerSet.mark.add(this._pathMark);
  }

  protected getPath(datum: any) {
    const area = this._areaCache.get(datum[DEFAULT_DATA_INDEX]);
    if (area) {
      return area.shape;
    }
    const shape = this._coordinateHelper?.shape(datum);
    this._areaCache.set(datum[DEFAULT_DATA_INDEX], {
      shape
    });
    return shape;
  }

  // life cycle
  onEvaluateEnd() {
    this._mapViewData.updateData();
  }

  getDimensionField(): string[] {
    return [this.nameField];
  }

  getMeasureField(): string[] {
    return [this.valueField];
  }

  release() {
    super.release();
    this._areaCache.clear();
    this._nameMap = {};
    this._trigger = this._mapViewData = null as any;
  }

  handleZoom(e: ZoomEventParam) {
    const { scale, scaleCenter } = e;
    if (scale === 1) {
      return;
    }

    const pathGroup = this.getRootMark().getProduct()?.getGroupGraphicItem();
    if (pathGroup) {
      if (!pathGroup.attribute.postMatrix) {
        pathGroup.setAttributes({
          postMatrix: new Matrix()
        });
      }
      pathGroup.scale(scale, scale, scaleCenter);
    }
    const vgrammarLabel = this._labelMark?.getComponent()?.getProduct();

    if (vgrammarLabel) {
      (vgrammarLabel as any).evaluate(null, null);
    }
  }

  handlePan(e: PanEventParam) {
    const { delta } = e;
    if (delta[0] === 0 && delta[1] === 0) {
      return;
    }
    const pathGroup = this.getRootMark().getProduct()?.getGroupGraphicItem();
    if (pathGroup) {
      if (!pathGroup.attribute.postMatrix) {
        pathGroup.setAttributes({
          postMatrix: new Matrix()
        });
      }
      pathGroup.translate(delta[0], delta[1]);
    }
    const vgrammarLabel = this._labelMark?.getComponent()?.getProduct();

    if (vgrammarLabel) {
      (vgrammarLabel as any).evaluate(null, null);
    }
  }

  getDatumCenter(datum: any): [number, number] {
    if (this._centroidProperty && datum.properties?.[this._centroidProperty]) {
      return datum.properties?.[this._centroidProperty];
    }

    if (isValidNumber(datum.centroidX * datum.centroidY)) {
      return [datum.centroidX, datum.centroidY];
    }

    if (datum.properties?.center) {
      return datum.properties.center;
    }

    if (datum.properties?.centroid) {
      return datum.properties.centroid;
    }

    return [Number.NaN, Number.NaN];
  }

  getDatumName(datum: any): string {
    if (datum[this.nameField]) {
      return datum[this.nameField];
    }
    if (datum.properties?.[this._nameProperty]) {
      if (this._spec?.nameMap) {
        return this._spec.nameMap[datum.properties[this._nameProperty]] ?? '';
      }
      return datum.properties[this._nameProperty] ?? '';
    }
    return '';
  }

  dataToPositionX(data: any): number {
    this._option?.onError('Method not implemented.');
    return 0;
  }
  dataToPositionY(data: any): number {
    this._option?.onError('Method not implemented.');
    return 0;
  }

  viewDataUpdate(d: DataView): void {
    super.viewDataUpdate(d);
    this._mapViewData?.getDataView()?.reRunAllTransform();
    this._mapViewData?.updateData();
  }

  protected _getDataIdKey() {
    return DEFAULT_DATA_INDEX;
  }

  getActiveMarks(): IMark[] {
    return [this._pathMark];
  }
}

export const registerMapSeries = () => {
  // 注册语法元素
  registerProjection();
  registerGeoCoordinate();
  registerPathMark();
  Factory.registerSeries(MapSeries.type, MapSeries);
  Factory.registerImplement('registerMap', registerMapSource);
  Factory.registerImplement('unregisterMap', unregisterMapSource);
  registerFadeInOutAnimation();
};
