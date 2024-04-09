import { IGraphic, IGroup } from '@visactor/vrender-core';

export function forEachGraphicItem(group: IGraphic, cb: (node: IGraphic) => boolean | void) {
  if (!group) {
    return;
  }

  group.forEachChildren(node => {
    const stopped = cb(node as IGraphic);
    if ((node as IGroup).isContainer && !stopped) {
      forEachGraphicItem(node as IGraphic, cb);
    }
  });
}
