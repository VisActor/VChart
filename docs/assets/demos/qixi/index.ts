import type { BaseActor, BaseLayer, Page } from '@visactor/story-player';
// eslint-disable-next-line no-duplicate-imports
import { Player } from '@visactor/story-player';
import { createActions } from './pages';
import { createPages } from './pages/page';
import { createLayers } from './layer';
import { createActors } from './pages/actor';
import { OriginalData } from './data/interface';

export const CONTAINER_WIDTH = 1080;
export const CONTAINER_HEIGHT = 1920;

export const initPlayer = (parentEl: HTMLElement, data: OriginalData) => {
  const player = new Player(
    {},
    {
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
      parentEl
    }
  );

  const pageMap: Record<string, Page> = {};
  const layerMap: Record<string, BaseLayer> = {};
  const actorMap: Record<string, BaseActor> = {};

  createPages(player, pageMap, data);
  createLayers(player, layerMap);
  createActors(player, actorMap, data);
  createActions(player, layerMap, pageMap, actorMap, data);

  return player;
};
