import VChart, { IChartSpec } from '@visactor/vchart';
import { IContext } from '../../interface/type';
import { Template } from '../base-template';

// TODO: 动态生成
export const CHART_TYPES = ['line', 'bar'];

export class Bar extends Template {
  protected isValid() {
    const { xField, yField, data } = this.spec;
    if (!xField || !yField) {
      throw new Error('Missing config: `xField`,`yField`');
    }
    if (!data) {
      throw new Error('Missing data');
    }
    return true;
  }

  protected setUp() {
    if (this.spec) {
      // TODO chart 会绘制整个background
      this.spec.background = 'rgba(0,0,0,0)';
    }
    return this.spec;
  }

  render(context: Partial<IContext> = {}) {
    const spec = this.setUp();
    if (spec && context.dom) {
      this._chartInstance = new VChart(spec as IChartSpec, {
        dom: context.dom,
        stage: context.stage,
        renderCanvas: context.canvas
      });
      if (this._chartInstance) {
        this._chartInstance.renderSync();
        // this.onRenderEnd(context);
      }
    }
  }
}
