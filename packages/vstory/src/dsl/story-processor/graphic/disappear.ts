import type { IRole } from '../../../story/role';
import type { IText } from '@visactor/vrender-core';
import type { IGraphicDisappearAction } from '../../types/graphic/disappear';
import { getRoleGraphic, getRoleParentGraphic } from './util';
import { typewriter } from './effect/typewriter';
import { commonDisappearEffect } from './effect/disappear';

export const textDisappearProcessor = async (role: IRole, spec = {}, IGraphicAppearAction: IGraphicDisappearAction) => {
  const { animation } = IGraphicAppearAction.payload ?? {};
  const { effect } = animation;
  const graphics = getRoleGraphic(role);
  const textGraphics = graphics.filter(graphic => graphic.type === 'text') as IText[];
  textGraphics.forEach(text => {
    if (!commonDisappearEffect(text, effect, animation)) {
      switch (effect) {
        case 'typewriter':
          typewriter(text, animation);
          break;
      }
    }
  });
};

export const graphicDisappearProcessor = async (
  role: IRole,
  spec = {},
  IGraphicAppearAction: IGraphicDisappearAction
) => {
  const { animation } = IGraphicAppearAction.payload ?? {};
  const { effect } = animation;
  let graphics;
  if (effect === 'move') {
    graphics = [getRoleParentGraphic(role)];
  } else {
    graphics = getRoleGraphic(role);
  }
  graphics.forEach(text => {
    if (!commonDisappearEffect(text, effect, animation)) {
    }
  });
};
