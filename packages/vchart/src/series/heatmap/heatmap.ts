/* eslint-disable no-duplicate-imports */
import { CartesianSeries } from '../cartesian/cartesian';
import { AttributeLevel } from '../../constant';
import type { Maybe, Datum } from '../../typings';
import { mergeSpec } from '../../util/spec/merge-spec';
import { registerHeatmapAnimation, type HeatmapAppearPreset } from './animation';
import { animationConfig, shouldMarkDoMorph, userAnimationConfig } from '../../animation/utils';
import type { IHeatmapSeriesSpec, IHeatmapSeriesTheme } from './interface';
import type { IAxisHelper } from '../../component/axis/cartesian/interface';
import type { ITextMark } from '../../mark/text';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { ICellMark } from '../../mark/cell';
import { normalizePadding, array } from '@visactor/vutils';
import { HeatmapSeriesTooltipHelper } from './tooltip-helper';
import { CellMark } from '../../mark/cell';
import { TextMark } from '../../mark/text';
import { heatmapSeriesMark } from './constant';
import { Factory } from '../../core/factory';
import type { IMark } from '../../mark/interface';
import { registerCellMark } from '@visactor/vgrammar-core';

export const DefaultBandWidth = 6; // 默认的bandWidth，避免连续轴没有bandWidth

export class HeatmapSeries<T extends IHeatmapSeriesSpec = IHeatmapSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.heatmap;
  type = SeriesTypeEnum.heatmap;

  static readonly mark: SeriesMarkMap = heatmapSeriesMark;

  protected declare _theme: Maybe<IHeatmapSeriesTheme>;

  protected _cellMark: ICellMark;
  protected _backgroundMark: ICellMark;

  protected _fieldValue!: string[];
  getFieldValue() {
    return this._fieldValue;
  }
  setFieldValue(f: string | string[]) {
    this._fieldValue = array(f);
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this.setFieldValue(this._spec.valueField);
  }

  initMark(): void {
    const progressive = {
      progressiveStep: this._spec.progressiveStep,
      progressiveThreshold: this._spec.progressiveThreshold,
      large: this._spec.large,
      largeThreshold: this._spec.largeThreshold
    };

    this._cellMark = this._createMark(HeatmapSeries.mark.cell, {
      morph: shouldMarkDoMorph(this._spec, HeatmapSeries.mark.cell.name),
      defaultMorphElementKey: this.getDimensionField()[0],
      isSeriesMark: true,
      label: mergeSpec({ animation: this._spec.animation }, this._spec.label),
      progressive
    }) as ICellMark;

    this._backgroundMark = this._createMark(HeatmapSeries.mark.cellBackground, {
      progressive
    }) as ICellMark;
  }

  initMarkStyle(): void {
    this.initCellMarkStyle();
    this.initCellBackgroundMarkStyle();
  }

  initLabelMarkStyle(textMark: ITextMark) {
    if (!textMark) {
      return;
    }
    this.setMarkStyle(textMark, {
      fill: this.getColorAttribute(),
      text: (datum: Datum) => {
        return datum[this.getMeasureField()[0]];
      }
    });
  }

  initCellMarkStyle() {
    this.setMarkStyle(
      this._cellMark,
      {
        x: (datum: Datum) => {
          const pos = this.dataToPositionX(datum);
          return pos;
        },
        y: (datum: Datum) => {
          const pos = this.dataToPositionY(datum);
          return pos;
        },
        size: () => {
          return [this.getCellSize(this._xAxisHelper), this.getCellSize(this._yAxisHelper)];
        },
        fill: this.getColorAttribute()
      },
      'normal',
      AttributeLevel.Series
    );

    this._trigger.registerMark(this._cellMark);
  }

  initCellBackgroundMarkStyle() {
    const padding = normalizePadding(this._spec.cellBackground?.style?.padding ?? 0);
    this.setMarkStyle(
      this._backgroundMark,
      {
        x: (datum: Datum) => {
          const width = this.getCellSize(this._xAxisHelper);
          const pos = this.dataToPositionX(datum);
          return pos - width / 2 + padding[3];
        },
        y: (datum: Datum) => {
          const height = this.getCellSize(this._yAxisHelper);
          const pos = this.dataToPositionY(datum);
          return pos - height / 2 + padding[0];
        },
        width: () => {
          return this.getCellSize(this._xAxisHelper) - padding[1] - padding[3];
        },
        height: () => {
          return this.getCellSize(this._yAxisHelper) - padding[0] - padding[2];
        }
      },
      'normal',
      AttributeLevel.Series
    );
  }

  // 通用的默认颜色映射 用户设置优先级比这个高，会在setStyle中处理
  getColorAttribute() {
    return {
      // TODO: 为热力图实现默认线性颜色 scale
      scale: this._option.globalScale.getScale('color') ?? this._getDefaultColorScale(),
      field: this.getFieldValue[0]
    };
  }

  initAnimation() {
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<HeatmapAppearPreset>)?.preset;
    // 分组数据的dataIndex应该与x轴顺序一致，而非data[DEFAULT_DATA_INDEX]顺序
    const dataIndex = (datum: any) => {
      const xValue = datum?.[this._fieldX[0]];
      const xIndex = this.getViewDataStatistics()?.latestData?.[this._fieldX[0]]?.values.indexOf(xValue);
      // 不应该出现xIndex === -1 || undefined的情况
      return xIndex || 0;
    };

    this._cellMark.setAnimationConfig(
      animationConfig(
        Factory.getAnimationInKey('heatmap')?.(appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.cell, this._spec, this._markAttributeContext),
        {
          dataIndex
        }
      )
    );
  }

  protected getCellSize(axisHelper: IAxisHelper) {
    return axisHelper.getBandwidth?.(0) ?? DefaultBandWidth;
  }

  protected initTooltip() {
    this._tooltipHelper = new HeatmapSeriesTooltipHelper(this);
    this._cellMark && this._tooltipHelper.activeTriggerSet.mark.add(this._cellMark);
  }

  getDefaultShapeType(): string {
    return 'square';
  }

  getDimensionField(): string[] {
    return [].concat(this.fieldX, this.fieldY);
  }

  getMeasureField(): string[] {
    return this.getFieldValue();
  }

  getActiveMarks(): IMark[] {
    return [this._cellMark];
  }
}

export const registerHeatmapSeries = () => {
  registerCellMark();
  Factory.registerMark(CellMark.type, CellMark);
  Factory.registerMark(TextMark.type, TextMark);
  Factory.registerSeries(HeatmapSeries.type, HeatmapSeries);
  registerHeatmapAnimation();
};
