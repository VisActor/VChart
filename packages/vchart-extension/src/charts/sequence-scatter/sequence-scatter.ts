import { ISequenceScatterSpec } from './interface';
import { VChart, BaseChart, ScatterChart } from '@visactor/vchart';
import { SequenceScatterChartSpecTransformer } from './sequence-scatter-transformer';

export class SequenceScatter extends BaseChart<Omit<ISequenceScatterSpec, 'data'>> {
  type = 'sequenceScatter';
  static type = 'sequenceScatter';
  static readonly view: string = 'singleDefault';

  declare _spec: ISequenceScatterSpec;

  static readonly transformerConstructor = SequenceScatterChartSpecTransformer;
  readonly transformerConstructor = SequenceScatterChartSpecTransformer;

  init() {
    if (!this.isValid()) {
      return;
    }
    super.init();
  }

  protected isValid() {
    const { xField, yField, data } = this._spec;
    if (!xField || !yField) {
      this._option.onError?.('Missing Required Config: `xField`, `yField` ');
      return false;
    }
    if (!data) {
      this._option.onError?.('Data is required');
      return false;
    }
    return true;
  }
}

export const registerSequenceScatter = (option?: { VChart?: typeof VChart }) => {
  const vchartConstructor = option?.VChart || VChart;
  if (vchartConstructor) {
    vchartConstructor.useChart([SequenceScatter, ScatterChart]);
  }
};
