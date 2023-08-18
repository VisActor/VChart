import type { ILine, ILineGraphicAttribute } from '@visactor/vrender';
import { createLine } from '@visactor/vrender';
import { VRenderActor } from './base';
import { ActorType } from '../interface';

export class VRenderLineActor extends VRenderActor<ILine, ILineGraphicAttribute> {
  type = ActorType.vrenderLine;
  createFunc = createLine;
}
