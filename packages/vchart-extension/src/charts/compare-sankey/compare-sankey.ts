import type { SankeyLinkElement } from '@visactor/vgrammar-sankey';
import type { ICompareSankeyChartSpecBase, ICompareSankeySeriesSpecBase } from './interface';
import type { ILinkPathMarkSpec, IRectMarkSpec } from '@visactor/vchart';
import {
  VChart,
  SankeyChart,
  SankeySeries,
  registerDataSetInstanceTransform,
  STATE_VALUE_ENUM,
  AttributeLevel,
  DEFAULT_DATA_INDEX,
  DEFAULT_DATA_KEY
} from '@visactor/vchart';
import { DataView } from '@visactor/vdataset';
import { CompareSankeyChartSpecTransformer } from './compare-sankey-transformer';
import { compareSankeySubNodes } from './compare-sankey-sub-nodes';
import type { ILinkPathMark } from '@visactor/vchart/src/mark/interface';
import { compareSankeySubData } from './compare-sankey-sub-data';
import type { IElement } from '@visactor/vgrammar-core';
import { getDatumOfGraphic } from '../../utils/mark';
import { getNodeDatumInSubTree, getNodeDatumInTree, getSubNodeDatum } from './utils';

type Datum = any;

export class CompareSankeyChart extends SankeyChart<ICompareSankeyChartSpecBase> {
  type = 'compareSankey';
  static type = 'compareSankey';
  readonly seriesType = CompareSankeySeries.type;

  declare _spec: ICompareSankeyChartSpecBase;

  static readonly transformerConstructor = CompareSankeyChartSpecTransformer;
  readonly transformerConstructor = CompareSankeyChartSpecTransformer;
}

export class CompareSankeySeries extends SankeySeries<ICompareSankeySeriesSpecBase> {
  // @ts-ignore
  type = 'compareSankey';
  static type = 'compareSankey';

  private _subData: DataView;

  private _activeLinkData: DataView;
  private _activeLinkMark: ILinkPathMark;

  initData() {
    super.initData();
    // 此时 viewData 已经初始化完成
    // 创建 第二层 viewDataActive
    //
    const { dataSet } = this._option;

    const compareSubData = new DataView(dataSet, { name: `compare-sankey-sub-data-${this.id}-data` });
    compareSubData.parse([this.getViewData()], {
      type: 'dataview'
    });
    this._subData = compareSubData;

    const compareNodeData = new DataView(dataSet, { name: `compare-sankey-node-${this.id}-data` });
    compareNodeData.parse([compareSubData], {
      type: 'dataview'
    });

    // 注册对比布局函数，计算拆解 nodes 的信息
    registerDataSetInstanceTransform(this._dataSet, 'compareSankeySubData', compareSankeySubData);
    compareSubData.transform({
      type: 'compareSankeySubData',
      options: {
        rawData: () => this.getRawData(),
        valueField: this._valueField,
        nodeKey: this._spec.nodeKey,
        subNodeGap: this._spec.subNodeGap ?? 2,
        subNodeMinSize: this._spec.subNodeMinSize ?? 0
      }
    });
    registerDataSetInstanceTransform(this._dataSet, 'compareSankeySubNodes', compareSankeySubNodes);
    compareNodeData.transform({
      type: 'compareSankeySubNodes'
    });
    this._nodesSeriesData.getDataView().parse([compareNodeData], {
      type: 'dataview'
    });

    // 激活时的linkData
    this._activeLinkData = new DataView(dataSet, { name: `compare-sankey-link-${this.id}-data` });
  }

  initEvent() {
    super.initEvent();
    this._activeLinkData?.target.addListener('change', this.activeLinkDataUpdate.bind(this));
  }

  initMark() {
    super.initMark();

    const linkMark = this._createMark(
      { ...SankeySeries.mark.link, name: 'activeLink' },
      {
        dataView: this._activeLinkData
      }
    ) as ILinkPathMark;
    if (linkMark) {
      this._activeLinkMark = linkMark;
    }
  }
  compileData() {
    super.compileData();
    this._activeLinkMark?.compileData();
  }

