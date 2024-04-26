import { Graphic } from '../graphic/graphic';
import { GraphicRect } from '../graphic/rect';
import { RoleComponent } from '../role';

export class RoleComponentRect extends RoleComponent {
  protected _createGraphic(): Graphic {
    return new GraphicRect('rect', this);
  }
}
