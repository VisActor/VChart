/* eslint-disable no-duplicate-imports */
import type { IRuleMark } from '../../mark/rule';
import { isNil } from '@visactor/vutils';
import {
  AttributeLevel,
  PREFIX,
  STACK_FIELD_END,
  STACK_FIELD_START,
  WaterfallDefaultSeriesField
} from '../../constant/index';
import { waterfall, waterfallFillTotal } from '../../data/transforms/waterfall';
import { BarSeries } from '../bar/bar';
import { valueInScaleRange } from '../../util';
import type { WaterfallAppearPreset } from './animation';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import type { IWaterfallSeriesSpec, IWaterfallSeriesTheme } from './interface';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { ITransformOptions, DataView } from '@visactor/vdataset';
import { registerDataSetInstanceTransform } from '../../data/register';
import { SeriesData } from '../base/series-data';
import { dataViewFromDataView } from '../../data/initialize';
import type { IStateAnimateSpec } from '../../animation/spec';
import { MarkTypeEnum } from '../../mark/interface';
import type { ITextMark } from '../../mark/text';
import type { IModelEvaluateOption } from '../../model/interface';
import type { Datum, Maybe } from '../../typings';
import { Direction } from '../../typings';
import type { IBarAnimationParams } from '../bar/animation';
import { VChart } from '../../core/vchart';
import { RuleMark } from '../../mark/rule';

VChart.useMark([RuleMark]);

export const DefaultBandWidth = 6; // 默认的bandWidth，避免连续轴没有bandWidth

export class WaterfallSeries extends BarSeries<any> {
  static readonly type: string = SeriesTypeEnum.waterfall;
  type = SeriesTypeEnum.waterfall;

  static readonly mark: SeriesMarkMap = {
    ...BarSeries.mark,
    [SeriesMarkNameEnum.leaderLine]: { name: SeriesMarkNameEnum.leaderLine, type: MarkTypeEnum.rule },
    [SeriesMarkNameEnum.stackLabel]: { name: SeriesMarkNameEnum.stackLabel, type: MarkTypeEnum.text }
  };

  protected declare _theme: Maybe<IWaterfallSeriesTheme>;

  protected _stack: boolean = true;

  protected _totalData?: SeriesData;

  protected declare _spec: IWaterfallSeriesSpec;

