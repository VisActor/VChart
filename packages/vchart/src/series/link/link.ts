/* eslint-disable no-duplicate-imports */
import { AttributeLevel, DEFAULT_DATA_SERIES_FIELD } from '../../constant/index';
import { CartesianSeries } from '../cartesian/cartesian';
import type { Maybe, Datum } from '../../typings';
import { isValid } from '../../util';
import type { IRuleMark } from '../../mark/rule';
import type { IMark } from '../../mark/interface';
import { SeriesTypeEnum } from '../interface/type';
import { registerDataSetInstanceTransform } from '../../data/register';
import { ShapeTypeEnum } from '../../typings';
import type { ISymbolMark } from '../../mark/symbol';
import type { IDotSeriesSpec } from '../dot/interface';
import type { IGroupMark } from '../../mark/group';
import { LinkSeriesTooltipHelper } from './tooltip-helper';
import type { ILinkSeriesSpec, ILinkSeriesTheme } from './interface';
import type { SeriesMarkMap } from '../interface';
import { RuleMark } from '../../mark/rule';
import { SymbolMark } from '../../mark/symbol';
import { linkSeriesMark } from './constant';
import { linkDotInfo } from '../../data/transforms/link-dot-info';
import { Factory } from '../../core/factory';

export class LinkSeries<T extends ILinkSeriesSpec = ILinkSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.link;
  type = SeriesTypeEnum.link;

  static readonly mark: SeriesMarkMap = linkSeriesMark;

  protected declare _theme: Maybe<ILinkSeriesTheme>;

  protected _fromField?: string;
  getFromField() {
    return this._fromField;
  }
  setFromField(field: string) {
    if (isValid(field)) {
      this._fromField = field;
    }
  }

  protected _toField?: string;
  getToField() {
    return this._toField;
  }
  setToField(field: string) {
    if (isValid(field)) {
      this._toField = field;
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

  protected _dotSeriesSpec?: IDotSeriesSpec;
  getDotSeriesSpec() {
    return this._dotSeriesSpec;
  }
  setDotSeriesSpec(spec: IDotSeriesSpec) {
    if (isValid(spec)) {
      this._dotSeriesSpec = spec;
    }
  }

  protected _getDotData() {
    const dotSeries = this._option.getChart().getSeriesInIndex([this._spec.dotSeriesIndex])[0];
    if (!dotSeries) {
      return [];
    }
    return dotSeries.getRawData().latestData;
  }

  initData() {
    super.initData();

    registerDataSetInstanceTransform(this._option.dataSet, 'linkDotInfo', linkDotInfo);
    this.getViewDataFilter()?.transform(
      {
        type: 'linkDotInfo',
        options: {
          infoKey: 'dots',
          fields: () => {
            return {
              fromField: this._fromField,
              toField: this._toField,
              xField: this._dotSeriesSpec.xField,
              yField: this._dotSeriesSpec.yField
            };
          },
          linkData: () => this._rawData.latestData,
          dotData: () => this._getDotData()
        }
      },
      false
    );
  }

  /**
   * @override
   */
  setAttrFromSpec() {
    super.setAttrFromSpec();
    this.setFromField(this._spec.fromField);
    this.setToField(this._spec.toField);
    this.setDotTypeField(this._spec.dotTypeField);
    this.setDotSeriesSpec(this._spec.dotSeriesSpec);
  }

  private _clipMark: IGroupMark;
  private _containerMark: IGroupMark;
  private _linkMark: IRuleMark;
  private _arrowMark: ISymbolMark;
  initMark(): void {
    this._clipMark = this._createMark(LinkSeries.mark.group) as IGroupMark;

    this._containerMark = this._createMark(LinkSeries.mark.group, {
      parent: this._clipMark
    }) as IGroupMark;

    this._linkMark = this._createMark(LinkSeries.mark.link, {
      skipBeforeLayouted: false,
      parent: this._containerMark
    }) as IRuleMark;

    this._arrowMark = this._createMark(LinkSeries.mark.arrow, {
      skipBeforeLayouted: false,
      isSeriesMark: true,
      parent: this._containerMark
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
          x: this._spec.leftAppendPadding,
          width: this.getLayoutRect().width
        },
        'normal',
        AttributeLevel.Series
      );
      containerMark.setInteractive(false);
    }

    const linkMark = this._linkMark;
    if (linkMark) {
      this.setMarkStyle(
        linkMark,
        {
          stroke: this.getColorAttribute(),
          strokeOpacity: this.dataToOpacity.bind(this),
          x: this.dataToPositionXFrom.bind(this),
          y: this.dataToPositionYFrom.bind(this),
          x1: this.dataToPositionXTo.bind(this),
          y1: this.dataToPositionYTo.bind(this)
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(linkMark);
    }

    const arrowMark = this._arrowMark;
    if (arrowMark) {
      const arrowSize = (this._theme?.arrow?.style?.size as number) ?? 10;
      this.setMarkStyle(
        arrowMark,
        {
          x: this.dataToPositionXTo.bind(this),
          y: (datum: Datum) => this.dataToPositionArrowYTo(datum, arrowSize), // csj-to do：箭头的dy不生效，暂时改变y position逻辑
          fill: this.getColorAttribute(),
          fillOpacity: this.dataToOpacity.bind(this),
          size: arrowSize,
          symbolType: (datum: Datum) => {
            return this.isPositionYFromHigher(datum) ? ShapeTypeEnum.triangleDown : ShapeTypeEnum.triangleUp;
          }
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(arrowMark);
    }
  }

  afterInitMark(): void {
    super.afterInitMark();
    this._trigger.setStateKeys([this._seriesField as string, this._fromField]);
  }

  /** 以下函数用于定位link和arrow */

  dataToPositionXFrom(datum: Datum): number {
    if (!this._xAxisHelper) {
      return Number.NaN;
    }
    const { dataToPosition } = this._xAxisHelper;

    return dataToPosition(this.getDatumPositionValues(datum, this._fromField + '_xField'), {
      bandPosition: this._bandPosition
    });
  }

  dataToPositionYFrom(datum: Datum): number {
    if (!this._yAxisHelper) {
      return Number.NaN;
    }
    const { dataToPosition } = this._yAxisHelper;

    return dataToPosition(this.getDatumPositionValues(datum, this._fromField + '_yField'));
  }

  dataToPositionXTo(datum: Datum): number {
    if (!this._xAxisHelper) {
      return Number.NaN;
    }
    const { dataToPosition } = this._xAxisHelper;
    return dataToPosition(this.getDatumPositionValues(datum, this._toField + '_xField'), {
      bandPosition: this._bandPosition
    });
  }

  dataToPositionYTo(datum: Datum): number {
    if (!this._yAxisHelper) {
      return Number.NaN;
    }
    const { dataToPosition } = this._yAxisHelper;

    return dataToPosition(this.getDatumPositionValues(datum, this._toField + '_yField'), {
      bandPosition: this._bandPosition
    });
  }

  dataToPositionArrowYTo(datum: Datum, arrowSize: number): number {
    if (!this._yAxisHelper) {
      return Number.NaN;
    }
    const { dataToPosition } = this._yAxisHelper;
    const offset = this.isPositionYFromHigher(datum) ? -arrowSize / 2 : arrowSize / 2;
    return (
      dataToPosition(this.getDatumPositionValues(datum, this._toField + '_yField'), {
        bandPosition: this._bandPosition
      }) + offset
    );
  }

  dataToOpacity(datum: Datum): number {
    if (
      this.isPositionXOuterRange(datum, this._fromField + '_xField') ||
      this.isPositionXOuterRange(datum, this._toField + '_xField') ||
      datum[this._fromField] === datum[this._toField]
    ) {
      return 0;
    }
    return 1;
  }

  /**
   * @description 用于判断link的箭头方向
   */
  isPositionYFromHigher(datum: Datum): boolean {
    return this.dataToPositionYFrom(datum) < this.dataToPositionYTo(datum);
  }

  /**
   * @description 用于判断link的起点、终点坐标是否超出range范围
   */
  isPositionXOuterRange(datum: Datum, field: string): boolean {
    if (!this._xAxisHelper) {
      return false;
    }
    const { dataToPosition, getScale } = this._xAxisHelper;

    if (
      dataToPosition(this.getDatumPositionValues(datum, field), {
        bandPosition: this._bandPosition
      }) < getScale(0).range()[0] ||
      dataToPosition(this.getDatumPositionValues(datum, field), {
        bandPosition: this._bandPosition
      }) > getScale(0).range()[1]
    ) {
      return true;
    }
    return false;
  }

  /**
   * @override
   * @description 如果用户设置了dotType，则seriesGroup作为颜色映射字段
   */
  getDefaultColorDomain() {
    return this._dotTypeField
      ? this._viewDataStatistics?.latestData[this._dotTypeField].values
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
      field: this._dotTypeField ?? this._seriesField ?? DEFAULT_DATA_SERIES_FIELD
    };
  }

  protected initTooltip() {
    this._tooltipHelper = new LinkSeriesTooltipHelper(this);
    this._linkMark && this._tooltipHelper.activeTriggerSet.mark.add(this._linkMark);
    this._arrowMark && this._tooltipHelper.activeTriggerSet.mark.add(this._arrowMark);
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

  getDotInfoData() {
    return (this._linkMark ?? this._arrowMark)?.getData();
  }

  getActiveMarks(): IMark[] {
    return [this._linkMark, this._arrowMark];
  }
}

export const registerLinkSeries = () => {
  Factory.registerMark(RuleMark.type, RuleMark);
  Factory.registerMark(SymbolMark.type, SymbolMark);
  Factory.registerSeries(LinkSeries.type, LinkSeries);
};
