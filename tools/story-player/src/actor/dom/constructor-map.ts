import type { ActorConstructorMap } from '../interface';
import { ActorType } from '../interface';
import { DomDivActor } from './div';
import { DomImgActor } from './img';

export const domActorConstructorMap: ActorConstructorMap = {
  [ActorType.domDiv]: DomDivActor,
  [ActorType.domImg]: DomImgActor,
};
