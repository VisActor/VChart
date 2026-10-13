import type { ISequenceAnalysisSpec } from './interface';
import { VChart, BaseChart, CommonChart } from '@visactor/vchart';
import { SequenceAnalysisChartSpecTransformer } from './sequence-analysis-transformer';

export class SequenceAnalysis extends BaseChart<Omit<ISequenceAnalysisSpec, 'data'>> {
  type = 'sequenceAnalysis';
  static type = 'sequenceAnalysis';
  static readonly view: string = 'singleDefault';

  declare _spec: ISequenceAnalysisSpec;

  static readonly transformerConstructor = SequenceAnalysisChartSpecTransformer;
  readonly transformerConstructor = SequenceAnalysisChartSpecTransformer;

  init() {
    if (!this.isValid()) {
      return;
    }
    super.init();
  }

  protected isValid() {
    const { eventData, type } = this._spec;
    if (type !== 'sequenceAnalysis') {
      this._option.onError?.('Type is required');
      return false;
    }
    if (!eventData) {
      this._option.onError?.('Data is required');
      return false;
    }
    return true;
  }
}

export const registerSequenceAnalysis = (option?: { VChart?: typeof VChart }) => {
  const vchartConstructor = option?.VChart || VChart;
  if (vchartConstructor) {
    vchartConstructor.useChart([SequenceAnalysis, CommonChart]);
  }
};
