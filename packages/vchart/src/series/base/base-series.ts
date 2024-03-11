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
import { seriesMarkInfoMap } from '../interface/theme';
import { DataView } from '@visactor/vdataset';
// eslint-disable-next-line no-duplicate-imports
import type { DataSet, ITransformOptions } from '@visactor/vdataset';
import type { IRegion } from '../../region/interface';
import type { IMark } from '../../mark/interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from '../../mark/interface/type';
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
  EnableMarkType,
  IGroup,
  ILayoutType,
  ILayoutPoint,
  ILayoutRect
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
  ISeriesMarkInfo,
  ISeriesSpecInfo
} from '../interface';
import { dataToDataView, dataViewFromDataView, updateDataViewInData } from '../../data/initialize';
import { mergeFields, getFieldAlias } from '../../util/data';
import { couldBeValidNumber } from '../../util/type';
import { mergeSpec } from '../../util/spec/merge-spec';
import type { IModelEvaluateOption, IModelRenderOption } from '../../model/interface';
import type { AddVChartPropertyContext } from '../../data/transforms/add-property';
// eslint-disable-next-line no-duplicate-imports
import { addVChartProperty } from '../../data/transforms/add-property';
import type { ISelectSpec } from '../../interaction/interface';
import { registerDataSetInstanceTransform } from '../../data/register';
import { BaseSeriesTooltipHelper } from './tooltip-helper';
import type { StatisticOperations } from '../../data/transforms/dimension-statistics';
// eslint-disable-next-line no-duplicate-imports
import { dimensionStatistics, dimensionStatisticsOfSimpleData } from '../../data/transforms/dimension-statistics';
import { invalidTravel } from '../../data/transforms/invalid-travel';
import { getDataScheme } from '../../theme/color-scheme/util';
import { SeriesData } from './series-data';
import { addDataKey, initKeyMap } from '../../data/transforms/data-key';
import type { IGroupMark } from '../../mark/group';
import type { ISeriesMarkAttributeContext } from '../../compile/mark';
// eslint-disable-next-line no-duplicate-imports
import { STATE_VALUE_ENUM } from '../../compile/mark';
import {
  array,
  isEqual,
  isNil,
  isValid,
  isBoolean,
  isString,
  isFunction,
  isArray,
  isValidNumber,
  isObject,
  minInArray,
  maxInArray
} from '@visactor/vutils';
import { ColorOrdinalScale } from '../../scale/color-ordinal-scale';
import { baseSeriesMark } from './constant';
import { animationConfig, userAnimationConfig, isAnimationEnabledForSeries } from '../../animation/utils';
import { BaseSeriesSpecTransformer } from './base-series-transformer';
import type { EventType } from '@visactor/vgrammar-core';
import { getDefaultInteractionConfigByMode } from '../../interaction/config';

export abstract class BaseSeries<T extends ISeriesSpec> extends BaseModel<T> implements ISeries {
  readonly specKey: string = 'series';
  readonly type: string = 'series';
  layoutType: ILayoutType = 'absolute';
  readonly modelType: string = 'series';
  readonly name: string | undefined = undefined;

  static readonly mark: SeriesMarkMap = baseSeriesMark;
  static readonly transformerConstructor = BaseSeriesSpecTransformer;
  readonly transformerConstructor = BaseSeriesSpecTransformer as any;

  declare getSpecInfo: () => ISeriesSpecInfo;

  protected declare _option: ISeriesOption;

  // 坐标系信息
  readonly coordinate: CoordinateType = 'none';

  // 区域
  protected _region: IRegion = null as unknown as IRegion;
  getRegion(): IRegion {
    return this._region;
  }

  private _layoutStartPoint: ILayoutPoint = {
    x: 0,
    y: 0
  };

  getLayoutStartPoint(): ILayoutPoint {
    return this._region.getLayoutStartPoint();
  }

  private _layoutRect: ILayoutRect = { width: null, height: null };

  getLayoutRect: () => ILayoutRect = () => {
    return {
      width: this._layoutRect.width ?? this._region.getLayoutRect().width,
      height: this._layoutRect.height ?? this._region.getLayoutRect().height
    };
  };

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

  protected _rawDataStatistics?: DataView;
  protected _rawStatisticsCache: Record<string, { values?: any[]; min?: number; max?: number }>;

