/**
 * 根据Key, 找到对应节点
 * @param hierarchyData
 * @param key
 * @param keyField
 * @param childrenField
 * @returns
 */
export const findHierarchyNode = <T>(
  hierarchyData: T[],
  key: string,
  keyField = 'key',
  childrenField = 'children'
): T | null => {
  for (let i = 0; i < hierarchyData.length; i++) {
    const node = hierarchyData[i];
    if (node[keyField] === key) {
      return node;
    }
    if (node[childrenField]) {
      const result = findHierarchyNode<T>(node[childrenField], key, keyField, childrenField);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

/**
 * 根据key, 找到对应节点的父节点
 * @param hierarchyData
 * @param key
 * @param keyField
 * @param childrenField
 * @returns
 */
export const findHierarchyNodeParent = <T>(
  hierarchyData: T[],
  key: string,
  keyField = 'key',
  childrenField = 'children'
): T | null => {
  for (let i = 0; i < hierarchyData.length; i++) {
    const node = hierarchyData[i];
    if (node[childrenField]) {
      for (let j = 0; j < node[childrenField].length; j++) {
        const childNode = node[childrenField][j];
        if (childNode[keyField] === key) {
          return node;
        }
        const result = findHierarchyNodeParent<T>([childNode], key, keyField, childrenField);
        if (result) {
          return result;
        }
      }
    }
  }
  return null;
};

/**
 * 回溯遍历多叉树, 找到给定key的路径.
 * @param hierarchyData
 * @param key
 * @param keyField
 * @param childrenField
 * @returns
 */
export const findHierarchyPath = <T>(
  hierarchyData: T[],
  key: string,
  keyField = 'key',
  childrenField = 'children'
): string[] => {
  const result: string[] = [];
  const dfs = (data: T[], path: string[]): boolean => {
    for (const item of data) {
      if (item[keyField] === key) {
        result.push(...path, item[keyField].toString());
        return true;
      }

      if (item[childrenField]) {
        const res = dfs(item[childrenField], [...path, item[keyField]]);
        if (res === true) {
          return res;
        }
      }
    }
    return false;
  };
  dfs(hierarchyData, []);
  return result;
};
