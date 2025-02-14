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

export function hasCommited(group: ICompilableMark) {
  if (group.type === MarkTypeEnum.group) {
    if (group.isCommited()) {
      return true;
    }

    return group.getMarks().some(hasCommited);
  }

  return group.isCommited();
}
