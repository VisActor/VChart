import type { BaseSpec } from '../../common/types';
import type { BinaryScoreRow } from '../roc/types';
/** 原始二分类标签和预测分数；重复样本分别计入。 */
export type PrecisionRecallCurveRow = BinaryScoreRow;
export interface PrecisionRecallCurveSpec extends BaseSpec {
  type: 'precisionRecallCurve';
  data: PrecisionRecallCurveRow[];
  /** 绘制各系列自己的正例比例基线，默认 false。 */
  baseline?: boolean;
  fieldLabels?: { recall?: string; precision?: string };
}
