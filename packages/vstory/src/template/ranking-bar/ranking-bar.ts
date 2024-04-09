import { IContext } from 'src/interface/type';
import { IRankingBarSpec } from './interface';
import { VChart } from '@visactor/vchart';
import { specParser } from './spec-parser';
import { Template } from '../base-template';

export class RankingBar extends Template {
  declare spec: IRankingBarSpec;

  protected _chartInstance: VChart;

  protected _timeNodes: string[];
  protected _timeData: Map<string, any[]>;

  constructor(spec: IRankingBarSpec) {
    super(spec);
    this.init();
  }

  protected init() {
    if (!this.isValid()) {
      return;
    }
    this._timeData = new Map();
    this._timeNodes = [];
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

  protected setUp() {
    const { vchartSpec } = specParser(this.spec);
    return vchartSpec;
  }

  render(context: Partial<IContext> = {}) {
    const spec = this.setUp();
    if (spec && context.dom) {
      this._chartInstance = new VChart(spec, { dom: context.dom, stage: context.stage });
      if (this._chartInstance) {
        this._chartInstance.renderSync();
        this.onRenderEnd(context);
      }
    }
  }

  release() {
    super.release();
    this._timeData = null;
    this._timeNodes = null;
  }
}
