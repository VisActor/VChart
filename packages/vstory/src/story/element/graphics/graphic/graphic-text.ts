import { getLayoutFromWidget } from '../../../utils/layout';
import { IWidgetData } from '../../../element/dsl-interface';
import { ElementGraphics } from './../element';
import { IText, createText, ITextGraphicAttribute, TextAlignType, TextBaselineType } from '@visactor/vrender-core';

export const MAX_LAYOUT_SIZE = 999999;

export class GraphicText {
  private _element: ElementGraphics;
  private _graphic: IText;
  constructor(graphicElement: ElementGraphics) {
    this._element = graphicElement;
  }

  show(): void {
    this._graphic.setAttributes({
      visible: true
      // visibleAll: true,
    });
  }
  hide(): void {
    this._graphic.setAttributes({
      visible: false
      // visibleAll: false,
    });
  }

  init() {
    this._graphic = createText(
      this._transformTextAttributes({
        visible: true,
        x: 0,
        y: 0,
        textAlign: 'center',
        textBaseline: 'middle',
        text: null,
        fontSize: 16,
        whiteSpace: 'normal',
        graphicAlign: 'center',
        graphicBaseline: 'middle',
        fill: '#000000',
        // compute real height without vrender buffer
        ignoreBuf: true,
        ...(this._element.spec.config?.text ?? {}),
        maxLineWidth: MAX_LAYOUT_SIZE,
        heightLimit: MAX_LAYOUT_SIZE
      })
    );
    this._element.geElementRootMark().add(this._graphic);
  }

  applyGraphicAttribute(graphicAttribute: Partial<ITextGraphicAttribute>): void {
    this._graphic.setAttributes({ ...graphicAttribute });
  }

  getGraphicAttribute(): ITextGraphicAttribute {
    return this._graphic?.attribute;
  }

  updateAttribute = (attribute: Partial<ITextGraphicAttribute>): void => {
    if (attribute) {
      this._graphic.setAttributes(this._transformTextAttributes(attribute));
      this._updateGraphicElementSize();
    }
  };

  applyLayoutData(w: Partial<IWidgetData>): void {
    const layoutData = getLayoutFromWidget(w);
    const layoutRatio = this._element.getTextLayoutRatio();
    const graphicAlign = (this._graphic.attribute as any).graphicAlign;
    const graphicBaseline = (this._graphic.attribute as any).graphicBaseline;
    const left = layoutData.x + layoutData.width * layoutRatio.left;
    const right = layoutData.x + layoutData.width * layoutRatio.right;
    const center = (left + right) / 2;
    const top = layoutData.y + layoutData.height * layoutRatio.top;
    const bottom = layoutData.y + layoutData.height * layoutRatio.bottom;
    const middle = (top + bottom) / 2;
    let x = center;
    let align: TextAlignType = 'center';
    let y = middle;
    let baseline: TextBaselineType = 'middle';
    switch (graphicAlign) {
      case 'left':
        x = left;
        align = 'left';
        break;
      case 'center':
        x = center;
        align = 'center';
        break;
      case 'right':
        x = right;
        align = 'right';
        break;
    }
    switch (graphicBaseline) {
      case 'top':
        y = top;
        baseline = 'top';
        break;
      case 'middle':
        y = middle;
        baseline = 'middle';
        break;
      case 'bottom':
        y = bottom;
        baseline = 'bottom';
        break;
    }
    this._graphic.setAttributes(
      this._transformTextAttributes({
        x,
        y,
        textAlign: align,
        textBaseline: baseline,
        angle: layoutData.angle,
        anchor: [layoutData.x + layoutData.width / 2, layoutData.y + layoutData.height / 2],
        maxLineWidth: right - left,
        heightLimit: this._element.graphic.getGraphicAttribute().isResized ? bottom - top : MAX_LAYOUT_SIZE
      })
    );
  }

  private _updateGraphicElementSize() {
    if (!this._element.graphic.getGraphicAttribute().isResized) {
      const layoutRatio = this._element.graphic.getTextLayoutRatio();
      const textHeight = this._graphic.AABBBounds.height();
      const minGraphicHeight = this._element.graphic.getInitialAttributes().height;
      const graphicHeight = Math.max(textHeight / (layoutRatio.bottom - layoutRatio.top), minGraphicHeight);
      this._element.graphic.applyLayoutData({
        height: graphicHeight
      });
      this.applyLayoutData(this._element.graphic.getLayoutData());
    }
  }

  private _transformTextAttributes(attributes: ITextGraphicAttribute): ITextGraphicAttribute {
    return attributes;
  }
}
