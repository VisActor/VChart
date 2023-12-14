import type { DataView } from '@visactor/vdataset';
import { isValid, isArray } from '@visactor/vutils';
/* eslint-disable no-duplicate-imports */
import { LineLikeSeriesMixin } from '../mixin/line-mixin';
import type { IAreaMark } from '../../mark/area';
import { Direction } from '../../typings/space';
import { CartesianSeries } from '../cartesian/cartesian';
import { AttributeLevel } from '../../constant';
import type { Maybe, Datum, ConvertToMarkStyleSpec, IAreaMarkSpec, InterpolateType } from '../../typings';
import { mergeSpec } from '../../util/spec/merge-spec';
import { valueInScaleRange } from '../../util/scale';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import { mixin } from '@visactor/vutils';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { DEFAULT_SMOOTH_INTERPOLATE } from '../../typings/interpolate';
import type { IAreaSeriesSpec, IAreaSeriesTheme } from './interface';
import type { IMarkAnimateSpec } from '../../animation/spec';
import { LineMark, registerLineMark } from '../../mark/line';
import { AreaMark, registerAreaMark } from '../../mark/area';
import { SymbolMark, registerSymbolMark } from '../../mark/symbol';
import { AreaSeriesTooltipHelper } from './tooltip-helpter';
import { areaSeriesMark } from './constant';
import { Factory } from '../../core/factory';
import { registerAreaAnimation } from './animation';
import type { IMark } from '../../mark/interface';
import { registerSampleTransform, registerMarkOverlapTransform } from '@visactor/vgrammar-core';
import type { ILabelSpec } from '../../component';

export interface AreaSeries<T extends IAreaSeriesSpec = IAreaSeriesSpec>
  extends Pick<
      LineLikeSeriesMixin,
      | 'initLineMark'
      | 'initSymbolMark'
      | 'initLabelMarkStyle'
      | 'initLineMarkStyle'
      | 'initSymbolMarkStyle'
      | 'encodeDefined'
      | '_lineMark'
      | '_symbolMark'
      | 'addSamplingCompile'
      | 'addOverlapCompile'
      | 'reCompileSampling'
      | 'initLineLabelMarkStyle'
    >,
    CartesianSeries<T> {}

