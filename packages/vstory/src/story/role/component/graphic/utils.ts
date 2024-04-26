import { ILayoutAttribute } from '../../runtime-interface';
import { IComponentRoleSpec } from '../../dsl-interface';
import { RoleGraphics } from '../role';
import { IWidgetData } from '../..';
import type { Graphic } from './graphic';
import { GraphicRect } from './rect';

export const transformAttributesByType = (
  from: string,
  to: string,
  attributes: IComponentRoleSpec['config']
): IComponentRoleSpec['config'] => {
  const graphic = attributes.graphic;
  // shapePoints will not be cloned
  delete graphic.shapePoints;
  // FIXME: rect line width is half to path graphics due to VRender logic
  if (from === 'rect') {
    graphic.lineWidth = graphic.lineWidth * 2;
  } else if (to === 'rect') {
    graphic.lineWidth = Math.ceil(graphic.lineWidth / 2);
  }
  return attributes;
};
