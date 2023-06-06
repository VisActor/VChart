import type { IBaseScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous } from '@visactor/vscale';
import type { INode, IGroup } from '@visactor/vrender';
import { AXIS_ELEMENT_NAME } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import type { AxisItem } from '@visactor/vrender-components';
import type { IOrientType, IPolarOrientType, Datum, StringOrNumber } from '../../typings';
import { BaseComponent } from '../base';
import type { IPolarAxisCommonTheme } from './polar/interface';
import type { ICartesianAxisCommonTheme } from './cartesian/interface';
import type { CompilableData } from '../../compile/data';
import type { IAxis, ITick } from './interface';
import type { IComponentOption } from '../interface';
import { array, eachSeries, get, getSeries, isArray, isBoolean, isValid, merge } from '../../util';
import type { ISeries } from '../../series/interface';
import { ChartEvent } from '../../constant';
import type { Group } from '../../series/base/group';
import { animationConfig } from '../../animation/utils';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { LooseFunction } from '@visactor/vutils';

export abstract class AxisComponent extends BaseComponent implements IAxis {
  static specKey = 'axes';

  protected _orient: IPolarOrientType | IOrientType;
  get orient() {
    return this._orient;
  }

  protected _scale!: IBaseScale;
  getScale() {
    return this._scale;
  }

  protected _scales: IBaseScale[] = [];
  getScales() {
    return this._scales;
  }

  protected declare _theme: ICartesianAxisCommonTheme | IPolarAxisCommonTheme;

  protected _tickData!: CompilableData;

  protected _statisticsDomain: {
    domain: any[];
    index: { [key in StringOrNumber]: number };
  } = { domain: [], index: {} };
  getStatisticsDomain() {
    return this._statisticsDomain;
  }

  // 与系列的关联关系
  // 优先级：id > index
  // 最终结果：series & region取交集
  protected _seriesUserId?: StringOrNumber[];
  protected _seriesIndex?: number[];
  protected _regionUserId?: StringOrNumber[];
  protected _regionIndex?: number[];

  /**
   * if axis will be shown
   */
  protected _visible: boolean = true;
  get visible() {
    return this._visible;
  }

  protected _tick: ITick | undefined = undefined;
  protected abstract computeDomain(data: { min: number; max: number; values: any[] }[]): StringOrNumber[];
  abstract dataToPosition(values: any[], cfg?: any): number;
  abstract valueToPosition(value: any): number;
  protected abstract axisHelper(): any;
  protected abstract getSeriesStatisticsField(s: ISeries): string[];
  protected abstract updateSeriesScale(): void;
  protected abstract collectData(depth: number): { min: number; max: number; values: any[] }[];
  protected abstract _initData(): void;
  abstract transformScaleDomain(): void;

  protected _dataFieldText: string;

  constructor(spec: any, options: IComponentOption) {
    super(spec, {
      ...options
    });
    this._visible = spec.visible ?? true;
  }

  created() {
    super.created();
    //series and regions
    this.setSeriesAndRegionsFromSpec();
    // event
    this.initEvent();
    // scales
    this.initScales();
    this.updateSeriesScale();
    // data
    this._initData();

    if (this._visible) {
      // 创建语法元素

      const axisMark = this._createMark('component', `axis-${this.orient}`, {
        componentType: this.orient === 'angle' ? 'circleAxis' : 'axis'
      });
      this._marks.addMark(axisMark);

      axisMark.setZIndex(this.layoutZIndex);
      if (isValid(this._spec.id)) {
        axisMark.setUserId(this._spec.id);
      }
      // interactive
      if (isBoolean(this._spec.interactive)) {
        axisMark.setInteractive(this._spec.interactive);
      }

      // Tip: 支持 spec.animationAppear.axis，并且坐标轴默认关闭动画
      if (
        this._option.animation !== false &&
        get(this._option.getChart().getSpec(), 'animation') !== false &&
        this._spec.animation === true
      ) {
        const axisAnimateConfig = animationConfig(DEFAULT_MARK_ANIMATION.axis(), {
          appear:
            this._spec.animationAppear ??
            get(this._option.getChart().getSpec(), 'animationAppear.axis') ??
            get(this._option.getChart().getSpec(), 'animationAppear'),
          disappear:
            this._spec.animationDisappear ??
            get(this._option.getChart().getSpec(), 'animationDisappear.axis') ??
            get(this._option.getChart().getSpec(), 'animationDisappear'),
          enter:
            this._spec.animationEnter ??
            get(this._option.getChart().getSpec(), 'animationEnter.axis') ??
            get(this._option.getChart().getSpec(), 'animationEnter'),
          exit:
            this._spec.animationExit ??
            get(this._option.getChart().getSpec(), 'animationExit.axis') ??
            get(this._option.getChart().getSpec(), 'animationExit'),
          update:
            this._spec.animationUpdate ??
            get(this._option.getChart().getSpec(), 'animationUpdate.axis') ??
            get(this._option.getChart().getSpec(), 'animationUpdate')
        });
        // 因为坐标轴的更新动画中处理了 enter，所以需要将 enter 的参数传入
        axisAnimateConfig.update[0].customParameters = {
          enter: axisAnimateConfig.enter[0]
        };
        axisMark.setAnimationConfig(axisAnimateConfig);
      }
    }
  }

