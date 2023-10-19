import type { IText, ITextGraphicAttribute } from '@visactor/vrender-core';
// eslint-disable-next-line no-duplicate-imports
import { createText } from '@visactor/vrender-core';
import { VRenderActor } from './base';
import { ActorType } from '../interface';

export class VRenderTextActor extends VRenderActor<IText, ITextGraphicAttribute> {
  type = ActorType.vrenderText;
  createFunc = createText;
}
