import type { IGroup, IGraphic } from '@visactor/vrender-core';

export const flickerEffect = (group: IGroup) => {
  if (!group || group.childrenCount === 0) {
    return;
  }
  // TODO:
  // 1. 支持闪烁快慢，即 duration
  // 2. 支持闪烁次数
  group.forEachChildren(child => {
    // FIXME: loop 次数不正确
    (child as IGraphic).animate().to({ opacity: 0 }, 120, 'linear').to({ opacity: 1 }, 120, 'linear').loop(1);
  });
};
