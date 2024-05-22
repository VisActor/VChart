import type { IAction } from '../types';

export type IProcessorMap = Record<string, Record<string, Function>>;

export interface IProcessorReturnType {
  totalTime: number;
  revertActionParams?: IAction;
}

export class ActionProcessor {
  protected _processorMap: Map<string, Record<string, Function>>;

  private static _instance: ActionProcessor = null;

  constructor(processorMap?: IProcessorMap) {
    if (!ActionProcessor._instance) {
      this.init(processorMap);
      ActionProcessor._instance = this;
    }
    return ActionProcessor._instance;
  }

  protected init(processorMap?: IProcessorMap) {
    this._processorMap = new Map();
    if (processorMap) {
      for (const key in processorMap) {
        console.log(`register ${key} processor.`); // TODO: remove log
        this.registerProcessor(key, processorMap[key]);
      }
    }
  }

  /**
   *
   * @param name 操作对象名称
   * @param processors 操作对象支持的 processor
   * @returns boolean 注册是否成功
   */
  registerProcessor(name: string, processors: Record<string, Function>) {
    if (!this._processorMap) {
      return false;
    }
    // 重复注册，目前直接替代
    this._processorMap.set(name, processors);
    return true;
  }

  getProcessorList(name: string) {
    return this._processorMap && this._processorMap.get(name);
  }

  getProcessor(name: string, actionName: string) {
    return this._processorMap && this._processorMap.get(name)?.[actionName];
  }

  /**
   * Execute action
   * @param name
   * @param actionName
   * @param actionParams
   * @returns IProcessorReturnType
   */
  async doAction(name: string, actionName: string, actionParams: any[]): Promise<IProcessorReturnType | undefined> {
    const processor = this.getProcessor(name, actionName);
    if (processor) {
      console.log(`Execute action => ${actionName}, character => ${name}`); // TODO: remove log
      const actionResult = await processor(...actionParams);
      console.log(`Action Executed:`, actionResult); // TODO: remove log
      return actionResult;
    }
    console.error(`Action not found: character => ${name}, action => ${actionName} `); // TODO: remove log
    return undefined;
  }

  release() {
    ActionProcessor._instance = null;

    if (this._processorMap) {
      this._processorMap.clear();
      this._processorMap = null;
    }
  }
}
