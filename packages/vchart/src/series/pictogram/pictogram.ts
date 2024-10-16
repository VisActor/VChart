import { DataView } from '@visactor/vdataset';
import { Factory } from '../../core';
import { GeoSeries } from '../geo/geo';
import { SeriesMarkMap, SeriesTypeEnum } from '../interface';
import { IMapSeriesSpec } from '../map/interface';
import { PictogramSeriesMark } from './constant';
import {
  SVGParsedElement,
  SVGParserResult,
  SVGSourceOption,
  getSVGSource,
  registerSVGSource,
  svgSourceMap,
  unregisterSVGSource
} from './svg-source';
import { SeriesData } from '../base/series-data';
import { TransformLevel } from '../../data/initialize';
import { copyDataView } from '../../data/transforms/copy-data-view';
import { lookup } from '../../data/transforms/lookup';
import { DEFAULT_DATA_INDEX } from '../../constant/data';
import { registerDataSetInstanceTransform } from '../../data/register';
import { GroupMark } from '../../mark';
import { IGroupMark } from '../../mark/group';
import { shouldMarkDoMorph } from '../../animation/utils';
import { AttributeLevel } from '../../constant/attribute';
import { PictogramSeriesSpecTransformer } from './pictogram-transformer';
import { isValid } from '@visactor/vutils';
import { Datum } from '../../typings';

const graphicAttributeTransform = {
  group: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      x: parseFloat(attributes.x) || 0,
      y: parseFloat(attributes.y) || 0
    };
  },
  rule: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      x: parseFloat(attributes.x1),
      y: parseFloat(attributes.y1),
      x1: parseFloat(attributes.x2),
      y1: parseFloat(attributes.y2),
      lineWidth: attributes['strokeWidth'] ?? isValid(attributes['stroke']) ? 1 : 0
    };
  },
  rect: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      lineWidth: attributes['strokeWidth'] ?? isValid(attributes['stroke']) ? 1 : 0
    };
  },
  polygon: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      points: attributes.points
        .trim()
        .split(/\s+/)
        .map((pair: string) => {
          const [x, y] = pair.split(',').map(Number);
          return { x, y };
        }),
      lineWidth: attributes['strokeWidth']
    };
  },
  line: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      points: attributes.points
        .trim()
        .split(/\s+/)
        .map((pair: string) => {
          const [x, y] = pair.split(',').map(Number);
          return { x, y };
        }),
      lineWidth: attributes['strokeWidth'] ?? isValid(attributes['stroke']) ? 1 : 0
    };
  },
  path: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      path: attributes.d,
      fill: attributes.fill === 'none' ? false : attributes.fill,
      lineWidth: attributes['strokeWidth'] ?? isValid(attributes['stroke']) ? 1 : 0
    };
  },
  arc: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      lineWidth: attributes['strokeWidth'] ?? isValid(attributes['stroke']) ? 1 : 0,
      outerRadius: attributes.r ?? attributes.ry,
      x: attributes.cx,
      y: attributes.cy,
      startAngle: 0,
      endAngle: Math.PI * 2,
      scaleX: attributes.rx / attributes.ry || 1
    };
  },
  text: (attributes: Record<string, any>, value: string) => {
    return {
      ...attributes,
      text: value,
      fill: attributes['fill'] ?? '#000',
      textAlign: 'center',
      textBaseLine: 'middle',
      anchor: [0, 0],
      lineWidth: attributes['strokeWidth'] ?? isValid(attributes['stroke']) ? 1 : 0
      // pickable: false
    };
  }
};

export class PictogramSeries<T extends IMapSeriesSpec = IMapSeriesSpec> extends GeoSeries<T> {
  static readonly type: string = SeriesTypeEnum.pictogram;
  type = SeriesTypeEnum.pictogram;
  static readonly mark: SeriesMarkMap = PictogramSeriesMark;
  static readonly transformerConstructor = PictogramSeriesSpecTransformer;

  map!: string;

  protected _pictogramMark: GroupMark;
  protected _parsedSvgResult: SVGParserResult;

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this.map = this._spec.map;
    // this._nameMap = this._spec.nameMap;
    this._nameField = this._spec.nameField;
    this._valueField = this._spec.valueField;
    // this._spec.nameProperty && (this._nameProperty = this._spec.nameProperty);
    // this._spec.centroidProperty && (this._centroidProperty = this._spec.centroidProperty);

    if (!this.map) {
      this._option?.onError(`svg source is not specified !`);
    }
    this._parsedSvgResult = getSVGSource(this.map)?.latestData;

