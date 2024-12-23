import { DataView } from '@visactor/vdataset';
import type { SVGParsedElement, SVGParserResult } from '@visactor/vdataset';
import type { PanEventParam, ZoomEventParam } from '../../core';
import { Factory } from '../../core';
import { GeoSeries } from '../geo/geo';
import type { ISeriesSeriesInfo, SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface';
import type { IPictogramSeriesSpec } from './interface';
import { PictogramSeriesMark } from './constant';
import { getSVGSource, registerSVGSource, svgSourceMap, unregisterSVGSource } from './svg-source';
import { SeriesData } from '../base/series-data';
import { lookup } from '../../data/transforms/lookup';
import { registerDataSetInstanceTransform } from '../../data/register';
import type { GroupMark } from '../../mark';
import { shouldMarkDoMorph } from '../../animation/utils';
import { AttributeLevel } from '../../constant/attribute';
import { PictogramSeriesSpecTransformer } from './pictogram-transformer';
import type { IMatrix } from '@visactor/vutils';
import { Bounds, Matrix, isValid, merge } from '@visactor/vutils';
import type { Datum } from '../../typings';
import { createRect } from '@visactor/vrender-core';
import type { Group, IGraphic } from '@visactor/vrender-core';
import { VGRAMMAR_HOOK_EVENT } from '../../constant/event';
import type { IHoverSpec, ISelectSpec } from '../../interaction/interface';
import { STATE_VALUE_ENUM } from '../../compile/mark';
import type { EventType } from '@visactor/vgrammar-core';
import { registerElementHighlightByGraphicName, registerElementSelectByGraphicName } from '@visactor/vgrammar-core';
import type { IGroupMark, IMark, ITextMark } from '../../mark/interface';
import { PictogramSeriesTooltipHelper } from './tooltip-helper';
import { graphicAttributeTransform, pictogram } from '../../data/transforms/pictogram';
import type { IPoint } from '../../typings/coordinate';

export interface SVGParsedElementExtend extends SVGParsedElement {
  _finalAttributes: Record<string, any>;
  _uniqueId: string; // 用于处理 svg 中 id 重复的情况
}

export class PictogramSeries<T extends IPictogramSeriesSpec = IPictogramSeriesSpec> extends GeoSeries<T> {
  static readonly type: string = SeriesTypeEnum.pictogram;
  type = SeriesTypeEnum.pictogram;
  static readonly mark: SeriesMarkMap = PictogramSeriesMark;
  static readonly transformerConstructor = PictogramSeriesSpecTransformer;

  svg!: string;

  protected _pictogramMark: GroupMark;
  protected _parsedSvgResult: SVGParserResult;
  private _labelMark: ITextMark;

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this.svg = this._spec.svg;
    this._nameField = this._spec.nameField;
    this._valueField = this._spec.valueField;

    if (!this.svg) {
      this._option?.onError(`svg source is not specified !`);
    }
    this._parsedSvgResult = getSVGSource(this.svg)?.latestData;

    if (!this._parsedSvgResult) {
      this._option?.onError(`'${this.svg}' is not registered !`);
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

  protected _buildMarkAttributeContext() {
    super._buildMarkAttributeContext();
    this._markAttributeContext.getTransformMatrix = this.getRootMatrix.bind(this);
    this._markAttributeContext.coordToPosition = this.coordToPosition.bind(this);
    this._markAttributeContext.dataToPosition = this.dataToPosition.bind(this);
  }

  protected _defaultHoverConfig(selector: string[], finalHoverSpec: IHoverSpec) {
    return {
      seriesId: this.id,
      regionId: this._region.id,
      selector,
      type: 'element-highlight-by-graphic-name',
      // trigger: finalHoverSpec.trigger as EventType,
      trigger: finalHoverSpec.trigger as EventType,
      triggerOff: 'pointerout' as EventType,
      blurState: STATE_VALUE_ENUM.STATE_HOVER_REVERSE,
      highlightState: STATE_VALUE_ENUM.STATE_HOVER
    };
  }

  protected _defaultSelectConfig(selector: string[], finalSelectSpec: ISelectSpec) {
    const isMultiple = finalSelectSpec.mode === 'multiple';
    const triggerOff = isValid(finalSelectSpec.triggerOff)
      ? finalSelectSpec.triggerOff
      : isMultiple
      ? ['empty', 'self']
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
    this._pictogramMark = this._createMark(
      PictogramSeries.mark.pictogram,
      {
        groupKey: this.getDimensionField()[0],
        isSeriesMark: true,
        skipBeforeLayouted: true,
        dataView: this._mapViewData.getDataView(),
        dataProductId: this._mapViewData.getProductId()
      },
      {
        morph: shouldMarkDoMorph(this._spec, PictogramSeries.mark.pictogram.name)
      }
    ) as GroupMark;

    if (!this._pictogramMark) {
      return;
    }

    this._pictogramMark.setUserId(PictogramSeries.mark.pictogram.name);
    for (const element of this._mapViewData.getDataView().latestData as SVGParserResult['elements']) {
      const { graphicType: type, name, parent, id, _nameFromParent, _uniqueId } = element;

      const mark = this._createMark(
        { type, name: name ?? _nameFromParent },
        {
          groupKey: _uniqueId,
          isSeriesMark: false,
          skipBeforeLayouted: true,
          dataView: this._mapViewData.getDataView(),
          dataProductId: this._mapViewData.getProductId(),
          parent: (this._pictogramMark.getMarkInUserId(parent?._uniqueId) as IGroupMark) ?? this._pictogramMark
        },
        {
          morph: shouldMarkDoMorph(this._spec, PictogramSeries.mark.pictogram.name)
        }
      );

      if (mark) {
        mark.setUserId(_uniqueId); // id 必须唯一，但无法控制 svg 中元素有重复 id， 这里做一个保护
        if (mark.type !== 'group') {
          mark.setMarkConfig({ graphicName: mark.name });
        }
        mark.setTransform([
          {
            type: 'filter',
            callback: (datum: SVGParsedElementExtend) => {
              return datum._uniqueId === _uniqueId;
            }
          }
        ]);
      }
    }
    this._initLabelMark();
  }

  private _initLabelMark() {
    // @ts-ignore
    if (this._spec.label.visible !== true) {
      return;
    }

    const labelMark = this._createMark(PictogramSeries.mark.label, {
      isSeriesMark: false,
      parent: this._pictogramMark,
      groupKey: '_uniqueId',
      skipBeforeLayouted: true,
      depend: this.getMarksWithoutRoot()
    }) as ITextMark;

    if (labelMark) {
      this._labelMark = labelMark;
      this._labelMark.setDataView(this._mapViewData.getDataView());
    }
  }

  initLabelMarkStyle() {
    if (!this._labelMark) {
      return;
    }
    this.setMarkStyle(
      this._labelMark,
      {
        visible: d => !!this._validElement(d as SVGParsedElementExtend),
        x: d => this.dataToPosition(d, true)?.x,
        y: d => this.dataToPosition(d, true)?.y,
        text: d => d[this.nameField],
        textAlign: 'center',
        textBaseline: 'middle'
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
  }

  initMarkStyle() {
    const { root, viewBoxRect } = this._parsedSvgResult;
    const elements = this._mapViewData.getDataView().latestData as SVGParserResult['elements'];
    if (root) {
      this.setMarkStyle(
        this._pictogramMark,
        graphicAttributeTransform.group(root.attributes),
        'normal',
        AttributeLevel.Built_In
      );
      if (root.transform) {
        this.setMarkStyle(
          this._pictogramMark,
          {
            postMatrix: () => root.transform
          },
          'normal',
          AttributeLevel.Built_In
        );
      }
      if (viewBoxRect) {
        // fill should be true or content will be invisible
        this._pictogramMark.setMarkConfig({
          clip: true,
          clipPath: [createRect({ ...viewBoxRect, fill: true }) as any]
        });
      }
    }
    for (const element of elements) {
      const { _uniqueId, _finalAttributes: attributes } = element as SVGParsedElementExtend;
      const mark = this._pictogramMark.getMarkInUserId(_uniqueId);
      const valid = this._validElement(element);
      if (mark) {
        // 描边粗细跟随缩放倍数
        this.setMarkStyle(mark, { keepStrokeScale: true }, 'normal', AttributeLevel.Built_In);
        if (valid) {
          this.initMarkStyleWithSpec(mark, merge({}, this._spec.pictogram, this._spec[mark.name]));
          this.setMarkStyle(mark, attributes, 'normal', AttributeLevel.Series);
          mark.setPostProcess('fill', (result, datum) => {
            return isValid(result) ? result : this._spec.defaultFillColor;
          });
        } else {
          // 对于没有设置 name 的元素，不支持响应事件、改变样式
          mark.setMarkConfig({ interactive: false });
          this.setMarkStyle(mark, attributes, 'normal', AttributeLevel.Built_In);
        }
      }
    }

    this.initLabelMarkStyle();
  }
  /** 在 svg 中使用 name attribute 标注了的图元*/
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

  dataToPosition(datum: Datum, global = false): IPoint {
    if (!datum) {
      return null;
    }
    const name = datum[this.nameField];
    if (!name) {
      return null;
    }

    const mark = this.getMarksWithoutRoot().filter(mark => mark.name === name);
    if (!mark || mark.length === 0) {
      return null;
    }
    let bounds = new Bounds();
    if (global) {
      mark.forEach(m => {
        bounds = bounds.union(m.getProduct().getGroupGraphicItem().globalAABBBounds);
      });
    } else {
      mark.forEach(m => {
        bounds = bounds.union(m.getProduct().getBounds());
      });
    }

    const point = { x: (bounds.x1 + bounds.x2) / 2, y: (bounds.y1 + bounds.y2) / 2 };

    if (global) {
      const { x, y } = this.getLayoutStartPoint();
      point.x -= x;
      point.y -= y;
    }
    return point;
  }

  coordToPosition(point: IPoint): IPoint | undefined {
    if (!point) {
      return null;
    }
    const { x, y } = point;
    const matrix = this.getRootMatrix();
    if (!matrix) {
      return null;
    }
    const position = {};
    matrix.getInverse().transformPoint({ x, y }, position as IPoint);
    return position as IPoint;
  }

  getRootMatrix() {
    return this.getPictogramRootGraphic()?.transMatrix as IMatrix;
  }

  getPictogramRootGraphic(): Group {
    return this._pictogramMark.getProduct()?.getGroupGraphicItem();
  }

  initData() {
    super.initData();
    const parsedSvg = svgSourceMap.get(this.svg);
    if (!parsedSvg) {
      this._option?.onError('no valid svg found!');
    }
    const svgData = new DataView(this._dataSet, { name: `pictogram_${this.id}_data` });
    registerDataSetInstanceTransform(this._dataSet, 'pictogram', pictogram);
    registerDataSetInstanceTransform(this._dataSet, 'lookup', lookup);
    svgData
      .parse([parsedSvg], {
        type: 'dataview'
      })
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
};
