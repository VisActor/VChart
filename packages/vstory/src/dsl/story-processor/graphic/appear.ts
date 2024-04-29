import { AppearAction } from '../../types/Appear';
import { IRole } from '../../../story/role';
import { commonAppearEffect } from './effect/appear';
import { getRoleGraphic } from './util';
import { typewriter } from './effect/typewriter';
import { IText } from '@visactor/vrender-core';

export const rectAppearProcessor = async (role: IRole, spec = {}, appearAction: AppearAction) => {
  const { animation } = appearAction.payload ?? {};
  const { effect } = animation;
  // if (effect === 'moveIn') {
  //   if (!commonAppearEffect(role.geElementRootMark(), effect, animation)) {
  //     // rect 自身特有 appear 效果
  //   }
  // } else {

  // }
  const graphics = getRoleGraphic(role);
  graphics.forEach(graphic => {
    if (!commonAppearEffect(graphic, effect, animation)) {
      // rect 自身特有 appear 效果
    }
  });
};

export const qipaoAppearProcessor = async (role: IRole, spec = {}, appearAction: AppearAction) => {
  const { animation } = appearAction.payload ?? {};
  const { effect } = animation;
  const graphics = getRoleGraphic(role);
  graphics.forEach(graphic => {
    if (!commonAppearEffect(graphic, effect, animation)) {
      // rect 自身特有 appear 效果
    }
  });
};

export const textAppearProcessor = async (role: IRole, spec = {}, appearAction: AppearAction) => {
  const { animation } = appearAction.payload ?? {};
  const { effect } = animation;
  const graphics = getRoleGraphic(role);
  const textGraphics = graphics.filter(graphic => graphic.type === 'text') as IText[];
  textGraphics.forEach(text => {
    if (!commonAppearEffect(text, effect, animation)) {
      switch (effect) {
        case 'typewriter': // TODO: type
          typewriter(text, animation);
          break;
      }
    }
  });
};
