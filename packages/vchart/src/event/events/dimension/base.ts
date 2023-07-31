import { error } from './../../../util/debug';
import type { IAxis } from './../../../component/axis/interface';
import type { RenderMode } from '../../../typings/spec/common';
import type {
  BaseEventParams,
  EventHandler,
  EventParamsDefinition,
  IComposedEvent,
  IEventDispatcher
} from '../../interface';
import type { IChart } from '../../../chart/interface';
import type { IDimensionInfo } from './interface';
import { getCartesianDimensionInfo, getDimensionInfoInAxis, getPolarDimensionInfo } from './util';
import type { Maybe } from '../../../typings';
import { isDiscrete } from '@visactor/vscale';

export class DimensionEvent implements IComposedEvent {
  protected _eventDispatcher: IEventDispatcher;
  protected _mode: RenderMode;

  protected _callback!: (params: BaseEventParams) => void;

  protected _chart: Maybe<IChart>;

  constructor(eventDispatcher: IEventDispatcher, mode: RenderMode) {
    this._eventDispatcher = eventDispatcher;
    this._mode = mode;

    this._chart = this._eventDispatcher.globalInstance.getChart?.();
  }

  register<Evt extends string>(eType: Evt, handler: EventHandler<EventParamsDefinition[Evt]>): void {
    (this._chart?.getOption().onError ?? error)('Method not implemented.');
  }
  unregister(): void {
    (this._chart?.getOption().onError ?? error)('Method not implemented.');
  }

  protected getTargetDimensionInfo(x: number, y: number): IDimensionInfo[] | null {
    const cartesianInfo = getCartesianDimensionInfo(this._chart, { x, y }) ?? [];
    const polarInfo = getPolarDimensionInfo(this._chart, { x, y }) ?? [];

    const result = [].concat(cartesianInfo, polarInfo);
    if (result.length === 0) {
      return null;
    }

    return result;
  }

  dispatch(v: unknown, opt: { filter?: (axis: IAxis) => boolean }) {
    // get all enable axis
    const axis = this._chart?.getAllComponents().filter(c => {
      if (c.specKey !== 'axes') {
        return false;
      }
      const scale = (<IAxis>c).getScale();
      if (!isDiscrete(scale.type)) {
        return false;
      }
      if (opt?.filter) {
        return opt.filter(<IAxis>c);
      }
      return true;
    }) as IAxis[];
    const dimensionInfo: IDimensionInfo[] = [];
    axis.forEach(a => {
      const info = getDimensionInfoInAxis(a as unknown as any, v);
      if (info) {
        dimensionInfo.push(info);
      }
    });
    this._callback.call(null, {
      action: 'enter',
      dimensionInfo
    } as unknown as BaseEventParams);
    return dimensionInfo;
  }
}
