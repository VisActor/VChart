import type { DataView } from '@visactor/vdataset';
import type { IBaseScale } from '@visactor/vgrammar-scale';
import type { StatisticOperations } from '../data/transforms/dimension-statistics';
import type { IVisualScale, IVisualSpecScale } from '../typings';

export interface IGlobalScale {
  color?: any;
  getScale: (user_id: string) => IBaseScale | null;
  getScaleSpec: (user_id: string) => IVisualSpecScale<unknown, unknown> | null;
  getStatisticalFields: (dataId: string) => {
    key: string;
    operations: StatisticOperations;
  }[];
  updateScaleDomain: (string: unknown[]) => void;

  registerMarkAttributeScale: (spec: IVisualScale, dataStatistics: DataView) => IBaseScale;

  /**
   * model add & remove global scale
   * 提供给图表模块按照需要添加全局 scale。目前的使用场景有 scatter series 的 sizeField 和 shapeField 配置。
   */
  registerModelScale: (spec: IVisualSpecScale<unknown, unknown>) => void;
  removeModelScale: (filter: (spec: IVisualSpecScale<unknown, unknown>) => boolean) => void;
}
