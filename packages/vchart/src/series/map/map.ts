/* eslint-disable no-duplicate-imports */
import { MarkTypeEnum } from '../../mark/interface';
import { registerGrammar } from '@visactor/vgrammar';
import type { IElement } from '@visactor/vgrammar';
import type { FeatureData } from '@visactor/vgrammar-projection';
import { Projection } from '@visactor/vgrammar-projection';
import { DataView } from '@visactor/vdataset';
import type { IPathMark } from '../../mark/path';
import { geoSourceMap } from './geo-source';
import { lookup } from '../../data/transforms/lookup';
import type { Maybe, Datum, StringOrNumber } from '../../typings';
import { isValid, isValidNumber, merge } from '../../util';
import { GeoSeries } from '../geo/geo';
import { DEFAULT_MAP_LOOK_UP_KEY, map } from '../../data/transforms/map';
import { copyDataView } from '../../data/transforms/copy-data-view';
import { registerDataSetInstanceTransform } from '../../data/register';
import { MapSeriesTooltipHelper } from './tooltip-helper';
import type { ITextMark } from '../../mark/text';
import { AttributeLevel, DEFAULT_DATA_SERIES_FIELD, DEFAULT_DATA_KEY, DEFAULT_DATA_INDEX } from '../../constant/index';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface';
import type { IMapSeriesSpec, IMapSeriesTheme } from './interface';
import { SeriesData } from '../base/series-data';
import type { PanEventParam, ZoomEventParam } from '../../event/interface';
import { animationConfig, shouldDoMorph, userAnimationConfig } from '../../animation/utils';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import { BaseSeries } from '../base/base-series';
import { VChart } from '../../core/vchart';
import { PathMark } from '../../mark/path';
import { TextMark } from '../../mark/text';

VChart.useMark([PathMark, TextMark]);

// 注册语法元素
registerGrammar('projection', Projection, 'projections');

export class MapSeries extends GeoSeries<IMapSeriesSpec> {
  static readonly type: string = SeriesTypeEnum.map;
  type = SeriesTypeEnum.map;

  static readonly mark: SeriesMarkMap = {
    ...BaseSeries.mark,
    [SeriesMarkNameEnum.area]: { name: SeriesMarkNameEnum.area, type: MarkTypeEnum.path }
  };

  map!: string;

  protected _nameMap!: { [key: StringOrNumber]: StringOrNumber };
  getNameMap() {
    return this._nameMap;
  }

  protected declare _theme: Maybe<IMapSeriesTheme>;

  private _areaCache: Map<string, { shape: string }> = new Map();

  private _pathMark: IPathMark;
  private _labelMark: ITextMark;

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this.map = this._spec.map;
    this._nameMap = this._spec.nameMap;
    this._nameField = this._spec.nameField;
    this._valueField = this._spec.valueField;
    this._spec.nameProperty && (this._nameProperty = this._spec.nameProperty);
    if (!this.map) {
      this._option.onError(`map type '${this.map}' is not specified !`);
    }

    if (!geoSourceMap.get(this.map)) {
      this._option.onError(`'${this.map}' data is not registered !`);
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
      this._option.onError('no valid map data found!');
    }
    const mapData = new DataView(this._dataSet);

