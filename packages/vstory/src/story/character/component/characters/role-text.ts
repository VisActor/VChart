import { createGroup } from '@visactor/vrender-core';
import { Graphic } from '../graphic/graphic';
import { GraphicPureText } from '../graphic/text';
import { CharacterGraphicComponent } from '../character';

/**
 * text component 没有关联 graphic，逻辑与 GraphicText 有所不同
 */
export class CharacterComponentText extends CharacterGraphicComponent {
  protected _createGraphic(): Graphic {
    return new GraphicPureText('TextComponent', this as any);
  }
}
