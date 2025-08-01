import type { ILayoutModel } from './../model/interface';
import type { IRect, IPoint } from '../typings';
import type { IBoundsLike } from '@visactor/vutils';
import type { ILayoutItem, ILayoutItemInitOption, ILayoutItemSpec } from './interface';
import type { ILayoutAlignSelf, ILayoutPoint, ILayoutRect } from '../typings/layout';
export declare class LayoutItem implements ILayoutItem {
    protected _spec: ILayoutItemSpec;
    getSpec(): ILayoutItemSpec;
    layoutClip: boolean;
    autoIndent: boolean;
    private _layoutStartPoint;
    getLayoutStartPoint(): ILayoutPoint;
    private _layoutRect;
    protected _layoutRectLevelMap: ILayoutRect;
    get layoutRectLevelMap(): ILayoutRect;
    protected _minWidth: number;
    get minWidth(): number;
    set minWidth(v: number);
    protected _maxWidth: number;
    get maxWidth(): number;
    set maxWidth(v: number);
    protected _minHeight: number;
    get minHeight(): number;
    set minHeight(v: number);
    protected _maxHeight: number;
    get maxHeight(): number;
    set maxHeight(v: number);
    protected _lastComputeRect: ILayoutRect;
    get lastComputeRect(): ILayoutRect;
    protected _lastComputeOutBounds: IBoundsLike;
    getLastComputeOutBounds(): IBoundsLike;
    getLayoutRect: () => ILayoutRect;
    layoutType: ILayoutItem['layoutType'];
    layoutBindRegionID: ILayoutItem['layoutBindRegionID'];
    _layoutOrient: ILayoutItem['layoutOrient'];
    get layoutOrient(): ILayoutItem['layoutOrient'];
    set layoutOrient(v: ILayoutItem['layoutOrient']);
    layoutPaddingLeft: ILayoutItem['layoutPaddingLeft'];
    layoutPaddingTop: ILayoutItem['layoutPaddingTop'];
    layoutPaddingRight: ILayoutItem['layoutPaddingRight'];
    layoutPaddingBottom: ILayoutItem['layoutPaddingBottom'];
    layoutOffsetX: ILayoutItem['layoutOffsetX'];
    layoutOffsetY: ILayoutItem['layoutOffsetY'];
    layoutLevel: ILayoutItem['layoutLevel'];
    chartLayoutRect: ILayoutRect;
    alignSelf: ILayoutAlignSelf;
    protected _model: ILayoutModel;
    get model(): ILayoutModel;
    get type(): string;
    protected _option: ILayoutItemInitOption;
    protected _willLayoutTag: boolean;
    get willLayoutTag(): boolean;
    constructor(model: ILayoutModel, option: ILayoutItemInitOption);
    private _setLayoutAttributeFromSpec;
    setAttrFromSpec(spec: ILayoutItemSpec, chartViewRect: ILayoutRect): void;
    onLayoutStart(layoutRect: IRect, viewRect: ILayoutRect): void;
    onLayoutEnd(): void;
    private _getAbsoluteSpecValue;
    absoluteLayoutInRect(layoutRect: IRect): void;
    setLayoutStartPosition(pos: Partial<IPoint>): void;
    setLayoutRect({ width, height }: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRect>): void;
    getLayout(): IRect;
    mergeLayoutRect({ width, height }: ILayoutRect): ILayoutRect;
    getOrientPosAttribute(): "x" | "y";
    getOrientSizeAttribute(): "width" | "height";
    protected changeBoundsBySetting(bounds: IBoundsLike): IBoundsLike;
    setRectInSpec(rect: ILayoutRect): {
        width: number;
        height: number;
    };
    computeBoundsInRect(rect: ILayoutRect): ILayoutRect;
    getModelId(): number;
    getModelVisible(): boolean;
    setWillLayoutTag(): void;
    clearWillLayoutTag(): void;
}