    mapData
      .parse([features], {
        type: 'dataview'
      })
      .transform({ type: 'copyDataView', options: { deep: true } })
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
      morph: shouldDoMorph(this._spec.animation, this._spec.morph, userAnimationConfig('area', this._spec)),
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this.getDimensionField()[0],
      isSeriesMark: true,
      skipBeforeLayouted: true,
      dataView: this._mapViewData.getDataView(),
      dataProductId: this._mapViewData.getProductId(),
      label: merge({ animation: this._spec.animation }, this._spec.label)
    }) as IPathMark;

    // if (this._spec.label?.visible) {
    //   this._labelMark = this._createMark(MapSeries.mark.label, {
    //     // map zoom/scale need to be transformed in path.group
    //     // so label mark cannot be in the same groupMark
    //     parent: this.getRegion().getGroupMark(),
    //     skipBeforeLayouted: true,
    //     dataView: this._mapViewData.getDataView(),
    //     dataProductId: this._mapViewData.getProductId()
    //   }) as ITextMark;
    // }
  }

  initMarkStyle() {
    const pathMark = this._pathMark;
    if (pathMark) {
      this.setMarkStyle(
        pathMark,
        {
          fill: (datum: any) => {
            if (isValid(datum[this._seriesField ?? DEFAULT_DATA_SERIES_FIELD])) {
              return (this._option.globalScale.getScale('color') ?? this.getDefaultColorScale()).scale(
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
      this._tooltipHelper?.activeTriggerSet.mark.add(pathMark);
    }
  }

  initLabelMarkStyle(labelMark?: ITextMark) {
    if (!labelMark) {
      return;
    }
    this.setMarkStyle(labelMark, {
      text: (datum: Datum) => {
        return this._getDatumName(datum);
      },
      x: (datum: Datum) => this.dataToPosition(datum)?.x,
      y: (datum: Datum) => this.dataToPosition(datum)?.y
    });
  }

  initAnimation() {
    this._pathMark.setAnimationConfig(
      animationConfig(DEFAULT_MARK_ANIMATION.path(), userAnimationConfig(SeriesMarkNameEnum.area, this._spec))
    );

    if (this._labelMark) {
      this._labelMark.setAnimationConfig(
        animationConfig(DEFAULT_MARK_ANIMATION.label(), userAnimationConfig(SeriesMarkNameEnum.label, this._spec))
      );
    }
  }

  protected initTooltip() {
    this._tooltipHelper = new MapSeriesTooltipHelper(this);
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

  updateSpec(spec: any) {
    const originalSpec = this._originalSpec;
    const { map, nameMap, valueField, nameProperty } = originalSpec;
    const result = super.updateSpec(spec);
    if (
      spec?.map !== map ||
      spec?.nameMap !== nameMap ||
      spec?.valueField !== valueField ||
      spec?.nameProperty !== nameProperty
    ) {
      result.change = true;
      result.reRender = true;
      result.reMake = true;
    }
    return result;
  }

  handleZoom(e: ZoomEventParam) {
    const { scale, scaleCenter } = e;
    if (scale === 1) {
      return;
    }

    this.getMarksWithoutRoot().forEach(mark => {
      const vGrammarMark = mark.getProduct();

      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const elements = vGrammarMark.elements;

      if (mark.type === MarkTypeEnum.path) {
        vGrammarMark.group.getGroupGraphicItem().scale(scale, scale, scaleCenter);
      } else {
        // label Mark 的定位，需要通过 dataToPosition 来计算
        elements.forEach((el: IElement) => {
          const graphicItem = el.getGraphicItem();
          const datum = el.getDatum();
          const newPosition = this.dataToPosition(datum);
          if (newPosition && graphicItem) {
            graphicItem.translateTo(newPosition.x, newPosition.y);
          }
        });
      }
    });
  }

  handlePan(e: PanEventParam) {
    const { delta } = e;
    if (delta[0] === 0 && delta[1] === 0) {
      return;
    }

    this.getMarksWithoutRoot().forEach(mark => {
      const vGrammarMark = mark.getProduct();

      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const elements = vGrammarMark.elements;

      if (mark.type === MarkTypeEnum.path) {
        vGrammarMark.group.getGroupGraphicItem().translate(delta[0], delta[1]);
      } else {
        // label Mark 的定位，需要通过 dataToPosition 来计算
        elements.forEach((el: IElement, i: number) => {
          const graphicItem = el.getGraphicItem();
          const datum = el.getDatum();
          const newPosition = this.dataToPosition(datum);
          if (newPosition && graphicItem) {
            graphicItem.translateTo(newPosition.x, newPosition.y);
          }
        });
      }
    });
  }

  protected _getDatumCenter(datum: any): [number, number] {
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

  protected _getDatumName(datum: any): string {
    if (datum[this.nameField]) {
      return datum[this.nameField];
    }
    if (datum.properties?.[this._nameProperty]) {
      if (this._spec.nameMap) {
        return this._spec.nameMap[datum.properties[this._nameProperty]] ?? '';
      }
      return datum.properties[this._nameProperty] ?? '';
    }
    return '';
  }

  dataToPositionX(data: any): number {
    this._option.onError('Method not implemented.');
    return 0;
  }
  dataToPositionY(data: any): number {
    this._option.onError('Method not implemented.');
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
}
