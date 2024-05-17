import { Graphic } from '../graphic/graphic';
import { GraphicRichText } from '../graphic/richtext';
import { CharacterComponent } from '../character';
import { StoryGraphicType } from '../../../../dsl/constant';

export class CharacterComponentRichText extends CharacterComponent {
  protected _createGraphic(): Graphic {
    return new GraphicRichText(StoryGraphicType.RICH_TEXT, this as any);
  }
}
