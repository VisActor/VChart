import type { BaseSpec } from '../../common/types';
/** 预计算统计结果；本包不拟合模型。 */
export interface MissingValueMatrixRow {
  /** 观测标识；与 variable 组合唯一，不是单元格唯一编号。 */
  observationId: string;
  variable: string;
  /** 该观测的该变量是否缺失；true 表示缺失。 */
  isMissing: boolean;
}
export interface MissingValueMatrixSpec extends BaseSpec {
  type: 'missingValueMatrix';
  data: MissingValueMatrixRow[];
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { observationId?: string; variable?: string };
}
