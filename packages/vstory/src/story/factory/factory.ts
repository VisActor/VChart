import { IGraphicConstructor } from '../element/graphics/graphic/graphic';
import { IElementConstructor, IElementInitOption } from '../element/runtime-interface';
import { IElementSpec } from './../element/dsl-interface';
export class StoryFactory {
  static elementMap: { [key: string]: IElementConstructor } = {};
  static registerElement(type: string, c: IElementConstructor) {
    StoryFactory.elementMap[type] = c;
  }

  static graphicMap: { [key: string]: IGraphicConstructor } = {};
  static registerGraphic(type: string, c: IGraphicConstructor) {
    StoryFactory.graphicMap[type] = c;
  }

  static createElement(spec: IElementSpec, opt: IElementInitOption) {
    const classC = StoryFactory.elementMap[spec.type];
    if (!classC) {
      return null;
    }
    const el = new classC(spec, opt);
    el.init();
    return el;
  }

  static createGraphic(type: string, opt: any) {
    const classC = StoryFactory.graphicMap[type];
    if (!classC) {
      return null;
    }
    return new classC(type, opt);
  }
}
