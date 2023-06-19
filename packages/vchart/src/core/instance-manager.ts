import type { IVChart } from './interface';

/** vchart 全局实例管理类，为了防止循环依赖，单独从 VChart 类抽出 */
export class InstanceManager {
  /** 全局实例 map */
  static readonly instances: Map<number, IVChart> = new Map();
  /** 注册实例 */
  static registerInstance(instance: IVChart) {
    InstanceManager.instances.set(instance.id, instance);
  }
  /** 注销实例 */
  static unregisterInstance(instance: IVChart) {
    InstanceManager.instances.delete(instance.id);
  }
  /**
   * 根据 vChart 实例的 id 获取 vChart 实例
   * @param id VChart 实例的 id，通过 vChart.id 获取
   * @returns
   */
  static getInstance(id: number): IVChart | undefined {
    return InstanceManager.instances.get(id);
  }
  /**
   * 根据图表 id 判断实例是否存在
   * @param id VChart 实例的 id，通过 vChart.id 获取
   * @returns
   */
  static instanceExist(id: number): boolean {
    return InstanceManager.instances.has(id);
  }

  static forEach(callbackfn: (value: IVChart, key: number, map: Map<number, IVChart>) => void, thisArg?: any) {
    return InstanceManager.instances.forEach(callbackfn, thisArg);
  }
}
