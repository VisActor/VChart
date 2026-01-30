import type { StringOrNumber } from '@visactor/vchart';
import {
  AttributeLevel,
  BaseSeries,
  DEFAULT_DATA_KEY,
  Factory,
  MarkTypeEnum,
  SeriesMarkNameEnum,
  baseSeriesMark,
  registerSymbolMark,
  registerTextMark,
  registerLineMark,
  STATE_VALUE_ENUM,
  type Datum,
  type IMark,
  type IPoint,
  type SeriesMarkMap,
  BaseSeriesSpecTransformer
} from '@visactor/vchart';
import { EVENT_SERIES_TYPE } from './constant';
import type { IEventSeriesSpec, LabelPosition } from './interface';

type AxisHelper = {
  isContinuous?: boolean;
  getSpec?: () => { type?: string };
  dataToPosition?: (values: any[], cfg?: { bandPosition?: number }) => number;
  valueToPosition?: (value: any) => number;
};

/** 默认 title 字体大小 */
const DEFAULT_TITLE_FONT_SIZE = 14;
/** 默认 dot 和 label 之间的间距 */
const DEFAULT_DOT_LABEL_GAP = 6;
/** 默认 title 和 subTitle 之间的间距 */
const DEFAULT_TITLE_SUBTITLE_GAP = 4;

const eventSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.line]: { name: SeriesMarkNameEnum.line, type: MarkTypeEnum.line },
  [SeriesMarkNameEnum.dot]: { name: SeriesMarkNameEnum.dot, type: MarkTypeEnum.symbol },
  [SeriesMarkNameEnum.title]: { name: SeriesMarkNameEnum.title, type: MarkTypeEnum.text },
  [SeriesMarkNameEnum.subTitle]: { name: SeriesMarkNameEnum.subTitle, type: MarkTypeEnum.text }
};

export class EventSeries<T extends IEventSeriesSpec = IEventSeriesSpec> extends BaseSeries<T> {
  static readonly type: string = EVENT_SERIES_TYPE;
  type = EVENT_SERIES_TYPE as any;

  static readonly mark: SeriesMarkMap = eventSeriesMark;
  static readonly transformerConstructor = BaseSeriesSpecTransformer as any;
  readonly transformerConstructor = BaseSeriesSpecTransformer as any;

  protected declare _spec: T;

  private _dotMark?: IMark;
  private _titleMark?: IMark;
  private _subTitleMark?: IMark;
  private _axisLineMark?: IMark;

