import type { ICartesianSeries, IPolarSeries, ISeries } from '../../series/interface';
// eslint-disable-next-line no-duplicate-imports
import { eachSeries } from '../../util/model';
// eslint-disable-next-line no-duplicate-imports
import { BaseComponent } from '../base/base-component';
import type { IEffect, IModelInitOption } from '../../model/interface';
import { ComponentTypeEnum, type IComponent, type IComponentOption } from '../interface';
import type { IGroupMark } from '../../mark/group';
import { dataFilterComputeDomain, dataFilterWithNewDomain } from './util';
import type { AdaptiveSpec, ILayoutRect, ILayoutType, IOrientType, IRect, StringOrNumber } from '../../typings';
import { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../../data/register';
import { BandScale, isContinuous, isDiscrete } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import type { IBandLikeScale, IBaseScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../typings/space';
import type { CartesianAxis, ICartesianBandAxisSpec } from '../axis/cartesian';
import { getDirectionByOrient, getOrient } from '../axis/cartesian/util/common';
import type { IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { mixin, clamp, isNil, merge, isEqual, isValid, array, minInArray, maxInArray, abs } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import type { IFilterMode } from './interface';
import type {
  IDataFilterComponent,
  IDataFilterComponentSpec,
  IRoamDragSpec,
  IRoamScrollSpec,
  IRoamZoomSpec
} from './interface';
import { dataViewParser, DataView } from '@visactor/vdataset';
import { CompilableData } from '../../compile/data/compilable-data';
import type { BaseEventParams } from '../../event/interface';
import type { IZoomable } from '../../interaction/zoom/zoomable';
// eslint-disable-next-line no-duplicate-imports
import { Zoomable } from '../../interaction/zoom/zoomable';
import type { AbstractComponent, DataZoom } from '@visactor/vrender-components';
import type { IDelayType } from '../../typings/event';
import { TransformLevel } from '../../data/initialize';
import type { IDataZoomSpec } from './data-zoom/interface';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
import { AttributeLevel } from '../../constant';

export abstract class DataFilterBaseComponent<T extends IDataFilterComponentSpec = IDataFilterComponentSpec>
  extends BaseComponent<AdaptiveSpec<T, 'width' | 'height'>>
  implements IDataFilterComponent
{
  layoutType: ILayoutType | 'none' = 'none';

  protected _component: AbstractComponent;

  protected _orient: IOrientType = 'left';
  protected _isHorizontal: boolean;

  // 是否为自动模式
  protected _auto?: boolean;
  protected _fixedBandSize?: number;
  protected _cacheRect?: ILayoutRect;
  protected _cacheVisibility?: boolean = undefined;
  protected _dataUpdating: boolean = false;

  // 数据
  protected _stateScale: IBaseScale;

  protected _relatedAxisComponent!: IComponent;
  protected _originalStateFields: Record<number, string | number>;

  // 与系列的关联关系
  // 优先级：id > index
  // 最终结果：series & region取交集
  protected _seriesUserId?: StringOrNumber[];
  protected _seriesIndex?: number[];
  protected _regionUserId!: string[];
  protected _regionIndex!: number[];
  protected _newDomain: any[];

  // 起点数据
  protected _startValue!: number | string;
  // 终点数据
  protected _endValue!: number | string;
  // 开始值，百分比值，0 - 1
  protected _start!: number;
  // 结束值，百分比值，0 - 1
  protected _end!: number;
  // 最小窗口范围
  protected _minSpan!: number;
  // 最大窗口范围
  protected _maxSpan!: number;
  // 窗口范围缓存
  protected _spanCache!: number;
  protected _shouldChange: boolean = true;

  protected _field!: string | undefined;
  protected _stateField: string = 'x';
  protected _valueField?: string;

  protected _width!: number;
  protected _height!: number;

  protected _filterMode!: IFilterMode;

  protected _activeRoam: boolean = true;
  protected _zoomAttr: IRoamZoomSpec = {
    enable: true,
    rate: 1,
    focus: true
  };
  protected _dragAttr: IRoamDragSpec = {
    enable: true,
    rate: 1,
    reverse: true
  };
  protected _scrollAttr: IRoamScrollSpec = {
    enable: true,
    rate: 1,
    reverse: true
  };

  get relatedAxisComponent() {
    return this._relatedAxisComponent;
  }

  /**
   * 外部可以通过此方法强制改变datazoom的start和end，达到聚焦定位的效果
   * @param start datazoom起点所在的相对位置
   * @param end datazoom终点所在的相对位置
   * @returns
   */
  setStartAndEnd(
    start: number | string,
    end: number | string,
    rangeMode: ['percent' | 'value', 'percent' | 'value'] = ['percent', 'percent']
  ) {
    const [startMode = 'percent', endMode = 'percent'] = rangeMode;

    const startPercent = (startMode === 'percent' ? start : this.dataToStatePoint(start)) as number;
    const endPercent = (endMode === 'percent' ? end : this.dataToStatePoint(end)) as number;

    this._handleChange(startPercent, endPercent, true);
  }

  enableInteraction() {
    this._activeRoam = true;
  }
  disableInteraction() {
    this._activeRoam = false;
  }
  zoomIn(location?: { x: number; y: number }) {
    this._handleChartZoom({
      zoomDelta: 1.2, // 经验值
      zoomX: location?.x,
      zoomY: location?.y
    });
  }

  zoomOut(location?: { x: number; y: number }) {
    this._handleChartZoom({
      zoomDelta: 0.8, // 经验值
      zoomX: location?.x,
      zoomY: location?.y
    });
  }

  protected abstract _getComponentAttrs(): any;
  protected abstract _createOrUpdateComponent(): void;
  protected abstract _computeWidth(): number;
  protected abstract _computeHeight(): number;
  protected abstract _handleDataCollectionChange(): void;

  protected _handleChange(start: number, end: number, updateComponent?: boolean) {
    const zoomLock = this._spec?.zoomLock ?? false;
    if (
      zoomLock ||
      // 拖拽两端的handler, 而非拖拽中间handler
      (end - start !== this._spanCache &&
        // 拖拽后超出限制范围
        (end - start < this._minSpan || end - start > this._maxSpan))
    ) {
      this._shouldChange = false;
    } else {
      this._shouldChange = true;
      this._spanCache = end - start;
    }
  }

  protected _isReverse() {
    const axis = this._relatedAxisComponent as CartesianAxis<any>;
    if (!axis) {
      return false;
    }
    const axisScale = axis.getScale() as IBandLikeScale;
    return axisScale.range()[0] > axisScale.range()[1] && (!axis.getInverse() || this._isHorizontal);
  }

  protected _updateRangeFactor(tag?: 'startHandler' | 'endHandler') {
    // 轴的range有时是相反的
    // 比如相同的region范围, 有的场景range为[0, 500], 有的场景range为[500, 0]
    // 而datazoom/scrollbar的range是根据布局强制转化为[0, 500]
    // 所以这里在转换时进行判断并做转置, 有待优化
    // 轴在inverse时，也要做转置处理
    const axis = this._relatedAxisComponent as CartesianAxis<any>;
    const axisScale = axis.getScale() as IBandLikeScale;
    const reverse = this._isReverse();
    const newRangeFactor: [number, number] = reverse ? [1 - this._end, 1 - this._start] : [this._start, this._end];

    if (reverse) {
      switch (tag) {
        case 'startHandler':
          axisScale.rangeFactorEnd(newRangeFactor[1]);
          break;
        case 'endHandler':
          axisScale.rangeFactorStart(newRangeFactor[0]);
          break;
        default:
          axisScale.rangeFactorStart(newRangeFactor[0], true);
          axisScale.rangeFactorEnd(newRangeFactor[1]); // end 保证为准确值
      }
    } else {
      switch (tag) {
        case 'startHandler':
          axisScale.rangeFactorStart(newRangeFactor[0]);
          break;
        case 'endHandler':
          axisScale.rangeFactorEnd(newRangeFactor[1]);
          break;
        default:
          axisScale.rangeFactorEnd(newRangeFactor[1], true);
          axisScale.rangeFactorStart(newRangeFactor[0]); // start 保证为准确值
      }
    }

    const newFactor = axisScale.rangeFactor();
    if (newFactor) {
      this._start = reverse ? 1 - newFactor[1] : newFactor[0];
      this._end = reverse ? 1 - newFactor[0] : newFactor[1];
    } else {
      this._start = 0;
      this._end = 1;
    }
  }

  effect: IEffect = {
    onZoomChange: (tag?: 'startHandler' | 'endHandler') => {
      const axis = this._relatedAxisComponent as CartesianAxis<any>;
      if (axis && this._filterMode === 'axis') {
        const axisScale = axis.getScale() as IBandLikeScale;
        const axisSpec = axis.getSpec() as ICartesianBandAxisSpec;
        // 判断是否允许自由更改轴 bandSize
        if (this._auto && this._getAxisBandSize(axisSpec) && (this._spec as IDataZoomSpec).ignoreBandSize) {
          axisScale.bandwidth('auto');
          axisScale.maxBandwidth('auto');
          axisScale.minBandwidth('auto');
        }

        this._updateRangeFactor(tag);
        if (this._auto) {
          (this._component as DataZoom)?.setStartAndEnd?.(this._start, this._end);
        }

        axis.effect.scaleUpdate();
      } else {
        eachSeries(
          this._regions,
          s => {
            s.getViewData()?.markRunning();
          },
          {
            userId: this._seriesUserId,
            specIndex: this._seriesIndex
          }
        );
        eachSeries(
          this._regions,
          s => {
            s.reFilterViewData();
          },
          {
            userId: this._seriesUserId,
            specIndex: this._seriesIndex
          }
        );
      }
    }
  };

  protected _visible: boolean = true;
  get visible() {
    return this._visible;
  }

  constructor(spec: T, options: IComponentOption) {
    super(spec as any, options);
    this._orient = getOrient(spec as any);
    this._isHorizontal = getDirectionByOrient(this._orient) === Direction.horizontal;
  }

  /**
   * the hook after this component is created
   */
  created() {
    super.created();
    // related axis
    this._setAxisFromSpec();
    // related regions
    this._setRegionsFromSpec();
    this._initEvent();
    // data for background
    this._initData();
    // init the state scale
    this._initStateScale();
    // set state: _start, _end, _startValue, _endValue, _newDomain from spec
    this._setStateFromSpec();
  }

  initLayout(): void {
    super.initLayout();
    this._layout && (this._layout.layoutOrient = this._orient);
  }

  protected _setAxisFromSpec() {
    if (isValid(this._spec.axisId)) {
      this._relatedAxisComponent = this._option.getComponentByUserId(this._spec.axisId);
    } else if (isValid(this._spec.axisIndex)) {
      this._relatedAxisComponent = this._option.getComponentByIndex('axes', this._spec.axisIndex);
    }

    // 如果用户没有配置关联轴 或 用户配置的关联轴和datazoom方向不一致
    // 则 使用与datazoom的orient相同的第一个axis作为关联轴
    if (isNil(this._spec.field) && !this._relatedAxisComponent) {
      const axes = this._option.getComponentsByKey('axes');
      const sameOrientAxis = axes.find((cm: any) => (cm as any)._orient === this._orient);

      if (sameOrientAxis) {
        this._relatedAxisComponent = sameOrientAxis;
      } else {
        const bandAxis = axes.find((cm: any) => !isContinuous((cm as any).getScale().type));

        this._relatedAxisComponent = bandAxis;
      }
    }
    if (this._relatedAxisComponent && this._filterMode === 'axis') {
      (this._relatedAxisComponent as CartesianAxis<any>).autoIndentOnce = true;
    }
  }

  protected _setRegionsFromSpec() {
    // 从axis中获取关联的regions
    this._regions = this._relatedAxisComponent ? this._relatedAxisComponent.getRegions() : this._option.getAllRegions();
    // 默认使用关联轴的系列绑定关系
    const bindSeriesFilter = this._relatedAxisComponent ? this._relatedAxisComponent.getBindSeriesFilter?.() : null;
    if (isValid(bindSeriesFilter)) {
      isValid(bindSeriesFilter.userId) && (this._seriesUserId = array(bindSeriesFilter.userId));
      isValid(bindSeriesFilter.specIndex) && (this._seriesIndex = array(bindSeriesFilter.specIndex));
    }
    // spec中的系列绑定关系 取交集
    if (isValid(this._spec.seriesId)) {
      const specSeriesId = array(this._spec.seriesId);
      if (this._seriesUserId) {
        this._seriesUserId = this._seriesUserId.filter(s => specSeriesId.includes(s));
      } else {
        this._seriesUserId = specSeriesId;
      }
    }
    if (isValid(this._spec.seriesIndex)) {
      const specSeriesIndex = array(this._spec.seriesIndex);
      if (this._seriesIndex) {
        this._seriesIndex = this._seriesIndex.filter(s => specSeriesIndex.includes(s));
      } else {
        this._seriesIndex = specSeriesIndex;
      }
    }
    if (isValid(this._spec.regionIndex)) {
      const regionsFromSpec = this._option.getRegionsInIndex(array(this._spec.regionIndex));
      // 如果用户配置了region就取 axis关联 和 用户配置 的交集
      this._regions = this._regions.filter(r => regionsFromSpec.includes(r));
      return;
    }
    if (isValid(this._spec.regionId)) {
      const ids = array(this._spec.regionId);
      // 如果用户配置了region就取 axis关联 和 用户配置 的交集
      this._regions = ids.length ? this._regions.filter(r => ids.includes(r.id)) : [];
      return;
    }
    return;
  }

  onDataUpdate(): void {
    const domain = this._computeDomainOfStateScale(isContinuous(this._stateScale.type));

    this._stateScale.domain(domain, true);
    this._handleChange(this._start, this._end, true);
    // auto 模式下需要重新布局
    if (this._spec.auto) {
      this._dataUpdating = true;
      this.getChart()?.setLayoutTag(true, null, false);
    }
  }

  protected _computeDomainOfStateScale(isContinuous?: boolean) {
    if ((this._spec as IDataZoomSpec).customDomain) {
      return (this._spec as IDataZoomSpec).customDomain;
    }

    const domain = this._data.getLatestData().map((d: any) => d[this._stateField]);

    if (isContinuous) {
      const domainNum = domain.map((n: any) => n * 1);
      return domain.length ? [minInArray(domainNum), maxInArray(domainNum)] : [-Infinity, Infinity];
    }

    return domain;
  }

  protected _initEvent() {
    this._initCommonEvent();
  }

  protected _initData() {
    const dataCollection: any[] = [];
    const stateFields: string[] = [];
    const valueFields: string[] = [];

    if (this._relatedAxisComponent) {
      const originalStateFields = {};
      eachSeries(
        this._regions,
        s => {
          // 如果副轴的类型是time或band，则无法进行数据统计
          const xAxisHelper =
            s.coordinate === 'cartesian'
              ? (s as ICartesianSeries).getXAxisHelper()
              : s.coordinate === 'polar'
              ? (s as IPolarSeries).angleAxisHelper
              : null;
          const yAxisHelper =
            s.coordinate === 'cartesian'
              ? (s as ICartesianSeries).getYAxisHelper()
              : s.coordinate === 'polar'
              ? (s as IPolarSeries).radiusAxisHelper
              : null;
          if (!xAxisHelper || !yAxisHelper) {
            return;
          }
          const stateAxisHelper =
            xAxisHelper.getAxisId() === this._relatedAxisComponent.id
              ? xAxisHelper
              : yAxisHelper.getAxisId() === this._relatedAxisComponent.id
              ? yAxisHelper
              : this._isHorizontal
              ? xAxisHelper
              : yAxisHelper;
          const valueAxisHelper = stateAxisHelper === xAxisHelper ? yAxisHelper : xAxisHelper;
          const isValidateValueAxis = isContinuous(valueAxisHelper.getScale(0).type);

          dataCollection.push(s.getRawData());
          // 这里获取原始的spec中的xField和yField，而非经过stack处理后的fieldX和fieldY，原因如下：
          // 1. dataFilterComputeDomain处理时拿到的viewData中没有__VCHART_STACK_START等属性，也就是还没处理
          // 2. datazoom计算的是原始的value值，如果要根据stack后的数据来算，则需要__VCHART_STACK_END - __VCHART_STACK_START
          const seriesSpec = s.getSpec();

          const xFields = array(seriesSpec.xField);
          const yFields = array(seriesSpec.yField);
          const xField = s.coordinate === 'cartesian' ? xFields[0] : seriesSpec.angleField ?? seriesSpec.categoryField;
          const yField = s.coordinate === 'cartesian' ? yFields[0] : seriesSpec.radiusField ?? seriesSpec.valueField;

          originalStateFields[s.id] =
            s.type === 'link' ? 'from_xField' : stateAxisHelper === xAxisHelper ? xField : yField;

          stateFields.push(originalStateFields[s.id]);
          if (this._valueField) {
            const valueField = s.type === 'link' ? 'from_yField' : valueAxisHelper === xAxisHelper ? xField : yField;
            valueFields.push(isValidateValueAxis ? valueField : null);
          }
        },
        {
          userId: this._seriesUserId,
          specIndex: this._seriesIndex
        }
      );

      this._originalStateFields = originalStateFields;
    } else {
      eachSeries(
        this._regions,
        s => {
          dataCollection.push(s.getRawData());

          stateFields.push(this._field);
          if (this._valueField) {
            valueFields.push(this._spec.valueField);
          }
        },
        {
          userId: this._seriesUserId,
          specIndex: this._seriesIndex
        }
      );
    }
    const { dataSet } = this._option;
    registerDataSetInstanceParser(dataSet, 'dataview', dataViewParser);
    registerDataSetInstanceTransform(dataSet, 'dataFilterComputeDomain', dataFilterComputeDomain);
    const data = new DataView(dataSet, { name: `${this.type}_${this.id}_data` });
    data.transform(
      {
        type: 'dataFilterComputeDomain',
        options: {
          input: {
            dataCollection: dataCollection,
            stateFields,
            valueFields
          },
          output: {
            stateField: this._stateField,
            valueField: this._valueField
          }
        }
      },
      false
    );

    this._data = new CompilableData(this._option, data);
    data.reRunAllTransform();
    dataSet.multipleDataViewAddListener(dataCollection, 'change', this._handleDataCollectionChange.bind(this));
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();

    // interaction相关
    if (this._spec.roamZoom === true || this._spec.roamZoom) {
      this._zoomAttr = merge({}, this._zoomAttr, this._spec.roamZoom);
    } else {
      this._zoomAttr.enable = false;
    }

    if (this._spec.roamDrag === true || this._spec.roamDrag) {
      this._dragAttr = merge({}, this._dragAttr, this._spec.roamDrag);
    } else {
      this._dragAttr.enable = false;
    }

    if (this._spec.roamScroll === true || this._spec.roamScroll) {
      this._scrollAttr = merge({}, this._scrollAttr, this._spec.roamScroll);
    } else {
      this._scrollAttr.enable = false;
    }

    // style相关
    this._field = this._spec.field;
    this._width = this._computeWidth();
    this._height = this._computeHeight();
    this._visible = this._spec.visible ?? true;
  }

  protected _statePointToData(state: number) {
    const scale = this._stateScale;
    const domain = scale.domain();

    // continuous scale: 本来可以用scale invert，但scale invert在大数据场景下性能不太好，所以这里自行计算
    if (isContinuous(scale.type)) {
      if (this._isReverse()) {
        return domain[0] + (domain[1] - domain[0]) * (1 - state);
      }
      return domain[0] + (domain[1] - domain[0]) * state;
    }

    // discete scale: 根据bandSize计算不准确, bandSize不是最新的, 导致index计算错误, 所以仍然使用invert
    let range = scale.range();
    if (this._isReverse()) {
      range = range.slice().reverse();
    }
    const posInRange: number = range[0] + (range[1] - range[0]) * state;
    // const bandSize = (scale as BandScale).bandwidth();
    // const domainIndex = Math.min(Math.max(0, Math.floor(posInRange / bandSize)), domain.length - 1);
    // return domain[domainIndex];
    return scale.invert(posInRange);
  }

  dataToStatePoint(data: number | string) {
    const scale = this._stateScale;
    const pos = scale.scale(data);
    let range = scale.range();

    if (!this._isHorizontal && isContinuous(scale.type)) {
      range = range.slice().reverse();
    }

    return (pos - range[0]) / (range[1] - range[0]);
  }

  protected _modeCheck(statePoint: 'start' | 'end', mode: string): any {
    if (statePoint === 'start') {
      return (mode === 'percent' && this._spec.start) || (mode === 'value' && this._spec.startValue);
    }
    return (mode === 'percent' && this._spec.end) || (mode === 'value' && this._spec.endValue);
  }

  protected _setStateFromSpec() {
    this._auto = !!this._spec.auto;
    let start;
    let end;
    if (this._spec.rangeMode) {
      const [startMode, endMode] = this._spec.rangeMode;
      // 只有mode与配置相符时，才会生效
      // 比如rangeMode为['value', 'percent'],那么start为dataValue, end为[0, 1]
      if (this._modeCheck('start', startMode) && this._modeCheck('end', endMode)) {
        start = startMode === 'percent' ? this._spec.start : this.dataToStatePoint(this._spec.startValue);
        end = endMode === 'percent' ? this._spec.end : this.dataToStatePoint(this._spec.endValue);
      }
    } else {
      start = this._spec.start
        ? this._spec.start
        : this._spec.startValue
        ? this.dataToStatePoint(this._spec.startValue)
        : 0;
      end = this._spec.end ? this._spec.end : this._spec.endValue ? this.dataToStatePoint(this._spec.endValue) : 1;
    }
    this._startValue = this._statePointToData(start);
    this._endValue = this._statePointToData(end);
    this._start = start;
    this._end = end;
    this._minSpan = this._spec.minSpan ?? 0;
    this._maxSpan = this._spec.maxSpan ?? 1;
    if (isContinuous(this._stateScale.type) && this._stateScale.domain()[0] !== this._stateScale.domain()[1]) {
      if (this._spec.minValueSpan) {
        this._minSpan = this._spec.minValueSpan / (this._stateScale.domain()[1] - this._stateScale.domain()[0]);
      }
      if (this._spec.maxValueSpan) {
        this._maxSpan = this._spec.maxValueSpan / (this._stateScale.domain()[1] - this._stateScale.domain()[0]);
      }
    }
    this._minSpan = Math.max(0, this._minSpan);
    this._maxSpan = Math.min(this._maxSpan, 1);

    // eslint-disable-next-line max-len
    if ((!this._relatedAxisComponent || this._filterMode !== 'axis') && (this._start !== 0 || this._end !== 1)) {
      this._newDomain = this._parseDomainFromState(this._startValue, this._endValue);
    }
  }

  private _parseFieldOfSeries(s: ISeries) {
    return this._originalStateFields?.[s.id];
  }

  protected _initStateScale() {
    const defaultRange = [0, 1];

    if (this._relatedAxisComponent) {
      const scale = (this._relatedAxisComponent as CartesianAxis<any>).getScale();
      const isContinuousScale = isContinuous(scale.type);
      const domain = this._computeDomainOfStateScale(isContinuousScale);

      this._stateScale = scale.clone();
      if (isContinuousScale) {
        const domainNum = domain.map((n: any) => n * 1);
        this._stateScale
          .domain(domain.length ? [minInArray(domainNum), maxInArray(domainNum)] : [0, 1], true)
          .range(defaultRange);
      } else {
        this._stateScale.domain(domain, true).range(defaultRange);
      }
    } else {
      this._stateScale = new BandScale();
      this._stateScale.domain(this._computeDomainOfStateScale(), true).range(defaultRange);
    }
  }

  init(option: IModelInitOption): void {
    super.init(option);
    // 添加 transform
    this._addTransformToSeries();
    // 增加datazoom 数据统计
    // 只有在轴没有被设置数据时才有用
    // this.addZoomStatistics();

    if (this._start !== 0 || this._end !== 1) {
      this.effect.onZoomChange();
    }
  }

  protected _addTransformToSeries() {
    if (!this._relatedAxisComponent || this._filterMode !== 'axis') {
      registerDataSetInstanceTransform(this._option.dataSet, 'dataFilterWithNewDomain', dataFilterWithNewDomain);

      eachSeries(
        this._regions,
        s => {
          s.addViewDataFilter({
            type: 'dataFilterWithNewDomain',
            options: {
              getNewDomain: () => this._newDomain,
              field: () => {
                return this._field ?? this._parseFieldOfSeries(s);
              },
              isContinuous: () => isContinuous(this._stateScale.type)
            },
            level: TransformLevel.dataZoomFilter
          });
        },
        {
          userId: this._seriesUserId,
          specIndex: this._seriesIndex
        }
      );
    }
  }

  /** LifeCycle API**/
  onRender(ctx: any): void {
    // do nothing
  }

  /**
   * updateSpec
   */
  _compareSpec(spec: AdaptiveSpec<T, 'width' | 'height'>, prevSpec: AdaptiveSpec<T, 'width' | 'height'>) {
    const result = super._compareSpec(spec, prevSpec);
    if (!result.reMake && !isEqual(prevSpec, spec)) {
      result.reRender = true;
      result.reMake = true;
    }

    return result;
  }

  reInit(spec?: AdaptiveSpec<T, 'width' | 'height'>) {
    super.reInit(spec);

    this._marks.forEach(g => {
      (<IGroupMark>g).getMarks().forEach(m => {
        this.initMarkStyleWithSpec(m, this._spec[m.name]);
      });
    });
  }

  changeRegions() {
    // do nothing
  }
  protected update(ctx: IComponentOption) {
    // do nothing
  }
  protected resize(ctx: IComponentOption) {
    // do nothing
  }

  protected _parseDomainFromState(startValue: number | string, endValue: number | string) {
    if (isContinuous(this._stateScale.type)) {
      return [Math.min(endValue as number, startValue as number), Math.max(endValue as number, startValue as number)];
    }
    const allDomain = this._stateScale.domain();
    const startIndex = allDomain.indexOf(startValue);
    const endIndex = allDomain.indexOf(endValue);
    return allDomain.slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1);
  }

  protected _handleStateChange = (startValue: number, endValue: number, tag?: string) => {
    this._startValue = startValue;
    this._endValue = endValue;

    this._newDomain = this._parseDomainFromState(this._startValue, this._endValue);

    this.effect.onZoomChange?.(tag);
    return true;
  };

  protected _handleChartZoom = (params: { zoomDelta: number; zoomX?: number; zoomY?: number }) => {
    if (!this._activeRoam) {
      return;
    }

    const { zoomDelta, zoomX, zoomY } = params;
    const { x, y } = this._regions[0].getLayoutStartPoint();
    const { width, height } = this._regions[0].getLayoutRect();

    const delta = Math.abs(this._start - this._end);
    const zoomRate = (this._spec.roamZoom as IRoamZoomSpec)?.rate ?? 1;
    // zoomDelta > 1表示放大, zoomDelta < 1表示缩小
    if (delta >= 1 && zoomDelta < 1) {
      return;
    }
    if (delta <= 0.01 && zoomDelta > 1) {
      return;
    }
    const focusLoc = this._isHorizontal ? zoomX : zoomY;
    const totalValue = delta * (zoomDelta - 1) * zoomRate;
    let startValue = totalValue / 2;
    let endValue = totalValue / 2;
    if (focusLoc) {
      const startLoc = this._isHorizontal ? x : y;
      const endLoc = this._isHorizontal ? width : height;
      startValue = (Math.abs(startLoc - focusLoc) / Math.abs(endLoc - startLoc)) * totalValue;
      endValue = (Math.abs(endLoc - focusLoc) / Math.abs(endLoc - startLoc)) * totalValue;
    }
    const start = clamp(this._start + startValue, 0, 1);
    const end = clamp(this._end - endValue, 0, 1);

    this._handleChange(Math.min(start, end), Math.max(start, end), true);
  };

  protected _handleChartScroll = (params: { scrollX: number; scrollY: number }, e: BaseEventParams['event']) => {
    if (!this._activeRoam) {
      return false;
    }
    const { scrollX, scrollY } = params;
    let value = this._isHorizontal ? scrollX : scrollY;
    // 判断这次是否应该要滚动，最少
    const active = this._isHorizontal ? abs(scrollX / scrollY) >= 0.5 : abs(scrollY / scrollX) >= 0.5;
    if (!this._scrollAttr.reverse) {
      value = -value;
    }

    if (active) {
      this._handleChartMove(value, this._scrollAttr.rate ?? 1);
    }

    // 判断是否滚动到最顶部或最底部
    // 如果滚动到最顶部或最底部，则不应该stopBubble
    const hasChange = this._start !== 0 && this._end !== 1;

    return active && hasChange;
  };

  protected _handleChartDrag = (delta: [number, number], e: BaseEventParams['event']) => {
    if (!this._activeRoam) {
      return;
    }
    const [dx, dy] = delta;
    let value = this._isHorizontal ? dx : dy;
    if (this._dragAttr.reverse) {
      value = -value;
    }

    this._handleChartMove(value, this._dragAttr.rate ?? 1);
  };

  protected _handleChartMove = (value: number, rate: number) => {
    const totalValue = this._isHorizontal ? this.getLayoutRect().width : this.getLayoutRect().height;
    if (Math.abs(value) >= 1e-6) {
      if (value > 0 && this._end < 1) {
        const moveDelta = Math.min(1 - this._end, value / totalValue) * rate;
        this._handleChange(this._start + moveDelta, this._end + moveDelta, true);
      } else if (value < 0 && this._start > 0) {
        const moveDelta = Math.max(-this._start, value / totalValue) * rate;
        this._handleChange(this._start + moveDelta, this._end + moveDelta, true);
      }
    }
    return false;
  };

  protected _initCommonEvent() {
    const delayType: IDelayType = this._spec?.delayType ?? 'throttle';
    const delayTime = isValid(this._spec?.delayType) ? this._spec?.delayTime ?? 30 : 0;
    const realTime = this._spec?.realTime ?? true;
    const option = { delayType, delayTime, realTime };
    if (this._zoomAttr.enable) {
      (this as unknown as IZoomable).initZoomEventOfRegions(this._regions, null, this._handleChartZoom, option);
    }
    if (this._scrollAttr.enable) {
      (this as unknown as IZoomable).initScrollEventOfRegions(this._regions, null, this._handleChartScroll, option);
    }
    if (this._dragAttr.enable) {
      (this as unknown as IZoomable).initDragEventOfRegions(this._regions, null, this._handleChartDrag, option);
    }
  }

  updateLayoutAttribute(): void {
    // create or update component
    if (this._visible) {
      this._createOrUpdateComponent();
    }
    super.updateLayoutAttribute();
  }

  onLayoutStart(layoutRect: IRect, viewRect: ILayoutRect, ctx: any): void {
    super.onLayoutStart(layoutRect, viewRect, ctx);
    const isShown = this._autoUpdate(layoutRect);
    const sizeKey = this._isHorizontal ? 'height' : 'width';
    this.layout.setLayoutRect(
      {
        [sizeKey]: isShown ? this[`_${sizeKey}`] : 0
      },
      {
        [sizeKey]: AttributeLevel.Built_In
      }
    );
    this._dataUpdating = false;
  }

  /**
   * bounds预计算
   * @param rect
   * @returns
   */
  getBoundsInRect(rect: ILayoutRect): IBoundsLike {
    const result: IBoundsLike = { x1: this.getLayoutStartPoint().x, y1: this.getLayoutStartPoint().y, x2: 0, y2: 0 };

    if (this._isHorizontal) {
      result.y2 = result.y1 + this._height;
      result.x2 = result.x1 + rect.width;
    } else {
      result.x2 = result.x1 + this._width;
      result.y2 = result.y1 + rect.height;
    }
    return result;
  }

  hide() {
    this._component?.hideAll();
  }

  show() {
    this._component?.showAll();
  }

  protected _getAxisBandSize(axisSpec?: ICartesianBandAxisSpec) {
    const bandSize = axisSpec?.bandSize;
    const maxBandSize = axisSpec?.maxBandSize;
    const minBandSize = axisSpec?.minBandSize;
    if (bandSize || minBandSize || maxBandSize) {
      return { bandSize, maxBandSize, minBandSize };
    }
    return undefined;
  }

  protected _autoUpdate(rect?: ILayoutRect): boolean {
    if (!this._auto) {
      this._cacheVisibility = undefined;
      return true;
    }

    const axis = this._relatedAxisComponent as CartesianAxis<any>;
    const axisSpec = axis?.getSpec() as ICartesianBandAxisSpec | undefined;
    const axisScale = axis?.getScale() as IBandLikeScale;
    const bandSizeResult = this._getAxisBandSize(axisSpec);

    if (
      !this._dataUpdating &&
      isDiscrete(axisScale.type) &&
      rect?.height === this._cacheRect?.height &&
      rect?.width === this._cacheRect?.width &&
      this._fixedBandSize === bandSizeResult?.bandSize
    ) {
      return this._cacheVisibility;
    }

    let isShown = true;
    if (this._isHorizontal && rect?.width !== this._cacheRect?.width) {
      axisScale.range(axis.getInverse() ? [rect.width, 0] : [0, rect.width]);
    } else if (rect?.height !== this._cacheRect?.height) {
      axisScale.range(axis.getInverse() ? [0, rect.height] : [rect.height, 0]);
    }

    this._cacheRect = {
      width: rect?.width,
      height: rect?.height
    };
    this._fixedBandSize = bandSizeResult?.bandSize;

    if (isDiscrete(axisScale.type)) {
      if (bandSizeResult && (this._start || this._end)) {
        if (this.type === ComponentTypeEnum.scrollBar) {
          this._start = 0;
          this._end = 1;
        }
        this._updateRangeFactor();
      }
      const [start, end] = axisScale.rangeFactor() ?? [];
      if (isNil(start) && isNil(end)) {
        isShown = false;
      } else {
        isShown = !(start === 0 && end === 1);
      }
    } else {
      const [start, end] = axisScale.rangeFactor() ?? [this._start, this._end];
      isShown = !(start === 0 && end === 1);
    }
    this.setStartAndEnd(this._start, this._end);
    if (isShown) {
      this.show();
    } else {
      this.hide();
    }
    this._cacheVisibility = isShown;
    return isShown;
  }

  protected _getNeedClearVRenderComponents(): IGraphic[] {
    return [this._component] as unknown as IGroup[];
  }
}

mixin(DataFilterBaseComponent, Zoomable);
