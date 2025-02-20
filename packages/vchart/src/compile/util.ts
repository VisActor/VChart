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

export function traverseGroupMark<T>(
  group: IMark,
  apply: (mark: IMark) => T,
  filter?: (mark: IMark) => boolean,
  leafFirst?: boolean,
  stop?: boolean
): T | undefined {
  const traverse = (mark: IMark): T | undefined => {
    if (!leafFirst) {
      if (mark && (!filter || filter(mark))) {
        const res = apply.call(null, mark);

        if (stop && res) {
          return res;
        }
      }
    }

    if (mark.type === MarkTypeEnum.group) {
      const children: IMark[] = (mark as IGroupMark).getMarks();

      if (children) {
        for (let i = 0; i < children.length; i++) {
          const res = traverse(children[i]);

          if (res && stop) {
            return res;
          }
        }
      }
    }

    if (leafFirst) {
      if (mark && (!filter || filter(mark))) {
        const res = apply.call(null, mark);

        if (res && stop) {
          return res;
        }
      }
    }

    return undefined;
  };

  return traverse(group);
}
