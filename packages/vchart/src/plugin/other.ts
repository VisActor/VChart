import {
  registerDirectionalLight,
  registerOrthoCamera,
  registerHtmlAttributePlugin,
  registerReactAttributePlugin,
  registerViewTransform3dPlugin
} from '@visactor/vrender-core';

import { registerAnimate as registerVRenderAnimate } from '@visactor/vrender-animate';
import { DragNDrop, Gesture } from '@visactor/vrender-kits';
import { Factory } from '../core/factory';
import { registerBuiltInAnimation } from '../animation/config';

export const register3DPlugin = () => {
  registerDirectionalLight();
  registerOrthoCamera();
  registerViewTransform3dPlugin();
};

export const registerAnimate = () => {
  registerVRenderAnimate();
  registerBuiltInAnimation();
};

export const registerDragPlugin = () => {
  Factory.registerStageEventPlugin('drag', DragNDrop);
};
export const registerGesturePlugin = () => {
  Factory.registerStageEventPlugin('gesture', Gesture);
};

export { registerReactAttributePlugin, registerHtmlAttributePlugin };
// export const registerMorph = registerViewMorphAPI;