  private _timeField?: string;
  private _eventField?: string;
  private _subTitleField?: string;
  private _layoutType?: T['layoutType'];
  private _labelPosition?: LabelPosition;
  private _xAxisHelper?: AxisHelper;
  private _yAxisHelper?: AxisHelper;
  private _scaleX?: unknown;
  private _scaleY?: unknown;

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this.setSeriesField(this._spec.seriesField);
    this._timeField = this._spec.timeField as string | undefined;
    this._eventField = this._spec.eventField;
    this._subTitleField = this._spec.subTitleField;
    this._layoutType = this._spec.layoutType;
    this._labelPosition = this._spec.labelPosition;
  }

  getDimensionField(): string[] {
    return this._timeField ? [this._timeField] : [];
  }

  getMeasureField(): string[] {
    return [];
  }

  initMark(): void {
    this._axisLineMark = this._createMark(EventSeries.mark.line, {
      isSeriesMark: true,
      groupKey: this._seriesField
    });

    this._dotMark = this._createMark(EventSeries.mark.dot, {
      isSeriesMark: true
    });

    this._titleMark = this._createMark(EventSeries.mark.title);

    this._subTitleMark = this._createMark(EventSeries.mark.subTitle);
  }

  initMarkStyle(): void {
    if (this._axisLineMark) {
      this.setMarkStyle(
        this._axisLineMark,
        {
          points: this._getAxisPoints.bind(this),
          visible: this._isFirstDataInGroup.bind(this),
          stroke: '#c0c3c7',
          lineWidth: 1
        },
        STATE_VALUE_ENUM.STATE_NORMAL,
        AttributeLevel.Series
      );
    }

    const dotSpec = this._spec.dot as { size?: number; style?: { size?: number; fill?: unknown } } | undefined;
    const dotSize =
      typeof dotSpec?.style?.size === 'number'
        ? dotSpec.style.size
        : typeof dotSpec?.size === 'number'
        ? dotSpec.size
        : 8;

    const titleStyle = this._spec.title?.style ?? {};
    const subTitleStyle = this._spec.subTitle?.style ?? {};

    // 获取 title 字体大小，用于计算 subTitle 的位置
    const titleFontSize = typeof titleStyle.fontSize === 'number' ? titleStyle.fontSize : DEFAULT_TITLE_FONT_SIZE;

    // dot 和 label 之间的间距
    const labelOffset = dotSize / 2 + DEFAULT_DOT_LABEL_GAP;

    if (this._dotMark) {
      this.setMarkStyle(
        this._dotMark,
        {
          x: (datum: Datum) => this._getPoint(datum).x,
          y: (datum: Datum) => this._getPoint(datum).y,
          size: dotSize,
          fill: dotSpec?.style?.fill ?? this.getColorAttribute()
        },
        STATE_VALUE_ENUM.STATE_NORMAL,
        AttributeLevel.Series
      );
    }

    if (this._titleMark) {
      this.setMarkStyle(
        this._titleMark,
        {
          fontSize: DEFAULT_TITLE_FONT_SIZE,
          ...titleStyle,
          x: (datum: Datum) => this._getTitlePosition(datum, labelOffset).x,
          y: (datum: Datum) => this._getTitlePosition(datum, labelOffset).y,
          textAlign: (datum: Datum) => this._getLabelTextAlign(datum),
          textBaseline: (datum: Datum) => this._getLabelTextBaseline(datum),
          text: (datum: Datum) => this._getDatumString(datum, this._eventField)
        },
        STATE_VALUE_ENUM.STATE_NORMAL,
        AttributeLevel.Series
      );
    }

    if (this._subTitleMark) {
      // subTitle 位置 = title 位置 + title 字体大小 + 间距
      const subTitleOffset = labelOffset + titleFontSize + DEFAULT_TITLE_SUBTITLE_GAP;

      this.setMarkStyle(
        this._subTitleMark,
        {
          ...subTitleStyle,
          x: (datum: Datum) => this._getSubTitlePosition(datum, subTitleOffset).x,
          y: (datum: Datum) => this._getSubTitlePosition(datum, subTitleOffset).y,
          textAlign: (datum: Datum) => this._getLabelTextAlign(datum),
          textBaseline: (datum: Datum) => this._getLabelTextBaseline(datum),
          text: (datum: Datum) => this._getDatumString(datum, this._subTitleField)
        },
        STATE_VALUE_ENUM.STATE_NORMAL,
        AttributeLevel.Series
      );
    }
  }

  /**
   * 根据数据索引判断标签应该放在哪一侧
   * @returns 'primary' 表示 top/left，'secondary' 表示 bottom/right
   */
  private _getLabelSide(datum: Datum): 'primary' | 'secondary' {
    const data = this._getViewDataList();
    const index = data.indexOf(datum);
    const position = this._labelPosition;

    if (this._layoutType === 'vertical') {
      // vertical 布局: left/right
      switch (position) {
        case 'left':
          return 'primary';
        case 'right':
          return 'secondary';
        case 'left-right':
          return index % 2 === 0 ? 'primary' : 'secondary';
        case 'right-left':
          return index % 2 === 0 ? 'secondary' : 'primary';
        default:
          return 'primary'; // 默认 left
      }
    } else {
      // horizontal 布局: top/bottom
      switch (position) {
        case 'top':
          return 'primary';
        case 'bottom':
          return 'secondary';
        case 'top-bottom':
          return index % 2 === 0 ? 'primary' : 'secondary';
        case 'bottom-top':
          return index % 2 === 0 ? 'secondary' : 'primary';
        default:
          return 'primary'; // 默认 top
      }
    }
  }

  /**
   * 获取标签的文本对齐方式
   */
  private _getLabelTextAlign(datum: Datum): 'left' | 'right' | 'center' {
    if (this._layoutType === 'vertical') {
      const side = this._getLabelSide(datum);
      return side === 'primary' ? 'right' : 'left';
    }
    return 'center';
  }

  /**
   * 获取标签的文本基线
   */
  private _getLabelTextBaseline(datum: Datum): 'top' | 'bottom' | 'middle' {
    if (this._layoutType === 'vertical') {
      return 'middle';
    }
    const side = this._getLabelSide(datum);
    return side === 'primary' ? 'bottom' : 'top';
  }

  /**
   * 获取 title 的位置
   */
  private _getTitlePosition(datum: Datum, offset: number): IPoint {
    const point = this._getPoint(datum);
    const side = this._getLabelSide(datum);

    if (this._layoutType === 'vertical') {
      // vertical: left/right
      return {
        x: side === 'primary' ? point.x - offset : point.x + offset,
        y: point.y
      };
    }
    // horizontal: top/bottom
    return {
      x: point.x,
      y: side === 'primary' ? point.y - offset : point.y + offset
    };
  }

  /**
   * 获取 subTitle 的位置
   */
  private _getSubTitlePosition(datum: Datum, offset: number): IPoint {
    const point = this._getPoint(datum);
    const side = this._getLabelSide(datum);

    if (this._layoutType === 'vertical') {
      // vertical: left/right
      return {
        x: side === 'primary' ? point.x - offset : point.x + offset,
        y: point.y
      };
    }
    // horizontal: top/bottom
    return {
      x: point.x,
      y: side === 'primary' ? point.y - offset : point.y + offset
    };
  }

  private _getViewDataList(): Datum[] {
    return this.getViewData()?.latestData ?? [];
  }

  private _getPoint(datum: Datum): IPoint {
    const rect = this._region.getLayoutRect();
    const data = this._getViewDataList();
    const index = data.indexOf(datum);
    const count = Math.max(1, data.length);

    // 计算时间方向的位置 (水平布局时是 x，垂直布局时是 y)
    let timePercent: number;
    if (this._timeField && datum) {
      const timeValue = (datum as Record<string, unknown>)[this._timeField];
      if (typeof timeValue === 'number') {
        // 获取所有时间值来计算范围
        const timeValues = data
          .map(d => (d as Record<string, unknown>)[this._timeField!] as number)
          .filter(v => typeof v === 'number');
        const minTime = Math.min(...timeValues);
        const maxTime = Math.max(...timeValues);

        if (maxTime !== minTime) {
          timePercent = (timeValue - minTime) / (maxTime - minTime);
        } else {
          timePercent = 0.5;
        }
      } else {
        timePercent = (index + 0.5) / count;
      }
    } else {
      timePercent = (index + 0.5) / count;
    }

    // 计算分类方向的位置（如果有 seriesField）
    let categoryPercent = 0.5;
    if (this._seriesField && datum) {
      const categoryValue = (datum as Record<string, unknown>)[this._seriesField];
      const uniqueCategories = Array.from(new Set(data.map(d => (d as Record<string, unknown>)[this._seriesField!])));
      const categoryIndex = uniqueCategories.indexOf(categoryValue);
      const categoryCount = Math.max(1, uniqueCategories.length);
      categoryPercent = (categoryIndex + 0.5) / categoryCount;
    }

    if (this._layoutType === 'vertical') {
      return {
        x: rect.width * categoryPercent,
        y: rect.height * timePercent
      };
    }

    return {
      x: rect.width * timePercent,
      y: rect.height * categoryPercent
    };
  }

  private _getAxisPoints(datum: Datum): IPoint[] {
    const rect = this._region.getLayoutRect();
    const data = this._getViewDataList();

    // 计算分类方向的位置
    let categoryPercent = 0.5;
    if (this._seriesField && datum) {
      const categoryValue = (datum as Record<string, unknown>)[this._seriesField];
      const uniqueCategories = Array.from(new Set(data.map(d => (d as Record<string, unknown>)[this._seriesField!])));
      const categoryIndex = uniqueCategories.indexOf(categoryValue);
      const categoryCount = Math.max(1, uniqueCategories.length);
      categoryPercent = (categoryIndex + 0.5) / categoryCount;
    }

    if (this._layoutType === 'vertical') {
      const x = rect.width * categoryPercent;
      return [
        { x, y: 0 },
        { x, y: rect.height }
      ];
    }

    const y = rect.height * categoryPercent;
    return [
      { x: 0, y },
      { x: rect.width, y }
    ];
  }

  private _isFirstDataInGroup(datum: Datum): boolean {
    if (!this._seriesField) {
      const data = this._getViewDataList();
      return data.indexOf(datum) === 0;
    }

    const data = this._getViewDataList();
    const categoryValue = (datum as Record<string, unknown>)[this._seriesField];

    // 找到该分类中的第一条数据
    const firstInGroup = data.find(d => (d as Record<string, unknown>)[this._seriesField!] === categoryValue);
    return datum === firstInGroup;
  }

  private _getDatumString(datum: Datum | undefined, field?: string): string {
    if (!datum || !field) {
      return '';
    }
    const value = (datum as Record<string, unknown>)[field];
    return typeof value === 'string' ? value : value == null ? '' : String(value);
  }

  getStatisticFields(): { key: string; operations: Array<'max' | 'min' | 'values'>; customize?: any[] }[] {
    const fields: { key: string; operations: Array<'max' | 'min' | 'values'>; customize?: any[] }[] = [];

    if (this._timeField) {
      fields.push({ key: this._timeField, operations: ['max', 'min', 'values'] });
    }

    if (this._seriesField) {
      fields.push({ key: this._seriesField, operations: ['values'] });
    }

    return fields;
  }

  getGroupFields(): string[] {
    return this._seriesField ? [this._seriesField] : [];
  }

  getXAxisHelper(): AxisHelper | undefined {
    return this._xAxisHelper;
  }

  setXAxisHelper(h: AxisHelper) {
    this._xAxisHelper = h;
    this.onMarkPositionUpdate();
  }

  get scaleX(): unknown {
    return this._scaleX;
  }

  setScaleX(s: unknown) {
    this._scaleX = s;
  }

  getYAxisHelper(): AxisHelper | undefined {
    return this._yAxisHelper;
  }

  setYAxisHelper(h: AxisHelper) {
    this._yAxisHelper = h;
    this.onMarkPositionUpdate();
  }

  get scaleY(): unknown {
    return this._scaleY;
  }

  setScaleY(s: unknown) {
    this._scaleY = s;
  }

  dataToPosition(data: Datum): IPoint {
    return this._getPoint(data);
  }

  dataToPositionX(data: Datum): number {
    return this._getPoint(data).x;
  }

  dataToPositionY(data: Datum): number {
    return this._getPoint(data).y;
  }

  valueToPosition(timeValue: StringOrNumber, eventValue?: StringOrNumber): IPoint {
    if (timeValue && typeof timeValue === 'object') {
      return this.dataToPosition(timeValue as Datum);
    }

    const mockDatum: Record<string, unknown> = {};
    if (this._timeField) {
      mockDatum[this._timeField] = timeValue;
    }
    if (this._eventField && eventValue !== undefined) {
      mockDatum[this._eventField] = eventValue;
    }
    return this._getPoint(mockDatum as Datum);
  }

  getStackGroupFields(): string[] {
    return [];
  }

  getStackValueField(): string | undefined {
    return undefined;
  }

  getActiveMarks(): IMark[] {
    return [this._axisLineMark, this._dotMark, this._titleMark, this._subTitleMark].filter(Boolean) as IMark[];
  }
}

export const registerEventSeries = () => {
  registerSymbolMark();
  registerTextMark();
  registerLineMark();
  Factory.registerSeries(EventSeries.type, EventSeries);
};
