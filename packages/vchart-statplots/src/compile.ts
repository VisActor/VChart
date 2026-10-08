import { compilePairPlot } from './plots/pair-plot/compile';
import { compileShapBeeswarm } from './plots/shap-beeswarm/compile';
import { compileHexbin } from './plots/hexbin/compile';
import { compileFeatureImportance } from './plots/feature-importance/compile';
import { compileLearningCurve } from './plots/learning-curve/compile';
import { compileQq } from './plots/qq/compile';
import { compileResidual } from './plots/residual/compile';
import { compileEmbedding } from './plots/embedding/compile';
import { compileScree } from './plots/scree/compile';
import { compileAutocorrelation } from './plots/autocorrelation/compile';
import { compileSeasonal } from './plots/seasonal/compile';
import { compileTimeSeries } from './plots/time-series/compile';
import { compileCalibration } from './plots/calibration/compile';
import { compilePrecisionRecall } from './plots/precision-recall/compile';
import { compileConfusionMatrix } from './plots/confusion-matrix/compile';
import { compileScatter } from './plots/scatter/compile';
import { compilePaired } from './plots/paired/compile';
import { compileStripPlot } from './plots/strip-plot/compile';
import { compileMissingness } from './plots/missingness/compile';
import { compileCount } from './plots/count/compile';
import type { ISpec } from '@visactor/vchart';
import type { StatPlotSpec } from './types';
import { validateStatPlot } from './validate';
import { StatPlotValidationError } from './errors';
import { compileBoxPlot } from './plots/box-plot/compile';
import { compileCorrelationMatrix } from './plots/correlation-matrix/compile';
import { compileEcdf } from './plots/ecdf/compile';
import { compileEstimateInterval } from './plots/estimate-interval/compile';
import { compileHistogram } from './plots/histogram/compile';
import { compileKde } from './plots/kde/compile';
import { compileRoc } from './plots/roc/compile';
import { compileViolin } from './plots/violin/compile';

/** 边界校验后编译，输入数据始终归调用方所有。 */
export function compileStatPlot(spec: StatPlotSpec): ISpec {
  const result = validateStatPlot(spec);
  if (!result.valid) {
    throw new StatPlotValidationError(result.errors);
  }
  switch (spec.type) {
    case 'pairPlot':
      return compilePairPlot(spec);
    case 'shapBeeswarmPlot':
      return compileShapBeeswarm(spec);
    case 'hexbinPlot':
      return compileHexbin(spec);
    case 'featureImportancePlot':
      return compileFeatureImportance(spec);
    case 'learningCurve':
      return compileLearningCurve(spec);
    case 'qqPlot':
      return compileQq(spec);
    case 'residualPlot':
      return compileResidual(spec);
    case 'embeddingPlot':
      return compileEmbedding(spec);
    case 'screePlot':
      return compileScree(spec);
    case 'autocorrelationPlot':
      return compileAutocorrelation(spec);
    case 'seasonalPlot':
      return compileSeasonal(spec);
    case 'timeSeriesPlot':
      return compileTimeSeries(spec);
    case 'calibrationCurve':
      return compileCalibration(spec);
    case 'precisionRecallCurve':
      return compilePrecisionRecall(spec);
    case 'confusionMatrix':
      return compileConfusionMatrix(spec);
    case 'scatterPlot':
      return compileScatter(spec);
    case 'pairedComparisonPlot':
      return compilePaired(spec);
    case 'stripPlot':
      return compileStripPlot(spec);
    case 'missingValueMatrix':
      return compileMissingness(spec);
    case 'countPlot':
      return compileCount(spec);
    case 'boxPlot':
      return compileBoxPlot(spec);
    case 'correlationMatrix':
      return compileCorrelationMatrix(spec);
    case 'ecdfPlot':
      return compileEcdf(spec);
    case 'pointIntervalPlot':
      return compileEstimateInterval(spec);
    case 'histogram':
      return compileHistogram(spec);
    case 'kdePlot':
      return compileKde(spec);
    case 'rocCurve':
      return compileRoc(spec);
    case 'violinPlot':
      return compileViolin(spec);
  }
}
