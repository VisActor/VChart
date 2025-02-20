import type { IGroupMark, IMark, IMarkRaw } from '../mark/interface';
import { MarkTypeEnum } from '../mark/interface';
import type { RenderMode } from '../typings/spec';
// eslint-disable-next-line no-duplicate-imports
import { RenderModeEnum } from '../typings/spec/common';
import type { ICompilableMark } from './mark';

// TODO: feishu => lark
export function toRenderMode(mode: RenderMode): any {
  switch (mode) {
    case RenderModeEnum['desktop-browser']:
    case RenderModeEnum['mobile-browser']:
      return 'browser';
    case RenderModeEnum.node:
    case RenderModeEnum.worker:
      return 'node';
    case RenderModeEnum.miniApp:
    case RenderModeEnum['desktop-miniApp']:
      return 'feishu';
    case RenderModeEnum.lynx:
      return 'lynx';
    case RenderModeEnum.wx:
      return 'wx';
    case RenderModeEnum.tt:
      return 'tt';
    case RenderModeEnum.harmony:
      return 'harmony';
  }
  return 'browser';
}

export function hasCommited(group: IMark) {
  if (group.type === MarkTypeEnum.group) {
    if (group.isCommited()) {
      return true;
    }

    return (group as IGroupMark).getMarks().some(hasCommited);
  }

  return group.isCommited();
}

export function traverseRemove(group: IMark, m: IMark) {
  if (group.type === MarkTypeEnum.group) {
    if ((group as IGroupMark).removeMark(m)) {
      return true;
    }

    const subMarks = (group as IGroupMark).getMarks();

    for (let i = 0; i < subMarks.length; i++) {
      if (traverseRemove(subMarks[i], m)) {
        return true;
      }
    }
  }

  return false;
}
