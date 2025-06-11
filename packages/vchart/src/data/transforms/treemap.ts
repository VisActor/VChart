import type { TreemapNodeElement, TreemapOptions } from '@visactor/vlayouts';
import { flattenNodes, TreemapLayout } from '@visactor/vlayouts';
import { DEFAULT_HIERARCHY_ROOT } from '../../constant/hierarchy';

export const treemapLayout = (
  data: Array<any>,
  op: TreemapOptions & {
    getViewBox: () => {
      x0: number;
      x1: number;
      y0: number;
      y1: number;
    };
    nameField: string;
  }
) => {
  const viewBox = op.getViewBox();

  if (viewBox) {
    const layout = new TreemapLayout(op);
    const res = layout.layout(data, op.getViewBox());

    const nodes: TreemapNodeElement[] = [];
    flattenNodes(res, nodes, { maxDepth: op?.maxDepth });

    nodes.forEach((datum, i) => {
      if (datum) {
        [DEFAULT_HIERARCHY_ROOT, 'name'].forEach(key => {
          (datum as any)[key] = (datum as any).datum[datum.depth][op.nameField];
        });
      }
    });

    return nodes;
  }

  return [];
};
