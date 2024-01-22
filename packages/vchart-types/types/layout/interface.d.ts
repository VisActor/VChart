import type { IBoundsLike } from '@visactor/vutils';
import type { StringOrNumber } from '../typings/common';
import type { IOrientType, IRect } from '../typings/space';
import type { IPoint } from '../typings/coordinate';
import type { ILayoutNumber, ILayoutPaddingSpec, ILayoutPoint, ILayoutRect, ILayoutType } from '../typings/layout';
import type { ILayoutModel } from '../model/interface';
export interface IBaseLayout {
    layoutItems: LayoutCallBack;
}
export type LayoutCallBack = (chart: any, item: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike) => void;
export interface ILayoutSpecBase {
    type: string;
}
export type ElementSpec = ({
    modelKey: string;
    modelIndex: number;
} | {
    modelId: string;
}) & {
    col: number;
    colSpan?: number;
    row: number;
    rowSpan?: number;
};
export interface IGridLayoutSpec extends ILayoutSpecBase {
    type: 'grid';
    col: number;
    row: number;
    colWidth?: {
        index: number;
        size: number | ((maxSize: number) => number);
    }[];
    rowHeight?: {
        index: number;
        size: number | ((maxSize: number) => number);
    }[];
    elements: ElementSpec[];
}
export interface IBaseLayoutSpec extends ILayoutSpecBase {
    type: 'base';
}
export type ILayoutSpec = IBaseLayoutSpec | IGridLayoutSpec;
export interface ILayoutConstructor {
    type: string;
    new (spec: ILayoutSpec | any, ctx?: any): IBaseLayout;
}
export interface ILayoutItem {
    readonly type: string;
    directionStr?: 'l2r' | 'r2l' | 't2b' | 'b2t';
    layoutClip: boolean;
    layoutType: ILayoutType;
    layoutBindRegionID: number | number[];
    layoutOrient: IOrientType;
    autoIndent: boolean;
    alignSelf?: 'start' | 'end' | 'middle';
    layoutPaddingLeft: number;
    layoutPaddingTop: number;
    layoutPaddingRight: number;
    layoutPaddingBottom: number;
    layoutOffsetX: number;
    layoutOffsetY: number;
    layoutLevel: number;
    chartLayoutRect: ILayoutRect;
    readonly layoutRectLevelMap: ILayoutRect;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    readonly model: ILayoutModel;
    getModelId: () => StringOrNumber;
    getModelVisible: () => boolean;
    getSpec?: () => any;
    setAttrFromSpec: (spec: ILayoutItemSpec, chartViewRect: ILayoutRect) => void;
    setRectInSpec: (rect: ILayoutRect) => ILayoutRect;
    getLayoutStartPoint: () => ILayoutPoint;
    getLayoutRect: () => ILayoutRect;
    getLayout: () => IRect;
    getLastComputeOutBounds: () => IBoundsLike;
    onLayoutStart: (layoutRect: IRect, viewRect: ILayoutRect, ctx: any) => void;
    onLayoutEnd: (option: any) => void;
    setLayoutRect: (rect: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRect>) => void;
    computeBoundsInRect: (rect: ILayoutRect) => ILayoutRect;
    setLayoutStartPosition: (pos: Partial<IPoint>) => void;
    absoluteLayoutInRect: (rect: IRect) => void;
}
export interface ILayoutItemSpec {
    layoutType?: ILayoutType;
    layoutLevel?: number;
    alignSelf?: 'start' | 'end' | 'middle';
    orient?: IOrientType;
    padding?: ILayoutPaddingSpec;
    indent?: ILayoutPaddingSpec;
    noOuterPadding?: boolean;
    width?: ILayoutNumber;
    maxWidth?: ILayoutNumber;
    minWidth?: ILayoutNumber;
    height?: ILayoutNumber;
    maxHeight?: ILayoutNumber;
    minHeight?: ILayoutNumber;
    offsetX?: ILayoutNumber;
    offsetY?: ILayoutNumber;
    zIndex?: number;
    clip?: boolean;
    left?: ILayoutNumber;
    right?: ILayoutNumber;
    top?: ILayoutNumber;
    bottom?: ILayoutNumber;
    center?: boolean;
}
export interface ILayoutItemInitOption {
    layoutType: ILayoutType;
    layoutLevel: number;
    layoutOrient?: IOrientType;
    transformLayoutRect?: (rect: ILayoutRect) => ILayoutRect;
    transformLayoutPosition?: (pos: Partial<IPoint>) => Partial<IPoint>;
}
