import { IContext } from 'src/interface/type';
import { IRankingBarSpec } from './interface';
import { VChart } from '@visactor/vchart';
import { specParser } from './spec-parser';

export class RankingBar {
  readonly type: 'ranking-bar';

  readonly spec: IRankingBarSpec;

  protected _chartInstance: VChart;

  protected _timeNodes: string[];
  protected _timeData: Map<string, any[]>;

  constructor(spec: IRankingBarSpec) {
    this.spec = spec;
    this.init();
  }

  protected isValid() {
    const { xField, yField, timeField, data } = this.spec;
    if (!xField || !yField || !timeField) {
      throw new Error('Missing config: `xField`,`yField`, `timeField`');
    }
    if (!data) {
      throw new Error('Missing data');
    }
    return true;
  }

  protected init() {
    if (!this.isValid()) {
      return;
    }
    this._timeData = new Map();
    this._timeNodes = [];
  }

  protected setUp() {
    const { vchartSpec } = specParser(this.spec);
    console.log(vchartSpec);
    return vchartSpec;
  }

  render(context: Partial<IContext> = {}) {
    const spec = this.setUp();
    if (spec && context.dom) {
      this._chartInstance = new VChart(spec, { dom: context.dom });
      if (this._chartInstance) {
        this._chartInstance.renderSync();
      }
    }
  }

  protected release() {
    this._timeData = null;
    this._timeNodes = null;
  }
}
