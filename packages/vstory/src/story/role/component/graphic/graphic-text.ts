import { getLayoutFromWidget } from '../../../utils/layout';
import { IWidgetData } from '../../dsl-interface';
import { RoleGraphics } from '../role';
import { IText, createText, ITextGraphicAttribute, TextAlignType, TextBaselineType } from '@visactor/vrender-core';

export const MAX_LAYOUT_SIZE = 999999;

export class GraphicText {
  private _role: RoleGraphics;
  private _graphic: IText;
  constructor(graphicRole: RoleGraphics) {
    this._role = graphicRole;
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
        ...(this._role.spec.options?.text ?? {}),
        maxLineWidth: MAX_LAYOUT_SIZE,
        heightLimit: MAX_LAYOUT_SIZE
      })
    );
    this._role.getGraphicParent().add(this._graphic);
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
      this._updateGraphicRoleSize();
    }
  };

  applyLayoutData(w: Partial<IWidgetData>): void {
    const layoutData = getLayoutFromWidget(w);
    const layoutRatio = this._role.getTextLayoutRatio();
    const graphicAlign = (this._graphic.attribute as any).graphicAlign;
    const graphicBaseline = (this._graphic.attribute as any).graphicBaseline;
    const left = layoutData.width * layoutRatio.left;
    const right = layoutData.width * layoutRatio.right;
    const center = (left + right) / 2;
    const top = layoutData.height * layoutRatio.top;
    const bottom = layoutData.height * layoutRatio.bottom;
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
        anchor: [layoutData.width / 2, layoutData.height / 2],
        scaleCenter: [layoutData.width / 2, layoutData.height / 2],
        maxLineWidth: right - left,
        heightLimit: this._role.graphic.getGraphicAttribute().isResized ? bottom - top : MAX_LAYOUT_SIZE
      })
    );
  }

  private _updateGraphicRoleSize() {
    if (!this._role.graphic.getGraphicAttribute().isResized) {
      const layoutRatio = this._role.graphic.getTextLayoutRatio();
      const textHeight = this._graphic.AABBBounds.height();
      const minGraphicHeight = this._role.graphic.getInitialAttributes().height;
      const graphicHeight = Math.max(textHeight / (layoutRatio.bottom - layoutRatio.top), minGraphicHeight);
      this._role.graphic.applyLayoutData({
        height: graphicHeight
      });
      this.applyLayoutData(this._role.graphic.getPositionData());
    }
  }

  private _transformTextAttributes(attributes: ITextGraphicAttribute): ITextGraphicAttribute {
    return attributes;
  }
}
