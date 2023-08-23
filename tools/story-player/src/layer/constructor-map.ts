import { CanvasLayer } from './canvas-layer';
import { DomLayer } from './dom-layer';
import type { LayerConstructorMap } from './interface';
import { LayerType } from './interface';
import { VRenderLayer } from './vrender-layer';

export const layerConstructorMap: LayerConstructorMap = {
  [LayerType.canvas]: CanvasLayer,
  [LayerType.dom]: DomLayer,
  [LayerType.vrender]: VRenderLayer,
};
