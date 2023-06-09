import type { IBoxPlotMarkSpec } from '../typings/visual';
import { BaseMark } from './base';
import type { IGroupMark } from '@visactor/vgrammar';
// eslint-disable-next-line no-duplicate-imports
import { registerBarBoxplotGlyph, registerBoxplotGlyph } from '@visactor/vgrammar';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';
export type IBoxPlotMark = IMarkRaw<IBoxPlotMarkSpec>;

const BOX_PLOT_GLYPH_TYPE = 'boxplot';
const BAR_BOX_PLOT_GLYPH_TYPE = 'barBoxplot';

export class BoxPlotMark extends BaseMark<IBoxPlotMarkSpec> implements IBoxPlotMark {
  static readonly type = MarkTypeEnum.boxPlot;
  readonly type = BoxPlotMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IBoxPlotMarkSpec> = {
      ...super._getDefaultStyle(),
      lineWidth: 2,
      boxWidth: 30,
      shaftWidth: 20,
      shaftShape: 'line'
    };
    return defaultStyle;
  }
  /** 创建语法元素对象 */
  protected _initProduct(group?: string | IGroupMark) {
    const shaftShape = this.getStyle('shaftShape');
    if (shaftShape === 'bar') {
      registerBarBoxplotGlyph();
    } else {
      registerBoxplotGlyph();
    }
    const view = this.getVGrammarView();

    // 声明语法元素
    const id = this.getProductId();
    const glyphType = shaftShape === 'bar' ? BAR_BOX_PLOT_GLYPH_TYPE : BOX_PLOT_GLYPH_TYPE;
    const direction = this.getStyle('direction');
    this._product = view
      .glyph(glyphType, group ?? view.rootMark)
      .id(id)
      .configureGlyph({ direction });
    this._compiledProductId = id;
  }
}
