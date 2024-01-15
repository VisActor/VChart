import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
// eslint-disable-next-line no-duplicate-imports
import { isValid, max } from '@visactor/vutils';
import type { Datum, ILiquidMarkSpec, IPoint } from '../../typings';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import type { ILiquidPadding, ILiquidSeriesSpec } from './interface';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { LiquidAppearPreset } from './animation';
// eslint-disable-next-line no-duplicate-imports
import { registerLiquidAnimation } from './animation';
import { LiquidSeriesMark } from './constant';
import { Factory } from '../../core/factory';
import type { IMark, IMarkRaw } from '../../mark/interface';
import { LineLikeSeriesSpecTransformer } from '../mixin/line-mixin-transformer';
import { registerLiquidMark } from '../../mark/liquid';
import { AttributeLevel, ChartEvent } from '../../constant';
import { BaseSeries } from '../base';
import type { IGroupMark } from '../../mark/group';
// eslint-disable-next-line no-duplicate-imports
import { registerGroupMark } from '../../mark/group';
import { getShapes } from './util';
import { createSymbol } from '@visactor/vrender-core';
import { labelSmartInvert } from '@visactor/vrender-components';
import { normalizeLayoutPaddingSpec } from '../../util';
import type { DataView } from '@visactor/vdataset';
import { LiquidSeriesTooltipHelper } from './tooltip-helper';

export type ILiquidMark = IMarkRaw<ILiquidMarkSpec>;
export class LiquidSeries<T extends ILiquidSeriesSpec = ILiquidSeriesSpec> extends BaseSeries<T> {
  static readonly type: string = SeriesTypeEnum.liquid;
  type = SeriesTypeEnum.liquid;

  static readonly mark: SeriesMarkMap = LiquidSeriesMark;
  static readonly transformerConstructor = LineLikeSeriesSpecTransformer;
  readonly transformerConstructor = LineLikeSeriesSpecTransformer;
  private _liquidMark?: ILiquidMark;
  private _liquidBackgroundMark?: IGroupMark | null = null;
  private _liquidOutlineMark?: IGroupMark | null = null;
  private _paddingSpec?: ILiquidPadding;
  private _marginSpec?: ILiquidPadding;

  private _heightRatio?: number;

  protected _valueField?: string;
  setValueField(field: string) {
    if (isValid(field)) {
      this._valueField = field;
    }
  }
  getValueField() {
    return this._valueField;
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this._marginSpec = normalizeLayoutPaddingSpec(this._spec.outlineMargin) as ILiquidPadding;
    this._paddingSpec = normalizeLayoutPaddingSpec(this._spec.outlinePadding) as ILiquidPadding;
    this.setValueField(this._spec.valueField);
  }

  rawDataUpdate(d: DataView): void {
    super.rawDataUpdate(d);
    this._heightRatio = max(...this._data.getLatestData().map((d: Datum) => d[this._valueField]));
  }

  initMark(): void {
    this._initLiquidOutlineMark();
    this._initLiquidBackgroundMark();
    this._initLiquidMark();
  }

  initMarkStyle(): void {
    this._initLiquidOutlineMarkStyle();
    this._initLiquidBackgroundMarkStyle();
    this._initLiquidMarkStyle();
  }

  private _initLiquidOutlineMark() {
    this._liquidOutlineMark = this._createMark(LiquidSeries.mark.liquidOutline, {
      isSeriesMark: true,
      skipBeforeLayouted: false
    }) as IGroupMark;
    return this._liquidOutlineMark;
  }

  private _initLiquidBackgroundMark() {
    this._liquidBackgroundMark = this._createMark(LiquidSeries.mark.liquidBackground, {
      isSeriesMark: true,
      skipBeforeLayouted: false
    }) as IGroupMark;
    return this._liquidBackgroundMark;
  }

  private _initLiquidMark() {
    this._liquidMark = this._createMark(LiquidSeries.mark.liquid, {
      parent: this._liquidBackgroundMark,
      isSeriesMark: true,
      skipBeforeLayouted: false
    }) as ILiquidMark;
    return this._liquidMark;
  }

  private _getPosAndSizeFormRegion(isOutline: boolean = false) {
    const {
      top: marginTop = 0,
      bottom: marginBottom = 0,
      left: marginLeft = 0,
      right: marginRight = 0
    } = this._marginSpec;
    const {
      top: paddingTop = 0,
      bottom: paddingBottom = 0,
      left: paddingLeft = 0,
      right: paddingRight = 0
    } = this._paddingSpec;

    const { width: regionWidth, height: regionHeight } = this._region.getLayoutRect();
    if (!isOutline) {
      return {
        x: regionWidth / 2 + (marginLeft + paddingRight - (marginRight + paddingRight)) / 2,
        y: regionHeight / 2 + (marginTop + paddingTop - (marginBottom + paddingBottom)) / 2,
        // eslint-disable-next-line max-len
        size: Math.min(
          regionWidth - (marginLeft + marginRight + paddingLeft + paddingRight),
          regionHeight - (marginTop + marginBottom + paddingTop + paddingBottom)
        )
      };
    }
    return {
      x: regionWidth / 2 + (marginLeft - marginRight) / 2,
      y: regionHeight / 2 + (marginTop - marginBottom) / 2,
      size: Math.min(regionWidth - (marginLeft + marginRight), regionHeight - (marginTop + marginBottom))
    };
  }

