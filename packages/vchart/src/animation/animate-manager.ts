import { StateManager } from '../compile/state-manager';
import { createID } from '../util/id';
import type { IAnimate, IAnimateState } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { AnimationStateEnum } from './interface';
import type { StateValueMap } from '../compile/interface/compilable-item';
import type { IGraphic } from '@visactor/vrender-core';

export class AnimateManager extends StateManager implements IAnimate {
  protected declare _stateMap: IAnimateState & StateValueMap;

  readonly id: number = createID();

  updateAnimateState(state: AnimationStateEnum, noRender?: boolean) {
    // when animation state is 'update', do animations by element diffState(enter & update & exit)
    if (state === AnimationStateEnum.update) {
      this.updateState(
        {
          animationState: {
            callback: (datum: any, g: IGraphic) => g.context.diffState
          }
        },
        noRender
      );
    }
    // when animation state is 'appear', all valid elements would do appear animation except from exit elements
    else if (state === AnimationStateEnum.appear) {
      this.updateState(
        {
          animationState: {
            callback: (datum: any, g: IGraphic) => {
              return g.context.diffState === 'exit' ? AnimationStateEnum.none : AnimationStateEnum.appear;
            }
          }
        },
        noRender
      );
    }
    // when animation state is other types, all elements would do animation by state
    else {
      this.updateState(
        {
          animationState: {
            callback: (datum: any, g: IGraphic) => state
          }
        },
        noRender
      );
    }
  }

  protected _getDefaultStateMap(): IAnimateState & StateValueMap {
    return {
      animationState: {
        callback: (datum: any, g: IGraphic) => {
          return g.context.diffState === 'exit'
            ? AnimationStateEnum.exit
            : g.context.diffState === 'update'
            ? AnimationStateEnum.update
            : AnimationStateEnum.appear;
        }
      }
    };
  }
}
