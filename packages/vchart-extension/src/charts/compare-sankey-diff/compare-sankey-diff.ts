import type { ICompareSankeyDiffChartSpecBase, ICompareSankeyDiffSeriesSpecBase } from './interface';
import type { IRectMarkSpec } from '@visactor/vchart';
import {
  VChart,
  SankeyChart,
  SankeySeries,
  registerDataSetInstanceTransform,
  STATE_VALUE_ENUM,
  AttributeLevel
} from '@visactor/vchart';
import { DataView } from '@visactor/vdataset';
import { CompareSankeyDiffChartSpecTransformer } from './compare-sankey-diff-transformer';
import { compareSankeyDiffSubData } from './compare-sankey-diff-data';
import { getNodeDatumInSubTree, getNodeDatumInTree, getSubNodeDatum } from '../compare-sankey/utils';

type Datum = any;
/**
 * compare-sankey-diff 图表类
 */
// @ts-expect-error
export class CompareSankeyDiffChart extends SankeyChart<ICompareSankeyDiffChartSpecBase> {
  type = 'compareSankeyDiff';
  static type = 'compareSankeyDiff';
  readonly seriesType = CompareSankeyDiffSeries.type;

  declare _spec: ICompareSankeyDiffChartSpecBase;

  static readonly transformerConstructor = CompareSankeyDiffChartSpecTransformer;
  readonly transformerConstructor = CompareSankeyDiffChartSpecTransformer;
}

/**
 * compare-sankey-diff 系列类
 */
// @ts-expect-error
export class CompareSankeyDiffSeries extends SankeySeries<ICompareSankeyDiffSeriesSpecBase> {
  // @ts-ignore
  type = 'compareSankeyDiff';
  static type = 'compareSankeyDiff';

  /**
   * 初始化数据视图，构建子节点数据与对比节点数据
   */
  initData() {
    super.initData();
    const { dataSet } = this._option;

    // 数据逻辑变化
    // 使用原始总计数据生成原始节点位置 这里可以不变
    // 使用每一个对比数据生成对比节点和对比边
    // 使用总计数据的节点位置更新对比数据的节点位置
    // 使用对比数据的点更新对比数据的边
    // 新数据以来原始数据，以来原始数据结果

    const compareData = new DataView(dataSet, { name: `compare-sankey-diff-compare-data-${this.id}-data` });
    compareData.parse([this.getViewData()], { type: 'dataview' });

    // 注册并执行子节点拆解与聚合
    registerDataSetInstanceTransform(this._dataSet, 'compareSankeyDiffSubData', compareSankeyDiffSubData);
    compareData.transform({
      type: 'compareSankeyDiffSubData',
      options: {
        rawData: () => this.getRawData(),
        valueField: this._valueField,
        nodeKey: this._spec.nodeKey,
        subNodeGap: (this._spec as any).subNodeGap ?? 2,
        subNodeMinSize: (this._spec as any).subNodeMinSize ?? 0
      }
    });

    this._nodesSeriesData.getDataView().parse([compareData], {
      type: 'dataview'
    });
    this._linksSeriesData.getDataView().parse([compareData], {
      type: 'dataview'
    });
  }

  /**
   * 编译数据
   */
  compileData() {
    super.compileData();
  }

  /**
   * 初始化链接样式（激活态）
   */
  _initLinkMarkStyle() {
    super._initLinkMarkStyle();
    if ((this._spec as any).compareLinkColor) {
      this.setMarkStyle<IRectMarkSpec>(
        this._linkMark,
        { fill: this._fillCompareLink },
        'normal',
        AttributeLevel.User_Mark
      );
    }
  }

  /**
   * 初始化节点样式（支持对比颜色）
   */
  _initNodeMarkStyle() {
    super._initNodeMarkStyle();
    if ((this._spec as any).compareNodeColor) {
      this.setMarkStyle<IRectMarkSpec>(
        this._nodeMark,
        { fill: this._fillCompareNode },
        'normal',
        AttributeLevel.User_Mark
      );
    }
  }

  /**
   * 计算节点填充色（支持 compareNodeColor）
   */
  protected _fillCompareNode = (datum: any) => {
    const specAny = this._spec as any;
    if (specAny.compareNodeColor?.[datum.type]) {
      return specAny.compareNodeColor[datum.type];
    }
    return this._spec.node?.style?.fill ?? this._fillByNode(datum);
  };

  /**
   * 计算激活态链接填充色（支持 compareLinkColor）
   */
  protected _fillCompareLink = (datum: any) => {
    const specAny = this._spec as any;
    if (specAny.compareLinkColor?.[datum.type]) {
      return specAny.compareLinkColor[datum.type];
    }
    return this._spec.link?.style?.fill ?? this._fillByLink(datum);
  };

  /**
   * 清除状态时同时清空激活态链接与 hover
   */
  protected _handleClearEmpty(highlightState: string, blurState: string) {
    super._handleClearEmpty(highlightState, blurState);

    const allNodeElements = this._nodeMark.getProductElements();
    if (allNodeElements || !allNodeElements.length) {
      allNodeElements.forEach(el => {
        el.removeState(STATE_VALUE_ENUM.STATE_HOVER);
      });
    }

    const allLinkElements = this._linkMark.getProductElements();
    if (allLinkElements || !allLinkElements.length) {
      allLinkElements.forEach(el => {
        el.removeState(STATE_VALUE_ENUM.STATE_HOVER);
      });
    }
  }

  public getSubNodeDatum(filter: (n: Datum) => boolean) {
    return getSubNodeDatum(this._nodeMark.getProductElements(), filter);
  }

  public getNodeDatumInTree(filter: (n: any) => boolean) {
    return getNodeDatumInTree(this._rawData.latestData[0].nodes, filter);
  }

  public getNodeDatumInSubTree(filter: (n: any) => boolean) {
    return getNodeDatumInSubTree(this._rawData.latestData[0].subNode, filter);
  }
}

/**
 * 注册 compare-sankey-diff 图表与系列
 */
export const registerCompareSankeyDiffChart = (option?: { VChart?: typeof VChart }) => {
  const vchartConstructor = option?.VChart || VChart;
  if (vchartConstructor) {
    vchartConstructor.useChart([CompareSankeyDiffChart]);
    vchartConstructor.useSeries([CompareSankeyDiffSeries]);
  }
};
