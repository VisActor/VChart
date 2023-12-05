/* eslint-disable no-duplicate-imports */
import type { IRuleMark } from '../../mark/rule';
import { isNil, precisionSub } from '@visactor/vutils';
import {
  AttributeLevel,
  PREFIX,
  STACK_FIELD_END,
  STACK_FIELD_START,
  WaterfallDefaultSeriesField
} from '../../constant/index';
import { waterfall, waterfallFillTotal } from '../../data/transforms/waterfall';
import { BarSeries } from '../bar/bar';
import { valueInScaleRange } from '../../util/scale';
import { registerWaterfallAnimation, type WaterfallAppearPreset } from './animation';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import type { IWaterfallSeriesSpec, IWaterfallSeriesTheme } from './interface';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import { registerFadeInOutAnimation } from '../../animation/config';
import type { ITransformOptions, DataView } from '@visactor/vdataset';
import { registerDataSetInstanceTransform } from '../../data/register';
import { SeriesData } from '../base/series-data';
import { dataViewFromDataView } from '../../data/initialize';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { ITextMark } from '../../mark/text';
import type { IModelEvaluateOption } from '../../model/interface';
import type { Datum, Maybe } from '../../typings';
import { Direction } from '../../typings/space';
import type { IBarAnimationParams } from '../bar/animation';
import { RuleMark } from '../../mark/rule';
import { waterfallSeriesMark } from './constant';
import { Group } from '../base/group';
import type { ILabelMark } from '../../mark/label';
import { LabelRule } from '../../component/label/util';
import { Factory } from '../../core/factory';
import { RectMark } from '../../mark';
import { getGroupAnimationParams } from '../util/utils';

export const DefaultBandWidth = 6; // 默认的bandWidth，避免连续轴没有bandWidth

export class WaterfallSeries<T extends IWaterfallSeriesSpec = IWaterfallSeriesSpec> extends BarSeries<any> {
  static readonly type: string = SeriesTypeEnum.waterfall;
  type = SeriesTypeEnum.waterfall;

  static readonly mark: SeriesMarkMap = waterfallSeriesMark;

  protected _stack: boolean = false;

  protected declare _theme: Maybe<IWaterfallSeriesTheme>;

  protected _totalData?: SeriesData;
  getTotalData() {
    return this._totalData?.getLatestData();
  }

  protected declare _spec: T;

  protected _leaderLineMark: IRuleMark = null;
  protected _stackLabelMark: ITextMark = null;
  protected _labelMark: ITextMark = null;

  protected initGroups() {
    const groupFields = this.getGroupFields();
    if (groupFields && groupFields.length) {
      this._groups = new Group(groupFields);
      this._data && this._groups.initData(this._data.getDataView(), this._dataSet);
    }
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    // waterfall data stack data
    this.setValueFieldToStack();
    // 不支持多维度;
    this._fieldX = [this._fieldX[0]];
    this._fieldY = [this._fieldY[0]];
    if (isNil(this._seriesField)) {
      this._seriesField = WaterfallDefaultSeriesField;
    }
  }

  getSeriesKeys(): string[] {
    if (this._seriesField === WaterfallDefaultSeriesField) {
      return [
        this._theme.seriesFieldName.increase,
        this._theme.seriesFieldName.decrease,
        this._theme.seriesFieldName.total
      ];
    }
    return super.getSeriesKeys();
  }

  protected initData(): void {
    super.initData();
    registerDataSetInstanceTransform(this._dataSet, 'waterfallFillTotal', waterfallFillTotal);
    registerDataSetInstanceTransform(this._dataSet, 'waterfall', waterfall);
    // 如果要在最后添加总计
    if (isNil(this._spec.total) || this._spec.total.type === 'end') {
      this._rawData?.transform(
        {
          type: 'waterfallFillTotal',
          options: {
            indexField: this.getGroupFields()[0],
            valueField: this.getStackValueField(),
            seriesField: this.getSeriesField(),
            seriesFieldName: this._theme.seriesFieldName,
            total: this._spec.total
          }
        },
        false
      );
    }
    // 总计数据
    const totalData = dataViewFromDataView(this.getViewData(), this._dataSet, {
      name: `${PREFIX}_series_${this.id}_totalData`
    });
    this.getViewData().target.removeListener('change', totalData.reRunAllTransform);
    this._totalData = new SeriesData(this._option, totalData);
    totalData.transform(
      {
        type: 'waterfall',
        options: {
          indexField: this.getGroupFields()[0],
          valueField: this.getStackValueField(),
          seriesField: this.getSeriesField(),
          seriesFieldName: this._theme.seriesFieldName,
          startAs: STACK_FIELD_START,
          endAs: STACK_FIELD_END,
          total: this._spec.total,
          groupData: () => this.getGroups().groupData
        }
      },
      false
    );
  }

  initAnimation() {
    // 这个数据在这个时候拿不到，因为组件还没创建结束，统计和筛选也还没添加。
    // 而且这个值理论上是动态的，建议 监听 viewDataStatisticsUpdate 消息动态更新
    const waterfallAnimationParams: IBarAnimationParams = {
      yField: this.direction === 'horizontal' ? this._fieldY[0] : this.getStackValueField(),
      xField: this.direction === 'horizontal' ? this.getStackValueField() : this._fieldX[0],
      direction: this.direction,
      growFrom: () =>
        this.direction === 'horizontal'
          ? this._xAxisHelper?.getScale(0).scale(0)
          : this._yAxisHelper?.getScale(0).scale(0)
    };
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<WaterfallAppearPreset>)?.preset;
    const animationParams = getGroupAnimationParams(this);

