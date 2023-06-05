import { StateManager } from '../compile/signal';
import type { StateValueMap } from '../compile/signal/interface';
import { PREFIX } from '../constant';
import { createID } from '../util';
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
    // FIXME: 由于布局两次 dataflow 导致动画多次执行，需要额外处理 appear 动画执行状态。
    // VGrammar 布局流程改造接入后可以去除这一 hack 逻辑。
    if (state === AnimationStateEnum.update) {
      this.updateState(
        {
          animationState: {
            callback: (datum: any, element: any) => element.diffState
          }
        },
        noRender
      );
    } else if (state === AnimationStateEnum.appear) {
      this.updateState(
        {
          animationState: {
            callback: (datum: any, element: any) => {
              return element.diffState === AnimationStateEnum.enter
                ? AnimationStateEnum.appear
                : AnimationStateEnum.none;
            }
          }
        },
        noRender
      );
    } else {
      this.updateState(
        {
          animationState: {
            callback: (datum: any, element: any) => state
          }
        },
        noRender
      );
    }
  }

  protected _getDefaultStateMap(): IAnimateState & StateValueMap {
    return {
      animationState: {
        callback: (datum: any, element: any) => {
          return element.diffState === AnimationStateEnum.enter ? AnimationStateEnum.appear : AnimationStateEnum.none;
        }
      }
    };
  }
}
