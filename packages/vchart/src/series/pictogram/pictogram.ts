import { DataView } from '@visactor/vdataset';
import { Factory, PanEventParam, ZoomEventParam } from '../../core';
import { GeoSeries } from '../geo/geo';
import { ISeriesSeriesInfo, SeriesMarkMap, SeriesTypeEnum } from '../interface';
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
import { Matrix, isValid, merge } from '@visactor/vutils';
import { Datum } from '../../typings';
import { createRect } from '@visactor/vrender-core';
import type { Group } from '@visactor/vrender-core';
import { measureText } from '../../util';
import { VGRAMMAR_HOOK_EVENT } from '../../constant/event';
import { IHoverSpec, ISelectSpec } from '../../interaction/interface';
import { STATE_VALUE_ENUM } from '../../compile/mark';
import {
  EventType,
  registerElementHighlightByGraphicName,
  registerElementSelectByGraphicName
} from '@visactor/vgrammar-core';
import { IMark } from '../../mark/interface';
import { PictogramSeriesTooltipHelper } from './tooltip-helper';

const graphicAttributeTransform = {
  group: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      x: parseFloat(attributes.x) || 0,
      y: parseFloat(attributes.y) || 0,
      fill: attributes['fill'] === 'none' ? false : attributes.fill
    };
  },
  rule: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      x: parseFloat(attributes.x1),
      y: parseFloat(attributes.y1),
      x1: parseFloat(attributes.x2),
      y1: parseFloat(attributes.y2),
      fill: attributes['fill'] === 'none' ? false : attributes.fill,
      lineWidth: attributes['strokeWidth'] ?? (isValid(attributes['stroke']) && attributes['stroke'] !== 'none' ? 1 : 0)
    };
  },
  rect: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      // rect 在 chrome 下有默认黑色填充，这里保持效果一致
      fill:
        (attributes['fill'] === 'none' ? false : attributes.fill?.includes('url') ? '#000' : attributes.fill) ?? '#000',
      stroke: attributes.stroke?.includes('url') ? false : attributes.stroke,
      lineWidth: attributes['strokeWidth'] ?? (isValid(attributes['stroke']) && attributes['stroke'] !== 'none' ? 1 : 0)
    };
  },
  polygon: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      // rect 在 chrome 下有默认黑色填充，这里保持效果一致
      fill: (attributes['fill'] === 'none' ? false : attributes.fill) ?? '#000',
      points: attributes.points
        .trim()
        .split(/\s+/)
        .map((pair: string) => {
          const [x, y] = pair.split(',').map(Number);
          return { x, y };
        }),
      lineWidth: attributes['strokeWidth'] ?? (isValid(attributes['stroke']) && attributes['stroke'] !== 'none' ? 1 : 0)
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
      fill: attributes['fill'] === 'none' ? false : attributes.fill,
      lineWidth: attributes['strokeWidth'] ?? (isValid(attributes['stroke']) && attributes['stroke'] !== 'none' ? 1 : 0)
    };
  },
  path: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      path: attributes.d,
      fill: attributes.fill === 'none' ? false : attributes.fill,
      stroke: attributes.stroke?.includes('url') ? false : attributes.stroke,
      lineWidth:
        attributes['strokeWidth'] ?? (isValid(attributes['stroke']) && attributes['stroke'] !== 'none' ? 1 : 0),
      fillStrokeOrder: 1
    };
  },
  arc: (attributes: Record<string, any>) => {
    return {
      ...attributes,
      fill: attributes['fill'] === 'none' ? false : attributes.fill,
      lineWidth:
        attributes['strokeWidth'] ?? (isValid(attributes['stroke']) && attributes['stroke'] !== 'none' ? 1 : 0),
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
      fill: (attributes['fill'] === 'none' ? false : attributes.fill) ?? '#000',
      textAlign: attributes.textAlign ?? 'left',
      textBaseLine: attributes.textAnchor ?? 'middle',
      anchor: [0, 0],
      lineWidth: attributes['strokeWidth'] ?? (isValid(attributes['stroke']) && attributes['stroke'] !== 'none' ? 1 : 0)
    };
  }
};

