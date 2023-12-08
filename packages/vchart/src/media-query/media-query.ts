import type {
  IMediaInfo,
  IMediaQueryCondition,
  IMediaQueryCheckResult,
  IMediaQuerySpec,
  IMediaQueryOption
} from './interface';
import { Event } from '../event/event';
import { MediaQueryItem } from './media-query-item';
import { cloneDeepSpec } from '../util';
import { IUpdateSpecResult } from '../model/interface';

export class MediaQuery {
  protected _spec: IMediaQuerySpec;

  /** 不带任何媒体查询的图表 spec */
  protected _baseChartSpec: any;

  protected _option: IMediaQueryOption;
  protected _event: Event;

  /** 根据查询条件的不同将媒体查询分类 */
  protected _queryMap: Partial<Record<keyof IMediaQueryCondition, MediaQueryItem[]>>;

  /** 当前正在生效的媒体查询 */
  protected _currentActiveItems = new Set<MediaQueryItem>();

  /** 当前媒体信息 */
  protected _currentMediaInfo: Partial<IMediaInfo> = {};

  constructor(spec: IMediaQuerySpec, option: IMediaQueryOption) {
    this._option = option;
    this._event = new Event(option.eventDispatcher, option.mode);
    this._spec = spec;
    this.init(spec);
  }

  /** 初始化 */
  init(spec: IMediaQuerySpec) {
    this._spec = spec;

    this._queryMap = {};
    spec.forEach(itemSpec => {
      const { query } = itemSpec;
      const item = new MediaQueryItem(itemSpec, {
        ...this._option,
        mediaQuery: this,
        getCurrentMediaInfo: () => this._currentMediaInfo as IMediaInfo
      });
      Object.keys(query).forEach(conditionKey => {
        if (!this._queryMap[conditionKey]) {
          this._queryMap[conditionKey] = [];
        }
        this._queryMap[conditionKey].push(item);
      });
    });

    this._baseChartSpec = cloneDeepSpec(this._getChart().getSpec());
  }

  resize(width: number, height: number): boolean {
    if (this._currentMediaInfo.width === width && this._currentMediaInfo.height === height) {
      return false;
    }
    this._currentMediaInfo.width = width;
    this._currentMediaInfo.height = height;
    // 执行依赖宽高信息的媒体查询
    return this._applyQueries(['minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'onResize']);
  }

  /** 给定查询条件来执行相关的所有媒体查询，返回是否命中相关查询 */
  protected _applyQueries(conditionKeys: Array<keyof IMediaQueryCondition>): boolean {
    const { globalInstance } = this._option;
    const chart = globalInstance.getChart();

    // 收集相关的所有查询并检查查询条件
    const relatedItemSet = new Set<MediaQueryItem>();
    const checkResults: IMediaQueryCheckResult[] = [];
    conditionKeys.forEach(conditionKey => {
      this._queryMap[conditionKey]?.forEach(item => {
        if (!relatedItemSet.has(item)) {
          relatedItemSet.add(item);
          checkResults.push(item.check());
        }
      });
    });

    // 将会生效的查询
    const changeToActive = checkResults
      .filter(result => result.hasChanged && result.isActive)
      .map(result => result.item);

    // 将会失效的查询
    const changeToInactive = checkResults
      .filter(result => result.hasChanged && !result.isActive)
      .map(result => result.item);

    if (!changeToActive.length && !changeToInactive.length) {
      return false;
    }

    let chartSpec: any;
    let hasChanged = false;
    // 处理将会失效的查询：重新执行一遍当前生效的查询
    if (changeToInactive.length > 0) {
      chartSpec = cloneDeepSpec(this._baseChartSpec);
      this._currentActiveItems.forEach(item => {
        const result = item.applyAction(chartSpec, changeToInactive.includes(item));
        chartSpec = result.chartSpec;
        hasChanged ||= result.hasChanged;
      });
      changeToInactive.forEach(item => {
        if (this._currentActiveItems.has(item)) {
          this._currentActiveItems.delete(item);
        }
      });
    } else {
      chartSpec = cloneDeepSpec(chart.getSpec());
    }

    // 处理将会生效的查询
    changeToActive.forEach(item => {
      this._currentActiveItems.add(item);
      const result = item.applyAction(chartSpec);
      chartSpec = result.chartSpec;
      hasChanged ||= result.hasChanged;
    });

    if (hasChanged) {
      globalInstance.updateSpecSync(chartSpec);
    }
    return true;
  }

  release() {
    // empty
  }

  protected _getChart() {
    return this._option.globalInstance.getChart();
  }
}
