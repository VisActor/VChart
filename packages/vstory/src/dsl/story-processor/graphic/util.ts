import type { IElement } from '../../../story/element';

export function getElementGraphic(element: IElement) {
  // TODO: 需要 element 提供接口
  return [(element as any).graphic._graphic, (element as any).text._graphic];
}
