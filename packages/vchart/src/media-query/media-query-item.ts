import type {
  IMediaQueryCondition,
  IMediaQueryItem,
  IMediaQueryActionResult,
  IMediaQueryCheckResult,
  IMediaQueryItemOption,
  MediaQueryAction
} from './interface';
import { array } from '@visactor/vutils';
import { applyMediaQueryItem } from './util/apply';
import type { MediaQuery } from './media-query';
import { checkMediaQuery } from './util';

export class MediaQueryItem {
  protected _spec: IMediaQueryItem;
  protected _query: IMediaQueryCondition;
  protected _action: MediaQueryAction[];

  protected _option: IMediaQueryItemOption;

  protected _mediaQuery: MediaQuery;

  /** 该查询是否生效中 */
  protected _isActive = false;
  get isActive(): boolean {
    return this._isActive;
  }

  constructor(spec: IMediaQueryItem, option: IMediaQueryItemOption) {
    this._option = option;
    this._mediaQuery = option.mediaQuery;
    this.init(spec);
  }

  /** 初始化 */
  init(spec: IMediaQueryItem) {
    const { query, action } = spec;
    this._spec = spec;
    this._query = query;
    this._action = array(action);
  }

  /** 检查媒体查询的条件是否满足 */
  check(): IMediaQueryCheckResult {
    const { getCurrentMediaInfo, globalInstance } = this._option;
    const isActive = checkMediaQuery(this._query, getCurrentMediaInfo(), globalInstance);
    return {
      item: this,
      isActive,
      hasChanged: isActive !== this._isActive
    };
  }

  /** 执行媒体查询 */
  applyAction(chartSpec: any, reverse?: boolean): IMediaQueryActionResult {
    this._isActive = !reverse;
    const { globalInstance } = this._option;
    return applyMediaQueryItem(this._spec, chartSpec, globalInstance, reverse);
  }

  release() {
    // empty
  }
}
