import { RectMark, type IRectMark } from './../../mark/rect';
import { ChartEvent } from '../../constant/event';
import {
  AttributeLevel,
  DEFAULT_DATA_KEY,
  DEFAULT_DATA_SERIES_FIELD,
  DEFAULT_SERIES_STYLE_NAME,
  PREFIX,
  STACK_FIELD_END,
  STACK_FIELD_END_PERCENT,
  STACK_FIELD_START,
  STACK_FIELD_START_PERCENT
} from '../../constant/index';
import { SeriesMarkNameEnum } from '../interface';
import { DataView } from '@visactor/vdataset';
// eslint-disable-next-line no-duplicate-imports
import type { DataSet, ITransformOptions } from '@visactor/vdataset';
import type { IRegion } from '../../region/interface';
import type { IMark } from '../../mark/interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from '../../mark/interface';
import type {
  CoordinateType,
  IInvalidType,
  IPoint,
  DataKeyType,
  Datum,
  Maybe,
  ISeriesSpec,
  IExtensionMarkSpec,
  IExtensionGroupMarkSpec,
  EnableMarkType
} from '../../typings';
import { BaseModel } from '../../model/base-model';
// eslint-disable-next-line no-duplicate-imports
import type {
  ISeriesOption,
  ISeries,
  ISeriesMarkInitOption,
  ISeriesStackData,
  ISeriesTooltipHelper,
  SeriesMarkMap,
  ISeriesMarkInfo
} from '../interface';
import { dataViewFromDataView } from '../../data/initialize';
import {
  isNil,
  isValid,
  isBoolean,
  isString,
  merge,
  isFunction,
  isArray,
  mergeFields,
  getFieldAlias
} from '../../util';
import type { IModelEvaluateOption, IModelRenderOption } from '../../model/interface';
import { Group } from './group';
import type { AddVChartPropertyContext } from '../../data/transforms/add-property';
// eslint-disable-next-line no-duplicate-imports
import { addVChartProperty } from '../../data/transforms/add-property';
import type { ITrigger } from '../../interaction/interface';
import { Trigger } from '../../interaction/trigger';
import { registerDataSetInstanceTransform } from '../../data/register';
import type { LayoutItem } from '../../model/layout-item';
import { BaseSeriesTooltipHelper } from './tooltip-helper';
import type { StatisticOperations } from '../../data/transforms/dimension-statistics';
// eslint-disable-next-line no-duplicate-imports
import { dimensionStatistics } from '../../data/transforms/dimension-statistics';
import { invalidTravel } from '../../data/transforms/invalid-travel';
import { getDataScheme } from '../../theme/color-scheme/util';
import { SeriesData } from './series-data';
import { addDataKey, initKeyMap } from '../../data/transforms/data-key';
import type { IGroupMark } from '../../mark/group';
import { array } from '@visactor/vutils';
import type { ISeriesMarkAttributeContext } from '../../compile/mark';
import { ColorOrdinalScale } from '../../scale/color-ordinal-scale';
import { Factory } from '../../core/factory';

export abstract class BaseSeries<T extends ISeriesSpec> extends BaseModel implements ISeries {
  readonly type: string = 'series';
  layoutType: LayoutItem['layoutType'] = 'absolute';
  readonly modelType: string = 'series';
  readonly name: string | undefined = undefined;

  static readonly mark: SeriesMarkMap = {
    [SeriesMarkNameEnum.label]: { name: SeriesMarkNameEnum.label, type: MarkTypeEnum.text }
  };

  protected _trigger!: ITrigger;
  /**
   * getTrigger
   */
  getTrigger() {
    return this._trigger;
  }

  protected declare _option: ISeriesOption;

  protected declare _spec: T;

  // 坐标系信息
  readonly coordinate: CoordinateType = 'none';

  // 区域
  protected _region: IRegion = null as unknown as IRegion;
  getRegion(): IRegion {
    return this._region;
  }

  /** 系列的根 mark */
  protected _rootMark: IGroupMark = null;
  getRootMark() {
    return this._rootMark;
  }

  /** series field 所作用的 mark */
  protected _seriesMark: Maybe<IMark> = null;

  protected _layoutLevel!: number;

