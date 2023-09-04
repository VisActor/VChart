import type { ISpecProcess } from '../spec-process/interface';
import type { ILayoutData, IChartLayout } from './interface';
import { Layout as BaseLayout } from '@visactor/vchart';
import type { IRect, ILayoutItem, IChart } from '@visactor/vchart';
import type { IBoundsLike } from '@visactor/vutils';

export class ChartLayout implements IChartLayout {
  protected _layoutData: ILayoutData = null;
  protected _specProcess: ISpecProcess;
  protected _vchart: IChart;

  // temp
  protected _layoutTemp = new BaseLayout();

  constructor(specProcess: ISpecProcess) {
    this._specProcess = specProcess;
  }

  clear() {
    this._vchart = null;
    this._specProcess = null;
  }

  setVChart(vchart: IChart) {
    this._vchart = vchart;
    this._vchart.setLayout(this.layout);
  }

  setLayoutData(d: ILayoutData) {
    this._layoutData = d;
  }
  getLayoutData() {
    return this._layoutData;
  }

  layout = (chart: IChart, item: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike) => {
    // use vchart buildIn layout for demo test
    this._layoutTemp.layoutItems(chart, item, chartLayoutRect, chartViewBox);
  };
}
