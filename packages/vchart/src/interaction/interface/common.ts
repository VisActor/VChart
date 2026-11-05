import type { IMarkGraphic } from '../../mark/interface';
import type { RenderMode } from '../../typings/spec/common';
import type { IEventDispatcher } from '../../event/interface';
import type { IModel } from '../../model/interface';
import type { ITrigger } from './trigger';

export interface IInteraction {
  setDisableActiveEffect: (disable: boolean) => void;
  addTrigger: (trigger: ITrigger) => void;
  setStatedGraphics: (trigger: ITrigger, graphics: IMarkGraphic[]) => void;
  getStatedGraphics: (trigger: ITrigger) => IMarkGraphic[];
  /**
   * 拆分后的 element-select 是否还有选中图元（包含共享 selected_reverse 的同组触发器）。
   */
  hasActiveLinkedSelect: (trigger: ITrigger) => boolean;
  /**
   * 图元是否属于同组另一个 element-select 的事件覆盖范围。
   * 点在这些图元上是切换选中，不是空白取消。
   */
  isGraphicInLinkedSelect: (trigger: ITrigger, graphic: IMarkGraphic) => boolean;
  /**
   * 清掉当前触发器以及同组 element-select 的 selected / selected_reverse。
   */
  clearLinkedSelectStates: (trigger: ITrigger) => IMarkGraphic[];
  updateStates: (
    trigger: ITrigger,
    newStatedGraphics: IMarkGraphic[],
    prevStatedGraphics?: IMarkGraphic[],
    state?: string,
    reverseState?: string
  ) => IMarkGraphic[];
  clearAllStates: () => void;
  clearAllStatesOfTrigger: (trigger: ITrigger, state?: string, reverseState?: string) => void;
  clearByState: (stateValue: string) => any;
  updateStateOfGraphics: (stateValue: string, markGraphics: IMarkGraphic[]) => void;
}

export interface ITriggerOption {
  mode: RenderMode;
  interaction: IInteraction;
  eventDispatcher: IEventDispatcher;
  model: IModel;
}
