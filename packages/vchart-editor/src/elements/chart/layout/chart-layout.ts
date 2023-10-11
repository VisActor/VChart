import type { IModelInfo } from './../../../core/interface';
import type { IChartModel } from './../interface';
import { DefaultLayout } from './default-layout';
import type { ISpecProcess } from '../spec-process/interface';
import type { ILayoutData, IChartLayout, LayoutMeta } from './interface';
import type { IVChart } from '@visactor/vchart';
import { merge, type IBoundsLike } from '@visactor/vutils';
import type { IPoint, IRect } from '../../../typings/space';
import { LayoutRectToRect, isPointInRect } from '../../../utils/space';
import { getChartModelWithModelInfo, transformModelPos, transformModelRect } from '../utils/layout';
import { isModelMatchModelInfo, isSameModelInfo } from '../../../utils/spec';

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
    this._vchart.setLayout(this.layout as any);
  }

  setLayoutData(d: ILayoutData) {
    this._layoutData = d;
    this._specProcess.updateLayout(this._layoutData);
  }
  getLayoutData() {
    return this._layoutData;
  }

  layout = (chart: IVChart, item: IChartModel[], chartLayoutRect: IRect, chartViewBox: IBoundsLike) => {
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
    const items = (<IChartModel[]>chart.getAllRegions()).concat(chart.getAllComponents() as IChartModel[]);
    items.forEach((item: IChartModel) => {
      if (item.type === 'tooltip' || item.type === 'crosshair') {
        return;
      }
      layoutData.push({
        id: item.userId,
        specKey: item.specKey,
        specIndex: item.getSpecIndex(),
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

  layoutWithData(chart: IVChart, item: IChartModel[], chartLayoutRect: IRect, chartViewBox: IBoundsLike) {
    item.forEach(i => {
      const data = this._layoutData.data.find(d => isModelMatchModelInfo(i, d));
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
    return this._layoutData.data.find(d => {
      const model = getChartModelWithModelInfo(this._vchart, d);
      // marker pick with event not pos;
      if (model.specKey.startsWith('mark')) {
        return false;
      }
      return isPointInRect(pos, transformModelRect(model, LayoutRectToRect(d.layout)));
    });
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

  getModelLayoutData(info: IModelInfo) {
    if (!this._layoutData?.data) {
      return null;
    }
    return this._layoutData.data.find(_d => isSameModelInfo(info, _d));
  }
}
