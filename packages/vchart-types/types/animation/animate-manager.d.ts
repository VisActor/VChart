import { StateManager } from '../compile/state-manager';
import type { IAnimate, IAnimateState } from './interface';
import { AnimationStateEnum } from './interface';
import type { StateValueMap } from '../compile/interface/compilable-item';
export declare class AnimateManager extends StateManager implements IAnimate {
    protected _stateMap: IAnimateState & StateValueMap;
    readonly id: number;
    updateAnimateState(state: AnimationStateEnum, noRender?: boolean): void;
    protected _getDefaultStateMap(): IAnimateState & StateValueMap;
}
