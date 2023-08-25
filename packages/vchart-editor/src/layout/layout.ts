import type { ISpecProcess } from '../spec-process/interface';
import type { ILayoutData, ILayout } from './interface';
import { LayoutEditor } from './layoutEditor';
import type { IRect, ILayoutItem, IChart } from '@visactor/vchart';
import type { IBoundsLike } from '@visactor/vutils';
// temp
import { Layout as BaseLayout } from './../../../vchart/src/layout/base-layout';

export class Layout implements ILayout {
  protected _layoutData: ILayoutData = null;
  protected _layoutEditor: LayoutEditor = null;
  protected _specProcess: ISpecProcess;
  protected _vchart: IChart;

  // temp
  protected _layoutTemp = new BaseLayout();

  constructor(specProcess: ISpecProcess) {
    this._specProcess = specProcess;
    this._layoutEditor = new LayoutEditor();
  }

  clear() {
    this._vchart = null;
    this._layoutEditor = null;
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
