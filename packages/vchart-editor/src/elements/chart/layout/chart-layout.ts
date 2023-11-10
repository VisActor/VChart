import type { IEditorLayer, IModelInfo } from './../../../core/interface';
import type { IChartModel } from './../interface';
import { DefaultLayout } from './default-layout';
import type { ISpecProcess } from '../spec-process/interface';
import type { ILayoutData, IChartLayout, LayoutMeta } from './interface';
import type { IVChart } from '@visactor/vchart';
import { merge, type IBoundsLike } from '@visactor/vutils';
import type { IPoint, IRect } from '../../../typings/space';
import { LayoutRectToRect, isPointInRect, isRectConnectRect } from '../../../utils/space';
import {
  IgnoreModelTypeInLayout,
  getChartModelWithModelInfo,
  transformModelPos,
  transformModelRect
} from '../utils/layout';
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
      viewBox: { x: 100, y: 100, width: 500, height: 500 },
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

  clearLayoutData() {
    this.setLayoutData({
      viewBox: this._layoutData.viewBox,
      data: null
    });
  }

  setLayoutData(d: ILayoutData) {
    const lastViewBox = this._layoutData.viewBox;
    this._layoutData = d;
    if (!this._layoutData.viewBox) {
      this._layoutData.viewBox = lastViewBox;
    }
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
    const startPos = { x: this._layoutData.viewBox?.x ?? 200, y: this._layoutData.viewBox?.y ?? 200 };
    const layoutData: LayoutMeta[] = [];
    const chart = this._vchart.getChart();
    const items = (<IChartModel[]>chart.getAllRegions()).concat(chart.getAllComponents() as IChartModel[]);
    items.forEach((item: IChartModel) => {
      if (IgnoreModelTypeInLayout[item.type]) {
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
    item
      .sort((a, b) => {
        if (a.type === 'region') {
          return -1;
        }
        if (b.type === 'region') {
          1;
        }
        return 0;
      })
      .forEach(i => {
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

  getOverModel(pos: IPoint, layer: IEditorLayer) {
    if (!this._layoutData.data) {
      return null;
    }
    return this._layoutData.data.find(d => {
      const model = getChartModelWithModelInfo(this._vchart, d);
      // marker pick with event not pos;
      if (!model) {
        return false;
      }
      if (model?.specKey.startsWith('mark')) {
        return false;
      }
      return isPointInRect(
        layer.transformPosInLayer(pos),
        transformModelRect(model as any, LayoutRectToRect(d.layout))
      );
    });
  }
  setModelLayoutData(d: LayoutMeta) {
    if (!this._layoutData?.data) {
      return;
    }
    const meta = this._layoutData.data.find(_d => _d.id === d.id);
    if (!meta) {
      this._layoutData.data.push(meta);
    } else {
      merge(meta, d);
    }
  }

  getModelLayoutData(info: IModelInfo) {
    if (!this._layoutData?.data) {
      return null;
    }
    return this._layoutData.data.find(_d => isSameModelInfo(info, _d));
  }

  getBoxConnectModel(rect: IRect) {
    const result: { layoutMeta: LayoutMeta; model: IChartModel }[] = [];
    this._layoutData.data.forEach(d => {
      const model = getChartModelWithModelInfo(this._vchart, d);
      if (!model || IgnoreModelTypeInLayout[model.type]) {
        return;
      }
      const modelRect = transformModelRect(model as unknown as IChartModel, LayoutRectToRect(d.layout));
      if (isRectConnectRect(rect, modelRect)) {
        result.push({ model, layoutMeta: d });
      }
    });
    if (result.find(info => info.layoutMeta.specKey === 'region' || info.layoutMeta.specKey === 'axes')) {
      // 如果包含了 region 或者 轴，那么需要需要将 region 和轴一起添加。它们布局时是一个整体 痛苦！
      this._layoutData.data.forEach(d => {
        if (d.specKey === 'region' || d.specKey === 'axes') {
          if (result.find(r => isSameModelInfo(r.layoutMeta, d))) {
            return;
          }
          const model = getChartModelWithModelInfo(this._vchart, d);
          result.push({ model, layoutMeta: d });
        }
      });
    }
    return result;
  }
}
