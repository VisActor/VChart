import type { IBoundsLike } from '@visactor/vutils';
import { isEqual } from '@visactor/vutils';
import type { ILayoutItem } from '../layout/interface';
import type { IOrientType, IPolarOrientType, IRect } from '../typings/space';
import { BaseModel } from './base-model';
import type { IModelSpec } from './interface';
import { LayoutItem } from '../layout/layout-item';
import type { IPoint } from '../typings/coordinate';
import type { ILayoutType, ILayoutPoint, ILayoutRect } from '../typings/layout';

export abstract class LayoutModel<T extends IModelSpec> extends BaseModel<T> {
  protected abstract layoutType: ILayoutType;
  protected layoutLevel?: number = 0;
  protected layoutZIndex: number = 0;

  protected _forceLayoutTag: boolean = false;
  protected _layout: ILayoutItem = null;
  protected _orient?: IPolarOrientType | IOrientType = null;

  // TODO: 有些hack,这个tag是为了避免布局逻辑中，轴的数据变化，又由数据变化触发重新布局
  protected _isLayout: boolean = true;

  initLayout() {
    this._layout = new LayoutItem(this, {
      layoutType: this.layoutType,
      layoutLevel: this.layoutLevel,
      transformLayoutRect: this._transformLayoutRect,
      transformLayoutPosition: this._transformLayoutPosition
    });
    if (this._orient && this._orient !== 'radius' && this._orient !== 'angle') {
      this._layout.layoutOrient = this._orient;
    }
  }

  onLayoutStart(layoutRect: IRect, viewRect: ILayoutRect, ctx: any): void {
    this._isLayout = true;
    super.onLayoutStart(layoutRect, viewRect, ctx);
  }
  onLayoutEnd(ctx: any): void {
    // diff layoutRect
    if (this._layout) {
      const layoutRect = this._layout.getLayoutRect();
      if (this._forceLayoutTag || !isEqual(this._lastLayoutRect, layoutRect)) {
        this.updateLayoutAttribute();
      }
      this._forceLayoutTag = false;
    }
    super.onLayoutEnd(ctx);
    this._isLayout = false;
  }

  afterSetLayoutStartPoint(_pos: ILayoutPoint) {
    // do nothing
  }

  protected _forceLayout() {
    if (this._isLayout) {
      return;
    }
    this._forceLayoutTag = true;
    this._option.globalInstance.getChart()?.setLayoutTag(true);
  }

  // 布局相关
  getLayoutStartPoint() {
    return this._layout.getLayoutStartPoint();
  }
  setLayoutStartPosition(pos: Partial<IPoint>) {
    return this._layout.setLayoutStartPosition(pos);
  }
  getLayoutRect() {
    return this._layout.getLayoutRect();
  }
  setLayoutRect(rect: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRect>) {
    return this._layout.setLayoutRect(rect, levelMap);
  }

  getLastComputeOutBounds() {
    return this._layout.getLastComputeOutBounds();
  }

  getGraphicBounds = () => {
    return {
      x1: this._layout.getLayoutStartPoint().x,
      y1: this._layout.getLayoutStartPoint().y,
      x2: this._layout.getLayoutStartPoint().x + this._layout.getLayoutRect().width,
      y2: this._layout.getLayoutStartPoint().y + this._layout.getLayoutRect().height
    };
  };

  abstract getBoundsInRect(rect: ILayoutRect, fullRect: ILayoutRect): IBoundsLike;

  protected _transformLayoutRect: (rect: ILayoutRect) => ILayoutRect = null;
  protected _transformLayoutPosition: (rect: Partial<IPoint>) => Partial<IPoint> = null;
}