  private _initLiquidOutlineMarkStyle() {
    const groupMark = this._liquidOutlineMark;
    groupMark.setZIndex(this.layoutZIndex);
    groupMark.created();
    this.setMarkStyle(
      groupMark,
      {
        width: () => this._region.getLayoutRect().width,
        height: () => this._region.getLayoutRect().height,
        stroke: this.getColorAttribute(),
        path: () => {
          const { x, y, size } = this._getPosAndSizeFormRegion(true);
          const symbolPath = createSymbol({
            x,
            y,
            size,
            symbolType: getShapes(this._spec.maskShape ?? 'circle', size),
            fill: true
          });
          return [symbolPath];
        }
      },
      'normal',
      AttributeLevel.Series
    );
    this._liquidOutlineMark.setInteractive(false);
  }

  private _initLiquidBackgroundMarkStyle() {
    const groupMark = this._liquidBackgroundMark;
    groupMark.setZIndex(this.layoutZIndex);
    groupMark.created();
    this.setMarkStyle(
      groupMark,
      {
        clip: true,
        width: () => this._region.getLayoutRect().width,
        height: () => this._region.getLayoutRect().height,
        path: () => {
          const { x, y, size } = this._getPosAndSizeFormRegion();
          const symbolPath = createSymbol({
            x,
            y,
            size,
            symbolType: getShapes(this._spec.maskShape ?? 'circle', size),
            fill: true
          });
          return [symbolPath];
        }
      },
      'normal',
      AttributeLevel.Series
    );
    this._liquidBackgroundMark.setInteractive(false);
  }

  private _initLiquidMarkStyle() {
    const liquidMark = this._liquidMark;
    if (liquidMark) {
      this.setMarkStyle(
        liquidMark,
        {
          dx: () => {
            return this._region.getLayoutStartPoint().x + this._region.getLayoutRect().width / 2;
          },
          y: () => {
            const { y: liquidBackY, size: liquidBackSize } = this._getPosAndSizeFormRegion();
            return liquidBackY - liquidBackSize / 2 + liquidBackSize - liquidBackSize * this._heightRatio;
          },
          height: () => {
            const { size: liquidBackSize } = this._getPosAndSizeFormRegion();
            return liquidBackSize * this._heightRatio;
          },
          fill: this.getColorAttribute(),
          wave: 0
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(liquidMark);
    }
  }

  protected initTooltip() {
    this._tooltipHelper = new LiquidSeriesTooltipHelper(this);
    this._liquidMark && this._tooltipHelper.activeTriggerSet.mark.add(this._liquidMark);
  }

  initAnimation() {
    const animationParams = {
      y: {
        from: () => {
          const { y: liquidBackY, size: liquidBackSize } = this._getPosAndSizeFormRegion();
          return liquidBackY - liquidBackSize / 2 + liquidBackSize;
        },
        to: () => {
          const { y: liquidBackY, size: liquidBackSize } = this._getPosAndSizeFormRegion();
          return liquidBackY - liquidBackSize / 2 + liquidBackSize - liquidBackSize * this._heightRatio;
        }
      },
      height: {
        from: 0,
        to: () => {
          const { size: liquidBackSize } = this._getPosAndSizeFormRegion();
          return liquidBackSize * this._heightRatio;
        }
      }
    };
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<LiquidAppearPreset>)?.preset;
    this._liquidMark.setAnimationConfig(
      animationConfig(
        Factory.getAnimationInKey('liquid')?.(animationParams, appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.liquid, this._spec, this._markAttributeContext)
      )
    );
  }

  protected initEvent(): void {
    super.initEvent();
    if (!this._spec.indicatorSmartInvert || !this._option.getChart().getComponentsByKey('indicator')) {
      return;
    }
    this.event.on(ChartEvent.renderFinished, () => {
      this._option
        .getChart()
        .getComponentsByKey('indicator')
        .forEach((indicatorComponent: any) => {
          // wave item比较特殊,  由wave1、wave2、wave3在x方向上偏移叠加而成
          // 由于在水波图中只需要判断y方向上是否重叠, 所以此处取wave1做y方向上对比
          const grammarMark = this._liquidMark.getProduct();
          const waveItem = (grammarMark.elements[0] as any).glyphGraphicItems.wave1;
          let { y1: waveY1, y2: waveY2 } = waveItem.globalAABBBounds;
          waveY1 += this._region.getLayoutStartPoint().y;
          waveY2 += this._region.getLayoutStartPoint().y;
          indicatorComponent
            ?.getIndicatorComponent()
            ?.getChildren()[0]
            ?.getChildren()
            .forEach((text: any) => {
              const { y1: textY1, y2: textY2 } = text.globalAABBBounds;
              if (waveY1 < textY1 && waveY2 > textY2) {
                const foregroundColor = text.attribute.fill;
                const backgroundColor = waveItem.attribute.fill;
                const invertColor = labelSmartInvert(foregroundColor, backgroundColor);
                text.setAttribute('fill', invertColor);
              }
            });
        });
    });
  }

  dataToPosition(data: Datum): IPoint {
    return null;
  }
  dataToPositionX(data: Datum): number {
    return null;
  }
  dataToPositionY(data: Datum): number {
    return null;
  }
  valueToPosition(value1: any, value2?: any): IPoint {
    return null;
  }

  getStatisticFields(): any[] {
    return [];
  }

  getGroupFields(): string[] {
    return [];
  }
  getStackGroupFields(): string[] {
    return [];
  }
  getStackValueField(): string {
    return '';
  }

  getActiveMarks(): IMark[] {
    return [this._liquidMark];
  }
}

export const registerLiquidSeries = () => {
  registerLiquidMark();
  registerGroupMark();
  registerLiquidAnimation();
  Factory.registerSeries(LiquidSeries.type, LiquidSeries);
};
