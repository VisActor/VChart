import type { DataView } from '@visactor/vdataset';
import { field, isFunction, isNil, pickWithout, toValidNumber } from '@visactor/vutils';
import { HierarchyNodeDatum, SankeyLinkDatum, SankeyLinkElement, SankeyNodeElement } from '@visactor/vgrammar-sankey';

export interface ICompareSankeyLayoutOpt {
  rawData: () => DataView;
  nodeKey: string;
  subNodeGap: number;
}

export const calculateNodeValue = (subTree: HierarchyNodeDatum[]) => {
  let sum = 0;
  subTree.forEach(node => {
    if (isNil(node.value)) {
      if (node.children?.length) {
        node.value = calculateNodeValue(node.children);
      } else {
        node.value = 0;
      }
    }

    sum += Math.abs(node.value);
  });

  return sum;
};

export function makeHierarchicNodes(
  originalNodes: HierarchyNodeDatum[],
  nodeKeyFunc: (node: HierarchyNodeDatum) => string,
  nodes: SankeyNodeElement[] = [],
  nodeMap: Record<string | number, SankeyNodeElement> = {},
  originalLinks?: (SankeyLinkDatum & { parents?: SankeyNodeElement[] })[]
) {
  calculateNodeValue(originalNodes);

  const doSubTree = (subTree: HierarchyNodeDatum[], depth: number, parents?: SankeyNodeElement[]) => {
    subTree.forEach((node, index) => {
      const nodeKey = nodeKeyFunc
        ? nodeKeyFunc(node)
        : parents
        ? `${parents[parents.length - 1].key}-${index}`
        : `${depth}-${index}`;
      const nodeValue: number = (isNil(node.value) ? 0 : toValidNumber(node.value)) as number;

      if (nodeMap[nodeKey]) {
        nodeMap[nodeKey].value = undefined;
      } else {
        const nodeElement: SankeyNodeElement = {
          depth,
          datum: node,
          index: index,
          key: nodeKey,
          value: nodeValue,
          sourceLinks: [] as SankeyLinkElement[],
          targetLinks: [] as SankeyLinkElement[]
        };

        nodeMap[nodeKey] = nodeElement;
        nodes.push(nodeElement);
      }
      if (parents && originalLinks) {
        originalLinks.push({
          source: parents[parents.length - 1].key,
          target: nodeKey,
          value: nodeValue,
          parents
        });
      }

      if (node.children && node.children.length) {
        doSubTree(node.children, depth + 1, parents ? parents.concat([nodeMap[nodeKey]]) : [nodeMap[nodeKey]]);
      }
    });
  };

  doSubTree(originalNodes, 0, null);
  return nodes;
}

export function computeHierarchicNodeLinks(
  originalNodes: HierarchyNodeDatum[],
  nodeKeyFunc: (node: HierarchyNodeDatum) => string
) {
  const nodes: SankeyNodeElement[] = [];
  const links: SankeyLinkElement[] = [];
  const nodeMap: Record<string | number, SankeyNodeElement> = {};
  const linkMap: Record<string | number, SankeyLinkElement> = {};
  const originalLinks: (SankeyLinkDatum & { parents?: SankeyNodeElement[] })[] = [];

  makeHierarchicNodes(originalNodes, nodeKeyFunc, nodes, nodeMap, originalLinks);

  originalLinks.forEach((link, index) => {
    const key = `${link.source}-${link.target}`;
    const linkDatum = pickWithout(link, ['parents']);

    (linkDatum as any).parents = link.parents.map(node => {
      return pickWithout(node, ['sourceLinks', 'targetLinks']);
    });

    if (linkMap[key]) {
      linkMap[key].value += toValidNumber(link.value);

      (linkMap[key].datum as SankeyLinkDatum[]).push(linkDatum as SankeyLinkDatum);

      return;
    }
    const linkElement = {
      index,
      key: `${link.source}-${link.target}`,
      source: link.source,
      target: link.target,
      datum: [linkDatum] as any,
      value: link.value,
      parents: link.parents.map(parent => parent.key)
    };

    links.push(linkElement);
    nodeMap[link.source].sourceLinks.push(linkElement);
    nodeMap[link.target].targetLinks.push(linkElement);
    linkMap[key] = linkElement;
  });

  return { nodes, links, nodeMap };
}

export function computeNodeValues(nodes: SankeyNodeElement[]) {
  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i];

    node.value = Math.max(
      isNil(node.value) ? 0 : toValidNumber(node.value),
      node.sourceLinks.reduce((sum, link: SankeyLinkElement) => {
        return sum + (toValidNumber(link.value) ?? 0);
      }, 0),
      node.targetLinks.reduce((sum, link: SankeyLinkElement) => {
        return sum + (toValidNumber(link.value) ?? 0);
      }, 0)
    );
  }
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