  protected _viewDataMap: Map<number, DataView> = new Map();

  // only add viewDataFilter when this._stack is true
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
      this.getMarks()
        .filter(m => {
          return m.getDataView() === this.getViewData();
        })
        .forEach(m => {
          m.setFacet(this._seriesField);
        });
    }
  }

  protected _groups?: IGroup;
  getGroups() {
    return this._groups;
  }

  protected _stack: boolean;
  protected _supportStack: boolean;
  getStack() {
    return this._stack;
  }

  getStackValue() {
    return this._spec.stackValue ?? `${PREFIX}_series_${this.type}`;
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
    if (!this._tooltipHelper) {
      this.initTooltip();
    }

    return this._tooltipHelper;
  }

  layoutZIndex: number = 0;

  protected _invalidType: IInvalidType = 'break';
  getInvalidType() {
    return this._invalidType;
  }
  setInvalidType(t: IInvalidType) {
    this._invalidType = t;
    this.getViewData()?.reRunAllTransform();
  }

  protected _markAttributeContext: ISeriesMarkAttributeContext;
  getMarkAttributeContext() {
    return this._markAttributeContext;
  }

  constructor(spec: T, options: ISeriesOption) {
    super(spec, options);
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
    // mark
    this.initRootMark();
    this.initMark();
    const hasAnimation = isAnimationEnabledForSeries(this);

    this._initExtensionMark({ hasAnimation });

    this.initMarkStyle();
    this.initMarkState();
    if (hasAnimation) {
      this.initAnimation();
    }

    if (!this._option.disableTriggerEvent) {
      this.initInteraction();
    }
    this.afterInitMark();

    // event
    this.initEvent();
    this.event.emit(ChartEvent.afterInitEvent, { model: this });
  }

  protected _buildMarkAttributeContext() {
    this._markAttributeContext = {
      vchart: this._option.globalInstance,
      globalScale: (key: string, value: string | number) => {
        return this._option.globalScale.getScale(key)?.scale(value);
      },
      seriesColor: (seriesValue: string | number) => {
        if (isNil(seriesValue)) {
          seriesValue = this.getSeriesKeys()[0];
        }
        return this._option.globalScale.getScale('color')?.scale(seriesValue);
      },
      getRegion: () => this._region
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
      this._stack = this._spec.percent || this._stack; // this._stack is `true` in bar/area series
    }
    if (isBoolean(this._spec.stackOffsetSilhouette)) {
      this._stackOffsetSilhouette = this._spec.stackOffsetSilhouette;
      this._stack = this._spec.stackOffsetSilhouette || this._stack; // this._stack is `true` in bar/area series
    }
    if (isValid(this._spec.stackValue)) {
      this._stack = true;
    }

    if (isNil(this._stack) && this._supportStack && this._seriesField) {
      // only set default value of stack to be `true` when series support stack and seriesField is not null
      this._stack = true;
    }
    if (isValid(this._spec.invalidType)) {
      this._invalidType = this._spec.invalidType;
    }
  }

  /** data */
  protected initData(): void {
    const d = this._spec.data ?? this._option.getSeriesData(this._spec.dataId, this._spec.dataIndex);
    if (d) {
      this._rawData = dataToDataView(d, this._dataSet, this._option.sourceDataList, {
        onError: this._option?.onError
      });
    }
    this._rawData?.target?.addListener('change', this.rawDataUpdate.bind(this));
    this._addDataIndexAndKey();
    // 初始化viewData
    if (this._rawData) {
      if (this._stack) {
        // 初始化viewDataFilter
        this._viewDataFilter = dataViewFromDataView(this._rawData, this._dataSet, {
          name: `${this.type}_${this.id}_viewDataFilter`
        });
      }

      // 初始化viewData
      const viewData = dataViewFromDataView(this._stack ? this._viewDataFilter : this._rawData, this._dataSet, {
        name: `${this.type}_${this.id}_viewData`
      });
      this._data = new SeriesData(this._option, viewData);

      if (this._stack) {
        this._viewDataFilter.target.removeListener('change', viewData.reRunAllTransform);
      }
    }

    // _invalidType 默认为 break/ignore，直接走图形层面的解析，不需要走 transform 数据处理逻辑
    if (this._invalidType === 'zero' && this._rawData?.dataSet) {
      registerDataSetInstanceTransform(this._rawData.dataSet, 'invalidTravel', invalidTravel);
      // make sure each series only transform once
      this._rawData?.transform(
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
      this._groups = { fields: groupFields };
      // this._data && this._groups.initData(this._data.getDataView(), this._dataSet);
    }
  }

  protected initStatisticalData(): void {
    if (this._data) {
      this._statisticViewData();
    }
  }

  getRawDataStatisticsByField(field: string, isNumeric?: boolean) {
    if (!this._rawStatisticsCache) {
      this._rawStatisticsCache = {};
    }

    if (!this._rawStatisticsCache[field]) {
      const canUseViewStatistics =
        this._viewDataStatistics &&
        (!this._viewDataFilter || this._viewDataFilter.transformsArr.length <= 1) &&
        this.getViewData().transformsArr.length <= 1;

      if (canUseViewStatistics && this._viewDataStatistics.latestData?.[field]) {
        this._rawStatisticsCache[field] = this._viewDataStatistics.latestData[field];
      } else if (this._rawData) {
        // 如果有设置统计信息，应当与设置值保持一致
        const fieldInfo = this._rawData.getFields()?.[field];
        if (fieldInfo && fieldInfo.lockStatisticsByDomain && fieldInfo.domain) {
          this._rawStatisticsCache[field] = {};
          if (isNumeric) {
            this._rawStatisticsCache[field].min = minInArray(fieldInfo.domain);
            this._rawStatisticsCache[field].max = maxInArray(fieldInfo.domain);
          } else {
            this._rawStatisticsCache[field].values = fieldInfo.domain;
          }
        } else {
          this._rawStatisticsCache[field] = dimensionStatisticsOfSimpleData(this._rawData.latestData, [
            { key: field, operations: isNumeric ? ['min', 'max'] : ['values'] }
          ])[field];
        }
      }
    }

    if (isNumeric && (isNil(this._rawStatisticsCache[field].min) || isNil(this._rawStatisticsCache[field].max))) {
      this._rawStatisticsCache[field].min = minInArray(this._rawStatisticsCache[field].values);
      this._rawStatisticsCache[field].max = maxInArray(this._rawStatisticsCache[field].values);
    }

    return this._rawStatisticsCache[field];
  }

  protected _statisticViewData() {
    registerDataSetInstanceTransform(this._dataSet, 'dimensionStatistics', dimensionStatistics);
    const viewDataStatisticsName = `${this.type}_${this.id}_viewDataStatic`;
    this._viewDataStatistics = new DataView(this._dataSet, { name: viewDataStatisticsName });
    this._viewDataStatistics.parse([this._data.getDataView()], {
      type: 'dataview'
    });
    this._viewDataStatistics.transform(
      {
        type: 'dimensionStatistics',
        options: {
          fields: () => {
            const fields = this.getStatisticFields();
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

    this._data.getDataView().target.removeListener('change', this._viewDataStatistics.reRunAllTransform);
    if (this._stack) {
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
    const dataName = `${this.type}_${this.id}_viewStackData`;
    this._viewStackData = new DataView(this._dataSet, { name: dataName });
    this._viewStackData.parse([this._viewDataFilter], {
      type: 'dataview'
    });
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
  protected _noAnimationDataKey(datum: Datum, index: number): unknown | undefined {
    return index;
  }

  protected generateDefaultDataKey(dataKey: DataKeyType) {
    if (isNil(dataKey)) {
      return (datum: Datum, index: number, context: AddVChartPropertyContext) => {
        // check if need animation data key
        if (this._spec.animation === false) {
          const v = this._noAnimationDataKey(datum, index);
          if (v !== undefined) {
            return v;
          }
        }
        const { keyMap } = context;
        const seriesDataKey = this._getSeriesDataKey(datum);
        if (keyMap.get(seriesDataKey) === undefined) {
          keyMap.set(seriesDataKey, 0);

          return seriesDataKey;
        }

        keyMap.set(seriesDataKey, keyMap.get(seriesDataKey) + 1);
        return `${seriesDataKey}_${keyMap.get(seriesDataKey)}`;
      };
    }

    if (isString(dataKey)) {
      return (datum: Datum) => datum[dataKey];
    }

    if (isArray(dataKey) && dataKey.every(d => isString(d))) {
      return (datum: Datum) => dataKey.map(k => datum[k]).join('-');
    }

    if (isFunction(dataKey)) {
      return (datum: Datum, index: number) => dataKey(datum, index);
    }

    this._option?.onError(`invalid dataKey: ${dataKey}`);
    return (datum: Datum, index: number) => undefined as string;
  }

  protected _addDataIndexAndKey() {
    if (this._rawData?.dataSet) {
      registerDataSetInstanceTransform(this._rawData.dataSet, 'addVChartProperty', addVChartProperty);
      this._rawData.transform(
        {
          type: 'addVChartProperty',
          options: {
            beforeCall: initKeyMap.bind(this),
            call: addDataKey
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
    this._rawDataStatistics?.reRunAllTransform();
    this._rawStatisticsCache = null;
    this.event.emit(ChartEvent.rawDataUpdate, { model: this });
  }
  viewDataFilterOver(d: DataView): void {
    this.event.emit(ChartEvent.viewDataFilterOver, { model: this });
  }
  viewDataUpdate(d: DataView): void {
    this.event.emit(ChartEvent.viewDataUpdate, { model: this });
    // 依据数据更新设置渲染结果
    // 初始化时会触发 viewDataUpdate，但是此时 srView 还未生成，因此实际上不会产生多余的 updateData 调用
    this._data?.updateData();
    this._viewDataStatistics && this._viewDataStatistics.reRunAllTransform();
  }
  viewDataStatisticsUpdate(d: DataView): void {
    this.event.emit(ChartEvent.viewDataStatisticsUpdate, { model: this });
  }

  // 数据到位置值
  getDatumPositionValue(datum: Datum, field: string) {
    if (!datum || isNil(field)) {
      return null;
    }
    return datum[field];
  }
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
  setValueFieldToStack() {
    // do nothing
  }
  setValueFieldToPercent() {
    // do nothing;
  }
  setValueFieldToStackOffsetSilhouette() {
    // do nothing
  }

  /** 获取系列中可以被操作的mark(brush需要通过在图元spec中内置state的方式实现框选样式，所以需要获取可被框选的mark) */
  abstract getActiveMarks(): IMark[];

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

  protected _initExtensionMark(options: { hasAnimation: boolean; depend?: IMark[] }) {
    if (!this._spec.extensionMark) {
      return;
    }
    const mainMarks = this.getMarksWithoutRoot();

    options.depend = mainMarks;

    this._spec.extensionMark?.forEach((m, i) => {
      this._createExtensionMark(m, null, `${PREFIX}_series_${this.id}_extensionMark`, i, options);
    });
  }

  private _createExtensionMark(
    spec: IExtensionMarkSpec<Exclude<EnableMarkType, 'group'>> | IExtensionGroupMarkSpec,
    parentMark: null | IGroupMark,
    namePrefix: string,
    index: number,
    options: { hasAnimation: boolean; depend?: IMark[] }
  ) {
    const mark = this._createMark(
      { type: spec.type, name: `${namePrefix}_${index}` },
      {
        // 避免二次dataflow
        skipBeforeLayouted: true,
        markSpec: spec,
        parent: parentMark,
        dataView: false,
        customShape: spec?.customShape,
        componentType: spec.componentType,
        depend: options.depend,
        key: spec.dataKey
      }
    ) as IGroupMark;
    if (!mark) {
      return;
    }

    mark.setInteractive(spec.interactive !== false);
    mark.setZIndex(spec.zIndex);

    if (options.hasAnimation) {
      // 自定义图元默认不添加动画
      const config = animationConfig({}, userAnimationConfig(spec.type, spec as any, this._markAttributeContext));
      mark.setAnimationConfig(config);
    }

    if (spec.type === 'group') {
      namePrefix = `${namePrefix}_${index}`;
      spec.children?.forEach((s, i) => {
        this._createExtensionMark(s as any, mark, namePrefix, i, options);
      });
    } else if (!parentMark && (!isNil(spec.dataId) || !isNil(spec.dataIndex))) {
      const dataView = this._option.getSeriesData(spec.dataId, spec.dataIndex);
      if (dataView === this._rawData) {
        mark.setDataView(this.getViewData(), this.getViewDataProductId());
      } else {
        mark.setDataView(dataView);
      }
    }
  }

  protected _updateExtensionMarkSpec(lastSpec?: any) {
    this._spec.extensionMark?.forEach((spec, i) => {
      const mark = this._marks.getMarkWithInfo({ name: `${this.type}_${this.id}_extensionMark_${i}` });
      if (!mark) {
        return;
      }
      if (lastSpec && isEqual(lastSpec.extensionMark?.[i], spec)) {
        return;
      }
      this.initMarkStyleWithSpec(mark, spec);
      mark.updateStaticEncode();
      mark.updateLayoutState();
    });
  }

  getStackData(): ISeriesStackData {
    return this._viewStackData?.latestData;
  }
  /** stack end */

  /** mark */

  protected _parseDefaultInteractionConfig(mainMarks?: IMark[]) {
    if (!mainMarks?.length) {
      return [];
    }

    const defaultConfig = getDefaultInteractionConfigByMode(this._option.mode);
    let finalHoverSpec = { ...defaultConfig?.hover };
    let finalSelectSpec: ISelectSpec = { ...defaultConfig?.select };

    const hoverSpec = this._spec.hover;
    if (isBoolean(hoverSpec)) {
      finalHoverSpec.enable = hoverSpec as boolean;
    } else if (isObject(hoverSpec)) {
      finalHoverSpec.enable = true;
      finalHoverSpec = mergeSpec(finalHoverSpec, hoverSpec);
    }

    const selectSpec = this._spec.select;
    if (isBoolean(selectSpec)) {
      finalSelectSpec.enable = selectSpec as boolean;
    } else if (isObject(selectSpec)) {
      finalSelectSpec.enable = true;
      finalSelectSpec = mergeSpec(finalSelectSpec, selectSpec);
    }
    const res = [];

    if (finalHoverSpec.enable) {
      res.push({
        vchartState: STATE_VALUE_ENUM.STATE_HOVER,
        seriesId: this.id,
        regionId: this._region.id,
        selector: mainMarks.map(mark => `#${mark.getProductId()}`),
        type: 'element-highlight',
        trigger: finalHoverSpec.trigger as EventType,
        triggerOff: finalHoverSpec.triggerOff as EventType,
        blurState: STATE_VALUE_ENUM.STATE_HOVER_REVERSE,
        highlightState: STATE_VALUE_ENUM.STATE_HOVER
      });
    }

    if (finalSelectSpec.enable) {
      res.push({
        vchartState: STATE_VALUE_ENUM.STATE_SELECTED,
        type: 'element-select',
        seriesId: this.id,
        regionId: this._region.id,
        selector: mainMarks.map(mark => `#${mark.getProductId()}`),
        trigger: finalSelectSpec.trigger as EventType,
        triggerOff: (finalSelectSpec.triggerOff ?? 'empty') as EventType,
        reverseState: STATE_VALUE_ENUM.STATE_SELECTED_REVERSE,
        state: STATE_VALUE_ENUM.STATE_SELECTED,
        isMultiple: finalSelectSpec.mode === 'multiple'
      });
    }

    return res;
  }

  protected _parseInteractionConfig(mainMarks?: IMark[]) {
    const compiler = this.getCompiler();
    if (!compiler) {
      return;
    }

    const { interactions } = this._spec;
    const res = this._parseDefaultInteractionConfig(mainMarks);

    if (res && res.length) {
      res.forEach(interaction => {
        compiler.addInteraction(interaction);
      });
    }

    if (interactions && interactions.length) {
      interactions.forEach(interaction => {
        const selectors: string[] = [];
        if (interaction.markIds) {
          this.getMarks().filter(mark => {
            if (interaction.markIds.includes(mark.getProductId())) {
              selectors.push(`#${mark.getProductId()}`);
            }
          });
        } else if (interaction.markNames) {
          this.getMarks().forEach(mark => {
            if (interaction.markNames.includes(mark.name)) {
              selectors.push(`#${mark.getProductId()}`);
            }
          });
        } else if (mainMarks?.length) {
          mainMarks.forEach(mark => {
            selectors.push(`#${mark.getProductId()}`);
          });
        }

        if (selectors.length) {
          compiler.addInteraction({
            ...interaction,
            selector: selectors,
            seriesId: this.id,
            regionId: this._region.id
          });
        }
      });
    }
  }

  initInteraction() {
    const marks = this.getMarksWithoutRoot();

    this._parseInteractionConfig(marks);
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
    if (this._rawData?.latestData?.length >= animationThreshold) {
      this._spec.animation = false;
    }
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
    this._data?.getDataView()?.target.addListener('change', this.viewDataUpdate.bind(this));
    this._viewDataStatistics?.target.addListener('change', this.viewDataStatisticsUpdate.bind(this));
  }

  protected _releaseEvent(): void {
    super._releaseEvent();
    this.getCompiler().removeInteraction(this.id);
  }

  /** event end */

  /** 初始化tooltip helper */
  protected initTooltip() {
    this._tooltipHelper = new BaseSeriesTooltipHelper(this);
  }

  /** updateSpec */
  _compareSpec(spec: T, prevSpec: T, ignoreCheckKeys?: { [key: string]: true }) {
    const result = super._compareSpec(spec, prevSpec);

    const currentKeys = Object.keys(prevSpec || {}).sort();
    const nextKeys = Object.keys(spec || {}).sort();
    if (!isEqual(currentKeys, nextKeys)) {
      result.reMake = true;
      return result;
    }

    ignoreCheckKeys = ignoreCheckKeys ?? { data: true };

    ignoreCheckKeys.invalidType = true;
    if (spec.invalidType !== prevSpec.invalidType) {
      result.reCompile = true;
    }

    ignoreCheckKeys.extensionMark = true;
    if (
      array(spec.extensionMark).length !== array(prevSpec.extensionMark).length ||
      (<Array<any>>prevSpec.extensionMark)?.some(
        (mark, index) => mark.type !== spec.extensionMark[index].type || mark.id !== spec.extensionMark[index].id
      )
    ) {
      result.reMake = true;
    }

    if (result.reMake) {
      return result;
    }

    // mark visible logic in compile
    if (
      (<Array<any>>prevSpec.extensionMark)?.some((mark, index) => mark.visible !== spec.extensionMark[index].visible)
    ) {
      result.reCompile = true;
    }

    // mark visible logic in compile
    if (
      this._marks.getMarks().some(m => {
        ignoreCheckKeys[m.name] = true;
        return prevSpec[m.name]?.visible !== spec[m.name]?.visible;
      })
    ) {
      result.reCompile = true;
    }

    if (
      currentKeys.some(k => {
        if (ignoreCheckKeys[k]) {
          return false;
        } else if (!isEqual(spec[k], prevSpec[k])) {
          return true;
        }
        return false;
      })
    ) {
      result.reMake = true;
      return result;
    }

    return result;
  }

  _updateSpecData() {
    if (this._rawData && this._spec.data && !(this._spec.data instanceof DataView)) {
      updateDataViewInData(this._rawData, this._spec.data, true);
    }
  }

  reInit(spec?: T) {
    super.reInit(spec);

    const marks = this.getMarksWithoutRoot();
    // FIXME: 合并 mark spec 的时机是否需要统一调整到 this.initMarkStyle() 中？
    marks.forEach(mark => {
      this._spec[mark.name] && this.initMarkStyleWithSpec(mark, this._spec[mark.name]);
    });
    this.initMarkStyle();
    marks.forEach(mark => {
      mark.updateStaticEncode();
      mark.updateLayoutState(true);
    });
    this._updateExtensionMarkSpec(spec);
    this._updateSpecData();

    if (this._tooltipHelper) {
      this._tooltipHelper.updateTooltipSpec();
    }
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
    // clear add transforms of rawData
    const transformIndex = this._rawData?.transformsArr?.findIndex(t => t.type === 'addVChartProperty');
    if (transformIndex >= 0) {
      this._rawData.transformsArr.splice(transformIndex, 1);
    }
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

  setLayoutStartPosition(pos: Partial<IPoint>): void {
    if (isValidNumber(pos.x)) {
      this._layoutStartPoint.x = pos.x;
    }
    if (isValidNumber(pos.y)) {
      this._layoutStartPoint.y = pos.y;
    }
  }

  setLayoutRect({ width, height }: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRect>) {
    if (isValidNumber(width)) {
      this._layoutRect.width = width;
    }

    if (isValidNumber(height)) {
      this._layoutRect.height = height;
    }
  }

  /** seriesField */
  getSeriesKeys(): string[] {
    if (this._seriesField) {
      return this.getRawDataStatisticsByField(this._seriesField)?.values ?? [];
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
    return (attribute: string) => this._seriesMark?.getAttribute(attribute as any, datum) ?? undefined;
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
    return this._getSeriesInfo(field, this.getRawDataStatisticsByField(field)?.values ?? []);
  }

  getSeriesInfoList() {
    return this._getSeriesInfo(this._seriesField ?? DEFAULT_DATA_SERIES_FIELD, this.getSeriesKeys());
  }

  /** seriesField end */

  // get default color scale
  // 重复代码太多了，整合一下
  protected _getDefaultColorScale() {
    const colorDomain = this.getDefaultColorDomain();
    const colorRange = this._getDataScheme();
    return new ColorOrdinalScale().domain(colorDomain).range?.(colorRange);
  }

  protected _getDataScheme() {
    return getDataScheme(this.getColorScheme(), this.type as any);
  }

  /** 获取默认 color scale 的 domain */
  getDefaultColorDomain(): any[] {
    return this._seriesField ? this.getViewDataStatistics()?.latestData[this._seriesField]?.values : [];
  }

  // 通用的默认颜色映射 用户设置优先级比这个高，会在setStyle中处理
  getColorAttribute() {
    return {
      scale: this._option.globalScale.getScale('color') ?? this._getDefaultColorScale(),
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

  protected _createMark<M extends IMark>(markInfo: ISeriesMarkInfo, option: ISeriesMarkInitOption = {}) {
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
      depend,
      progressive,
      support3d = this._spec.support3d || !!(this._spec as any).zField,
      morph = false,
      customShape,
      stateSort
    } = option;
    const m = super._createMark<M>(markInfo, {
      key: key ?? this._getDataIdKey(),
      support3d,
      seriesId: this.id,
      attributeContext: this._markAttributeContext,
      componentType: option.componentType
    });
    if (isValid(m)) {
      this._marks.addMark(m, { name: markInfo.name });

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

      const spec = this.getSpec() || ({} as T);

      m.setMorph(morph);
      m.setMorphKey(spec.morph?.morphKey || `${this.getSpecIndex()}`);
      m.setMorphElementKey(spec.morph?.morphElementKey ?? option.defaultMorphElementKey);

      if (!isNil(progressive)) {
        m.setProgressiveConfig(progressive);
      }

      if (!isNil(groupKey)) {
        m.setGroupKey(groupKey);
      }

      if (customShape) {
        m.setCustomizedShapeCallback(customShape);
      }

      if (stateSort) {
        m.setStateSortCallback(stateSort);
      }

      this.initMarkStyleWithSpec(m, mergeSpec({}, themeSpec, markSpec || spec[m.name]));
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

    const seriesField = this.getSeriesField();

    if (seriesField && !dimensionFields.includes(seriesField)) {
      key += `_${datum[seriesField]}`;
    }

    return key;
  }

  /**
   * data
   */
  addViewDataFilter(option: ITransformOptions) {
    (this._viewDataFilter ?? this.getViewData())?.transform(option, false);
  }

  reFilterViewData() {
    (this._viewDataFilter ?? this.getViewData())?.reRunAllTransform();
  }

  reTransformViewData() {
    this._data?.getDataView()?.reRunAllTransform();
  }

  fillData() {
    this.getRawData()?.reRunAllTransform();
  }

  compile() {
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
      return Object.values<ISeriesMarkInfo>(seriesMarkInfoMap[this.type] ?? {});
    }
    return list;
  }

  protected _getInvalidConnectType() {
    return this._invalidType === 'zero' ? 'zero' : this._invalidType === 'link' ? 'connect' : 'none';
  }

  protected _getInvalidDefined = (datum: Datum) => couldBeValidNumber(datum[this.getStackValueField()]);

  protected _getRelatedComponentSpecInfo(specKey: string) {
    const specIndex = this.getSpecIndex();
    const relatedComponent = this._option
      .getSpecInfo()
      .component[specKey]?.filter(componentInfo => componentInfo.seriesIndexes.includes(specIndex));
    return relatedComponent ?? [];
  }
}
