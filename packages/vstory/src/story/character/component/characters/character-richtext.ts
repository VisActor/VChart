import { Graphic } from '../graphic/graphic';
import { GraphicRichText } from '../graphic/richtext';
import { CharacterGraphicComponent } from '../character';

export class CharacterComponentRichText extends CharacterGraphicComponent {
  protected _createGraphic(): Graphic {
    return new GraphicRichText('TextComponent', this as any);
  }
}
