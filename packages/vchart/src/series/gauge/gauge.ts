import { MarkTypeEnum } from '../../mark/interface';
// eslint-disable-next-line no-duplicate-imports
import { isValid, radians } from '../../util';
import { SeriesTypeEnum } from '../interface';
import type { IGaugeSeriesSpec, IGaugeSeriesTheme } from './interface';
import { ProgressLikeSeries } from '../polar/progress-like/progress-like';
import type { IProgressArcMark } from '../../mark/progress-arc';
import { DataSet, DataView, dataViewParser } from '@visactor/vdataset';
import { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../../data/register';
import { SEGMENT_FIELD_END, SEGMENT_FIELD_START } from '../../constant';
import type { Datum } from '@visactor/vgrammar';
import type { Maybe } from '../../typings';

export class GaugeSeries extends ProgressLikeSeries<IGaugeSeriesSpec> {
  static readonly type: string = SeriesTypeEnum.gauge;
  type = SeriesTypeEnum.gauge;

  protected declare _theme: Maybe<IGaugeSeriesTheme>;

  private _segmentMark: IProgressArcMark | null = null;
  private _trackMark: IProgressArcMark | null = null;

  protected _stack: boolean = false;
  protected _padAngle: number = 0;

  protected _segmentData: DataView;

  setAttrFromSpec(): void {
    super.setAttrFromSpec();

    this._padAngle = radians(this._spec.padAngle ?? 0);
  }

  initData(): void {
    super.initData();

    /**
     * @description 将数据排序并调整图元的起始点为上一个数据的终点，但是终点维持不变
     */
    const spiltSegment = (data: Array<DataView>, op: string) => {
      // 数据处理
      const dataCollect = [...data[0].latestData];
      dataCollect.sort((a, b) => a[this._angleField[0]] - b[this._angleField[0]]);
      dataCollect.forEach((datum: any, i) => {
        datum[SEGMENT_FIELD_END] = datum[this._angleField[0]];
        if (i > 0) {
          datum[SEGMENT_FIELD_START] = dataCollect[i - 1][SEGMENT_FIELD_END];
        } else {
          datum[SEGMENT_FIELD_START] = undefined;
        }
      });
      return dataCollect;
    };

    // data to dataview
    const dataSet = new DataSet();
    registerDataSetInstanceParser(dataSet, 'dataview', dataViewParser);
    registerDataSetInstanceTransform(dataSet, 'spiltSegment', spiltSegment);
    const segmentDataView = new DataView(dataSet);
    segmentDataView.parse([this.getViewData()], {
      type: 'dataview'
    });
    segmentDataView.transform(
      {
        type: 'spiltSegment'
      },
      false
    );

    this._segmentData = segmentDataView;
  }

  initMark(): void {
    this._trackMark = this._createMark(MarkTypeEnum.progressArc, 'track') as IProgressArcMark;
    this._segmentMark = this._createMark(MarkTypeEnum.progressArc, 'segment', {
      isSeriesMark: true,
      dataView: this._segmentData
    }) as IProgressArcMark;
  }

  initMarkStyle(): void {
    this.initTrackMarkStyle();
    this.initSegmentMarkStyle();
  }

  private initSegmentMarkStyle() {
    const segmentMark = this._segmentMark;
    if (segmentMark) {
      this.setMarkStyle(segmentMark, {
        x: () => this.angleAxisHelper.center().x,
        y: () => this.angleAxisHelper.center().y,
        startAngle: this._getAngleValueStart.bind(this),
        endAngle: this._getAngleValueEnd.bind(this),
        innerRadius: () => this._computeLayoutRadius() * (this._spec.innerRadius ?? 0),
        // 需要优先兼容this._spec.radius
        outerRadius: () => this._computeLayoutRadius() * (this._spec.radius ?? this._spec.outerRadius ?? 1),
        cap: this._spec.roundCap ?? false,
        boundsMode: 'imprecise',
        cornerRadius: this._spec.cornerRadius,
        fill: this.getColorAttribute(),
        fillOpacity: 1,
        zIndex: 200,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // forceShowCap 是内部属性，不在接口中暴露
        forceShowCap: true
      });
      this._trigger.registerMark(segmentMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(segmentMark);
    }
  }

  private initTrackMarkStyle() {
    const trackMark = this._trackMark;
    if (trackMark) {
      this.setMarkStyle(trackMark, {
        x: () => this.angleAxisHelper.center().x,
        y: () => this.angleAxisHelper.center().y,
        startAngle: this._startAngle,
        endAngle: this._endAngle,
        cornerRadius: this._spec.cornerRadius,
        zIndex: 100
      });
      this._trigger.registerMark(trackMark);
    }
  }

  protected _getAngleValueStart(datum: Datum) {
    const angle = isValid(datum[SEGMENT_FIELD_START])
      ? this.angleAxisHelper.dataToPosition([datum[SEGMENT_FIELD_START]])
      : this._startAngle;
    return angle + (this._spec.padAngle ?? 0) / 2;
  }

  protected _getAngleValueEnd(datum: Datum) {
    const angle = this.angleAxisHelper.dataToPosition([datum[SEGMENT_FIELD_END]]);
    return angle - (this._spec.padAngle ?? 0) / 2;
  }
}
