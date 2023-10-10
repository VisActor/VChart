import { StateManager } from '../compile/signal';
import type { StateValueMap } from '../compile/signal/interface';
import type { IAnimate, IAnimateState } from './interface';
import { AnimationStateEnum } from './interface';
export declare class AnimateManager extends StateManager implements IAnimate {
  protected _stateMap: IAnimateState & StateValueMap;
  readonly id: number;
  protected stateKeyToSignalName: (key: string) => string;
  getAnimationStateSignalName(): string;
  updateAnimateState(state: AnimationStateEnum, noRender?: boolean): void;
  protected _getDefaultStateMap(): IAnimateState & StateValueMap;
}