    this._barMark.setAnimationConfig(
      animationConfig(
        Factory.getAnimationInKey('waterfall')?.(waterfallAnimationParams, appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.bar, this._spec, this._markAttributeContext),
        animationParams
      )
    );

    if (this._leaderLineMark) {
      this._leaderLineMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('fadeInOut')?.(),
          userAnimationConfig(SeriesMarkNameEnum.leaderLine, this._spec, this._markAttributeContext)
        )
      );
    }
  }

  viewDataUpdate(d: DataView): void {
    this._totalData.getDataView().reRunAllTransform();
    this._totalData.updateData();
    super.viewDataUpdate(d);
  }
  /**
   * data
   */
  // waterfall 不支持任何的 data filter
  addViewDataFilter(_option: ITransformOptions) {
    // do nothing
  }
  reFilterViewData() {
    // do nothing
  }

  onEvaluateEnd(ctx: IModelEvaluateOption): void {
    super.onEvaluateEnd(ctx);
    this._totalData.updateData();
  }

  initMark(): void {
    super.initMark();
    const leaderLine = this._createMark(WaterfallSeries.mark.leaderLine, {
      key: 'index',
      customShape: this._spec.leaderLine?.customShape
    }) as IRuleMark;
    if (leaderLine) {
      this._leaderLineMark = leaderLine;
      leaderLine.setDataView(this._totalData.getDataView(), this._totalData.getProductId());
    }
    if (this._spec.stackLabel?.visible) {
      this._barMark.addLabelSpec(this._preprocessLabelSpec(this._spec.stackLabel));
    }
  }

  initLabelMarkStyle(labelMark: ILabelMark): void {
    if (!labelMark) {
      return;
    }

    if (!this._labelMark && this._spec.label?.visible) {
      super.initLabelMarkStyle(labelMark);
      this._labelMark = labelMark;
      return;
    }

    this._stackLabelMark = labelMark;
    // 瀑布图标签 encode 在自定义布局中计算
    labelMark.skipEncode = true;
    labelMark.setRule(LabelRule.stackLabel);
    labelMark.setDataView(this._totalData.getDataView(), this._totalData.getProductId());

    this.setMarkStyle(labelMark, {
      text: (datum: Datum) => {
        return this._spec.stackLabel?.valueType === 'absolute' ? datum.end : precisionSub(datum.end, datum.start);
      }
    });
  }

  totalPositionX(datum: Datum, field: string, pos: number = 0.5) {
    const { dataToPosition, getBandwidth } = this._xAxisHelper;
    if (this._direction === Direction.vertical) {
      return (
        dataToPosition([datum[field]], {
          bandPosition: this._bandPosition
        }) +
        getBandwidth(0) * 0.5 -
        (this._barMark.getAttribute('width', datum) as number) * (0.5 - pos)
      );
    }
    return valueInScaleRange(
      dataToPosition([datum[field]], {
        bandPosition: this._bandPosition
      })
    );
  }

  totalPositionY(datum: Datum, field: string, pos: number = 0.5) {
    const { dataToPosition, getBandwidth } = this._yAxisHelper;
    if (this._direction === Direction.vertical) {
      return valueInScaleRange(
        dataToPosition([datum[field]], {
          bandPosition: this._bandPosition
        })
      );
    }
    return (
      dataToPosition([datum[field]], {
        bandPosition: this._bandPosition
      }) +
      getBandwidth(0) * 0.5 -
      (this._barMark.getAttribute('height', datum) as number) * (0.5 - pos)
    );
  }

  initMarkStyle(): void {
    super.initMarkStyle();
    if (this._leaderLineMark) {
      if (this._direction === Direction.vertical) {
        this.setMarkStyle(
          this._leaderLineMark,
          {
            visible: (datum: Datum) => !isNil(datum.lastIndex),
            x: (datum: Datum) => {
              if (!datum.lastIndex) {
                return 0;
              }
              return this.totalPositionX(datum, 'lastIndex', 1);
            },
            x1: (datum: Datum) => this.totalPositionX(datum, 'index', 0),
            y: (datum: Datum) => this.totalPositionY(datum, 'lastEnd', 0),
            y1: (datum: Datum) => this.totalPositionY(datum, datum.isTotal ? 'end' : 'start', 0)
          },
          'normal',
          AttributeLevel.Series
        );
      } else {
        this.setMarkStyle(
          this._leaderLineMark,
          {
            visible: (datum: Datum) => !isNil(datum.lastIndex),
            x: (datum: Datum) => this.totalPositionX(datum, 'lastEnd', 0),
            x1: (datum: Datum) => this.totalPositionX(datum, datum.isTotal ? 'end' : 'start', 0),
            y: (datum: Datum) => {
              if (!datum.lastIndex) {
                return 0;
              }
              return this.totalPositionY(datum, 'lastIndex', 1);
            },
            y1: (datum: Datum) => this.totalPositionY(datum, 'index', 0)
          },
          'normal',
          AttributeLevel.Series
        );
      }
    }
  }
}

export const registerWaterfallSeries = () => {
  Factory.registerMark(RuleMark.type, RuleMark);
  Factory.registerMark(RectMark.type, RectMark);
  Factory.registerSeries(WaterfallSeries.type, WaterfallSeries);
  registerWaterfallAnimation();
  registerFadeInOutAnimation();
};
