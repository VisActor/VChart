import type { IGraphic, IGroup, INode } from '@visactor/vrender-core';
import type { IEditorLayer, IElementPath, IElementPathEnd } from './../core/interface';
import { transformPointWithMatrix } from './space';
import type { IPoint } from '../typings/space';
export function getElementPath(node: INode, finish: INode, endPath: IElementPathEnd): IElementPath {
  let result: IElementPath | IElementPathEnd = endPath;
  let parent: INode = node.parent as IGroup;
  while (node !== finish) {
    let index: number = 0;
    // eslint-disable-next-line no-loop-func
    (<IGroup>parent).forEachChildren((n, i) => {
      if (n === node) {
        index = i;
        return true;
      }
      return false;
    });
    result = {
      index,
      child: result
    };
    node = parent;
    parent = node.parent;
  }
  return result as IElementPath;
}

export function getPosInClient({ percentX, percentY }: { percentX: number; percentY: number }, node: IGraphic) {
  return transformPointWithMatrix(node.globalTransMatrix, {
    x: (node.AABBBounds.x2 - node.AABBBounds.x1) * percentX,
    y: (node.AABBBounds.y2 - node.AABBBounds.y1) * percentY
  });
}

export function getEndPathWithNode(pos: IPoint, node: IGraphic) {
  const inverse = node.globalTransMatrix.getInverse();
  const { x: nodePosX, y: nodePosY } = transformPointWithMatrix(inverse, pos);
  return {
    percentX: nodePosX / node.AABBBounds.width(),
    percentY: nodePosY / node.AABBBounds.height()
  };
}

export function addRectToPathElement(node: IGraphic) {
  const bounds = node.AABBBounds;
  const rect = {
    x: bounds.x1,
    y: bounds.y1,
    width: bounds.width(),
    height: bounds.height()
  };
  const finalRectPos = transformPointWithMatrix(
    node.layer.globalTransMatrix.getInverse(),
    transformPointWithMatrix(node.parent.globalTransMatrix, rect)
  );
  rect.x = finalRectPos.x;
  rect.y = finalRectPos.y;
  return rect;
}