  protected isSeriesDataEnable() {
    let enable = true;
    eachSeries(
      this._regions,
      s => {
        if (isArray(s.getViewDataStatistics()?.latestData)) {
          enable = false;
        }
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
    return enable;
  }

  protected _initTheme(theme?: any) {
    super._initTheme(theme);
    const { domainLine, label, tick, grid, title, subTick, subGrid } = this._theme;
    this._spec.domainLine = merge({}, domainLine, this._originalSpec.domainLine);
    this._spec.label = merge({}, label, this._originalSpec.label);
    this._spec.tick = merge({}, tick, this._originalSpec.tick);
    this._spec.grid = merge({}, grid, this._originalSpec.grid);
    this._spec.title = merge({}, title, this._originalSpec.title);
    this._spec.subTick = merge({}, subTick, this._originalSpec.subTick);
    this._spec.subGrid = merge({}, subGrid, this._originalSpec.subGrid);
  }

  protected setSeriesAndRegionsFromSpec() {
    const { seriesId, seriesIndex, regionId, regionIndex } = this._spec;
    isValid(seriesId) && (this._seriesUserId = array(seriesId));
    isValid(regionId) && (this._regionUserId = array(regionId));
    isValid(seriesIndex) && (this._seriesIndex = array(seriesIndex));
    isValid(regionIndex) && (this._regionIndex = array(regionIndex));
    this._regions = this._option.getRegionsInUserIdOrIndex(this._regionUserId as string[], this._regionIndex);
    // _regions 被更新了，layoutBindRegionID 也要更新
    this.layoutBindRegionID = this._regions.map(x => x.id);
  }

  getBindSeriesFilter() {
    return {
      userId: this._seriesUserId,
      specIndex: this._seriesIndex
    };
  }

  protected computeStatisticsDomain = () => {
    const data: { min: number; max: number; values: any[] }[] = [];
    eachSeries(
      this._regions,
      s => {
        const vd = s.getViewDataStatistics?.();
        vd &&
          this.getSeriesStatisticsField(s as ISeries).forEach(f => {
            vd.latestData?.[f] && data.push(vd.latestData[f]);
          });
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );

    this._statisticsDomain.domain = this.computeDomain(data);
    if (!isContinuous(this._scale.type)) {
      this._statisticsDomain.index = {};
      for (let i = 0; i < this._statisticsDomain.domain.length; i++) {
        this._statisticsDomain.index[this._statisticsDomain.domain[i]] = i;
      }
    }
  };

  protected initEvent() {
    this.event.on(
      ChartEvent.scaleUpdate,
      { filter: ({ model }) => model?.id === this.id },
      this.effect.scaleUpdate.bind(this)
    );
    const viewStatistics = getSeries(this._regions, {
      userId: this._seriesUserId,
      specIndex: this._seriesIndex
    })
      .map(s => s.getViewDataStatistics())
      .filter(v => !!v);
    this._option.dataSet.multipleDataViewAddListener(viewStatistics, 'change', () => {
      this.updateScaleDomain();
    });
  }

  protected updateScaleDomain() {
    if (!this.isSeriesDataEnable()) {
      return;
    }
    this.computeStatisticsDomain();
    for (let i = 0; i < this._scales.length; i++) {
      const data = this.collectData(i);
      const domain = this.computeDomain(data);
      this._scales[i].domain(domain);
    }
    this.transformScaleDomain();
    this.event.emit(ChartEvent.scaleUpdate, { model: this });
  }

  protected computeData(): void {
    this._tickData.getDataView().reRunAllTransform();
    this._tickData.updateData();
  }

  protected initScales() {
    this._scales = [this._scale];
    const groups: Group[] = [];
    eachSeries(
      this._regions,
      s => {
        const g = s.getGroups();
        g && groups.push(g);
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
    if (groups.length !== 0) {
      const depth = Math.max(...groups.map(g => g.fields.length));
      for (let i = 1; i < depth; i++) {
        const scale = this._scale.clone();
        this._scales.push(scale);
      }
    }
    // this.updateScaleDomain();
  }

  /** Update API **/
  updateSpec(spec: any) {
    const originalSpec = this._originalSpec;
    const result = super.updateSpec(spec);
    result.reRender = true;
    if (originalSpec.type !== spec.type) {
      result.reMake = true;
      return result;
    }
    result.reMake =
      ['seriesId', 'seriesIndex', 'regionId', 'regionIndex'].some(k => {
        JSON.stringify(originalSpec[k]) !== JSON.stringify(spec[k]);
      }) || result.reMake;
    return result;
  }

  protected getLabelFormatMethod() {
    return this._spec.label.formatMethod
      ? (value: any, datum: any, index: number) => this._spec.label.formatMethod(datum.rawValue, datum)
      : null;
  }

  protected getLabelItems(length: number) {
    return isArray(this._tickData.getLatestData())
      ? [
          this._tickData
            .getLatestData()
            .map((obj: Datum) => {
              return {
                id: obj.value,
                label: obj.value,
                value: length === 0 ? 0 : this.dataToPosition([obj.value]) / length,
                rawValue: obj.value
              };
            })
            .filter((entry: AxisItem) => entry.value >= 0 && entry.value <= 1)
        ]
      : [];
  }

  protected _delegateAxisContainerEvent(component: IGroup) {
    const axisMainContainer = component?.find((node: INode) => node.name === AXIS_ELEMENT_NAME.axisContainer, true);
    if (axisMainContainer) {
      // 代理组件上的事件，目前坐标轴组件比较特殊，包含了网格线，但是事件这块只提供不包含网格线部分的响应
      axisMainContainer.addEventListener('*', ((event: any, type: string) =>
        this._delegateEvent(component as unknown as INode, event, type)) as LooseFunction);
    }
  }

  reInit(): void {
    super.reInit();
    this._initTheme();
  }
}
