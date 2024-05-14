import { Graphic } from '../graphic/graphic';
import { GraphicRect } from '../graphic/rect';
import { CharacterComponent } from '../character';
import { StoryEvent } from '../../../interface';

export class CharacterComponentRect extends CharacterComponent {
  protected _createGraphic(): Graphic {
    return new GraphicRect('RectComponent', this);
  }
}
