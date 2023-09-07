import { DefaultLayout } from './default-layout';
import type { ISpecProcess } from '../spec-process/interface';
import type { ILayoutData, IChartLayout, LayoutMeta } from './interface';
import type { IRect, ILayoutItem, IChart } from '@visactor/vchart';
import type { IBoundsLike } from '@visactor/vutils';

export class ChartLayout implements IChartLayout {
  protected _layoutData: ILayoutData = null;
  protected _specProcess: ISpecProcess;
  protected _vchart: IChart;

  // temp
  protected _defaultLayout = new DefaultLayout();

  constructor(specProcess: ISpecProcess) {
    this._specProcess = specProcess;
    this._layoutData = {
      viewBox: null,
      data: null
    };
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
    this._specProcess.updateLayout(this._layoutData);
  }
  getLayoutData() {
    return this._layoutData;
  }

  layout = (chart: IChart, item: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike) => {
    // use vchart buildIn layout for demo test
    if (!this._layoutData?.data?.length) {
      this._defaultLayout.layoutItems(chart, item, chartLayoutRect, chartViewBox);
      this.saveLayoutData();
    }
    this.layoutWithData(chart, item, chartLayoutRect, chartViewBox);
  };

  setViewBox(r: IRect) {
    this._layoutData.viewBox = r;
  }

  saveLayoutData() {
    const startPos = { x: this._layoutData.viewBox.x, y: this._layoutData.viewBox.y };
    const layoutData: LayoutMeta[] = [];
    const chart = this._vchart.getChart();
    const items = chart.getAllRegions().concat(chart.getAllComponents());
    items.forEach((item: any) => {
      layoutData.push({
        id: item.userId,
        layout: {
          x: { offset: startPos.x + item.getLayoutStartPoint().x },
          y: { offset: startPos.y + item.getLayoutStartPoint().y },
          width: { offset: item.getLayoutRect().width },
          height: { offset: item.getLayoutRect().height }
        }
      });
    });
    this._layoutData.data = layoutData;
    this._specProcess.updateLayout(this._layoutData);
  }

  layoutWithData(chart: IChart, item: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike) {
    item.forEach(i => {
      const data = this._layoutData.data.find(d => d.id === i.userId);
      if (!data) {
        return;
      }
      i.setLayoutRect({
        x: data.layout.x.offset,
        y: data.layout.y.offset,
        width: data.layout.width.offset,
        height: data.layout.height.offset
      });
      const pos = { x: data.layout.x.offset, y: data.layout.y.offset };
      if (i.type.startsWith('cartesianAxis')) {
        if (i.layoutOrient === 'left') {
          pos.x -= data.layout.width.offset;
        } else if (i.layoutOrient === 'top') {
          pos.y -= data.layout.height.offset;
        }
      }
      i.setLayoutStartPosition(pos);
    });
  }
}
