import { Graphic } from '../graphic/graphic';
import { GraphicRichText } from '../graphic/richtext';
import { RoleGraphicComponent } from '../role';

export class RoleComponentRichText extends RoleGraphicComponent {
  protected _createGraphic(): Graphic {
    return new GraphicRichText('TextComponent', this as any);
  }
}
