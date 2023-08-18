import type { ActorConstructorMap } from '../interface';
import { ActorType } from '../interface';
import { VChartActor } from './vchart';

export const vchartActorConstructorMap: ActorConstructorMap = {
  [ActorType.vchart]: VChartActor,
};
