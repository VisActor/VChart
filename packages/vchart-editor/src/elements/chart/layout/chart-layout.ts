import type { IEditorLayer, IModelInfo } from './../../../core/interface';
import type { IChartModel, ILayoutItem } from './../interface';
// import { DefaultLayout } from './default-layout';
import type { ISpecProcess } from '../spec-process/interface';
import type { ILayoutData, IChartLayout, LayoutMeta } from './interface';
import { Layout, type IVChart } from '@visactor/vchart';
import type { IBoundsLike } from '@visactor/vutils';
import { merge } from '@visactor/vutils';
import type { IPoint, IRect } from '../../../typings/space';
import { LayoutRectToRect, isPointInRect, isRectConnectRect } from '../../../utils/space';
import {
  IgnoreModelTypeInLayout,
  getAxisLayoutInRegionRect,
  getBoundsInRects,
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
  protected _defaultLayout = new Layout();

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

  layout = (chart: IVChart, item: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike) => {
    // use vchart buildIn layout for demo test
    if (!this._layoutData?.data?.length) {
      this._defaultLayout.layoutItems(chart as any, item as any, chartLayoutRect, chartViewBox);
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
    // @ts-ignore
    const items = chart.getLayoutElements() as ILayoutItem[];
    items.forEach(item => {
      if (IgnoreModelTypeInLayout[item.model.type]) {
        return;
      }
      layoutData.push({
        id: item.model.userId,
        specKey: item.model.specKey === '' ? item.model.type : item.model.specKey,
        specIndex: item.model.getSpecIndex(),
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
    item
      .sort((a, b) => {
        if (a.model.type === 'region') {
          return -1;
        }
        if (b.model.type === 'region') {
          1;
        }
        return 0;
      })
      .forEach(i => {
        const data = this._layoutData.data.find(d => isModelMatchModelInfo(i.model, d));
        if (!data) {
          return;
        }
        const rect = LayoutRectToRect(data.layout);
        if ((<IChartModel>i.model)._clearLayoutCache) {
          (<IChartModel>i.model)._clearLayoutCache();
        }
        const size = i.computeBoundsInRect(rect);
        if (rect.width !== size.width || rect.height !== size.height) {
          if (i.model.type.startsWith('cartesianAxis')) {
            if (i.layoutOrient === 'left' || i.layoutOrient === 'right') {
              rect.width = size.width;
            } else {
              rect.height = size.height;
            }
          } else if (i.model.type === 'region') {
            // nothing
          } else {
            rect.width = size.width;
            rect.height = size.height;
          }
          i.computeBoundsInRect(rect);
        }
        i.setLayoutRect(rect);
        const pos = { x: data.layout.x.offset, y: data.layout.y.offset };
        transformModelPos(i.model, pos);
        i.setLayoutStartPosition(pos);
        data.layout.width.offset = rect.width;
        data.layout.height.offset = rect.height;
        this.setModelLayoutData(data);
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
        result.push({ model: model as unknown as IChartModel, layoutMeta: d });
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
          result.push({ model: model as unknown as IChartModel, layoutMeta: d });
        }
      });
    }
    return result;
  }

  // 将模块的布局数据改为属性更新后的。
  // 这里会设置一个非常大的bounds，尽可能保持模块基准点，增加它的可布局空间
  // 布局后会根据模块bounds，再次调整bounds到合适的大小
  resetModelLayoutDataAfterAttributeChanged(modelInfo: IModelInfo, model?: IChartModel) {
    if (!model) {
      model = getChartModelWithModelInfo(this._vchart, modelInfo) as unknown as IChartModel;
    }
    if (!model) {
      return;
    }
    if (model.type.startsWith('region')) {
      // region 不处理
      return;
    } else if (model.type.startsWith('cartesianAxis')) {
      // 轴处理
      this._resetAxisLayout(modelInfo, model);
    } else if (model.type.startsWith('title')) {
      // 标题 只增加可布局高度，因为默认会有宽度换行
      this._resetTitleLayout(modelInfo, model);
    } else {
      // 通用逻辑 增加可布局宽高
      this._resetModelLayout(modelInfo, model);
    }
  }

  private _resetAxisLayout(modelInfo: IModelInfo, model: IChartModel) {
    const regions = (<any>model)._regions;
    const axisRegionLayoutData = regions.map((r: IChartModel) =>
      getAxisLayoutInRegionRect(model.layout, { ...r.getLayoutStartPoint(), ...r.getLayoutRect() })
    );
    const layoutData = this.getModelLayoutData(modelInfo);
    if (!layoutData) {
      return;
    }
    if (model.layoutOrient === 'left') {
      const b = getBoundsInRects(axisRegionLayoutData, ['x1', 'y1']);
      layoutData.layout.x.offset = b.x1;
      layoutData.layout.y.offset = b.y1;
      layoutData.layout.width.offset = 999999;
    } else if (model.layoutOrient === 'right') {
      const b = getBoundsInRects(axisRegionLayoutData, ['x2', 'y1']);
      layoutData.layout.x.offset = b.x1;
      layoutData.layout.y.offset = b.y1;
      layoutData.layout.width.offset = 999999;
    } else if (model.layoutOrient === 'top') {
      const b = getBoundsInRects(axisRegionLayoutData, ['x1', 'y1']);
      layoutData.layout.x.offset = b.x1;
      layoutData.layout.y.offset = b.y1;
      layoutData.layout.height.offset = 999999;
    } else if (model.layoutOrient === 'bottom') {
      const b = getBoundsInRects(axisRegionLayoutData, ['x1', 'y2']);
      layoutData.layout.x.offset = b.x1;
      layoutData.layout.y.offset = b.y2;
      layoutData.layout.height.offset = 999999;
    }
    this.setModelLayoutData(layoutData);
  }
  private _resetTitleLayout(modelInfo: IModelInfo, model: IChartModel) {
    const layoutData = this.getModelLayoutData(modelInfo);
    if (!layoutData) {
      return;
    }
    layoutData.layout.height.offset = 999999;
    this.setModelLayoutData(layoutData);
  }
  private _resetModelLayout(modelInfo: IModelInfo, model: IChartModel) {
    const layoutData = this.getModelLayoutData(modelInfo);
    if (!layoutData) {
      return;
    }
    layoutData.layout.width.offset = 999999;
    layoutData.layout.height.offset = 999999;
    this.setModelLayoutData(layoutData);
  }
}
