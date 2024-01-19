import { merge } from '@visactor/vutils';
import type { IStateManagerOption, StateValueMap } from './interface';
import { SignalManager } from './signal-manager';

/** 状态管理器，由 SignalManager 继承而来，管理所有和状态相关的 signal */
export class StateManager extends SignalManager {
  protected _stateMap: StateValueMap;
  getStateMap() {
    return this._stateMap;
  }

  /** 默认 state map */
  protected _getDefaultStateMap(): StateValueMap {
    return {};
  }

  /** state key 转为 signal name */
  protected stateKeyToSignalName: (key: string) => string;

  constructor(option: IStateManagerOption) {
    super(option);
    if (option.stateKeyToSignalName) {
      this.stateKeyToSignalName = option.stateKeyToSignalName;
    } else {
      this.stateKeyToSignalName = () => 'state_signal';
    }
    this.initStateMap();
  }

  /** 初始化 state map */
  initStateMap(state?: StateValueMap) {
    this._stateMap = state ?? this._getDefaultStateMap();
  }

  compile(stateMap?: StateValueMap) {
    const state = stateMap ?? this._stateMap;
    Object.keys(state).forEach(key => {
      const name = this.stateKeyToSignalName(key);
      const value = state[key];
      this.updateSignal(name, value);
    });
  }

  /** 更新 state 并默认触发重渲染 */
  updateState(newState: Partial<StateValueMap>, noRender?: boolean) {
    if (!newState) {
      return;
    }
    merge(this._stateMap, newState);

    this.compile(newState);

    if (noRender) {
      return;
    }
    return this.getCompiler().renderNextTick();
  }
}
