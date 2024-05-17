import { Graphic } from '../graphic/graphic';
import { GraphicPureText } from '../graphic/text';
import { CharacterComponent } from '../character';
import { StoryGraphicType } from '../../../../dsl/constant';

/**
 * text component 没有关联 graphic，逻辑与 GraphicText 有所不同
 */
export class CharacterComponentText extends CharacterComponent {
  protected _createGraphic(): Graphic {
    return new GraphicPureText(StoryGraphicType.TEXT, this as any);
  }
}