  _initLinkMarkStyle() {
    super._initLinkMarkStyle();
    // (this._activeLinkMark as any).setGlyphConfig({
    //   direction: this.direction
    // });
    this._activeLinkMark.setAttribute('direction', this.direction);

    this.setMarkStyle<ILinkPathMarkSpec>(
      this._activeLinkMark,
      {
        x0: (datum: Datum) => datum.x0,
        x1: (datum: Datum) => datum.x1,
        y0: (datum: Datum) => datum.y0,
        y1: (datum: Datum) => datum.y1,
        thickness: (datum: Datum) => datum.thickness
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );

    this.setMarkStyle(
      this._activeLinkMark,
      {
        fill: this._fillActiveLink
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.User_Mark
    );
  }

  _initNodeMarkStyle() {
    super._initNodeMarkStyle();
    if (this._spec.compareNodeColor) {
      this.setMarkStyle<IRectMarkSpec>(
        this._nodeMark,
        {
          fill: this._fillCompareNode
        },
        'normal',
        AttributeLevel.User_Mark
      );
    }
  }

  private activeLinkDataUpdate() {
    this._activeLinkMark.getData().updateData();
  }

  protected _fillCompareNode = (datum: Datum) => {
    if (this._spec.compareNodeColor?.[datum.type]) {
      return this._spec.compareNodeColor[datum.type];
    }
    return this._spec.node.style?.fill ?? this._fillByNode(datum);
  };

  protected _fillActiveLink = (datum: Datum) => {
    if (this._spec.compareLinkColor?.[datum.type]) {
      return this._spec.compareLinkColor[datum.type];
    }
    return this._spec.link.style?.fill ?? this._fillByLink(datum);
  };

  protected _handleNodeRelatedClick(element: IElement, highlightState: string, blurState: string) {
    const nodeDatum = element.getDatum();
    // 节点
    const allNodeElements = this._nodeMark.getProductElements();
    if (!allNodeElements || !allNodeElements.length) {
      return;
    }
    // 边
    const allLinkElements = this._linkMark.getProductElements();
    if (!allLinkElements || !allLinkElements.length) {
      return;
    }

    // 原始 link 全部进入blur状态
    allLinkElements.forEach(el => {
      el.removeState([STATE_VALUE_ENUM.STATE_SANKEY_EMPHASIS]);
    });
    this._highLightElements(allLinkElements, [], highlightState, blurState);

    const nodeDatums = allNodeElements.map(el => getDatumOfGraphic(el) as Datum);
    const pickNodeDatums = nodeDatums.filter(d => d.key === nodeDatum.key);
    // 层级型数据
    const highlightLinksData: any[] = [];
    // 高亮节点key
    const highlightNodeKeys: (string | number)[] = pickNodeDatums.map(d => d.key);

    // 上游路径始终只选取第一个
    this._activeTargetLink(
      nodeDatum,
      pickNodeDatums,
      allNodeElements,
      allLinkElements,
      highlightNodeKeys,
      highlightLinksData,
      highlightState,
      blurState
    );
    this._activeSourceLink(
      nodeDatum,
      pickNodeDatums,
      nodeDatums,
      allNodeElements,
      highlightNodeKeys,
      highlightLinksData,
      highlightState,
      blurState
    );
    this._highLightElements(allNodeElements, highlightNodeKeys as string[], highlightState, blurState);
    this._activeLinkData.parseNewData(highlightLinksData);

    this._needClear = true;
  }

  private _activeTargetLink(
    nodeDatum: Datum,
    pickNodeDatums: Datum[],
    allNodeElements: any[],
    allLinkElements: any[],
    highlightNodeKeys: (string | number)[],
    highlightLinksData: any[],
    highlightState: string,
    blurState: string
  ) {
    this._handleClearEmpty(highlightState, blurState);
    const sourceNode = nodeDatum.sourceNode;
    // 上游路径始终只选取第一个
    const firstTarget = sourceNode.targetLinks[0];
    if (!firstTarget) {
      return;
    }
    let percent = 0;
    pickNodeDatums.forEach(n => {
      const link = n.targetLinks.find((l: any) => l.key === firstTarget.key);
      if (link) {
        const p = link.value / firstTarget.value;
        const key = firstTarget.key + '_' + n.type;
        const activeLink = {
          ...firstTarget,
          // 起点重新分配
          y0: firstTarget.y0 - firstTarget.thickness / 2 + (percent + p / 2) * firstTarget.thickness,
          y1: n.y0 + (p * firstTarget.thickness) / 2,
          thickness: p * firstTarget.thickness,
          key,
          type: n.type,
          [DEFAULT_DATA_INDEX]: highlightLinksData.length,
          [DEFAULT_DATA_KEY]: key
        };
        highlightLinksData.push(activeLink);
        percent += p;
      }
    });

    // 第一个 path 中上流路径上的 node 全部高亮
    highlightNodeKeys.push(...firstTarget.parents, nodeDatum.key);
    const linkKeys: string[] = [];
    // 找到对应的原始 link 也都高亮
    for (let i = 0; i < firstTarget.parents.length - 1; i++) {
      linkKeys.push(firstTarget.parents[i] + '-' + firstTarget.parents[i + 1]);
    }
    this._highLightElements(allLinkElements, linkKeys, highlightState, blurState);
  }

  private _activeSourceLink(
    nodeDatum: Datum,
    pickNodeDatums: Datum[],
    allNodeDatums: Datum[],
    allNodeElements: any[],
    highlightNodeKeys: (string | number)[],
    highlightLinksData: any[],
    highlightState: string,
    blurState: string
  ) {
    this._handleClearEmpty(highlightState, blurState);
    const sourceNode = nodeDatum.sourceNode;
    // 下游路径始需要全部处理
    const sourceLinks = sourceNode.sourceLinks;
    if (!sourceLinks?.length) {
      return;
    }

    const sourceValueTemp: { [key: string]: number } = {};
    sourceLinks.forEach((sourceLink: SankeyLinkElement) => {
      highlightNodeKeys.push(sourceLink.target);
      pickNodeDatums.forEach((n, index) => {
        sourceValueTemp[n.type] = sourceValueTemp[n.type] ?? 0;
        const link = n.sourceLinks.find((l: SankeyLinkElement) => l.key === sourceLink.key);
        if (link) {
          const p = link.value / n.value;
          const totalSize = n.y1 - n.y0;
          const size = totalSize * p;
          const key = sourceLink.key + '_' + n.type;
          const activeLink = {
            ...sourceLink,
            // 起点重新分配
            y0: n.y0 + sourceValueTemp[n.type] * totalSize + size / 2,
            thickness: size,
            key,
            type: n.type,
            [DEFAULT_DATA_INDEX]: highlightLinksData.length,
            [DEFAULT_DATA_KEY]: key
          };
          // y1 分为第一个和在其他
          if (index === 0) {
            // 与原始link的起点
            activeLink.y1 = sourceLink.y1 - sourceLink.thickness / 2 + size / 2;
          } else {
            // 与目标子 node 的 y0 对齐
            const targetNode = allNodeDatums.find(_n => _n.key === link.target && _n.type === n.type);
            if (targetNode) {
              activeLink.y1 = targetNode.y0 + size / 2;
            } else {
              // 错误的情况
              return;
            }
          }
          highlightLinksData.push(activeLink);
          sourceValueTemp[n.type] += p;
        }
      });
    });
  }

  protected _handleClearEmpty(highlightState: string, blurState: string) {
    super._handleClearEmpty(highlightState, blurState);
    this._activeLinkData.parseNewData([]);

    // 同时需要清除 hover
    const allNodeElements = this._nodeMark.getProductElements();
    if (allNodeElements || !allNodeElements.length) {
      allNodeElements.forEach(el => {
        el.removeState(STATE_VALUE_ENUM.STATE_HOVER);
      });
    }

    // 同时需要清除 hover
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

export const registerCompareSankeyChart = (option?: { VChart?: typeof VChart }) => {
  const vchartConstructor = option?.VChart || VChart;
  if (vchartConstructor) {
    vchartConstructor.useChart([CompareSankeyChart]);
    vchartConstructor.useSeries([CompareSankeySeries]);
  }
};
