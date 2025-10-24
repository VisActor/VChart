// 遍历树，桑基图节点通过 callback  返回到调用方
export const traverseTree = (subTree: any[], callback: (node: any) => void) => {
  subTree.forEach(node => {
    callback(node);
    if (node.children && node.children.length) {
      traverseTree(node.children, callback);
    }
  });
};
