import type { IBoundsLike } from '@visactor/vutils';
import type { ILayoutItem } from '../layout/interface';
import type { IOrientType, IPolarOrientType, IRect } from '../typings/space';
import { BaseModel } from './base-model';
import type { IModelSpec } from './interface';
import type { IPoint } from '../typings/coordinate';
import type { ILayoutType, ILayoutPoint, ILayoutRect } from '../typings/layout';
export declare abstract class LayoutModel<T extends IModelSpec> extends BaseModel<T> {
    protected layoutType: ILayoutType | 'none';
    protected layoutLevel?: number;
    protected layoutZIndex: number;
    layoutClip: boolean;
    get layoutOrient(): IOrientType;
    set layoutOrient(v: IOrientType);
    protected _forceLayoutTag: boolean;
    protected _layout: ILayoutItem;
    protected _orient?: IPolarOrientType | IOrientType;
    protected _layoutRect: ILayoutRect;
    protected _layoutStartPos: IPoint;
    protected _isLayout: boolean;
    initLayout(): void;
    onLayoutStart(layoutRect: IRect, viewRect: ILayoutRect, ctx: any): void;
    onLayoutEnd(ctx: any): void;
    afterSetLayoutStartPoint(_pos: ILayoutPoint): void;
    protected _forceLayout(): void;
    getLayoutPositionExcludeIndent(): {
        x: number;
        y: number;
    };
    getLayoutRectExcludeIndent(): {
        width: number;
        height: number;
    };
    getLayoutStartPoint(): IPoint;
    setLayoutStartPosition(pos: Partial<IPoint>): any;
    getLayoutRect(): ILayoutRect;
    setLayoutRect(rect: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRect>): any;
    getLastComputeOutBounds(): IBoundsLike;
    getGraphicBounds: () => {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    setAttrFromSpec(): void;
    abstract getBoundsInRect(rect: ILayoutRect, fullRect: ILayoutRect): IBoundsLike;
    protected _transformLayoutRect: (rect: ILayoutRect) => ILayoutRect;
    protected _transformLayoutPosition: (rect: Partial<IPoint>) => Partial<IPoint>;
}
