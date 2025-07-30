import type { DataView } from '@visactor/vdataset';
import { field, isFunction } from '@visactor/vutils';
import { computeNodeValues, computeHierarchicNodeLinks } from '@visactor/vlayouts/es/sankey/hierarchy';
import type { SankeyNodeElement } from '@visactor/vlayouts/es/sankey/interface';

export interface ICompareSankeyLayoutOpt {
  rawData: () => DataView;
  nodeKey: string;
  subNodeGap: number;
}

export const compareSankeySubData = (data: Array<DataView>, opt: ICompareSankeyLayoutOpt) => {
  const viewData = data[0] as DataView;
  if (!viewData.latestData?.length) {
    return {};
  }
  // 读取参数
  const rawDataTree = opt.rawData().latestData[0];
  const subNodeGap = opt.subNodeGap;
  const keyFunc = isFunction(opt.nodeKey) ? opt.nodeKey : opt.nodeKey ? field(opt.nodeKey as string) : null;

  const subNodeMap: { [key: string]: any } = {};
  rawDataTree.subNode.forEach((sunGroup: any) => {
    subNodeMap[sunGroup.type] = computeHierarchicNodeLinks(sunGroup.nodes, keyFunc);
    computeNodeValues(subNodeMap[sunGroup.type].nodes);
  });
  const subCount = Object.keys(subNodeMap).length;

  const subNodes: any[] = [];
  viewData.latestData[0].nodes.forEach((n: SankeyNodeElement) => {
    let path: (string | number)[] = [];
    if (n.targetLinks.length) {
      const link = n.targetLinks[0];
      path = [...link.parents];
    }
    path.push(n.key);
    // 根据path获取sub的节点
    // 当前已使用比例
    let currentY = n.y0;
    const totalSize = n.y1 - n.y0 - (subCount - 1) * subNodeGap;
    const totalValue = n.value;
    rawDataTree.subNode.forEach((sunGroup: any) => {
      const subNode = (subNodeMap[sunGroup.type].nodes as SankeyNodeElement[]).find(subN => subN.key === n.key);
      if (!subNode) {
        return;
      }
      const percent = subNode.value / totalValue;
      subNode.x0 = n.x0;
      subNode.x1 = n.x1;
      subNode.y0 = currentY;
      subNode.y1 = currentY + totalSize * percent;
      // @ts-ignore
      subNode.type = sunGroup.type;
      // @ts-ignore
      subNode.sourceNode = n;
      currentY += totalSize * percent + subNodeGap;
      subNodes.push(subNode);
    });
  });
  return subNodeMap;
};
