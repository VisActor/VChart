import { createGroup } from '@visactor/vrender-core';
import { Graphic } from '../graphic/graphic';
import { GraphicPureText } from '../graphic/text';
import { RoleGraphicComponent } from '../role';

/**
 * text component 没有关联 graphic，逻辑与 GraphicText 有所不同
 */
export class RoleComponentText extends RoleGraphicComponent {
  protected _createGraphic(): Graphic {
    return new GraphicPureText('TextComponent', this as any);
  }
}
