import type { IGraphic } from '@visactor/vrender-core';
import type { IPointLike } from '@visactor/vutils';
import { isValid } from '@visactor/vutils';
import { ElementGraphics } from '../element';
import { IElementGraphicsSpec, IWidgetData } from '../..';
import { getLayoutFromWidget } from '../../../utils/layout';

export interface IGraphicConstructor {
  new (type: string, element: ElementGraphics): Graphic;
}

export abstract class Graphic {
  readonly containsShapePoints: boolean = false;
  type: string;

  protected _element: ElementGraphics;
  protected _graphic: IGraphic<any>;

  constructor(type: string, element: ElementGraphics) {
    this.type = type;
    this._element = element;
  }

  abstract init(): void;

  getBounds() {
    return this._graphic.AABBBounds;
  }

  release() {
    if (this._graphic) {
      this._graphic.parent.removeChild(this._graphic);
      this._graphic = null;
    }
  }

  getInitialAttributes(): any {
    return {
      x: 0,
      y: 0,
      width: 120,
      height: 80,
      angle: 0,
      anchor: [60, 40],
      lineWidth: 2,
      stroke: '#000000',
      shapePoints: [] as IPointLike[]
    };
  }

  show(): void {
    this._graphic.setAttributes({
      visible: true,
      visibleAll: true
    });
  }
  hide(): void {
    this._graphic.setAttributes({
      visible: false,
      visibleAll: false
    });
  }

  getGraphicAttribute(): IElementGraphicsSpec['config']['graphic'] {
    return this._graphic?.attribute;
  }

  applyGraphicAttribute(graphicAttribute: IElementGraphicsSpec['config']['graphic']): void {
    this._graphic.setAttributes(
      this._transformAttributes({
        ...graphicAttribute
      })
    );
  }

  getLayoutData() {
    return {
      x: this._graphic.attribute.x,
      y: this._graphic.attribute.y,
      width: this._graphic.attribute.width,
      height: this._graphic.attribute.height,
      angle: this._graphic.attribute.angle,
      shapePoints: this._graphic.attribute.shapePoints
    };
  }

  applyLayoutData(layoutData: Partial<IWidgetData>): void {
    this._graphic.setAttributes(
      this._transformAttributes({
        ...getLayoutFromWidget(layoutData),
        angle: this._element.spec.config.angle,
        shapePoints: this._element.spec.config.shapePoints
      })
    );
  }

  getTextLayoutRatio(): { left: number; right: number; top: number; bottom: number } {
    return {
      left: 0,
      right: 1,
      top: 0,
      bottom: 1
    };
  }

  protected _transformAttributes(attributes: any): any {
    const x = attributes.x ?? this._graphic?.attribute.x;
    const y = attributes.y ?? this._graphic?.attribute.y;
    const width = attributes.width ?? this._graphic?.attribute.width;
    const height = attributes.height ?? this._graphic?.attribute.height;

    const transformedAttributes = Object.assign({}, attributes);
    Object.keys(transformedAttributes).forEach(key => {
      if (!isValid(attributes[key])) {
        delete transformedAttributes[key];
      }
    });
    transformedAttributes.anchor = [x + width / 2, y + height / 2];
    transformedAttributes.scaleCenter = [x + width / 2, y + height / 2];
    return transformedAttributes;
  }
}
