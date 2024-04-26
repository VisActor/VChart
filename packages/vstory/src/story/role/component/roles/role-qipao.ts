import { Graphic } from '../graphic/graphic';
import { GraphicQipao } from '../graphic/qipao';
import { RoleComponent } from '../role';

export class RoleComponentQipao extends RoleComponent {
  protected _createGraphic(): Graphic {
    return new GraphicQipao('QipaoComponent', this);
  }
}
