import { SIGNAL_HEIGHT, SIGNAL_WIDTH } from '@visactor/vgrammar-core';
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
  }
  return 'browser';
}

export function viewResizeSync(view: any, width: number, height: number, render?: boolean) {
  let needDataflow = false;

  // width value changed: update signal, skip resize op
  if (width !== view.width()) {
    needDataflow = true;
    view.updateSignal(SIGNAL_WIDTH, width);
  }

  // height value changed: update signal, skip resize op
  if (height !== view.height()) {
    needDataflow = true;
    view.updateSignal(SIGNAL_HEIGHT, height);
  }

  // run dataflow on width/height signal change
  if (needDataflow) {
    if (render) {
      view.evaluateSync();
    } else {
      view._dataflow.evaluateSync();
    }
  }
}
