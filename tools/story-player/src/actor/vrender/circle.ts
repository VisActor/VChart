import type { ICircle, ICircleGraphicAttribute } from '@visactor/vrender';
// eslint-disable-next-line no-duplicate-imports
import { createCircle } from '@visactor/vrender';
import { VRenderActor } from './base';
import { ActorType } from '../interface';

export class VRenderCircleActor extends VRenderActor<ICircle, ICircleGraphicAttribute> {
  type = ActorType.vrenderCircle;
  createFunc = createCircle;
}