    if (!this._parsedSvgResult) {
      this._option?.onError(`'${this.map}' is not registered !`);
    }
  }

  // data

  getDatumCenter(datum: any): [number, number] {
    // TODO
    return [Number.NaN, Number.NaN];
  }

  getDatumName(datum: any): string {
    // TODO
    return '';
  }

  protected initTooltip() {
    super.initTooltip();
  }

  initMark() {
    this._pictogramMark = this._createMark(PictogramSeries.mark.pictogram, {
      morph: shouldMarkDoMorph(this._spec, PictogramSeries.mark.pictogram.name),
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this.getDimensionField()[0],
      isSeriesMark: true,
      skipBeforeLayouted: true,
      dataView: this._mapViewData.getDataView(),
      dataProductId: this._mapViewData.getProductId()
    }) as GroupMark;
    for (const element of this._mapViewData.getDataView().latestData as SVGParserResult['elements']) {
      const { type, name, parent, id } = element;
      // console.log(type, name, id, this._pictogramMark.getMarkInUserId(parent?.id));
      const mark = this._createMark(
        { type, name: id },
        {
          morph: shouldMarkDoMorph(this._spec, PictogramSeries.mark.pictogram.name),
          defaultMorphElementKey: name,
          groupKey: id,
          isSeriesMark: false,
          skipBeforeLayouted: true,
          dataView: this._mapViewData.getDataView(),
          dataProductId: this._mapViewData.getProductId(),
          parent: (this._pictogramMark.getMarkInUserId(parent?.id) as IGroupMark) ?? this._pictogramMark
        }
      );

      if (mark) {
        mark.setUserId(id);
        mark.setTransform([
          {
            type: 'filter',
            callback: (datum: SVGParsedElement) => {
              return datum.id === id;
            }
          }
        ]);
      }
    }
  }

  initMarkStyle() {
    const { root } = this._parsedSvgResult;
    const elements = this._mapViewData.getDataView().latestData as SVGParserResult['elements'];
    if (root) {
      this.setMarkStyle(
        this._pictogramMark,
        graphicAttributeTransform['group'](root.attributes),
        'normal',
        AttributeLevel.Default
      );
      if (root.transform) {
        this.setMarkStyle(
          this._pictogramMark,
          {
            postMatrix: root.transform
          },
          'normal',
          AttributeLevel.Default
        );
      }
    }
    for (const element of elements) {
      const { id, attributes } = element;
      const mark = this._pictogramMark.getMarkInUserId(id);
      if (mark) {
        this.initMarkStyleWithSpec(mark, this._spec.pictogram);
        this.setMarkStyle(mark, attributes, 'normal', AttributeLevel.Series);
        mark.setPostProcess('fill', result => {
          if (!isValid(result)) {
            return this._spec.defaultFillColor ?? element.attributes.fill;
          }
          return result;
        });
      }
    }
  }

  initData() {
    super.initData();
    // 初始化地图数据
    const parsedSvg = svgSourceMap.get(this.map);
    if (!parsedSvg) {
      this._option?.onError('no valid svg found!');
    }

    const svgData = new DataView(this._dataSet, { name: `pictogram_${this.id}_data` });
    registerDataSetInstanceTransform(this._dataSet, 'copyDataView', copyDataView);
    // TODO: move
    registerDataSetInstanceTransform(this._dataSet, 'pictogram', (data: SVGParserResult, opt: SVGSourceOption) => {
      const { elements } = data;
      if (elements) {
        elements.forEach((el, index: number) => {
          el[DEFAULT_DATA_INDEX] = index;
          const { type, transform } = el;
          if (el.id === 'text22819') {
            debugger;
          }
          if (graphicAttributeTransform[type]) {
            el.attributes = graphicAttributeTransform[type](el.attributes, el.value);
          }
          if (transform) {
            el.attributes.postMatrix = transform;
          }
        });
      }
      return elements;
    });
    registerDataSetInstanceTransform(this._dataSet, 'lookup', lookup);

    svgData
      .parse([parsedSvg], {
        type: 'dataview'
      })
      .transform({ type: 'copyDataView', options: { deep: true }, level: TransformLevel.copyDataView })
      .transform({ type: 'pictogram' })
      .transform({
        type: 'lookup',
        options: {
          from: () => this.getViewData().latestData,
          key: 'name',
          fields: this._nameField,
          set: (a: Datum, b: Datum) => {
            a.data = b;
          }
        }
      });
    this._data?.getDataView().target.addListener('change', svgData.reRunAllTransform);
    this._mapViewData = new SeriesData(this._option, svgData);
  }

  getMarkData(datum: Datum) {
    return datum.data ?? {};
  }

  getMeasureField(): string[] {
    return [this.valueField];
  }
}

export const registerPictogramSeries = () => {
  // 注册语法元素
  Factory.registerSeries(PictogramSeries.type, PictogramSeries);
  Factory.registerImplement('registerSVG', registerSVGSource);
  Factory.registerImplement('unregisterSVG', unregisterSVGSource);
  // registerFadeInOutAnimation();
};