export class AreaSeries<T extends IAreaSeriesSpec = IAreaSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.area;
  type = SeriesTypeEnum.area;

  static readonly mark: SeriesMarkMap = areaSeriesMark;

  protected _areaMark!: IAreaMark;
  protected _supportStack: boolean = true;
  protected _sortDataByAxis: boolean = false;

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    const isAreaVisible = this._spec.area?.visible !== false && this._spec.area?.style?.visible !== false;
    const isLineVisible = this._spec.line?.visible !== false && this._spec.line?.style?.visible !== false;
    // merge line to area
    const areaSpec = this._spec.area ?? {};
    const lineSpec = this._spec.line ?? {};
    areaSpec.interactive = areaSpec.interactive || lineSpec.interactive;
    areaSpec.support3d = areaSpec.support3d || lineSpec.support3d;
    areaSpec.zIndex =
      isValid(areaSpec.zIndex) || isValid(lineSpec.zIndex)
        ? Math.max(areaSpec.zIndex ?? 0, lineSpec.zIndex ?? 0)
        : undefined;

    // remove area stroke
    if (areaSpec.style) {
      delete areaSpec.style.stroke;
    }
    if (areaSpec.state) {
      Object.keys(areaSpec.state).forEach(state => {
        if ('style' in areaSpec.state[state]) {
          delete areaSpec.state[state].style.stroke;
        } else {
          delete (<ConvertToMarkStyleSpec<IAreaMarkSpec>>areaSpec.state[state]).stroke;
        }
      });
    }
    // check which one is main
    let mainSpec = areaSpec;
    let subSpec = lineSpec;
    const seriesMark = this._spec.seriesMark ?? 'area';
    if (seriesMark === 'line' || (isLineVisible && !isAreaVisible)) {
      mainSpec = lineSpec;
      subSpec = areaSpec;
    }
    areaSpec.style = mergeSpec({}, subSpec.style, mainSpec.style);
    areaSpec.state = mergeSpec({}, subSpec.state, mainSpec.state);
    if (!isAreaVisible) {
      areaSpec.style.fill = false;
    }
    if (!isLineVisible) {
      areaSpec.style.stroke = false;
    }
    areaSpec.visible = !(!isAreaVisible && !isLineVisible);
  }

  initMark(): void {
    const progressive = {
      progressiveStep: this._spec.progressiveStep,
      progressiveThreshold: this._spec.progressiveThreshold,
      large: this._spec.large,
      largeThreshold: this._spec.largeThreshold
    };

    const isAreaVisible = this._spec.area?.visible !== false && this._spec.area?.style?.visible !== false;
    const isPointVisible = this._spec.point?.visible !== false && this._spec.point?.style?.visible !== false;

    const seriesMark = this._spec.seriesMark ?? 'area';
    // area
    this._areaMark = this._createMark(AreaSeries.mark.area, {
      groupKey: this._seriesField,
      defaultMorphElementKey: this.getDimensionField()[0],
      progressive,
      isSeriesMark: isAreaVisible && seriesMark !== 'point',
      customShape: this._spec.area?.customShape
    }) as IAreaMark;
    if (this._areaMark && this._spec.areaLabel?.visible) {
      this._areaMark.addLabelSpec(
        this._preprocessLabelSpec(this._spec.areaLabel as ILabelSpec, this.initLineLabelMarkStyle),
        true
      );
    }
    if (!isPointVisible && this._areaMark && this._spec.label?.visible) {
      this._areaMark.addLabelSpec(this._preprocessLabelSpec(this._spec.label as ILabelSpec));
    }
    this.initSymbolMark(progressive, seriesMark === 'point');
  }

  initMarkStyle(): void {
    // FIXME 是不是应该把curveType提前到上层配置
    // 不允许area和line的curveType不一致
    const userCurveType = (this.getSpec().area?.style?.curveType ??
      this.getSpec().line?.style?.curveType) as InterpolateType;
    const curveType =
      userCurveType === DEFAULT_SMOOTH_INTERPOLATE
        ? this._direction === Direction.vertical
          ? 'monotoneX'
          : 'monotoneY'
        : userCurveType;

    // area
    const areaMark = this._areaMark;
    if (areaMark) {
      if (this._direction === Direction.vertical) {
        this.setMarkStyle(
          this._areaMark,
          {
            x: this.dataToPositionX.bind(this),
            y1: (datum: Datum) => {
              return valueInScaleRange(this.dataToPositionY1(datum), this._yAxisHelper?.getScale?.(0));
            },
            y: this.dataToPositionY.bind(this),
            z: this._fieldZ ? this.dataToPositionZ.bind(this) : null
          },
          'normal',
          AttributeLevel.Series
        );
      } else {
        this.setMarkStyle(
          this._areaMark,
          {
            x: this.dataToPositionX.bind(this),
            x1: (datum: Datum) => {
              return valueInScaleRange(this.dataToPositionX1(datum), this._xAxisHelper?.getScale?.(0));
            },
            y: this.dataToPositionY.bind(this),
            z: this._fieldZ ? this.dataToPositionZ.bind(this) : null,
            orient: this._direction
          },
          'normal',
          AttributeLevel.Series
        );
      }
      this.setMarkStyle(
        areaMark,
        {
          fill: this.getColorAttribute(),
          stroke: this.getColorAttribute()
        },
        'normal',
        AttributeLevel.Series
      );
      if (this._invalidType !== 'zero') {
        this.setMarkStyle(
          areaMark,
          {
            defined: this._getInvalidDefined,
            connectedType: this._getInvalidConnectType()
          },
          'normal',
          AttributeLevel.Series
        );
      }
      this.setMarkStyle(
        areaMark,
        {
          curveType
        },
        'normal',
        AttributeLevel.Built_In
      );
      this._trigger.registerMark(areaMark);

      // change stroke to area stoke = [lineStroke,false,false,false]
      Object.keys(areaMark.stateStyle).forEach(state => {
        if (areaMark.stateStyle[state].stroke) {
          areaMark.setPostProcess(
            'stroke',
            result => {
              return [result, false, false, false];
            },
            state
          );
        }
      });
    }

    this.initLineMarkStyle(this._direction, userCurveType);
    this.initSymbolMarkStyle();
  }

  initAnimation() {
    const animationParams = { direction: this.direction };
    const appearPreset = (this._spec.animationAppear as IMarkAnimateSpec<string>)?.preset;
    if (this._lineMark) {
      this._lineMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('line')?.(animationParams, appearPreset),
          userAnimationConfig(SeriesMarkNameEnum.line, this._spec, this._markAttributeContext)
        )
      );
    }

    if (this._areaMark) {
      this._areaMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('area')?.(animationParams, appearPreset),
          userAnimationConfig(SeriesMarkNameEnum.area, this._spec, this._markAttributeContext)
        )
      );
    }

    if (this._symbolMark) {
      this._symbolMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('scaleInOut')?.(),
          userAnimationConfig(SeriesMarkNameEnum.point, this._spec, this._markAttributeContext)
        )
      );
    }
  }

  protected initTooltip() {
    this._tooltipHelper = new AreaSeriesTooltipHelper(this);
    this._areaMark && this._tooltipHelper.activeTriggerSet.dimension.add(this._areaMark);
    this._lineMark && this._tooltipHelper.activeTriggerSet.dimension.add(this._lineMark);
    this._symbolMark && this._tooltipHelper.activeTriggerSet.mark.add(this._symbolMark);
  }

  viewDataStatisticsUpdate(d: DataView) {
    super.viewDataStatisticsUpdate(d);
    this.encodeDefined(this._areaMark, 'defined');
  }

  compile(): void {
    super.compile();
    this.addSamplingCompile();
    this.addOverlapCompile();
  }

  getDefaultShapeType() {
    return 'square';
  }

  getActiveMarks(): IMark[] {
    return [this._areaMark, this._symbolMark, this._lineMark];
  }

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    this.reCompileSampling();
  }

  getSeriesStyle(datum: Datum) {
    return (attribute: string) => {
      const seriesMarkType = this._spec.seriesMark ?? 'area';

      let result = this._seriesMark?.getAttribute(attribute as any, datum) ?? undefined;
      if (attribute === 'fill' && (!result || seriesMarkType === 'line')) {
        attribute = 'stroke';
        result = this._seriesMark?.getAttribute(attribute, datum) ?? undefined;
      }
      if (attribute === 'stroke' && isArray(result)) {
        return result[0];
      }
      return result;
    };
  }
}

mixin(AreaSeries, LineLikeSeriesMixin);

export const registerAreaSeries = () => {
  registerSampleTransform();
  registerMarkOverlapTransform();
  registerLineMark();
  registerAreaMark();
  registerSymbolMark();
  registerAreaAnimation();
  Factory.registerSeries(AreaSeries.type, AreaSeries);
};
