import { StateManager } from '../compile/signal/state-manager';

export class ModelStateManager extends StateManager {
  declare _stateMap: {
    layoutUpdateRank: number;
    [key: string]: unknown;
  };

  protected _getDefaultStateMap(): Record<string, unknown> {
    // 模块内的需要动态影响图表的属性
    return {
      layoutUpdateRank: 1
    };
  }

  updateLayoutState(): Promise<void> {
    this._stateMap.layoutUpdateRank++;
    return this.updateState({
      layoutUpdateRank: this._stateMap.layoutUpdateRank
    });
  }
}
