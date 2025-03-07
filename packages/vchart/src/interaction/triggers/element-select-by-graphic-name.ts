import type { IMarkGraphic } from '../../mark/interface/common';
import { Factory } from '../../core/factory';
import { ElementSelect } from './element-select';

const type = 'element-select-by-graphic-name';

export class ElementSelectByGraphicName extends ElementSelect {
  static type: string = type;
  type: string = type;
  start(markGraphic: IMarkGraphic): void {
    const name = markGraphic?.name;

    if (name) {
      this.getMarks().forEach(mark => {
        mark.getGraphics()?.forEach(g => {
          if (g.name === name) {
            super.start(g);
          }
        });
      });
    }
  }
}

export const registerElementSelectByGraphicName = () => {
  Factory.registerInteractionTrigger(ElementSelectByGraphicName.type, ElementSelectByGraphicName);
};
