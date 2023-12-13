import type {
  IMediaInfo,
  IMediaQueryCheckResult,
  IMediaQuerySpec,
  IMediaQueryOption,
  IMediaQueryItem,
  IMediaQueryActionResult
} from './interface';
import { array, cloneDeepSpec } from '../util';
import { checkMediaQuery } from './util';
import { executeMediaQueryAction } from './util/action';

export class MediaQuery {
  protected _spec: IMediaQuerySpec;
  protected _option: IMediaQueryOption;

  /** 不带任何媒体查询的图表 spec */
  protected _baseChartSpec: any;

  /** 当前正在生效的媒体查询 */
  protected _currentActiveItems = new Set<IMediaQueryItem>();
  /** 当前媒体信息 */
  protected _currentMediaInfo: Partial<IMediaInfo> = {};

  constructor(spec: IMediaQuerySpec, option: IMediaQueryOption) {
    this._option = option;
    this._init(spec);
  }

  /** 初始化 */
  protected _init(spec: IMediaQuerySpec) {
    this._spec = spec;
  }

  init(mediaInfo: Partial<IMediaInfo>, compile?: boolean, render?: boolean): boolean {
    const { width, height } = mediaInfo;
    const result = this.changeSize(width, height, compile, render);
    return result;
  }

  changeSize(width: number, height: number, compile?: boolean, render?: boolean): boolean {
    if (this._currentMediaInfo.width === width && this._currentMediaInfo.height === height) {
      return false;
    }
    this._currentMediaInfo.width = width;
    this._currentMediaInfo.height = height;
    // 由于目前媒体查询只和图表宽高有关，这里执行所有媒体查询
    return this._applyQueries(compile, render);
  }

  /** 给定查询条件来执行相关的所有媒体查询，返回是否命中相关查询 */
  protected _applyQueries(compile?: boolean, render?: boolean): boolean {
    // 检查所有查询的查询条件
    const changeToActive: IMediaQueryItem[] = []; // 将会生效的查询
    const changeToInactive: IMediaQueryItem[] = []; // 将会失效的查询
    this._spec.forEach(item => {
      const { hasChanged, isActive } = this.check(item);
      if (hasChanged) {
        if (isActive) {
          changeToActive.push(item);
        } else {
          changeToInactive.push(item);
        }
      }
    });

    if (!changeToActive.length && !changeToInactive.length) {
      return false;
    }
    if (!this._baseChartSpec) {
      this._baseChartSpec = cloneDeepSpec(this._option.globalInstance.getSpec());
    }
    let chartSpec: any;
    let hasChanged = false;

    // 处理将会失效的查询：重新执行一遍当前生效的查询
    if (changeToInactive.length > 0) {
      chartSpec = cloneDeepSpec(this._baseChartSpec);
      Array.from(this._currentActiveItems).forEach(item => {
        if (changeToInactive.includes(item)) {
          this._currentActiveItems.delete(item);
          return;
        }
        const result = this.apply(item, chartSpec);
        chartSpec = result.chartSpec;
      });
      hasChanged = true;
    } else {
      chartSpec = cloneDeepSpec(this._option.globalInstance.getSpec());
    }

    // 处理将会生效的查询
    changeToActive.forEach(item => {
      this._currentActiveItems.add(item);
      const result = this.apply(item, chartSpec);
      chartSpec = result.chartSpec;
      hasChanged ||= result.hasChanged;
    });

    if (hasChanged) {
      this._option.updateSpec(chartSpec, compile, render);
    }
    return true;
  }

  /** 检查媒体查询的条件是否满足 */
  check(item: IMediaQueryItem): IMediaQueryCheckResult {
    const { globalInstance } = this._option;
    const isActive = checkMediaQuery(item.query, this._currentMediaInfo as IMediaInfo, globalInstance);
    return {
      isActive,
      hasChanged: isActive !== this._currentActiveItems.has(item)
    };
  }

  /** 执行一条媒体查询 */
  apply(item: IMediaQueryItem, chartSpec: any): IMediaQueryActionResult {
    const { globalInstance } = this._option;
    const { query, action } = item;
    let hasChanged = false;
    // 执行
    array(action).forEach(actionItem => {
      const result = executeMediaQueryAction(actionItem, query, chartSpec, globalInstance);
      chartSpec = result.chartSpec;
      hasChanged ||= result.hasChanged;
    });
    return { chartSpec, hasChanged };
  }

  release() {
    // empty
  }
}
