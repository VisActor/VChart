import type { ISymbolMark } from '../../mark/symbol';
import { AttributeLevel, DEFAULT_DATA_INDEX, PREFIX } from '../../constant';
import type { IBoxPlotMark } from '../../mark/boxPlot';
import { MarkTypeEnum } from '../../mark/interface';
import type { IModelEvaluateOption, IModelInitOption } from '../../model/interface';
import type { BoxPlotShaftShape, IOutlierMarkSpec, Maybe, Datum } from '../../typings';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../typings';
import { isNumber, valueInScaleRange } from '../../util';
import { CartesianSeries } from '../cartesian/cartesian';
import { SeriesTypeEnum } from '../interface';
import type { IBoxPlotSeriesSpec, IBoxPlotSeriesTheme } from './interface';
import { STATE_VALUE_ENUM } from '../../compile/mark';
import { registerDataSetInstanceTransform } from '../../data/register';
import { DataView } from '@visactor/vdataset';
import { SeriesData } from '../base/series-data';
import { foldOutlierData } from '../../data/transforms/box-plot';
import { BOX_PLOT_OUTLIER_VALUE_FIELD } from '../../constant/box-plot';
import { BoxPlotSeriesTooltipHelper } from './tooltip-helper';
import { addVChartProperty } from '../../data/transforms/add-property';
import { addDataKey, initKeyMap } from '../../data/transforms/data-key';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { IMarkAnimateSpec } from '../../animation/spec';

const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_SHAFT_FILL_OPACITY = 0.5;
const DEFAULT_SHAFT_SHAPE = 'line';
export const DEFAULT_FILL_COLOR = '#FFF';
export const DEFAULT_STROKE_COLOR = '#000';

const DEFAULT_OUTLIER_SIZE = 10;

export class BoxPlotSeries extends CartesianSeries<any> {
  static readonly type: string = SeriesTypeEnum.boxPlot;
  type = SeriesTypeEnum.boxPlot;

  protected declare _spec: IBoxPlotSeriesSpec;

  protected declare _theme: Maybe<IBoxPlotSeriesTheme>;
  protected _minField: string;
  getMinField() {
    return this._minField;
  }
  protected _maxField: string;
  getMaxField() {
    return this._maxField;
  }
  protected _q1Field: string;
  getQ1Field() {
    return this._q1Field;
  }
  protected _medianField: string;
  getMedianField() {
    return this._medianField;
  }
  protected _q3Field: string;
  getQ3Field() {
    return this._q3Field;
  }
  protected _outliersField: string;
  getOutliersField() {
    return this._outliersField;
  }
  protected _lineWidth: number;
  protected _boxWidth: number;
  protected _shaftShape: BoxPlotShaftShape;
  getShaftShape() {
    return this._shaftShape;
  }
  protected _shaftWidth: number;
  protected _boxFillColor: string;
  getBoxFillColor() {
    return this._boxFillColor;
  }
  protected _strokeColor: string;
  getStrokeColor() {
    return this._strokeColor;
  }
  protected _shaftFillOpacity: number;
  protected _outliersStyle: IOutlierMarkSpec;
  getOutliersStyle() {
    return this._outliersStyle;
  }
  protected _outlierDataView: SeriesData;

  private _autoBoxWidth: number;

  /**
   * @override
   */
  setAttrFromSpec() {
    super.setAttrFromSpec();
    const boxPlotStyle: any = this._spec.boxPlot?.style ?? {};
    this._minField = this._spec.minField;
    this._maxField = this._spec.maxField;
    this._q1Field = this._spec.q1Field;
    this._medianField = this._spec.medianField;
    this._q3Field = this._spec.q3Field;
    this._outliersField = this._spec.outliersField;
    this._lineWidth = boxPlotStyle.lineWidth ?? DEFAULT_STROKE_WIDTH;
    this._boxWidth = boxPlotStyle.boxWidth;
    this._shaftShape = boxPlotStyle.shaftShape ?? DEFAULT_SHAFT_SHAPE;
    this._shaftWidth = boxPlotStyle.shaftWidth;
    this._boxFillColor = boxPlotStyle.boxFill;
    this._strokeColor = boxPlotStyle.stroke;

    this._shaftFillOpacity =
      this._shaftShape === 'bar' ? boxPlotStyle.shaftFillOpacity ?? DEFAULT_SHAFT_FILL_OPACITY : undefined;

    this._outliersStyle = this._spec.outliersStyle;
  }

  private _boxPlotMark?: IBoxPlotMark;
  private _outlierMark?: ISymbolMark;

  initMark(): void {
    const progressive = {
      progressiveStep: this._spec.progressiveStep,
      progressiveThreshold: this._spec.progressiveThreshold,
      large: this._spec.large,
      largeThreshold: this._spec.largeThreshold
    };

    this._boxPlotMark = this._createMark(MarkTypeEnum.boxPlot, 'boxPlot', {
      isSeriesMark: true,
      progressive
    }) as IBoxPlotMark;
    this._outlierMark = this._createMark(MarkTypeEnum.symbol, 'outlier', {
      progressive,
      key: DEFAULT_DATA_INDEX,
      dataView: this._outlierDataView.getDataView(),
      dataProductId: this._outlierDataView.getProductId()
    }) as ISymbolMark;
  }

