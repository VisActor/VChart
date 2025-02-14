import {
  registerDirectionalLight,
  registerOrthoCamera,
  registerHtmlAttributePlugin,
  registerReactAttributePlugin,
  registerViewTransform3dPlugin
} from '@visactor/vrender-core';

import { registerViewMorphAPI, registerAnimate as registerAnimateAPI } from '@visactor/vgrammar-core';
import { registerVGrammarCommonAnimation } from '../animation/config';
import { Factory } from '../core';
import { DragNDrop, Gesture } from '@visactor/vrender-kits';

export const register3DPlugin = () => {
  registerDirectionalLight();
  registerOrthoCamera();
  registerViewTransform3dPlugin();
};

export const registerAnimate = () => {
  registerAnimateAPI();
  registerVGrammarCommonAnimation();
};

export const registerDragPlugin = () => {
  Factory.registerStageEventPlugin('drag', DragNDrop);
};
export const registerGesturePlugin = () => {
  Factory.registerStageEventPlugin('gesture', Gesture);
};

export { registerReactAttributePlugin, registerHtmlAttributePlugin };
export const registerMorph = registerViewMorphAPI;
