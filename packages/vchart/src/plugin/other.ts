import { registerHtmlAttributePlugin, registerReactAttributePlugin } from '@visactor/vrender-core';

import { registerAnimate as registerVRenderAnimate } from '@visactor/vrender-animate';
import { DragNDrop, Gesture } from '@visactor/vrender-kits';
import { Factory } from '../core/factory';
import { registerBuiltInAnimation, registerDisappearAnimation } from '../animation/config';

export const registerAnimate = () => {
  registerVRenderAnimate();
  registerBuiltInAnimation();
  registerDisappearAnimation();
};

export const registerDragPlugin = () => {
  Factory.registerStageEventPlugin('drag', DragNDrop);
};
export const registerGesturePlugin = () => {
  Factory.registerStageEventPlugin('gesture', Gesture);
};

export { registerReactAttributePlugin, registerHtmlAttributePlugin };
// export const registerMorph = registerViewMorphAPI;