  /**
   * data
   * 数据节点
   * rawData 只进行 fields 相关能力，筛选+sort。
   * rawDataStatistics 的统计值是fields筛选后的。是符合预期的。
   * viewDatFilter 节点用来做组件等图表逻辑的数据筛选
   * viewData上不允许挂 filter
   * 数据更新流程一：重新做数据变换
   * viewData.reRunAllTransform()=>viewDataStatistics();
   * 数据更新流程二：图表逻辑更新，进行数据筛选
   * viewDatFilter.reRunAllTransform() => region.waitAllSeriesFilterOver()=>
   * viewData.reRunAllTransform()=>viewDataStatistics();
   * 数据更新流程三：用户更新数据
   * rawData().parse().rawDataStatistics()=>
   * viewDatFilter.reRunAllTransform() => region.waitAllSeriesFilterOver()=>
   * viewData.reRunAllTransform()=>viewDataStatistics();
   *
   * NEED-OPTIMIZATION:
   * 一：额外增加了 filter 节点，流程断开为2部分。只是因为堆积需要，因为 filter 和数据变换可以用排序解决。
   * 二：running tag 没有找到好办法消除。只是增加了一个易用 api 到 dataView 上
   */
  protected _rawData!: DataView;
  getRawData() {
    return this._rawData;
  }

  protected _rawDataStatistics!: DataView;
  getRawDataStatistics() {
    return this._rawDataStatistics;
  }

  protected _viewDataMap: Map<number, DataView> = new Map();

  // 额外增加一个 filter 节点
  protected _viewDataFilter: DataView = null;

  getViewDataFilter() {
    return this._viewDataFilter;
  }

  // view data
  protected _data: SeriesData = null;
  getViewData() {
    return this._data?.getDataView();
  }
  getViewDataProductId() {
    return this._data?.getProductId();
  }

  protected _viewDataStatistics!: DataView;
  getViewDataStatistics() {
    return this._viewDataStatistics;
  }
  protected _viewStackData!: DataView;
  getViewStackData() {
    return this._viewStackData;
  }

  protected _seriesField?: string;
  getSeriesField() {
    return this._seriesField;
  }
  setSeriesField(field: string) {
    if (isValid(field)) {
      this._seriesField = field;
      this.getMarksInType([MarkTypeEnum.line, MarkTypeEnum.area]).forEach(m => {
        m.setFacet(this._seriesField);
      });
    }
  }

  protected _groups?: Group;
  getGroups() {
    return this._groups;
  }

  protected _stackValue!: string;

  protected _stack: boolean = false;
  getStack() {
    return this._stack;
  }
  protected _percent: boolean = false;
  getPercent() {
    return this._percent;
  }
  protected _stackOffsetSilhouette: boolean = false;
  getStackOffsetSilhouette() {
    return this._stackOffsetSilhouette;
  }
  protected _dataSet: DataSet;

  protected declare _tooltipHelper: ISeriesTooltipHelper | undefined;
  get tooltipHelper() {
    return this._tooltipHelper;
  }

  protected _invalidType: IInvalidType;
  getInvalidType() {
    return this._invalidType;
  }
  setInvalidType(t: IInvalidType) {
    this._invalidType = t;
    this.getViewData()?.reRunAllTransform();
  }

  protected _markAttributeContext: ISeriesMarkAttributeContext;

  constructor(spec: any, options: ISeriesOption) {
    super(spec, {
      ...options
    });
    this._region = options.region;
    this._dataSet = options.dataSet;
    this._spec?.name && (this.name = this._spec.name);
  }

  created(): void {
    super.created();
    this._buildMarkAttributeContext();
    // data
    this.initData();
    this.initGroups();
    // 调整统计数据的创建时机，需要等待group创建完成
    this.initStatisticalData();
    this.event.emit(ChartEvent.afterInitData, { model: this });
    // trigger
    this.initTrigger();
    // tooltip
    this.initTooltip();
    // mark
    this.initRootMark();
    this.initMark();
    this._initExtensionMark();
    this.initMarkStyle();
    this.initMarkState();
    this.afterInitMark();
    if (this._spec.animation !== false && isValid(this._region.animate)) {
      this.initAnimation();
    }

    // event
    this.initEvent();
    this.event.emit(ChartEvent.afterInitEvent, { model: this });
  }

