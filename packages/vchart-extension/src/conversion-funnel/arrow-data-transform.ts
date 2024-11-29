import { IPointLike, isValid, isValidNumber, maxInArray } from '@visactor/vutils';
import type { IConversionFunnelSpec, Arrow } from './interface';
import { isArrowCross, isSameArrow } from './util';

export interface ParsedArrow extends Arrow {
  position: 'left' | 'right';
  distance: number;
  /** 层级跨度 */
  span: number;
  layout: {
    isLayout: boolean;
    duplicateNode: ParsedArrow | null;
    fromIndex: number;
    toIndex: number;
    fromTotal: number;
    toTotal: number;
    level: number;
    points: IPointLike[];
  };
  context: {
    field: string;
  };
  id: string;
}

export const conversionArrowTransform = (
  arrowSpec: IConversionFunnelSpec['conversionArrow'],
  options: {
    categoryField: string;
  }
) => {
  if (!arrowSpec || !arrowSpec.arrows?.length) {
    return [];
  }
  const { arrows } = arrowSpec;

  const parsedArrows = parseArrow(arrows, options.categoryField);
  const leftArrows = parsedArrows.filter(arrow => arrow.position === 'left');
  const rightArrows = parsedArrows.filter(arrow => arrow.position === 'right');

  const left = computeArrows(leftArrows) ?? [];
  const right = computeArrows(rightArrows) ?? [];
  return [...left, ...right];
};

function parseArrow(arrows: Arrow[], categoryField: string): ParsedArrow[] {
  return arrows
    .filter(arrow => isValidNumber(arrow.from * arrow.to))
    .map((arrow, index) => {
      const { from, to } = arrow;
      return {
        ...arrow,
        position: arrow.position || 'right',
        distance: arrow.distance || 40,
        from: Math.min(from, to),
        to: Math.max(from, to),
        span: Math.abs(from - to),
        isLayout: false,
        context: {
          field: categoryField
        },
        layout: {
          level: 0
        },
        id: `${from}-${to}-${index}`
      } as unknown as ParsedArrow;
    });
}

function computeArrows(arrows: ParsedArrow[]) {
  if (arrows?.length === 0) {
    return null;
  }

  const nodeDegreeMap = new Map<
    number,
    {
      fromNodes: ParsedArrow[];
      toNodes: ParsedArrow[];
      nodes: ParsedArrow[];
      degree: number;
    }
  >();

  arrows.forEach(arrow => {
    const fromNodeDegree = nodeDegreeMap.get(arrow.from);
    if (isValid(fromNodeDegree)) {
      const firstNodeWidthSameFromTo = fromNodeDegree.fromNodes.find(node => isSameArrow(node, arrow));
      if (!firstNodeWidthSameFromTo) {
        fromNodeDegree.degree += 1;
      } else {
        arrow.layout.duplicateNode = firstNodeWidthSameFromTo;
      }
      fromNodeDegree.fromNodes.push(arrow);
    } else {
      nodeDegreeMap.set(arrow.from, {
        fromNodes: [arrow],
        toNodes: [],
        nodes: [],
        degree: 1
      });
    }

    const toNodeDegree = nodeDegreeMap.get(arrow.to);
    if (isValid(toNodeDegree)) {
      const firstNodeWidthSameFromTo = toNodeDegree.toNodes.find(node => isSameArrow(node, arrow));
      if (!firstNodeWidthSameFromTo) {
        toNodeDegree.degree += 1;
      } else {
        arrow.layout.duplicateNode = firstNodeWidthSameFromTo;
      }
      toNodeDegree.toNodes.push(arrow);
    } else {
      nodeDegreeMap.set(arrow.to, {
        toNodes: [arrow],
        fromNodes: [],
        nodes: [],
        degree: 1
      });
    }
  });
  nodeDegreeMap.forEach(node => {
    // 入边，层级跨度越大的越靠下
    node.fromNodes.sort((a, b) => b.span - a.span);
    // 出边，层级跨度越大的越靠上
    node.toNodes.sort((a, b) => a.span - b.span);
    // 入边在上，出边在下
    node.nodes = [...node.toNodes, ...node.fromNodes];
  });

  arrows
    .sort((a, b) => a.span - b.span)
    .forEach(arrow => {
      let level = 0;
      const arrowsIsLayout = arrows.filter(arrow => arrow.layout.isLayout);
      // 1. 获取当前箭头所在层级
      const maxLevelArrow = maxInArray(arrowsIsLayout, (cur, curMax) => cur.layout.level - curMax.layout.level);

      if (maxLevelArrow && isArrowCross(arrow, maxLevelArrow)) {
        level = maxLevelArrow.layout.level + 1;
      }
      arrow.layout.level = level;

      // 2. 计算 from 和 to 的顺序
      const duplicateNode = arrow.layout.duplicateNode;
      if (duplicateNode) {
        arrow.layout.fromIndex = duplicateNode.layout.fromIndex;
        arrow.layout.toIndex = duplicateNode.layout.toIndex;
      } else {
        arrow.layout.fromIndex = nodeDegreeMap.get(arrow.from).nodes.findIndex(node => node === arrow);
        arrow.layout.toIndex = nodeDegreeMap.get(arrow.to).nodes.findIndex(node => node === arrow);
      }

      arrow.layout.fromTotal = nodeDegreeMap.get(arrow.from).degree;
      arrow.layout.toTotal = nodeDegreeMap.get(arrow.to).degree;

      arrow.layout.isLayout = true;
    });

  return arrows;
}
