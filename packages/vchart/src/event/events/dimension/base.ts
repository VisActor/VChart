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
import { getCartesianDimensionInfo, getPolarDimensionInfo } from './util';
import type { Maybe } from '../../../typings';

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
    throw new Error('Method not implemented.');
  }
  unregister(): void {
    throw new Error('Method not implemented.');
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
}