  initMarkStyle(): void {
    const boxPlotMark = this._boxPlotMark;
    if (boxPlotMark) {
      const commonBoxplotStyles = {
        direction: this._direction,
        lineWidth: this._lineWidth,
        shaftShape: this._shaftShape,
        fill: this._boxFillColor ?? (this._shaftShape === 'line' ? DEFAULT_FILL_COLOR : this.getColorAttribute()),
        minMaxFillOpacity: this._shaftFillOpacity,
        stroke: this._strokeColor ?? (this._shaftShape === 'line' ? this.getColorAttribute() : DEFAULT_STROKE_COLOR)
      };

      const boxPlotMarkStyles =
        this._direction === Direction.vertical
          ? {
              x: this.dataToPositionX.bind(this),
              ...commonBoxplotStyles,
              boxWidth: () => this._boxWidth ?? this._getMarkWidth(),
              ruleWidth: () => this._shaftWidth ?? this._getMarkWidth(),
              q1q3Width: () => this._boxWidth ?? this._getMarkWidth(),
              minMaxWidth: () => this._shaftWidth ?? this._getMarkWidth()
            }
          : {
              y: this.dataToPositionY.bind(this),
              ...commonBoxplotStyles,
              boxHeight: () => this._boxWidth ?? this._getMarkWidth(),
              ruleHeight: () => this._shaftWidth ?? this._getMarkWidth(),
              q1q3Height: () => this._boxWidth ?? this._getMarkWidth(),
              minMaxHeight: () => this._shaftWidth ?? this._getMarkWidth()
            };

      this.setMarkStyle(boxPlotMark, boxPlotMarkStyles, STATE_VALUE_ENUM.STATE_NORMAL, AttributeLevel.Series);

      this._trigger.registerMark(boxPlotMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(boxPlotMark);
    }

    const outlierMark = this._outlierMark;
    if (outlierMark) {
      this.setMarkStyle(
        outlierMark,
        {
          fill: this._outliersStyle?.fill ?? this.getColorAttribute(),
          size: isNumber(this._outliersStyle?.size) ? this._outliersStyle.size : DEFAULT_OUTLIER_SIZE,
          shape: 'circle'
        },
        STATE_VALUE_ENUM.STATE_NORMAL,
        AttributeLevel.Series
      );
      this._trigger.registerMark(outlierMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(outlierMark);
    }
  }

  initBoxPlotMarkStyle(): void {
    const boxPlotMark = this._boxPlotMark;
    const axisHelper = this._direction === Direction.vertical ? this._yAxisHelper : this._xAxisHelper;
    if (boxPlotMark && axisHelper) {
      const { dataToPosition } = axisHelper;
      const scale = axisHelper?.getScale?.(0);
      this.setMarkStyle(
        boxPlotMark,
        {
          min: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._minField), {
                bandPosition: this._bandPosition
              }),
              scale
            ),
          q1: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._q1Field), {
                bandPosition: this._bandPosition
              }),
              scale
            ),
          median: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._medianField), {
                bandPosition: this._bandPosition
              }),
              scale
            ),
          q3: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._q3Field), {
                bandPosition: this._bandPosition
              }),
              scale
            ),
          max: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._maxField), {
                bandPosition: this._bandPosition
              }),
              scale
            )
        },
        STATE_VALUE_ENUM.STATE_NORMAL,
        AttributeLevel.Series
      );
    }
    const outlierMark = this._outlierMark;
    if (outlierMark && axisHelper) {
      const { dataToPosition } = axisHelper;
      const scale = axisHelper?.getScale?.(0);
      const outlierMarkPositionChannel =
        this._direction === Direction.vertical
          ? {
              x: this.dataToPositionX.bind(this),
              y: (datum: Datum) =>
                valueInScaleRange(
                  dataToPosition(this.getDatumPositionValues(datum, BOX_PLOT_OUTLIER_VALUE_FIELD), {
                    bandPosition: this._bandPosition
                  }),
                  scale
                )
            }
          : {
              y: this.dataToPositionY.bind(this),
              x: (datum: Datum) =>
                valueInScaleRange(
                  dataToPosition(this.getDatumPositionValues(datum, BOX_PLOT_OUTLIER_VALUE_FIELD), {
                    bandPosition: this._bandPosition
                  }),
                  scale
                )
            };
      this.setMarkStyle(outlierMark, outlierMarkPositionChannel, STATE_VALUE_ENUM.STATE_NORMAL, AttributeLevel.Series);
    }
  }

  initData(): void {
    super.initData();
    if (!this._data) {
      return;
    }

    registerDataSetInstanceTransform(this._dataSet, 'foldOutlierData', foldOutlierData);
    registerDataSetInstanceTransform(this._dataSet, 'addVChartProperty', addVChartProperty);

    const outlierDataView = new DataView(this._dataSet);
    outlierDataView.parse([this.getViewData()], {
      type: 'dataview'
    });
    outlierDataView.name = `${PREFIX}_series_${this.id}_outlierData`;
    outlierDataView.transform({
      type: 'foldOutlierData',
      options: {
        dimensionField: this._direction === Direction.vertical ? this._fieldX : this._fieldY,
        outliersField: this._outliersField
      }
    });

    outlierDataView.transform(
      {
        type: 'addVChartProperty',
        options: {
          beforeCall: initKeyMap,
          call: addDataKey.bind(this)
        }
      },
      false
    );

    this._outlierDataView = new SeriesData(this._option, outlierDataView);
  }

  init(option: IModelInitOption): void {
    super.init(option);
    //init在axis初始化之后才被执行，此时axisHelper不为空
    this.initBoxPlotMarkStyle();
  }

  private _getMarkWidth() {
    if (this._autoBoxWidth) {
      return this._autoBoxWidth;
    }
    //获取自适应的图元宽度
    const bandAxisHelper = this._direction === Direction.vertical ? this._xAxisHelper : this._yAxisHelper;
    const xField = this._direction === Direction.vertical ? this._fieldX : this._fieldY;

    const innerBandWidth = bandAxisHelper.getBandwidth(xField.length - 1);
    const autoBoxWidth = innerBandWidth / xField.length;
    this._autoBoxWidth = autoBoxWidth;

    return this._autoBoxWidth;
  }

  onLayoutEnd(ctx: any) {
    super.onLayoutEnd(ctx);
    //每次布局结束，清除自适应宽度缓存
    this._autoBoxWidth = null;
  }

  private _initAnimationSpec(config: any) {
    //将spec中的animation的type替换为箱型图的type
    const newConfig = Object.assign({}, config);
    ['appear', 'enter', 'update', 'exit', 'disappear'].forEach(state => {
      if (newConfig[state] && newConfig[state].type === 'scaleIn') {
        newConfig[state].type = this._shaftShape === 'line' ? 'boxplotScaleIn' : 'barBoxplotScaleIn';
      } else if (newConfig[state] && newConfig[state].type === 'scaleOut') {
        newConfig[state].type = this._shaftShape === 'line' ? 'boxplotScaleOut' : 'barBoxplotScaleOut';
      }
    });
    return newConfig;
  }

  initAnimation() {
    // 分组数据的dataIndex应该与x轴顺序一致，而非data[DEFAULT_DATA_INDEX]顺序
    const dataIndex = (datum: Datum) => {
      const xField = this._direction === Direction.vertical ? this._fieldX[0] : this._fieldY[0];
      const xValue = datum?.[xField];
      const xIndex = this._viewDataStatistics?.latestData?.[xField]?.values.indexOf(xValue);
      // 不应该出现xIndex === -1 || undefined的情况
      return xIndex || 0;
    };
    if (this._boxPlotMark) {
      const newDefaultConfig = this._initAnimationSpec(DEFAULT_MARK_ANIMATION.boxPlot());
      const newConfig = this._initAnimationSpec(userAnimationConfig('boxPlot', this._spec));
      this._boxPlotMark.setAnimationConfig(animationConfig(newDefaultConfig, newConfig, { dataIndex }));
    }

    if (this._outlierMark) {
      const outlierMarkUserAnimation = {
        appear: (this._spec.animationAppear as IMarkAnimateSpec<string>)?.symbol,
        disappear: (this._spec.animationDisappear as IMarkAnimateSpec<string>)?.symbol,
        enter: (this._spec.animationEnter as IMarkAnimateSpec<string>)?.symbol,
        exit: (this._spec.animationExit as IMarkAnimateSpec<string>)?.symbol,
        update: (this._spec.animationUpdate as IMarkAnimateSpec<string>)?.symbol
      };
      this._outlierMark.setAnimationConfig(
        animationConfig(DEFAULT_MARK_ANIMATION.symbol(), outlierMarkUserAnimation, {
          dataIndex
        })
      );
    }
  }

  protected initTooltip() {
    this._tooltipHelper = new BoxPlotSeriesTooltipHelper(this);
  }

  getStatisticFields() {
    const fields = super.getStatisticFields();
    const outliersField = fields.find(f => f.key === this._outliersField);
    if (outliersField) {
      outliersField.operations = ['array-min', 'array-max'];
    }
    return fields;
  }

  onEvaluateEnd(ctx: IModelEvaluateOption): void {
    //初次编译时，会传入空数据；待所有计算完成后，需要重新执行updateData更新数据
    super.onEvaluateEnd(ctx);
    this._outlierDataView.updateData();
  }

  getDefaultShapeType(): string {
    return 'square';
  }
}
