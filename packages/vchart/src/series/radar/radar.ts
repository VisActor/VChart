/* eslint-disable no-duplicate-imports */
import { LineLikeSeriesMixin } from '../mixin/line-mixin';
import type { ILineMark } from '../../mark/line';
import type { IMark, IMarkProgressiveConfig } from '../../mark/interface';
import { AttributeLevel, ChartEvent, POLAR_START_RADIAN } from '../../constant';
import { DEFAULT_LINEAR_INTERPOLATE } from '../../typings/interpolate';
import type { Datum, IPoint, IPolarPoint, Maybe } from '../../typings';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import { degreeToRadian, isArray, mixin, isValid } from '@visactor/vutils';
import type { IRadarSeriesSpec, IRadarSeriesTheme } from './interface';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { registerRadarAnimation, type IRadarAnimationParams, type RadarAppearPreset } from './animation';
import { RoseLikeSeries } from '../polar/rose-like';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { IAreaMark } from '../../mark/area';
import { AreaMark, registerAreaMark } from '../../mark/area';
import { LineMark, registerLineMark } from '../../mark/line';
import { SymbolMark, registerSymbolMark } from '../../mark/symbol';
import { radarSeriesMark } from './constant';
import { Factory } from '../../core/factory';
import { registerMarkOverlapTransform } from '@visactor/vgrammar-core';
import { LineLikeSeriesSpecTransformer } from '../mixin/line-mixin-transformer';

export interface RadarSeries<T extends IRadarSeriesSpec>
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
      | 'addOverlapCompile'
    >,
    RoseLikeSeries<T> {}

export class RadarSeries<T extends IRadarSeriesSpec = IRadarSeriesSpec> extends RoseLikeSeries<T> {
  static readonly type: string = SeriesTypeEnum.radar;
  type = SeriesTypeEnum.radar;

  static readonly mark: SeriesMarkMap = radarSeriesMark;
  static readonly transformerConstructor = LineLikeSeriesSpecTransformer as any;
  readonly transformerConstructor = LineLikeSeriesSpecTransformer;

  private _areaMark: ILineMark;
  protected _sortDataByAxis: boolean = false;

  initGroups() {
    // do nothing
  }

  compile(): void {
    super.compile();
    this.addOverlapCompile();
  }

  initMark(): void {
    const progressive = {
      progressiveStep: this._spec.progressiveStep,
      progressiveThreshold: this._spec.progressiveThreshold,
      large: this._spec.large,
      largeThreshold: this._spec.largeThreshold
    };

    const isAreaVisible = this._spec.area?.visible !== false && this._spec.area?.style?.visible !== false;
    const seriesMark = this._spec.seriesMark ?? 'area';
    this.initAreaMark(progressive, isAreaVisible && seriesMark === 'area');
    this.initLineMark(progressive, seriesMark === 'line' || (seriesMark === 'area' && !isAreaVisible));
    this.initSymbolMark(progressive, seriesMark === 'point');
  }

  initMarkStyle(): void {
    this.initAreaMarkStyle();
    this.initLineMarkStyle();
    this.initSymbolMarkStyle();
  }

  initAreaMark(progressive: IMarkProgressiveConfig, isSeriesMark: boolean) {
    this._areaMark = this._createMark(RadarSeries.mark.area, {
      progressive,
      isSeriesMark,
      customShape: this._spec.area?.customShape,
      stateSort: this._spec.area?.stateSort
    }) as IAreaMark;
  }

  initAreaMarkStyle() {
    const areaMark = this._areaMark;
    if (areaMark) {
      this.setMarkStyle(
        areaMark,
        {
          x: this.dataToPositionX.bind(this),
          y: this.dataToPositionY.bind(this),
          x1: (datum: Datum) => {
            if (!datum || !this.angleAxisHelper || !this.radiusAxisHelper) {
              return Number.NaN;
            }
            return this.valueToPosition(
              this.getDatumPositionValues(datum, this._angleField),
              this._stack ? this.getDatumPositionValues(datum, this._innerRadiusField) : this.radiusScale.domain()[0]
            ).x;
          },
          y1: (datum: Datum) => {
            if (!datum || !this.angleAxisHelper || !this.radiusAxisHelper) {
              return Number.NaN;
            }

            const value = this.valueToPosition(
              this.getDatumPositionValues(datum, this._angleField),
              this._stack ? this.getDatumPositionValues(datum, this._innerRadiusField) : this.radiusScale.domain()[0]
            ).y;
            return value;
          },
          fill: this.getColorAttribute(),
          curveType: DEFAULT_LINEAR_INTERPOLATE,
          closePath: true
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
      this.event.on(ChartEvent.viewDataStatisticsUpdate, { filter: param => param.model === this }, () => {
        this.encodeDefined(areaMark, 'defined');
      });
      this._trigger.registerMark(areaMark);
    }
  }

  protected initTooltip() {
    super.initTooltip();

    this._lineMark && this._tooltipHelper.activeTriggerSet.dimension.add(this._lineMark);
    this._symbolMark && this._tooltipHelper.activeTriggerSet.mark.add(this._symbolMark);
    this._areaMark && this._tooltipHelper.activeTriggerSet.dimension.add(this._areaMark);
  }

  initAnimation() {
    const animationParams: IRadarAnimationParams = {
      center: () => this.angleAxisHelper?.center(),
      radius: () => {
        const rect = this.getLayoutRect();
        return Math.min(rect.width, rect.height);
      },
      startAngle: isValid(this._spec.startAngle) ? degreeToRadian(this._spec.startAngle) : POLAR_START_RADIAN,
      pointToCoord: (point: IPoint) => this.angleAxisHelper?.pointToCoord(point),
      coordToPoint: (coord: IPolarPoint) => this.angleAxisHelper.coordToPoint(coord)
    };
    const appearPreset = ((this._spec?.animationAppear as IStateAnimateSpec<RadarAppearPreset>)?.preset ??
      'clipIn') as RadarAppearPreset;

    if (appearPreset === 'clipIn') {
      if (this._rootMark) {
        this._rootMark.setAnimationConfig(
          animationConfig(
            Factory.getAnimationInKey('radarGroup')?.(animationParams, appearPreset),
            userAnimationConfig(SeriesMarkNameEnum.group, this._spec, this._markAttributeContext)
          )
        );
      }
    }

    // TODO: animationType
    const markAnimationMap: [IMark, string][] = [
      [this._areaMark, 'radar'],
      [this._lineMark, 'radar'],
      [this._symbolMark, 'radarSymbol']
    ];

    // 为 mark 添加动画
    markAnimationMap.forEach(([mark, animation]) => {
      if (isValid(mark)) {
        const getAnimation = Factory.getAnimationInKey(animation);
        mark.setAnimationConfig(
          animationConfig(
            getAnimation?.(animationParams, appearPreset),
            userAnimationConfig(mark.name, this._spec, this._markAttributeContext)
          )
        );
      }
    });
  }

  getDefaultShapeType() {
    return 'square';
  }

  getActiveMarks(): IMark[] {
    return [this._areaMark, this._symbolMark, this._lineMark];
  }

  getSeriesStyle(datum: Datum) {
    return (attribute: string) => {
      let result = this._seriesMark?.getAttribute(attribute as any, datum) ?? undefined;
      if (attribute === 'fill' && !result) {
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

mixin(RadarSeries, LineLikeSeriesMixin);

export const registerRadarSeries = () => {
  registerMarkOverlapTransform();
  registerAreaMark();
  registerLineMark();
  registerSymbolMark();
  registerRadarAnimation();
  Factory.registerSeries(RadarSeries.type, RadarSeries);
};
