import { validatePairPlot } from './plots/pair-plot/validate';
import { validateShapBeeswarm } from './plots/shap-beeswarm/validate';
import { validateHexbin } from './plots/hexbin/validate';
import { validateFeatureImportance } from './plots/feature-importance/validate';
import { validateLearningCurve } from './plots/learning-curve/validate';
import { validateQq } from './plots/qq/validate';
import { validateResidual } from './plots/residual/validate';
import { validateEmbedding } from './plots/embedding/validate';
import { validateScree } from './plots/scree/validate';
import { validateAutocorrelation } from './plots/autocorrelation/validate';
import { validateSeasonal } from './plots/seasonal/validate';
import { validateTimeSeries } from './plots/time-series/validate';
import { validateCalibration } from './plots/calibration/validate';
import { validatePrecisionRecall } from './plots/precision-recall/validate';
import { validateConfusionMatrix } from './plots/confusion-matrix/validate';
import { validateScatter } from './plots/scatter/validate';
import { validatePaired } from './plots/paired/validate';
import { validateStripPlot } from './plots/strip-plot/validate';
import { validateMissingness } from './plots/missingness/validate';
import { validateCount } from './plots/count/validate';
import validateStructure from './generated/validate';
import type { StatPlotSpec } from './types';
import type { StatPlotIssue, ValidationResult } from './common/types';
import { validateBoxPlot } from './plots/box-plot/validate';
import { validateCorrelationMatrix } from './plots/correlation-matrix/validate';
import { validateEcdf } from './plots/ecdf/validate';
import { validateEstimateInterval } from './plots/estimate-interval/validate';
import { validateHistogram } from './plots/histogram/validate';
import { validateKde } from './plots/kde/validate';
import { validateRoc } from './plots/roc/validate';
import { validateViolin } from './plots/violin/validate';

function validateSemantics(spec: StatPlotSpec): StatPlotIssue[] {
  switch (spec.type) {
    case 'pairPlot':
      return validatePairPlot(spec);
    case 'shapBeeswarmPlot':
      return validateShapBeeswarm(spec);
    case 'hexbinPlot':
      return validateHexbin(spec);
    case 'featureImportancePlot':
      return validateFeatureImportance(spec);
    case 'learningCurve':
      return validateLearningCurve(spec);
    case 'qqPlot':
      return validateQq(spec);
    case 'residualPlot':
      return validateResidual(spec);
    case 'embeddingPlot':
      return validateEmbedding(spec);
    case 'screePlot':
      return validateScree(spec);
    case 'autocorrelationPlot':
      return validateAutocorrelation(spec);
    case 'seasonalPlot':
      return validateSeasonal(spec);
    case 'timeSeriesPlot':
      return validateTimeSeries(spec);
    case 'calibrationCurve':
      return validateCalibration(spec);
    case 'precisionRecallCurve':
      return validatePrecisionRecall(spec);
    case 'confusionMatrix':
      return validateConfusionMatrix(spec);
    case 'scatterPlot':
      return validateScatter(spec);
    case 'pairedComparisonPlot':
      return validatePaired(spec);
    case 'stripPlot':
      return validateStripPlot(spec);
    case 'missingValueMatrix':
      return validateMissingness(spec);
    case 'countPlot':
      return validateCount(spec);
    case 'boxPlot':
      return validateBoxPlot(spec);
    case 'correlationMatrix':
      return validateCorrelationMatrix(spec);
    case 'ecdfPlot':
      return validateEcdf(spec);
    case 'pointIntervalPlot':
      return validateEstimateInterval(spec);
    case 'histogram':
      return validateHistogram(spec);
    case 'kdePlot':
      return validateKde(spec);
    case 'rocCurve':
      return validateRoc(spec);
    case 'violinPlot':
      return validateViolin(spec);
  }
}

/** JSON 结构和统计关系分别校验；错误路径可直接反馈给 skill。 */
export function validateStatPlot(input: unknown): ValidationResult {
  if (!validateStructure(input)) {
    return {
      valid: false,
      errors: (validateStructure.errors ?? []).map(error => {
        const property =
          error.params.missingProperty ??
          error.params.additionalProperty ??
          (error.keyword === 'discriminator' ? error.params.tag : undefined);
        return {
          code: 'SCHEMA_ERROR' as const,
          path:
            error.instancePath +
            (typeof property === 'string' ? '/' + property.replace(/~/g, '~0').replace(/\//g, '~1') : ''),
          message: error.message ?? '不符合统计图表结构'
        };
      })
    };
  }
  const errors = validateSemantics(input as StatPlotSpec);
  return errors.length ? { valid: false, errors } : { valid: true, errors: [] };
}