  protected _buildMarkAttributeContext() {
    this._markAttributeContext = {
      globalScale: (key: string, value: string | number) => {
        return this._option.globalScale.getScale(key)?.scale(value);
      },
      seriesColor: (seriesValue: string | number) => {
        if (isNil(seriesValue)) {
          seriesValue = this.getSeriesKeys()[0];
        }
        return this._option.globalScale.getScale('color')?.scale(seriesValue);
      }
    };
  }

  /** 预处理spec信息 */
  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this.setSeriesField(this._spec.seriesField);
    if (isBoolean(this._spec.stack)) {
      this._stack = this._spec.stack;
    }
    if (isBoolean(this._spec.percent)) {
      this._percent = this._spec.percent;
      this._stack = this._spec.stack || this._spec.percent;
    }
    if (isBoolean(this._spec.stackOffsetSilhouette)) {
      this._stackOffsetSilhouette = this._spec.stackOffsetSilhouette;
      this._stack = this._spec.stack || this._spec.stackOffsetSilhouette;
    }
    if (isValid(this._spec.invalidType)) {
      this._invalidType = this._spec.invalidType;
    }
    this._tooltipHelper?.updateTooltipSpec();
  }

  /** data */
  protected initData(): void {
    this._rawData = this._spec.data as DataView;
    this._addDataIndexAndKey();
    // 初始化viewData
    if (this._rawData) {
      // 初始化viewDataFilter
      this._viewDataFilter = dataViewFromDataView(this._rawData, this._dataSet, {
        name: `${PREFIX}_series_${this.id}_viewDataFilter`
      });
      // 初始化viewData
      const viewData = dataViewFromDataView(this._viewDataFilter, this._dataSet, {
        name: `${PREFIX}_series_${this.id}_viewData`
      });
      this._data = new SeriesData(this._option, viewData);
      // viewData 的更新由 region 控制
      // TODO:不合理，需要优化
      this._viewDataFilter.target.removeListener('change', viewData.reRunAllTransform);
    }

    // _invalidType 默认为 break/ignore，直接走图形层面的解析，不需要走 transform 数据处理逻辑
    if (this._invalidType === 'link' || this._invalidType === 'zero') {
      registerDataSetInstanceTransform(this._option.dataSet, 'invalidTravel', invalidTravel);
      this.getViewData()?.transform(
        {
          type: 'invalidTravel',
          options: {
            config: () => {
              return {
                invalidType: this._invalidType,
                checkField: this.getStackValueField()
              };
            }
          }
        },
        false
      );
    }
  }

  protected initGroups() {
    const groupFields = this.getGroupFields();
    if (groupFields && groupFields.length) {
      this._groups = new Group(groupFields);
      this._data && this._groups.initData(this._data.getDataView(), this._dataSet);
    }
  }

  protected initStatisticalData(): void {
    if (this._rawData) {
      this._statisticRawData();
    }
    if (this._data) {
      this._statisticViewData();
    }
  }

  protected _statisticRawData() {
    const rawDataName = `${PREFIX}_series_${this.id}_rawDataStatic`;
    this._rawDataStatistics = this.createStatisticalData(
      rawDataName,
      this._rawData,
      this._option.globalScale.getStatisticalFields
    );
    this._rawData.target.removeListener('change', this._rawDataStatistics.reRunAllTransform);
    this._rawDataStatistics.reRunAllTransform();
  }

  protected _statisticViewData() {
    const viewDataName = `${PREFIX}_series_${this.id}_viewDataStatic`;
    this._viewDataStatistics = this.createStatisticalData(viewDataName, this._data.getDataView());
    this._data.getDataView().target.removeListener('change', this._viewDataStatistics.reRunAllTransform);
    if (this._stack || this._stackValue) {
      this.createdStackData();
    }
  }

  protected createStatisticalData(
    dataName: string,
    rawData: DataView,
    staticFields?: (dataId: string) => {
      key: string;
      operations: StatisticOperations;
    }[]
  ) {
    registerDataSetInstanceTransform(this._dataSet, 'dimensionStatistics', dimensionStatistics);
    const data = new DataView(this._dataSet, { name: dataName });
    data.parse([rawData], {
      type: 'dataview'
    });
    // data.name = dataName;
    data.transform(
      {
        type: 'dimensionStatistics',
        options: {
          operations: ['max', 'min', 'values'],
          fields: () => {
            const fields = mergeFields(this.getStatisticFields(), staticFields?.(rawData.name as string) ?? []);
            if (this._seriesField) {
              mergeFields(fields, [
                {
                  key: this._seriesField,
                  operations: ['values']
                }
              ]);
            }

            return fields;
          },
          target: 'latest'
        }
      },
      false
    );
    return data;
  }

  // stack
  private createdStackData(): void {
    const dataName = this._rawData?.name ?? `${PREFIX}_series_${this.id}_viewStackData`;
    this._viewStackData = new DataView(this._dataSet);
    this._viewStackData.parse([this.getViewDataFilter()], {
      type: 'dataview'
    });
    this._viewStackData.name = dataName;
    this._viewStackData.transform(
      {
        type: 'stackSplit',
        options: {
          fields: this.getStackGroupFields()
        }
      },
      false
    );
  }

  // make sure this function fast
  protected _noAnimationDataKey(datum: Datum, index: number, context: AddVChartPropertyContext): unknown | undefined {
    return index;
  }

  protected generateDefaultDataKey(
    dataKey: DataKeyType,
    datum: Datum,
    index: number,
    context: AddVChartPropertyContext
  ) {
    if (isNil(dataKey)) {
      // check if need animation data key
      if (this._spec.animation === false) {
        const v = this._noAnimationDataKey(datum, index, context);
        if (v !== undefined) {
          return v;
        }
      }
      const { keyMap } = context;
      const seriesDataKey = this._getSeriesDataKey(datum);
      if (keyMap.get(seriesDataKey) === undefined) {
        keyMap.set(seriesDataKey, 0);
      } else {
        keyMap.set(seriesDataKey, keyMap.get(seriesDataKey) + 1);
      }
      return `${seriesDataKey}_${keyMap.get(seriesDataKey)}`;
    }

    if (isString(dataKey)) {
      return datum[dataKey];
    }

    if (isArray(dataKey) && dataKey.every(d => isString(d))) {
      return dataKey.map(k => datum[k]).join('-');
    }

    if (isFunction(dataKey)) {
      return dataKey(datum, index);
    }

    this._option.onError(`invalid dataKey: ${dataKey}`);
  }

  protected _addDataIndexAndKey() {
    if (this._rawData?.dataSet) {
      registerDataSetInstanceTransform(this._rawData.dataSet, 'addVChartProperty', addVChartProperty);
      this._rawData.transform(
        {
          type: 'addVChartProperty',
          options: {
            beforeCall: initKeyMap,
            call: addDataKey.bind(this)
          }
        },
        false
      );
    }
  }

  updateRawData(d: any): void {
    if (!this._rawData) {
      return;
    }
    this._rawData.updateRawData(d);
  }
  rawDataUpdate(d: DataView): void {
    this.event.emit(ChartEvent.rawDataUpdate, { model: this });
    this._rawDataStatistics?.reRunAllTransform();
  }
  rawDataStatisticsUpdate(d: DataView): void {
    this.event.emit(ChartEvent.rawDataStatisticsUpdate, { model: this });
  }
  viewDataFilterOver(d: DataView): void {
    this.event.emit(ChartEvent.viewDataFilterOver, { model: this });
  }
  viewDataUpdate(d: DataView): void {
    this.event.emit(ChartEvent.viewDataUpdate, { model: this });
    // 依据数据更新设置渲染结果
    // 初始化时会触发 viewDataUpdate，但是此时 srView 还未生成，因此实际上不会产生多余的 updateData 调用
    this._data.updateData();
    this._viewDataStatistics.reRunAllTransform();
  }
  viewDataStatisticsUpdate(d: DataView): void {
    this.event.emit(ChartEvent.viewDataStatisticsUpdate, { model: this });
  }

  // 数据到位置值
  getDatumPositionValues(datum: Datum, fields: string | string[]) {
    if (!datum || isNil(fields)) {
      return [];
    }

    if (isString(fields)) {
      return [datum[fields]];
    }
    return fields.map(f => datum[f]);
  }
  /** mark end */

  /** 获取参与统计的字段与统计类型 */
  abstract getStatisticFields(): {
    key: string;
    operations: StatisticOperations;
  }[];
  /** 获取分组字段 */
  abstract getGroupFields(): string[];
  /** 数据到坐标点的映射 */
  abstract dataToPosition(data: Datum): IPoint;
  /** 数据到 x 坐标点的映射 */
  abstract dataToPositionX(data: Datum): number;
  /** 数据到 y 坐标点的映射 */
  abstract dataToPositionY(data: Datum): number;
  /** 数据到坐标点的映射 */
  abstract valueToPosition(value1: any, value2?: any): IPoint;
  abstract initMark(): void;
  abstract initMarkStyle(): void;

  /** stack start */
  abstract getStackGroupFields(): string[];
  abstract getStackValueField(): string | undefined;
  abstract setValueFieldToStack(): void;
  abstract setValueFieldToPercent(): void;
  abstract setValueFieldToStackOffsetSilhouette(): void;

  initRootMark() {
    this._rootMark = this._createMark(
      { type: MarkTypeEnum.group, name: `seriesGroup_${this.type}_${this.id}` },
      {
        parent: this._region.getGroupMark?.(),
        dataView: false
      }
    ) as IGroupMark;
    this._rootMark.setZIndex(this.layoutZIndex);
  }

  protected _initExtensionMark() {
    if (!this._spec.extensionMark) {
      return;
    }
    this._spec.extensionMark?.forEach((m, i) => {
      this._createExtensionMark(m, null, `${PREFIX}_series_${this.id}_extensionMark`, i);
    });
  }

  private _createExtensionMark(
    spec: IExtensionMarkSpec<Exclude<EnableMarkType, MarkTypeEnum.group>> | IExtensionGroupMarkSpec,
    parentMark: null | IGroupMark,
    namePrefix: string,
    index: number
  ) {
    const mark = this._createMark(
      { type: spec.type, name: `${PREFIX}_${index}` },
      {
        markSpec: spec,
        parent: parentMark,
        dataView: false
      }
    ) as IGroupMark;
    if (!mark) {
      return;
    }

    if (spec.type === 'group') {
      namePrefix = `${namePrefix}_${index}`;
      spec.children?.forEach((s, i) => {
        this._createExtensionMark(s as any, mark, namePrefix, i);
      });
    } else if (!parentMark && (!isNil(spec.dataId) || !isNil(spec.dataIndex))) {
      const dataView = this._option.getSeriesData(spec.id, spec.dataIndex);
      if (dataView === this._rawData) {
        mark.setDataView(this.getViewData(), this.getViewDataProductId());
      } else {
        mark.setDataView(dataView);
      }
    }
  }

  getStackData(): ISeriesStackData {
    return this._viewStackData?.latestData;
  }
  /** stack end */

  /** mark */
  initTrigger() {
    const triggerSpec = {
      hover: this._spec.hover,
      select: this._spec.select
    };
    const triggerOptions = {
      ...this._option,
      model: this,
      interaction: this._region.interaction
    };
    this._trigger = new Trigger(triggerSpec, triggerOptions);
  }

  initAnimation() {
    // do nothing
  }

  initMarkState() {
    this.initSeriesStyleState();
  }

  /**
   * 初始化initSeriesStyleState所对应的state，配置series-style数组会转化到state实现，每一个seriesItem都对应一个state
   * @returns
   */
  initSeriesStyleState() {
    const seriesStyle = this._spec.seriesStyle;
    if (!seriesStyle || !seriesStyle.length) {
      return;
    }
    const groupBy = this._seriesField ?? DEFAULT_DATA_SERIES_FIELD;
    this.getMarksWithoutRoot().forEach(mark => {
      const filterMap: { [key: string]: true } = {};
      const attrMap: { [key: string]: true } = {};
      const markStyle: { [key: string]: { [key: string]: any } } = {};
      seriesStyle.forEach(item => {
        const style = item[mark.name]?.style;
        if (style) {
          filterMap[item.name] = true;
          markStyle[item.name] = markStyle[item.name] || {};
          Object.keys(style).forEach(key => {
            attrMap[key] = true;
            markStyle[item.name][key] = style[key];
          });
        }
      });
      mark.state.addStateInfo({
        stateValue: DEFAULT_SERIES_STYLE_NAME,
        level: -1,
        filter: (datum: Datum) => {
          if (Array.isArray(datum)) {
            if (datum.length === 0) {
              return false;
            }
            return filterMap[datum[0][groupBy]] === true;
          }
          return filterMap[datum[groupBy]] === true;
        }
      });
      const style = {};
      Object.keys(attrMap).forEach(key => {
        style[key] = (datum: Datum) => {
          let style;
          if (Array.isArray(datum)) {
            if (datum.length === 0) {
              return undefined;
            }
            style = markStyle[datum[0][groupBy]]?.[key];
          }
          style = markStyle[datum[groupBy]]?.[key];
          if (style) {
            return style;
          }
          return mark.getAttribute(key as any, datum);
        };
      });
      this.setMarkStyle(mark, style, DEFAULT_SERIES_STYLE_NAME);
    });
  }

  afterInitMark(): void {
    this.event.emit(ChartEvent.afterInitMark, { model: this });
    // 此时mark相关的统计数据收集完成
    this._rawDataStatistics?.reRunAllTransform();
    this.setSeriesField(this._spec.seriesField);

    let animationThreshold = this._spec.animationThreshold ?? Number.MAX_SAFE_INTEGER;
    // set mark stroke color follow series color
    // only set normal state in the level lower than level Series
    this.getMarks().forEach(m => {
      if (m.stateStyle?.normal?.lineWidth) {
        m.setAttribute('stroke', this.getColorAttribute(), 'normal', AttributeLevel.Base_Series);
      }
      const config = m.getProgressiveConfig();
      if (config) {
        if (config.large && config.largeThreshold) {
          animationThreshold = Math.min(animationThreshold, config.largeThreshold);
        }
        if (config.progressiveThreshold) {
          animationThreshold = Math.min(animationThreshold, config.progressiveThreshold);
        }
      }
    });
    // auto close animation
    // if (this._rawData?.latestData?.length >= animationThreshold) {
    //   this._spec.animation = false;
    // }
  }

  getMarksWithoutRoot(): IMark[] {
    return this.getMarks().filter(m => !m.name.includes('seriesGroup'));
  }
  getMarksInType(type: string | string[]): IMark[] {
    return this._marks.getMarksInType(type);
  }
  getMarkInName(name: string): IMark | undefined {
    return this._marks.get(name);
  }
  getMarkInId(markId: number): IMark | undefined {
    return this.getMarks().find(m => m.id === markId);
  }
  /** mark end */

  /** event */
  protected initEvent() {
    this._trigger.init();
    this._rawData?.target.addListener('change', this.rawDataUpdate.bind(this));
    this._data?.getDataView()?.target.addListener('change', this.viewDataUpdate.bind(this));
    this._viewDataStatistics?.target.addListener('change', this.viewDataStatisticsUpdate.bind(this));
    this._rawDataStatistics?.target.addListener('change', this.rawDataStatisticsUpdate.bind(this));
  }

  protected _releaseEvent(): void {
    super._releaseEvent();
    this._trigger.release();
  }

  /** event end */

  /** 初始化tooltip helper */
  protected initTooltip() {
    this._tooltipHelper = new BaseSeriesTooltipHelper(this);
  }

  /** updateSpec */
  updateSpec(spec: any) {
    const result = super.updateSpec(spec);
    if (spec.type !== this.type) {
      result.reMake = true;
    }

    const { invalidType } = this._originalSpec;
    if (spec.invalidType !== invalidType) {
      result.change = true;
      result.reRender = true;
    }
    return result;
  }

  reInit(theme?: any) {
    super.reInit(theme);

    this.initMarkStyle();

    this.getMarksWithoutRoot().forEach(mark => {
      this.initMarkStyleWithSpec(mark, this._spec[mark.name]);
    });
  }

  // 首次布局完成后填充系列数据
  onEvaluateEnd(ctx: IModelEvaluateOption): void {
    this._data.updateData();
  }
  onRender(ctx: IModelRenderOption): void {
    return;
  }
  release(): void {
    super.release();
    this._viewDataMap.clear();
    // TODO: rawData transform clear;
    // this._dataSet=>// _rawData.tag = vchart
    this._data?.release();
    this._dataSet =
      this._data =
      this._rawData =
      this._rawDataStatistics =
      this._spec =
      this._region =
      this._viewDataStatistics =
      this._viewStackData =
        null;
  }

  onLayoutEnd(ctx: any) {
    const region = this.getRegion();
    this.setLayoutRect(region.getLayoutRect());
    this.setLayoutStartPosition(region.getLayoutStartPoint());

    super.onLayoutEnd(ctx);
  }

  /** seriesField */
  getSeriesKeys(): string[] {
    if (this._seriesField) {
      return this._rawDataStatistics?.latestData[this._seriesField]?.values ?? [];
    }
    if (this.name) {
      return [this.name];
    }
    if (this.userId) {
      return [`${this.userId}`];
    }
    return [`${this.type}_${this.id}`];
  }

  getSeriesStyle(datum: Datum) {
    return (attribute: string) => this._seriesMark?.getAttribute(attribute as any, datum) ?? null;
  }

  protected _getSeriesInfo(field: string, keys: string[]) {
    const defaultShapeType = this.getDefaultShapeType();
    return keys.map(key => {
      return {
        key,
        style: this.getSeriesStyle({
          [field]: key
        }),
        shapeType: defaultShapeType
      };
    });
  }

  getSeriesInfoInField(field: string) {
    const keys = this._rawDataStatistics.latestData[field]?.values;
    return this._getSeriesInfo(field, keys);
  }

  getSeriesInfoList() {
    return this._getSeriesInfo(this._seriesField ?? DEFAULT_DATA_SERIES_FIELD, this.getSeriesKeys());
  }

  /** seriesField end */

  // get default color scale
  // 重复代码太多了，整合一下
  protected getDefaultColorScale() {
    const colorDomain = this.getDefaultColorDomain();
    const colorRange = getDataScheme(this._option.getTheme().colorScheme, this.type as any);
    return new ColorOrdinalScale().domain(colorDomain).range?.(colorRange);
  }

  /** 获取默认 color scale 的 domain */
  getDefaultColorDomain(): any[] {
    return this._seriesField ? this._viewDataStatistics?.latestData[this._seriesField]?.values : [];
  }

  // 通用的默认颜色映射 用户设置优先级比这个高，会在setStyle中处理
  getColorAttribute() {
    return {
      scale: this._option.globalScale.getScale('color') ?? this.getDefaultColorScale(),
      field: this._seriesField ?? DEFAULT_DATA_SERIES_FIELD
    };
  }

  /** 获取维度field */
  getDimensionField(): string[] {
    return [];
  }
  /** 获取指标field */
  getMeasureField(): string[] {
    return [];
  }

  // 用于 axisHelper 更新
  protected onMarkPositionUpdate(): void {
    this.onMarkTreePositionUpdate(this.getMarksWithoutRoot());
  }

  protected onMarkTreePositionUpdate(marks: IMark[]): void {
    // do nothing
  }

  async setCurrentTheme(theme: any, noRender?: boolean) {
    const modifyConfig = () => {
      // 重新初始化
      this.reInit(theme);

      return { change: true, reMake: false };
    };

    if (noRender) {
      modifyConfig();
    } else {
      await this._option.globalInstance.updateCustomConfigAndRerender(modifyConfig);
    }
  }

  protected _initTheme(theme?: any) {
    const globalTheme = this._option.getTheme();

    if (theme) {
      super._initTheme(theme);
    } else {
      super._initTheme(globalTheme.series[this.type] ?? {});
    }

    this._mergeThemeToSpec();
    this._preprocessSpec();
  }

  /** 将 theme merge 到 spec 中 */
  protected _mergeThemeToSpec() {
    const chartSpec = this.getChart().getSpec();
    this._spec = merge({}, this._theme, this._getDefaultSpecFromChart(chartSpec), this._originalSpec);
  }

  /** 从 chart spec 提取配置作为 series 的默认 spec 配置 */
  protected _getDefaultSpecFromChart(chartSpec: any): Partial<T> {
    return {};
  }

  protected _createMark<T extends IMark>(markInfo: ISeriesMarkInfo, option: ISeriesMarkInitOption = {}) {
    const {
      key,
      groupKey,
      skipBeforeLayouted,
      themeSpec = {},
      markSpec,
      dataView,
      dataProductId,
      parent,
      isSeriesMark,
      dataStatistics,
      depend,
      label,
      progressive,
      support3d = this._spec.support3d || !!(this._spec as any).zField,
      morph = false
    } = option;
    const m = super._createMark<T>(markInfo, {
      key: key ?? this._getDataIdKey(),
      support3d,
      dataStatistics: dataStatistics ?? this._rawDataStatistics,
      attributeContext: this._markAttributeContext
    });
    if (isValid(m)) {
      this._marks.addMark(m);

      if (isSeriesMark) {
        this._seriesMark = m;
      }

      if (isNil(parent)) {
        this._rootMark?.addMark(m);
      } else if (parent !== false) {
        parent.addMark(m);
      }

      if (isNil(dataView)) {
        m.setDataView(this.getViewData(), this.getViewDataProductId());
        m.setSkipBeforeLayouted(true);
      } else if (dataView !== false) {
        m.setDataView(dataView, dataProductId);
      }

      if (isBoolean(skipBeforeLayouted)) {
        m.setSkipBeforeLayouted(skipBeforeLayouted);
      }

      if (isValid(depend)) {
        m.setDepend(...array(depend));
      }

      if (isValid(label)) {
        m.setLabelSpec(label);
      }

      const spec = this.getSpec() || {};

      m.setMorph(morph);
      m.setMorphKey(spec.morph?.morphKey || `${this._specIndex}`);
      m.setMorphElementKey(spec.morph?.morphElementKey ?? option.defaultMorphElementKey);

      if (!isNil(progressive)) {
        m.setProgressiveConfig(progressive);
      }

      if (!isNil(groupKey)) {
        m.setGroupKey(groupKey);
      }

      this.initMarkStyleWithSpec(m, merge({}, themeSpec, markSpec || spec[m.name]));
    }
    return m;
  }

  protected _getDataIdKey() {
    // 系列图元默认使用 rawData 初始生成的唯一数据 id 作为 key
    return super._getDataIdKey() ?? DEFAULT_DATA_KEY;
  }

  /**
   * 默认数据 id 生成逻辑。
   * 数据中的 维度A的值_维度B的值_***_维度C的值_seriesField的值_index
   * index作用是为了避免 id 重复
   */
  protected _getSeriesDataKey(datum: Datum) {
    let key = '';
    if (!datum) {
      return key;
    }

    const dimensionFields = this.getDimensionField();
    key = dimensionFields.map(field => datum[field]).join('_');

    if (this.getSeriesField()) {
      key += `_${datum[this.getSeriesField()]}`;
    }

    return key;
  }

  /**
   * data
   */
  addViewDataFilter(option: ITransformOptions) {
    this._viewDataFilter.transform(option, false);
  }

  reFilterViewData() {
    this._viewDataFilter?.reRunAllTransform();
  }

  reTransformViewData() {
    this._data?.getDataView()?.reRunAllTransform();
  }

  fillData() {
    this.getRawData()?.reRunAllTransform();
  }

  compile() {
    this.compileSignal();
    this.compileData(); // 系列只需要编译数据，mark 将在 region 编译过程中编译
  }

  getDefaultShapeType() {
    return 'circle';
  }

  getFieldAlias(field: string) {
    if (
      field === STACK_FIELD_END ||
      field === STACK_FIELD_END_PERCENT ||
      field === STACK_FIELD_START ||
      field === STACK_FIELD_START_PERCENT
    ) {
      field = this.getStackValueField();
    }
    return getFieldAlias(this.getRawData(), field) ?? field;
  }

  getMarkInfoList() {
    const list = super.getMarkInfoList();
    if (!list.length) {
      const SeriesConstructor = Factory.getSeries(this.type);
      return Object.values(SeriesConstructor.mark ?? {});
    }
    return list;
  }
}
