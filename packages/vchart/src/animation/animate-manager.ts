import type { IElement } from '@visactor/vgrammar-core';
import { StateManager } from '../compile/signal/state-manager';
import type { StateValueMap } from '../compile/signal/interface';
import { PREFIX } from '../constant';
import { createID } from '../util/id';
import type { IAnimate, IAnimateState } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { AnimationStateEnum } from './interface';

export class AnimateManager extends StateManager implements IAnimate {
  protected declare _stateMap: IAnimateState & StateValueMap;

  readonly id: number = createID();

  protected stateKeyToSignalName = (key: string) => {
    return `${PREFIX}_animate_${this.id}_${key}`;
  };

  getAnimationStateSignalName() {
    return this.stateKeyToSignalName('animationState');
  }

  updateAnimateState(state: AnimationStateEnum, noRender?: boolean) {
    // when animation state is 'update', do animations by element diffState(enter & update & exit)
    if (state === AnimationStateEnum.update) {
      this.updateState(
        {
          animationState: {
            callback: (datum: any, element: IElement) => element.diffState
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
            callback: (datum: any, element: IElement) => {
              return element.diffState === 'exit' ? AnimationStateEnum.none : AnimationStateEnum.appear;
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
            callback: (datum: any, element: IElement) => state
          }
        },
        noRender
      );
    }
  }

  protected _getDefaultStateMap(): IAnimateState & StateValueMap {
    return {
      animationState: {
        callback: (datum: any, element: IElement) => {
          return element.diffState === 'exit' ? AnimationStateEnum.none : AnimationStateEnum.appear;
        }
      }
    };
  }
}
