import type { ICartesianSeries, IPolarSeries, ISeries } from '../../series/interface';
// eslint-disable-next-line no-duplicate-imports
import { eachSeries, isValid, array } from '../../util';
// eslint-disable-next-line no-duplicate-imports
import { BaseComponent } from '../base';
import type { IEffect, IModelInitOption, ILayoutRect } from '../../model/interface';
import type { LayoutItem } from '../../model/layout-item';
import type { IComponent, IComponentOption } from '../interface';
import type { IGroupMark } from '../../mark/group';
import { dataFilterComputeDomain, dataFilterWithNewDomain } from './util';
import type { IOrientType, StringOrNumber } from '../../typings';
import { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../../data/register';
import { BandScale, isContinuous } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import type { IBaseScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../typings/space';
import type { CartesianAxis } from '../axis/cartesian';
import { getDirectionByOrient, getOrient } from '../axis/cartesian/util';
import type { IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { mixin, clamp, isNil } from '@visactor/vutils';
import type { IDataFilterComponent } from './interface';
import { dataViewParser, DataView } from '@visactor/vdataset';
import { CompilableData } from '../../compile/data';
import type { BaseEventParams } from '../../event/interface';
import type { IZoomable } from '../../interaction/zoom/zoomable';
// eslint-disable-next-line no-duplicate-imports
import { Zoomable } from '../../interaction/zoom/zoomable';

export abstract class DataFilterBaseComponent extends BaseComponent implements IDataFilterComponent {
  layoutType: LayoutItem['layoutType'] = 'region-relative';

  protected _orient: IOrientType = 'left';
  protected _isHorizontal: boolean;

  get orient() {
    return this._orient;
  }

  get layoutOrient() {
    return this._orient;
  }
  set layoutOrient(v: IOrientType) {
    this._orient = v;
  }

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

  protected _field: string;
  protected _stateField: string = 'x';
  protected _valueField?: string;

  protected _width!: number;
  protected _height!: number;

  /**
   * 外部可以通过此方法强制改变datazoom的start和end，达到聚焦定位的效果
   * @param start datazoom起点所在的相对位置
   * @param end datazoom终点所在的相对位置
   * @returns
   */
  setStartAndEnd(start: number, end: number) {
    this._handleChange(start, end, true);
  }
  protected abstract _getComponentAttrs(): any;
  protected abstract _createOrUpdateComponent(): void;
  protected abstract _initEvent(): void;
  protected abstract _computeWidth(): number;
  protected abstract _computeHeight(): number;
  protected abstract _handleChange(start: number, end: number, updateComponent?: boolean): void;
  protected abstract _handleDataCollectionChange(): void;

  effect: IEffect = {
    onZoomChange: () => {
      if (this._relatedAxisComponent && this._spec.filterMode === 'axis') {
        const scale = (this._relatedAxisComponent as CartesianAxis).getScale();
        (scale as any).rangeFactor(this._isHorizontal ? [this._start, this._end] : [1 - this._end, 1 - this._start]);
        this._relatedAxisComponent.effect.scaleUpdate();
      } else {
        eachSeries(
          this._regions,
          s => {
            s.getViewDataFilter()?.markRunning();
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

  constructor(spec: any, options: IComponentOption) {
    super(spec, {
      ...options
    });
    this._orient = getOrient(spec);
    this._layoutOrient = this._orient;
    this._isHorizontal = getDirectionByOrient(this._layoutOrient) === Direction.horizontal;
    isValid(spec.autoIndent) && (this._autoIndent = spec.autoIndent);
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
    // data for background
    this._initData();
    // init the state scale
    this._initStateScale();
    // set state: _start, _end, _startValue, _endValue, _newDomain from spec
    this._setStateFromSpec();
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
  }

  protected _computeDomainOfStateScale(isContinuous?: boolean) {
    const domain = this._data.getLatestData().map((d: any) => d[this._stateField]);

    if (isContinuous) {
      return domain.length ? [Math.min.apply(null, domain), Math.max.apply(null, domain)] : [-Infinity, Infinity];
    }

    return domain;
  }

  protected _initData() {
    const dataCollection: any[] = [];
    const stateFields: string[] = [];
    const valueFields: string[] = [];
    let hasValidateValueField = false;

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

          if (isValidateValueAxis) {
            hasValidateValueField = true;
          }

          dataCollection.push(s.getRawData());
          // 这里获取原始的spec中的xField和yField，而非经过stack处理后的fieldX和fieldY，原因如下：
          // 1. dataFilterComputeDomain处理时拿到的viewData中没有__VCHART_STACK_START等属性，也就是还没处理
          // 2. datazoom计算的是原始的value值，如果要根据stack后的数据来算，则需要__VCHART_STACK_END - __VCHART_STACK_START
          const seriesSpec = s.getSpec();

          const xFields = array(seriesSpec.xField);
          const yFields = array(seriesSpec.yField);
          const xField =
            s.coordinate === 'cartesian'
              ? xFields[xFields.length - 1]
              : seriesSpec.angleField ?? seriesSpec.categoryField;
          const yField =
            s.coordinate === 'cartesian'
              ? yFields[yFields.length - 1]
              : seriesSpec.radiusField ?? seriesSpec.valueField;

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
      hasValidateValueField = isNil(this._spec.valueField);
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
    const data = new DataView(dataSet);
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
            valueField: hasValidateValueField ? this._valueField : null
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

    if (this._spec.roam) {
      (this as unknown as IZoomable).initZoomable(this.event, this._option.mode);
    }
    // style相关
    this._field = this._spec.field;
    this._width = this._computeWidth();
    this._height = this._computeHeight();
    this._visible = this._spec.visible ?? true;
  }

  protected _statePointToData(state: number) {
    const scale = this._stateScale;
    let range = scale.range();

    if (!this._isHorizontal && isContinuous(scale.type)) {
      range = range.slice().reverse();
    }
    const posInRange: number = range[0] + (range[1] - range[0]) * state;

    return scale.invert(posInRange);
  }

  protected _dataToStatePoint(data: number | string) {
    const scale = this._stateScale;
    const pos = scale.scale(data);
    let range = scale.range();

    if (!this._isHorizontal && isContinuous(scale.type)) {
      range = range.slice().reverse();
    }

    return (pos - range[0]) / (range[1] - range[0]);
  }

  protected _modeCheck(statePoint: string, mode: string) {
    if (statePoint === 'start') {
      return (mode === 'percent' && this._spec.start) || (mode === 'value' && this._spec.startValue);
    } else if (statePoint === 'end') {
      return (mode === 'percent' && this._spec.end) || (mode === 'value' && this._spec.endValue);
    }
  }

  protected _setStateFromSpec() {
    let start;
    let end;
    if (this._spec.rangeMode) {
      const [startMode, endMode] = this._spec.rangeMode;
      // 只有mode与配置相符时，才会生效
      // 比如rangeMode为['value', 'percent'],那么start为dataValue, end为[0, 1]
      if (this._modeCheck('start', startMode) && this._modeCheck('end', endMode)) {
        start = startMode === 'percent' ? this._spec.start : this._dataToStatePoint(this._spec.startValue);
        end = endMode === 'percent' ? this._spec.end : this._dataToStatePoint(this._spec.endValue);
      }
    } else {
      start = this._spec.start
        ? this._spec.start
        : this._spec.startValue
        ? this._dataToStatePoint(this._spec.startValue)
        : 0;
      end = this._spec.end ? this._spec.end : this._spec.endValue ? this._dataToStatePoint(this._spec.endValue) : 1;
    }
    this._startValue = this._statePointToData(start);
    this._endValue = this._statePointToData(end);
    this._start = start;
    this._end = end;

    if ((!this._relatedAxisComponent || this._spec.filterMode !== 'axis') && (this._start !== 0 || this._end !== 1)) {
      this._newDomain = this._parseDomainFromState(this._startValue, this._endValue);
    }
  }

  private _parseFieldOfSeries(s: ISeries) {
    return this._originalStateFields?.[s.id];
  }

  protected _initStateScale() {
    const defaultRange = [0, 1];

    if (this._relatedAxisComponent) {
      const scale = (this._relatedAxisComponent as CartesianAxis).getScale();
      const isContinuousScale = isContinuous(scale.type);
      const domain = this._computeDomainOfStateScale(isContinuousScale);

      this._stateScale = scale.clone();
      if (isContinuousScale) {
        this._stateScale
          .domain(domain.length ? [Math.min.apply(null, domain), Math.max.apply(null, domain)] : [0, 1], true)
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
    if (!this._relatedAxisComponent || this._spec.filterMode !== 'axis') {
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
            }
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
  updateSpec(spec: any) {
    const result = super.updateSpec(spec);
    result.reRender = true;
    result.reMake = true;

    return result;
  }

  reInit(theme?: any) {
    super.reInit(theme);

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

  protected _handleStateChange = (startValue: number, endValue: number) => {
    if (startValue === this._startValue && endValue === this._endValue) {
      return false;
    }
    this._startValue = startValue;
    this._endValue = endValue;

    this._newDomain = this._parseDomainFromState(this._startValue, this._endValue);

    this.effect.onZoomChange?.();
    return true;
  };

  protected _handleChartScroll = (params: { scrollX: number; scrollY: number }, e: BaseEventParams['event']) => {
    this._handleChartDrag([params.scrollX, params.scrollY], e);
  };

  protected _handleChartZoom = (
    params: { zoomDelta: number; zoomX: number; zoomY: number },
    e: BaseEventParams['event']
  ) => {
    const { zoomDelta } = params;
    const delta = Math.abs(this._start - this._end);

    if (delta >= 1 && zoomDelta > 1) {
      return;
    }

    if (delta <= 0.01 && zoomDelta < 1) {
      return;
    }
    const value = (delta * (zoomDelta - 1)) / 2;
    const start = clamp(this._start - value, 0, 1);
    const end = clamp(this._end + value, 0, 1);

    this._handleChange(Math.min(start, end), Math.max(start, end), true);
  };

  protected _handleChartDrag = (delta: [number, number], e: BaseEventParams['event']) => {
    const [dx, dy] = delta;
    const value = this._isHorizontal ? dx : dy;
    const totalValue = this._isHorizontal ? this.getLayoutRect().width : this.getLayoutRect().height;

    if (Math.abs(value) >= 1e-6) {
      if (value > 0 && this._end < 1) {
        const moveDelta = Math.min(1 - this._end, value / totalValue);
        this._handleChange(this._start + moveDelta, this._end + moveDelta, true);
      } else if (value < 0 && this._start > 0) {
        const moveDelta = Math.max(-this._start, value / totalValue);
        this._handleChange(this._start + moveDelta, this._end + moveDelta, true);
      }
    }
  };

  protected _initCommonEvent() {
    if (this._spec.roam) {
      (this as unknown as IZoomable).initZoomEventOfRegions(this._regions, null, this._handleChartZoom);
      (this as unknown as IZoomable).initScrollEventOfRegions(this._regions, null, this._handleChartScroll);
      (this as unknown as IZoomable).initDragEventOfRegions(this._regions, null, this._handleChartDrag);
    }
  }

  updateLayoutAttribute(): void {
    // create or update component
    if (this._visible) {
      this._createOrUpdateComponent();
    }
    this._initCommonEvent();
    this._initEvent();
    super.updateLayoutAttribute();
  }
  /**
   * bounds预计算
   * @param rect
   * @returns
   */
  boundsInRect(rect: ILayoutRect): IBoundsLike {
    const result: IBoundsLike = { x1: this.getLayoutStartPoint().x, y1: this.getLayoutStartPoint().y, x2: 0, y2: 0 };

    if (this._visible === false) {
      return result;
    }

    if (this._isHorizontal) {
      result.y2 = result.y1 + this._height;
      result.x2 = result.x1 + rect.width;
    } else {
      result.x2 = result.x1 + this._width;
      result.y2 = result.y1 + rect.height;
    }
    return result;
  }

  clear() {
    super.clear();
    this._stateScale = null;
    this._relatedAxisComponent = null;

    this._seriesIndex = null;
    this._seriesUserId = null;
    this._regionUserId = null;
    this._regionIndex = null;
    this._newDomain = null;

    this._startValue = null;
    this._endValue = null;

    this._stateField = null;

    this._width = null;
    this._height = null;
  }
}

mixin(DataFilterBaseComponent, Zoomable);
