import type { IGraphicAttribute } from '@visactor/vrender';
import type { IActorConfig } from '../interface';

export interface IVRenderActorConfig<A extends Partial<IGraphicAttribute>> extends IActorConfig {
  defaultAttribute: A;
}
