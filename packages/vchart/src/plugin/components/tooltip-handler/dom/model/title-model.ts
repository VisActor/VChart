import type { Maybe } from '@visactor/vutils';
import { defaultH2Style } from './style-constants';
import { BaseTooltipModel } from './base-tooltip-model';
import { ShapeModel } from './shape-model';
import { TextModel } from './text-model';
import { mergeSpec } from '../../../../../util/spec/merge-spec';

export class TitleModel extends BaseTooltipModel {
  shape: Maybe<ShapeModel>;
  textSpan: Maybe<TextModel>;

  init(): void {
    const tooltipActual = this._option.getTooltipActual();

    if (!this.product) {
      this.product = this.createElement('h2');
    }

    const { title } = tooltipActual;
    if (title?.hasShape && title?.shapeType) {
      if (!this.shape) {
        this._initShape();
      }
    } else if (this.shape) {
      this._releaseShape();
    }

    if (!this.textSpan) {
      this._initTextSpan();
    }
  }

  private _initShape() {
    const shape = new ShapeModel(this.product!, this._option, 0);
    shape.init();
    this.shape = shape;
    this.children[shape.childIndex] = shape;
  }

  private _releaseShape() {
    if (!this.shape) {
      return;
    }
    this.shape.release();
    delete this.children[this.shape.childIndex];
    this.shape = null;
  }

  private _initTextSpan() {
    const textSpan = new TextModel(this.product!, this._option, 1);
    textSpan.init();
    this.textSpan = textSpan;
    this.children[textSpan.childIndex] = textSpan;
  }

  setStyle(style?: Partial<CSSStyleDeclaration>): void {
    const tooltipStyle = this._option.getTooltipStyle();
    const tooltipActual = this._option.getTooltipActual();

    const { title } = tooltipActual;
    super.setStyle(mergeSpec({}, defaultH2Style, tooltipStyle.title, style));

    this.shape?.setStyle(
      {
        paddingRight: tooltipStyle.shapeColumn.common?.marginRight
      },
      {
        hasShape: title?.hasShape,
        symbolType: title?.shapeType,
        size: tooltipStyle.shapeColumn.common?.width,
        fill: title?.shapeColor,
        hollow: title?.shapeHollow
      }
    );
    this.textSpan?.setStyle({
      color: 'inherit'
    });
  }

  setContent(): void {
    const tooltipStyle = this._option.getTooltipStyle();
    const tooltipActual = this._option.getTooltipActual();
    const tooltipAttributes = this._option.getTooltipAttributes();

    const { title } = tooltipActual;
    this.init();
    this.shape?.setStyle(undefined, {
      hasShape: title?.hasShape,
      symbolType: title?.shapeType,
      size: tooltipStyle.shapeColumn.common?.width,
      fill: title?.shapeColor,
      hollow: title?.shapeHollow
    });
    this.textSpan?.setStyle({
      color: 'inherit'
    });
    this.textSpan?.setContent(title?.value, tooltipAttributes.title?.value?.multiLine);
  }

  release(): void {
    super.release();
    this.shape = null;
    this.textSpan = null;
  }
}