  protected _leaderLineMark: IRuleMark = null;
  protected _stackLabelMark: ITextMark = null;
  protected _labelMark: ITextMark = null;

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this._stack = false;
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
    const animationParams: IBarAnimationParams = {
      yField: this.direction === 'horizontal' ? this._fieldY[0] : this.getStackValueField(),
      xField: this.direction === 'horizontal' ? this.getStackValueField() : this._fieldX[0],
      direction: this.direction,
      growFrom: () =>
        this.direction === 'horizontal'
          ? this._xAxisHelper?.getScale(0).scale(0)
          : this._yAxisHelper?.getScale(0).scale(0)
    };
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<WaterfallAppearPreset>)?.preset;

    // 分组数据的dataIndex应该与x轴顺序一致，而非data[DEFAULT_DATA_INDEX]顺序
    const dataIndex = (datum: any) => {
      const xValue = datum?.[this._fieldX[0]];
      const xIndex = this.getViewDataStatistics()?.latestData?.[this._fieldX[0]]?.values.indexOf(xValue);
      // 不应该出现xIndex === -1 || undefined的情况
      return xIndex || 0;
    };

    this._rectMark.setAnimationConfig(
      animationConfig(
        DEFAULT_MARK_ANIMATION.waterfall(animationParams, appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.bar, this._spec),
        { dataIndex }
      )
    );

    if (this._labelMark) {
      this._labelMark.setAnimationConfig(
        animationConfig(DEFAULT_MARK_ANIMATION.label(), userAnimationConfig(SeriesMarkNameEnum.label, this._spec), {
          dataIndex
        })
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
      key: 'index'
    }) as IRuleMark;
    if (leaderLine) {
      this._leaderLineMark = leaderLine;
      leaderLine.setDataView(this._totalData.getDataView(), this._totalData.getProductId());
    }
    const stackLabel = this._createMark(WaterfallSeries.mark.stackLabel, {
      key: 'index'
    }) as ITextMark;
    if (stackLabel) {
      this._stackLabelMark = stackLabel;
      stackLabel.setDataView(this._totalData.getDataView(), this._totalData.getProductId());
    }
  }

  protected _totalPositionX(datum: Datum, field: string, pos: number = 0.5) {
    const { dataToPosition, getBandwidth } = this._xAxisHelper;
    if (this._direction === Direction.vertical) {
      return (
        dataToPosition([datum[field]], {
          bandPosition: this._bandPosition
        }) +
        getBandwidth(0) * 0.5 -
        (this._rectMark.getAttribute('width', datum) as number) * (0.5 - pos)
      );
    }
    return valueInScaleRange(
      dataToPosition([datum[field]], {
        bandPosition: this._bandPosition
      })
    );
  }

  protected _totalPositionY(datum: Datum, field: string, pos: number = 0.5) {
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
      (this._rectMark.getAttribute('height', datum) as number) * (0.5 - pos)
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
              return this._totalPositionX(datum, 'lastIndex', 1);
            },
            x1: (datum: Datum) => this._totalPositionX(datum, 'index', 0),
            y: (datum: Datum) => this._totalPositionY(datum, 'lastEnd', 0),
            y1: (datum: Datum) => this._totalPositionY(datum, datum.isTotal ? 'end' : 'start', 0)
          },
          'normal',
          AttributeLevel.Series
        );
      } else {
        this.setMarkStyle(
          this._leaderLineMark,
          {
            visible: (datum: Datum) => !isNil(datum.lastIndex),
            x: (datum: Datum) => this._totalPositionX(datum, 'lastEnd', 0),
            x1: (datum: Datum) => this._totalPositionX(datum, datum.isTotal ? 'end' : 'start', 0),
            y: (datum: Datum) => {
              if (!datum.lastIndex) {
                return 0;
              }
              return this._totalPositionY(datum, 'lastIndex', 1);
            },
            y1: (datum: Datum) => this._totalPositionY(datum, 'index', 0)
          },
          'normal',
          AttributeLevel.Series
        );
      }
    }

    if (this._stackLabelMark) {
      this.setMarkStyle(this._stackLabelMark, {
        text: (datum: Datum) => {
          const text = this._spec.stackLabel?.valueType === 'absolute' ? datum.end : datum.end - datum.start;
          if (this._spec.stackLabel?.formatMethod) {
            return this._spec.stackLabel.formatMethod(text, datum);
          }
          return text;
        }
      });
      const pos = this._spec.stackLabel?.position || 'withChange';
      const offset = this._spec.stackLabel?.offset || 0;
      if (this._direction === Direction.vertical) {
        this.setMarkStyle(this._stackLabelMark, {
          x: (datum: Datum) => this._totalPositionX(datum, 'index', 0.5),
          y: (datum: Datum) => {
            if (pos === 'middle') {
              return (this._totalPositionY(datum, 'end') + this._totalPositionY(datum, 'start')) * 0.5;
            } else if (pos === 'max') {
              return this._totalPositionY(datum, datum.end >= datum.start ? 'end' : 'start') - offset;
            } else if (pos === 'min') {
              return this._totalPositionY(datum, datum.end >= datum.start ? 'start' : 'end') + offset;
            }
            return this._totalPositionY(datum, 'end') + (datum.end >= datum.start ? -offset : offset);
          },
          textBaseline: (datum: Datum) => {
            if (pos === 'middle') {
              return 'middle';
            } else if ((pos === 'withChange' && datum.end - datum.start >= 0) || pos === 'max') {
              return 'bottom';
            }
            return 'top';
          }
        });
      } else {
        this.setMarkStyle(this._stackLabelMark, {
          x: (datum: Datum) => {
            if (pos === 'middle') {
              return (this._totalPositionX(datum, 'end') + this._totalPositionY(datum, 'start')) * 0.5;
            } else if (pos === 'max') {
              return this._totalPositionX(datum, datum.end >= datum.start ? 'end' : 'start') + offset;
            } else if (pos === 'min') {
              return this._totalPositionX(datum, datum.end >= datum.start ? 'start' : 'end') - offset;
            }
            return this._totalPositionX(datum, 'end') + (datum.end >= datum.start ? offset : -offset);
          },
          y: (datum: Datum) => this._totalPositionY(datum, 'index', 0.5),
          textAlign: (datum: Datum) => {
            if (pos === 'middle') {
              return 'center';
            } else if ((pos === 'withChange' && datum.end - datum.start >= 0) || pos === 'max') {
              return 'left';
            }
            return 'right';
          }
        });
      }
    }
  }
}
