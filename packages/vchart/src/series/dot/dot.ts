/* eslint-disable no-duplicate-imports */
import { AttributeLevel, DEFAULT_DATA_SERIES_FIELD } from '../../constant/index';
import { CartesianSeries } from '../cartesian/cartesian';
import type { Maybe, Datum } from '../../typings';
import { isValid, mergeSpec } from '../../util';
import type { ISymbolMark } from '../../mark/symbol';
import type { ITextMark } from '../../mark/text';
import type { IRuleMark } from '../../mark/rule';
import type { IMark } from '../../mark/interface';
import { MarkTypeEnum } from '../../mark/interface';
import { SeriesTypeEnum } from '../interface/type';
import { dataViewParser } from '@visactor/vdataset';
import { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../../data/register';
import type { IGroupMark } from '../../mark/group';
import type { IModelEvaluateOption } from '../../model/interface';
import { DotSeriesTooltipHelper } from './tooltip-helper';
import type { IRectMark } from '../../mark/rect';
import type { FunctionType, IFillMarkSpec, VisualType } from '../../typings/visual';
import type { IDotSeriesSpec, IDotSeriesTheme } from './interface';
import { getDataScheme } from '../../theme/color-scheme/util';
import { copyDataView } from '../../data/transforms/copy-data-view';
import { objFlat } from '../../data/transforms/obj-flat';
import { DEFAULT_GRID_BACKGROUND } from './config';
import { ColorOrdinalScale } from '../../scale/color-ordinal-scale';
import type { SeriesMarkMap } from '../interface';
import { VChart } from '../../core/vchart';
import { SymbolMark } from '../../mark/symbol';
import { TextMark } from '../../mark/text';
import { RuleMark } from '../../mark/rule';
import { RectMark } from '../../mark/rect';
import { dotSeriesMark } from './constant';
import { Factory } from '../../core/factory';

export class DotSeries<T extends IDotSeriesSpec = IDotSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.dot;
  type = SeriesTypeEnum.dot;

  static readonly mark: SeriesMarkMap = dotSeriesMark;

  protected declare _theme: Maybe<IDotSeriesTheme>;

  private _xDimensionStatisticsDomain: any[];

  // csj-Q: 是否需要把这些属性写成接口？
  protected _seriesGroupField?: string;
  getSeriesGroupField() {
    return this._seriesField;
  }
  setSeriesGroupField(field: string) {
    if (isValid(field)) {
      this._seriesGroupField = field;
    }
  }

  protected _titleField?: string;
  getTitleField() {
    return this._titleField;
  }
  setTitleField(field: string) {
    if (isValid(field)) {
      this._titleField = field;
    }
  }

  protected _subTitleField?: string;
  getSubTitleField() {
    return this._subTitleField;
  }
  setSubTitleField(field: string) {
    if (isValid(field)) {
      this._subTitleField = field;
    }
  }

  protected _dotTypeField?: string;
  getDotTypeField() {
    return this._dotTypeField;
  }
  setDotTypeField(field: string) {
    if (isValid(field)) {
      this._dotTypeField = field;
    }
  }

  protected _highLightSeriesGroup?: string;
  getHighLightSeriesGroup() {
    return this._highLightSeriesGroup;
  }
  setHighLightSeriesGroup(field: string) {
    if (isValid(field)) {
      this._highLightSeriesGroup = field;
    }
  }

  protected _gridBackground?: IFillMarkSpec;
  setGridBackground(gridBackground: IFillMarkSpec) {
    if (isValid(gridBackground)) {
      this._gridBackground = gridBackground;
    }
  }

  /**
   * @override
   */
  initData(): void {
    super.initData();
    this._xDimensionStatisticsDomain = this.getRawData().latestData.map((d: Datum) => d[this._fieldY[0]]);

    // data to dataview
    registerDataSetInstanceTransform(this._option.dataSet, 'objFlat', objFlat);
    registerDataSetInstanceTransform(this._option.dataSet, 'copyDataView', copyDataView);
    registerDataSetInstanceParser(this._option.dataSet, 'dataview', dataViewParser);

    this.getViewDataFilter()?.transform(
      {
        type: 'objFlat',
        options: 'dots'
      },
      false
    );
  }

  /**
   * @override
   */
  setSeriesField(field: string) {
    if (isValid(field)) {
      this._seriesField = field;
      this.getMarksInType([MarkTypeEnum.line, MarkTypeEnum.area]).forEach(m => {
        m.setFacet(this._seriesField);
      });
    }
  }

  getStatisticFields() {
    return [{ key: this._fieldY[0], operations: ['values'], customize: this._xDimensionStatisticsDomain }] as {
      key: string;
      operations: Array<'max' | 'min' | 'values'>;
      customize: any[];
    }[];
  }

  /**
   * @override
   */
  setAttrFromSpec() {
    super.setAttrFromSpec();
    this.setSeriesGroupField(this._spec.seriesGroupField);
    this.setTitleField(this._spec.titleField);
    this.setSubTitleField(this._spec.subTitleField);
    this.setDotTypeField(this._spec.dotTypeField);
    this.setHighLightSeriesGroup(this._spec.highLightSeriesGroup);
    this.setGridBackground(mergeSpec(DEFAULT_GRID_BACKGROUND, this._spec?.grid?.background || {}));
  }

  private _clipMark: IGroupMark;
  private _containerMark: IGroupMark;
  private _gridBackgroundMark: IRectMark;
  private _gridMark: IRuleMark;
  private _dotMark: ISymbolMark;
  private _titleMark: ITextMark;
  private _subTitleMark: ITextMark;
  private _symbolMark: ISymbolMark;
  initMark(): void {
    this._clipMark = this._createMark(DotSeries.mark.group) as IGroupMark;

    this._containerMark = this._createMark(DotSeries.mark.group, {
      parent: this._clipMark,
      dataView: this.getRawData()
    }) as IGroupMark;

    this._gridBackgroundMark = this._createMark(DotSeries.mark.gridBackground, {
      parent: this._containerMark,
      dataView: this.getRawData()
    }) as IRectMark;

    this._gridMark = this._createMark(DotSeries.mark.grid, {
      parent: this._containerMark,
      dataView: this.getRawData()
    }) as IRuleMark;

    this._dotMark = this._createMark(DotSeries.mark.dot, {
      skipBeforeLayouted: false,
      isSeriesMark: true,
      parent: this._containerMark
    }) as ISymbolMark;

    this._titleMark = this._createMark(DotSeries.mark.title, {
      parent: this._containerMark,
      dataView: this.getRawData()
    }) as ITextMark;

    this._subTitleMark = this._createMark(DotSeries.mark.subTitle, {
      parent: this._containerMark,
      dataView: this.getRawData()
    }) as ITextMark;

    this._symbolMark = this._createMark(DotSeries.mark.symbol, {
      parent: this._containerMark,
      dataView: this.getRawData()
    }) as ISymbolMark;
  }

  initMarkStyle(): void {
    const clipMark = this._clipMark;
    if (clipMark) {
      this.setMarkStyle(
        clipMark,
        {
          x: -this._spec.leftAppendPadding,
          y: 0,
          // 本应使用this.getLayoutRect().width, 但这该返回值为0。考虑到横向不需要裁剪，故先采用一个较大值
          width: 10000,
          height: this._spec.clipHeight,
          clip: true
        },
        'normal',
        AttributeLevel.Series
      );
      clipMark.setInteractive(false);
    }

    const containerMark = this._containerMark;
    if (containerMark) {
      this.setMarkStyle(
        containerMark,
        {
          x: this._spec.leftAppendPadding
        },
        'normal',
        AttributeLevel.Series
      );
      containerMark.setInteractive(false);
    }

    const gridBackgroundMark = this._gridBackgroundMark;
    if (gridBackgroundMark) {
      this.setMarkStyle(
        gridBackgroundMark,
        {
          x: this.getRegionRectLeft.bind(this),
          x1: this.getRegionRectRight.bind(this),
          y: this.dataToGridBackgroundPositionY.bind(this),
          y1: this.dataToGridBackgroundPositionY1.bind(this),
          fill: this._gridBackground.fill,
          fillOpacity: this.dataToGridBackgroundOpacity.bind(this) as FunctionType<number>
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(gridBackgroundMark);
      // this._tooltipHelper?.activeTriggerSet.mark.add(gridMark);
    }

    const gridMark = this._gridMark;
    if (gridMark) {
      this.setMarkStyle(
        gridMark,
        {
          stroke: this.getColorAttribute(),
          x: this.getRegionRectLeft.bind(this),
          y: this.dataToPositionY.bind(this),
          x1: this.getRegionRectRight.bind(this),
          y1: this.dataToPositionY.bind(this)
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(gridMark);
      // this._tooltipHelper?.activeTriggerSet.mark.add(gridMark);
    }

    const dotMark = this._dotMark;
    if (dotMark) {
      this.setMarkStyle(
        dotMark,
        {
          x: this.dataToPositionX.bind(this),
          y: this.dataToPositionY.bind(this),
          fill: this.getDotColorAttribute(),
          fillOpacity: this.dataToOpacity.bind(this)
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(dotMark);
    }

    const titleMark = this._titleMark;
    if (titleMark) {
      this.setMarkStyle(
        titleMark,
        {
          fill: this.getColorAttribute(),
          text: (datum: any) => {
            return datum[this.getTitleField()];
          },
          x: this.getRegionRectLeft.bind(this),
          y: this.dataToPositionY.bind(this)
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(titleMark);
      // this._tooltipHelper?.activeTriggerSet.mark.add(titleMark);
    }

    const subTitleMark = this._subTitleMark;
    if (subTitleMark) {
      this.setMarkStyle(
        subTitleMark,
        {
          fill: this.getColorAttribute(),
          text: (datum: any) => {
            return datum[this.getSubTitleField()];
          },
          x: this.getRegionRectLeft.bind(this),
          y: this.dataToPositionY.bind(this)
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(subTitleMark);
      // this._tooltipHelper?.activeTriggerSet.mark.add(subTitleMark);
    }

    const symbolMark = this._symbolMark;
    if (symbolMark) {
      this.setMarkStyle(
        symbolMark,
        {
          x: this.getRegionRectLeft.bind(this),
          y: this.dataToPositionY.bind(this),
          fill: this.getColorAttribute()
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(symbolMark);
      // this._tooltipHelper?.activeTriggerSet.mark.add(symbolMark);
    }
  }

  dataToGridBackgroundPositionY(datum: Datum): number {
    if (!this._yAxisHelper) {
      return Number.NaN;
    }
    const { dataToPosition, getBandwidth } = this._yAxisHelper;

    return (
      dataToPosition(this.getDatumPositionValues(datum, this._fieldY), {
        bandPosition: this._bandPosition
      }) -
      getBandwidth(0) / 2
    );
  }

  dataToGridBackgroundPositionY1(datum: Datum): number {
    if (!this._yAxisHelper) {
      return Number.NaN;
    }
    const { dataToPosition, getBandwidth } = this._yAxisHelper;

    return (
      dataToPosition(this.getDatumPositionValues(datum, this._fieldY), {
        bandPosition: this._bandPosition
      }) +
      getBandwidth(0) / 2
    );
  }

  dataToOpacity(datum: Datum): number {
    if (!this._xAxisHelper) {
      return Number.NaN;
    }
    const { dataToPosition, getScale } = this._xAxisHelper;

    if (
      dataToPosition(this.getDatumPositionValues(datum, this._fieldX), {
        bandPosition: this._bandPosition
      }) < getScale(0).range()[0] ||
      dataToPosition(this.getDatumPositionValues(datum, this._fieldX), {
        bandPosition: this._bandPosition
      }) > getScale(0).range()[1]
    ) {
      return 0;
    }
    return this._theme?.dot?.style?.fillOpacity ?? 1;
  }

  dataToGridBackgroundOpacity(datum: Datum): VisualType<number> {
    if (datum[this._seriesGroupField] === this._highLightSeriesGroup) {
      return this._gridBackground.fillOpacity;
    }
    return 0;
  }

  onLayoutEnd(ctx: any) {
    super.onLayoutEnd(ctx);
    const layoutOffsetX = this._spec?.leftAppendPadding ?? 0;
    this.setMarkStyle(
      this._clipMark,
      {
        width: this.getLayoutRect().width + layoutOffsetX //clip的数值只能在layoutEnd之后获得
      },
      'normal',
      AttributeLevel.Series
    );
  }

  /**
   * @override
   * @description 如果用户设置了seriesGroup，则seriesGroup作为颜色映射字段
   */
  getDefaultColorDomain() {
    return this._seriesGroupField
      ? this._viewDataStatistics?.latestData[this._seriesGroupField].values
      : this._seriesField
      ? this._viewDataStatistics?.latestData[this._seriesField].values
      : [];
  }

  /**
   * @override
   */
  // 通用的默认颜色映射 用户设置优先级比这个高，会在setStyle中处理
  getColorAttribute() {
    return {
      scale: this._option.globalScale.getScale('color') ?? this.getDefaultColorScale(),
      field: this._seriesGroupField ?? this._seriesField ?? DEFAULT_DATA_SERIES_FIELD
    };
  }

  /**
   * @override
   * @description 对于dot来说，dotType优先级高于seriesGroup，作为颜色映射字段
   */
  protected getDotColorScale() {
    const colorDomain = this._dotTypeField
      ? this._viewDataStatistics?.latestData[this._dotTypeField].values
      : this._seriesGroupField
      ? this._viewDataStatistics?.latestData[this._seriesGroupField].values
      : this._seriesField
      ? this._viewDataStatistics?.latestData[this._seriesField].values
      : [];
    const colorRange = getDataScheme(this._option.getTheme().colorScheme, this.type);
    return new ColorOrdinalScale().domain(colorDomain).range(colorRange);
  }

  /**
   * @override
   */
  // 通用的默认颜色映射 用户设置优先级比这个高，会在setStyle中处理
  getDotColorAttribute() {
    return {
      scale: this._option.globalScale.getScale('color') ?? this.getDotColorScale(),
      field: this._dotTypeField ?? this._seriesGroupField ?? this._seriesField ?? DEFAULT_DATA_SERIES_FIELD
    };
  }

  protected initTooltip() {
    this._tooltipHelper = new DotSeriesTooltipHelper(this);
    this._dotMark && this._tooltipHelper.activeTriggerSet.mark.add(this._dotMark);
  }

  /**
   * @description onEvaluateEnd之后可以拿到canvas element，将滚动条挂载到canvas element上
   */
  onEvaluateEnd(ctx: IModelEvaluateOption): void {
    super.onEvaluateEnd(ctx);
  }

  protected onMarkTreePositionUpdate(marks: IMark[]): void {
    marks.forEach(m => {
      if (m.type === 'group') {
        this.onMarkTreePositionUpdate((m as IGroupMark).getMarks());
      } else {
        m.updateLayoutState();
      }
    });
  }

  getDotData() {
    return this._dotMark?.getData();
  }

  protected _getDataIdKey() {
    // dot 系列没有动画，可以使用默认的 dataKey
    return undefined as any;
  }

  getStackValueField(): string {
    return null;
  }

  getActiveMarks(): IMark[] {
    return [this._dotMark];
  }
}

export const registerDotSeries = () => {
  Factory.registerMark(SymbolMark.type, SymbolMark);
  Factory.registerMark(RuleMark.type, RuleMark);
  Factory.registerMark(RectMark.type, RectMark);
  Factory.registerMark(TextMark.type, TextMark);

  Factory.registerSeries(DotSeries.type, DotSeries);
};
