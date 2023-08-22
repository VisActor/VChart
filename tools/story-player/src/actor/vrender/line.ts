import type { ILine, ILineGraphicAttribute } from '@visactor/vrender';
// eslint-disable-next-line no-duplicate-imports
import { createLine } from '@visactor/vrender';
import { VRenderActor } from './base';
import { ActorType } from '../interface';

export class VRenderLineActor extends VRenderActor<ILine, ILineGraphicAttribute> {
  type = ActorType.vrenderLine;
  createFunc = createLine;
}
