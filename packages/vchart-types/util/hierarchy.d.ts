export declare const findHierarchyNode: <T>(
  hierarchyData: T[],
  key: string,
  keyField?: string,
  childrenField?: string
) => T;
export declare const findHierarchyNodeParent: <T>(
  hierarchyData: T[],
  key: string,
  keyField?: string,
  childrenField?: string
) => T;
export declare const findHierarchyPath: <T>(
  hierarchyData: T[],
  key: string,
  keyField?: string,
  childrenField?: string
) => string[];
