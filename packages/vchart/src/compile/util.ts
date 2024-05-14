import type { RenderMode } from '../typings/spec';
// eslint-disable-next-line no-duplicate-imports
import { RenderModeEnum } from '../typings/spec/common';

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
  }
  return 'browser';
}
