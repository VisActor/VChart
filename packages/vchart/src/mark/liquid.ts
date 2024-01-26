import { Factory } from './../core/factory';
import { registerWaveGlyph } from '@visactor/vgrammar-core';
import type { ILiquidMarkSpec } from '../typings';
import type { IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { BaseMark } from './base';
import type { ILiquidMark } from '../series/liquid/liquid';
// eslint-disable-next-line no-duplicate-imports
import type { IGroupMark } from '@visactor/vgrammar-core';

const WAVE_GLYPH_TYPE = 'wave';
export class LiquidMark extends BaseMark<ILiquidMarkSpec> implements ILiquidMark {
  static readonly type = MarkTypeEnum.liquid;
  readonly type = LiquidMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<ILiquidMarkSpec> = {
      ...super._getDefaultStyle(),
      wave: 0
    };
    return defaultStyle;
  }

  /** 创建语法元素对象 */
  protected _initProduct(group?: string | IGroupMark) {
    const view = this.getVGrammarView();

    // 声明语法元素
    const id = this.getProductId();
    this._product = view.glyph(WAVE_GLYPH_TYPE, group ?? view.rootMark).id(id);
    this._compiledProductId = id;
  }
}

export const registerLiquidMark = () => {
  Factory.registerMark(LiquidMark.type, LiquidMark);
  registerWaveGlyph();
};
