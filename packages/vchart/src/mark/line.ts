import { Factory } from './../core/factory';
import { SeriesTypeEnum } from '../series/interface/type';
import type { ILineMarkSpec } from '../typings/visual';
import { BaseLineMark } from './base/base-line';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { registerLineGraphic } from '@visactor/vgrammar-core';
import { registerVGrammarLineOrAreaAnimation } from '../animation/config';

export type ILineMark = IMarkRaw<ILineMarkSpec>;

export class LineMark extends BaseLineMark<ILineMarkSpec> implements ILineMark {
  static readonly type = MarkTypeEnum.line;
  readonly type = LineMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<ILineMarkSpec> = {
      ...super._getDefaultStyle(),
      lineWidth: 1
    };
    return defaultStyle;
  }

  /**
   * TODO: SeriesTypeEnum 移到最外层
   * @override 线不支持填充
   * @returns
   */
  protected _getIgnoreAttributes(): string[] {
    if (this.model?.type === SeriesTypeEnum.radar && this.model?.coordinate === 'polar') {
      return [];
    }
    return ['fill', 'fillOpacity'];
  }
}

export const registerLineMark = () => {
  Factory.registerMark(LineMark.type, LineMark);
  registerLineGraphic();
  registerVGrammarLineOrAreaAnimation();
};
