import { merge } from '@visactor/vutils';
import { defaultH2Style } from './style-constants';
import { BaseTooltipModel } from './base-tooltip-model';
import { ShapeModel } from './shape-model';
import { TextModel } from './text-model';

export class TitleModel extends BaseTooltipModel {
  shape: ShapeModel | null = null;
  textSpan: TextModel;

  init(): void {
    if (!this._tooltipActual) {
      return;
    }

    if (!this.product) {
      this.product = this.createElement('h2');
    }

    const { title } = this._tooltipActual;
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
    const shape = new ShapeModel(this.product, this._option, 0, this._tooltipStyle, this._tooltipActual);
    shape.init();
    this.shape = shape;
    this.children[shape.childIndex] = shape;
  }

  private _releaseShape() {
    this.shape.release();
    delete this.children[this.shape.childIndex];
    this.shape = null;
  }

  private _initTextSpan() {
    const textSpan = new TextModel(this.product, this._option, 1, this._tooltipStyle, this._tooltipActual);
    textSpan.init();
    this.textSpan = textSpan;
    this.children[textSpan.childIndex] = textSpan;
  }

  setStyle(style?: Partial<CSSStyleDeclaration>): void {
    if (!this._tooltipActual || !this._tooltipStyle) {
      return;
    }

    const { title } = this._tooltipActual;
    super.setStyle(merge({}, defaultH2Style, this._tooltipStyle.title, style));

    this.shape?.setStyle(
      {
        paddingRight: this._tooltipStyle.content.shape.marginRight
      },
      {
        hasShape: title?.hasShape,
        shapeType: title?.shapeType,
        size: this._tooltipStyle.content.shape.width,
        color: title?.shapeColor,
        hollow: title?.shapeHollow
      }
    );
  }

  setContent(): void {
    if (!this._tooltipActual || !this._tooltipStyle) {
      return;
    }

    const { title } = this._tooltipActual;
    this.init();
    this.shape?.setStyle(undefined, {
      hasShape: title?.hasShape,
      shapeType: title?.shapeType,
      size: this._tooltipStyle.content.shape.width,
      color: title?.shapeColor,
      hollow: title?.shapeHollow
    });
    this.textSpan.setContent(title.value);
  }

  release(): void {
    super.release();
    this.shape = null;
    this.textSpan = null;
  }
}
