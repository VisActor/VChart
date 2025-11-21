import { Datum, IElement } from '@visactor/vgrammar-core';

// 遍历树，桑基图节点通过 callback  返回到调用方
export const traverseTree = (subTree: any[], callback: (node: any) => void) => {
  subTree.forEach(node => {
    callback(node);
    if (node.children && node.children.length) {
      traverseTree(node.children, callback);
    }
  });
};

/**
 * 通过节点获取链接节点
 * 规则如下
 * 1. 节点有 children 时，链接节点为 children 中第一个节点
 * 2. 节点无 children 时，链接节点为父节点
 */
// export const getLinkNodeInFSAT = (
//   node: any,
//   allNodeElements: IElement[],
//   allLinkElements: IElement[],
//   viewData: DataView
// ) => {
//   return {
//     nodeKey: [],
//     linkKey: []
//   } as { nodeKey: string[]; linkKey: string[] };
// };

/**
 * 获取符合条件的子节点元素
 */
export function getSubNodeDatum(allNodeElements: IElement[], filter: (n: any) => boolean) {
  return allNodeElements.filter((n: any) => filter(n.data[0]));
}

/**
 * 在原始树结构中查找符合条件的节点
 */
export function getNodeDatumInTree(nodes: any[], filter: (n: any) => boolean) {
  const result: any[] = [];
  nodes.forEach((node: any) => {
    traverseTree([node], (node: any) => {
      if (filter(node)) {
        result.push(node);
      }
    });
  });
  return result;
}

export function getNodeDatumInSubTree(subNodes: any[], filter: (n: any) => boolean) {
  const list: {
    type: string;
    datum: Datum[];
    [key: string]: any;
  }[] = [];
  subNodes.forEach((subNode: any) => {
    const { nodes, ...result } = subNode;
    result.datum = [];
    nodes.forEach((node: any) => {
      if (filter(node)) {
        result.datum.push(node);
      }
    });
    list.push(result);
  });
  return list;
}
