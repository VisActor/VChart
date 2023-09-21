import { DefaultLayout } from './default-layout';
import type { ISpecProcess } from '../spec-process/interface';
import type { ILayoutData, IChartLayout, LayoutMeta } from './interface';
import type { IVChart } from '@visactor/vchart';
import { merge, type IBoundsLike } from '@visactor/vutils';
import type { IPoint, IRect } from '../../../typings/space';
import { LayoutRectToRect, isPointInRect } from '../../../utils/space';
import { transformModelPos } from '../utils/layout';
import type { ILayoutItem } from '../interface';

export class ChartLayout implements IChartLayout {
  protected _layoutData: ILayoutData = null;
  protected _specProcess: ISpecProcess;
  protected _vchart: IVChart;

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

  setVChart(vchart: IVChart) {
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

  layout = (chart: IVChart, item: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike) => {
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
      if (item.type === 'tooltip' || item.type === 'crosshair') {
        return;
      }
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

  layoutWithData(chart: IVChart, item: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike) {
    item.forEach(i => {
      const data = this._layoutData.data.find(d => d.id === i.userId);
      if (!data) {
        return;
      }
      const rect = LayoutRectToRect(data.layout);
      i.computeBoundsInRect(rect);
      i.setLayoutRect(rect);
      const pos = { x: data.layout.x.offset, y: data.layout.y.offset };
      transformModelPos(i, pos);
      i.setLayoutStartPosition(pos);
    });
  }

  getOverModel(pos: IPoint) {
    return this._layoutData.data.find(d => isPointInRect(pos, LayoutRectToRect(d.layout)));
  }
  setModelLayoutData(d: LayoutMeta) {
    if (!this._layoutData?.data) {
      return;
    }
    const meta = this._layoutData.data.find(_d => _d.id === d.id);
    if (!meta) {
      this._layoutData.data.push(meta);
    }
    merge(meta, d);
  }
}
