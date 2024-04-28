import { ACustomAnimate, createLine, createSymbol, getTextBounds } from '@visactor/vrender-core';
import type { IGraphic } from '@visactor/vrender-core';
import { isArray } from '@visactor/vutils';

export class TypeWriter extends ACustomAnimate<{ text: string }> {
  declare valid: boolean;
  declare target: IGraphic;

  private fromText = '';
  private toText = '';

  getEndProps(): Record<string, any> {
    if (this.valid === false) {
      return {};
    }
    return {
      text: this.to
    };
  }

  onBind(): void {
    // const symbol = createSymbol({
    //   x: this.target.attribute.x,
    //   y: this.target.attribute.y,
    //   symbolType: 'circle',
    //   size: 6,
    //   fill: 'red'
    // });
    // this.target.parent.add(symbol);
    // console.log(this.target);
    this.fromText = this.from?.text ?? '';
    this.toText = this.to?.text ?? '';
    if (!this.toText || isArray(this.toText)) {
      this.valid = false;
    } else {
      this.toText = this.toText.toString();
      const root = this.target.attachShadow();
      const fontSize = this.target.getComputedAttribute('fontSize');
      const line = createLine({
        x: 0,
        y: 0,
        dy: -fontSize / 2,
        points: [
          { x: 0, y: 0 },
          { x: 0, y: fontSize }
        ],
        stroke: 'black'
      });
      root.add(line);
    }
  }

  onEnd(): void {
    this.target.detachShadow();
    return;
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    if (this.valid === false) {
      return;
    }
    // update text
    const fromCount = this.fromText.length;
    const toCount = this.toText.length;
    const count = Math.ceil(fromCount + (toCount - fromCount) * ratio);

    out.text = this.toText.substr(0, count);

    // update line position
    const line = this.target.shadowRoot?.at(0) as IGraphic;

    const endX = getTextBounds({ ...this.target.attribute, ...out }).width() / 2 + 2;

    line.setAttribute('x', endX);
  }
}
