import type { IPyramid3dMarkSpec } from '../../typings/visual';
import type { IMarkRaw } from '../interface';
import { MarkTypeEnum } from '../interface/type';
import { BasePolygonMark } from './base-polygon';
export type IPyramid3dMark = IMarkRaw<IPyramid3dMarkSpec>;
export declare class Pyramid3dMark extends BasePolygonMark<IPyramid3dMarkSpec> implements IPyramid3dMark {
    static readonly type = MarkTypeEnum.pyramid3d;
    readonly type = MarkTypeEnum.pyramid3d;
}
export declare const registerPyramid3dMark: () => void;
