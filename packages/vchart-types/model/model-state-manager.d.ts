import { StateManager } from '../compile/signal/state-manager';
export declare class ModelStateManager extends StateManager {
  _stateMap: {
    layoutUpdateRank: number;
    [key: string]: unknown;
  };
  protected _getDefaultStateMap(): Record<string, unknown>;
  updateLayoutState(): Promise<void>;
}
