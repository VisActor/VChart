import {
  registerDirectionalLight,
  registerOrthoCamera,
  registerHtmlAttributePlugin,
  registerReactAttributePlugin,
  registerViewTransform3dPlugin
} from '@visactor/vrender-core';

import {
  registerViewMorphAPI,
  registerAnimate as registerAnimateAPI,
  registerDragPlugin,
  registerGesturePlugin
} from '@visactor/vgrammar-core';
import { registerVGrammarCommonAnimation } from '../animation/config';

export const register3DPlugin = () => {
  registerDirectionalLight();
  registerOrthoCamera();
  registerViewTransform3dPlugin();
};

export const registerAnimate = () => {
  registerAnimateAPI();
  registerVGrammarCommonAnimation();
};

export { registerReactAttributePlugin, registerHtmlAttributePlugin, registerDragPlugin, registerGesturePlugin };
export const registerMorph = registerViewMorphAPI;