interface SVGParsedElementExtend extends SVGParsedElement {
  _finalAttributes: Record<string, any>;
}

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

  getDatumCenter(datum: SVGParsedElementExtend): [number, number] {
    return [Number.NaN, Number.NaN];
  }

  getDatumName(datum: SVGParsedElementExtend): string {
    return datum.name || datum._nameFromParent;
  }

  getMarksWithoutRoot(): IMark[] {
    return this.getMarks().filter(
      m => m.name && !m.name.includes('seriesGroup') && !m.name.includes('root') && m !== this._pictogramMark
    );
  }

  protected _defaultHoverConfig(selector: string[], finalHoverSpec: IHoverSpec) {
    return {
      seriesId: this.id,
      regionId: this._region.id,
      selector,
      type: 'element-highlight-by-graphic-name',
      trigger: finalHoverSpec.trigger as EventType,
      // triggerOff: finalHoverSpec.triggerOff as EventType,
      triggerOff: 'pointerout' as EventType, // FIXME: 默认为什么是 view: pointerleave
      blurState: STATE_VALUE_ENUM.STATE_HOVER_REVERSE,
      highlightState: STATE_VALUE_ENUM.STATE_HOVER
    };
  }

  protected _defaultSelectConfig(selector: string[], finalSelectSpec: ISelectSpec) {
    const isMultiple = finalSelectSpec.mode === 'multiple';
    const triggerOff = isValid(finalSelectSpec.triggerOff)
      ? finalSelectSpec.triggerOff
      : isMultiple
      ? ['empty']
      : ['empty', finalSelectSpec.trigger];
    return {
      type: 'element-select-by-graphic-name',
      seriesId: this.id,
      regionId: this._region.id,
      selector,
      trigger: finalSelectSpec.trigger as EventType,
      triggerOff: triggerOff as EventType,
      reverseState: STATE_VALUE_ENUM.STATE_SELECTED_REVERSE,
      state: STATE_VALUE_ENUM.STATE_SELECTED,
      isMultiple
    };
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
      const { graphicType: type, name, parent, id, _nameFromParent } = element;
      // console.log(type, name, id, this._pictogramMark.getMarkInUserId(parent?.id));
      const mark = this._createMark(
        { type, name: name ?? _nameFromParent },
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
        if (mark.type !== 'group') {
          mark.setGraphicName(mark.name);
        }
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
    const { root, viewBoxRect } = this._parsedSvgResult;
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
      if (viewBoxRect) {
        // fill should be true or content will be invisible
        this._pictogramMark.setClip(() => [createRect({ ...viewBoxRect, fill: true })]);
      }
    }
    for (const element of elements) {
      const { id, _finalAttributes: attributes } = element as SVGParsedElementExtend;
      const mark = this._pictogramMark.getMarkInUserId(id);
      const valid = this._validElement(element);
      if (mark) {
        if (valid) {
          this.initMarkStyleWithSpec(mark, merge({}, this._spec.pictogram, this._spec[mark.name]));
          this.setMarkStyle(mark, attributes, 'normal', AttributeLevel.Series);
          mark.setPostProcess('fill', (result, datum) => {
            return isValid(result) ? result : this._spec.defaultFillColor;
          });
        } else {
          // 对于没有设置 name 的元素，不支持响应事件、改变样式
          mark.setInteractive(false);
          this.setMarkStyle(mark, attributes, 'normal', AttributeLevel.Built_In);
        }
      }
    }
  }
  protected _validElement(element: SVGParsedElement) {
    return element.name || element._nameFromParent;
  }

  protected initTooltip() {
    this._tooltipHelper = new PictogramSeriesTooltipHelper(this);
    this.getMarksWithoutRoot().forEach(mark => {
      if (mark && mark.name) {
        this._tooltipHelper.activeTriggerSet.mark.add(mark);
      }
    });
  }

  initData() {
    super.initData();
    const parsedSvg = svgSourceMap.get(this.map);
    if (!parsedSvg) {
      this._option?.onError('no valid svg found!');
    }

    const svgData = new DataView(this._dataSet, { name: `pictogram_${this.id}_data` });
    registerDataSetInstanceTransform(this._dataSet, 'copyDataView', copyDataView);
    // TODO: move
    registerDataSetInstanceTransform(this._dataSet, 'pictogram', (data: SVGParserResult, opt: SVGSourceOption) => {
      const { elements } = data;
      if (elements && elements.length) {
        elements.forEach((el, index: number) => {
          el[DEFAULT_DATA_INDEX] = index;
          const { graphicType: type, transform } = el;

          let finalAttributes = {};
          if (el.graphicType === 'text') {
            finalAttributes = merge({}, el._inheritStyle, el.parent?._textGroupStyle, el.attributes);
          } else if (el.graphicType !== 'group') {
            finalAttributes = merge({}, el._inheritStyle, el.attributes);
          }

          if (graphicAttributeTransform[type]) {
            el._finalAttributes = graphicAttributeTransform[type](finalAttributes, el.value);
          } else {
            el._finalAttributes = finalAttributes;
          }

          if (transform) {
            el._finalAttributes.postMatrix = transform;
          }
        });

        const texts = elements.filter(el => el.tagName === 'text');
        for (let i = 0; i < texts.length; i++) {
          const textId = texts[i].id;
          const children = elements.filter(el => {
            let result = false;
            let parent = el.parent;
            while (parent) {
              if (parent.id === textId) {
                result = true;
                break;
              }
              parent = parent.parent;
            }

            return result;
          });

          if (children && children.length) {
            let startX = texts[i]._textGroupStyle?.x ?? 0;
            let curX = startX;

            for (let j = 0; j < children.length; j++) {
              const currentChild = children[j];
              if (currentChild.graphicType === 'group') {
                curX = startX;
              } else if (currentChild.value) {
                if (currentChild.parent.attributes.x === undefined) {
                  const lastText = children
                    .slice(0, j)
                    .reverse()
                    .find(c => c.graphicType === 'text' && c.value);
                  if (lastText) {
                    const width = measureText(lastText.value, lastText._finalAttributes).width;
                    curX += width;
                  }
                  currentChild._finalAttributes.x = curX;
                }
              }
            }
          }
        }
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
            if (b) {
              a.data = b;
            }
          }
        }
      })
      .transform({
        type: 'lookup',
        options: {
          from: () => this.getViewData().latestData,
          key: '_nameFromParent',
          fields: this._nameField,
          set: (a: Datum, b: Datum) => {
            if (b) {
              a.data = b;
            }
          }
        }
      });
    this._data?.getDataView().target.addListener('change', svgData.reRunAllTransform);
    this._mapViewData = new SeriesData(this._option, svgData);
  }

  mapViewDataUpdate() {
    this._mapViewData.updateData();
  }

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    this._mapViewData?.getDataView().reRunAllTransform();
  }

  updateSVGSize() {
    const { width: regionWidth, height: regionHeight } = this.getLayoutRect();
    const regionCenterX = regionWidth / 2;
    const regionCenterY = regionHeight / 2;
    const root = this.getPictogramRootGraphic();
    if (root) {
      const bounds = root.AABBBounds;
      const { x1, x2, y1, y2 } = root.AABBBounds;
      const width = bounds.width();
      const height = bounds.height();

      const rootCenterX = (x1 + x2) / 2;
      const rootCenterY = (y1 + y2) / 2;

      const scaleX = regionWidth / width;
      const scaleY = regionHeight / height;
      const scale = Math.min(scaleX, scaleY);

      root.scale(scale, scale, { x: rootCenterX, y: rootCenterY });
      root.translate(regionCenterX - rootCenterX, regionCenterY - rootCenterY);
    }
  }

  protected initEvent(): void {
    super.initEvent();
    this._mapViewData.getDataView()?.target.addListener('change', this.mapViewDataUpdate.bind(this));
    // 必须在有 vrender mark 的时机后更新
    this.event.on(VGRAMMAR_HOOK_EVENT.AFTER_MARK_LAYOUT_END, this.updateSVGSize.bind(this));
  }

  getPictogramRootGraphic(): Group {
    return this._pictogramMark.getProduct()?.getGroupGraphicItem();
  }

  handleZoom(e: ZoomEventParam) {
    const { scale, scaleCenter } = e;
    if (scale === 1) {
      return;
    }

    const root = this.getPictogramRootGraphic();
    if (root) {
      if (!root.attribute.postMatrix) {
        root.setAttributes({
          postMatrix: new Matrix()
        });
      }
      root.scale(scale, scale, scaleCenter);
    }
  }

  handlePan(e: PanEventParam) {
    const { delta } = e;
    if (delta[0] === 0 && delta[1] === 0) {
      return;
    }
    const root = this.getPictogramRootGraphic();
    if (root) {
      if (!root.attribute.postMatrix) {
        root.setAttributes({
          postMatrix: new Matrix()
        });
      }
      root.translate(delta[0], delta[1]);
    }
  }

  getMarkData(datum: Datum) {
    return datum.data ?? {};
  }

  getMeasureField(): string[] {
    return [this.valueField];
  }

  getDimensionField(): string[] {
    return [this.nameField];
  }
  protected _getSeriesInfo(field: string, keys: string[]) {
    const defaultShapeType = this.getDefaultShapeType();
    return keys.map(key => {
      return {
        key,
        originalKey: key,
        style: this.getSeriesStyle({
          data: {
            [field]: key
          }
        }),
        shapeType: defaultShapeType
      } as ISeriesSeriesInfo;
    });
  }
}

export const registerPictogramSeries = () => {
  // 注册语法元素
  Factory.registerSeries(PictogramSeries.type, PictogramSeries);
  Factory.registerImplement('registerSVG', registerSVGSource);
  Factory.registerImplement('unregisterSVG', unregisterSVGSource);
  registerElementHighlightByGraphicName();
  registerElementSelectByGraphicName();
  // registerFadeInOutAnimation();
};
