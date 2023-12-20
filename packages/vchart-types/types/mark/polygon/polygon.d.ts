import type { IPolygonMarkSpec } from '../../typings/visual';
import { BasePolygonMark } from './base-polygon';
import type { IMarkRaw, IMarkStyle } from '../interface';
import { MarkTypeEnum } from '../interface/type';
export type IPolygonMark = IMarkRaw<IPolygonMarkSpec>;
export declare class PolygonMark extends BasePolygonMark<IPolygonMarkSpec> implements IPolygonMark {
    static readonly type = MarkTypeEnum.polygon;
    readonly type = MarkTypeEnum.polygon;
    protected _getDefaultStyle(): IMarkStyle<IPolygonMarkSpec>;
}
export declare const registerPolygonMark: () => void;
