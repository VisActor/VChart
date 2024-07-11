import { ComponentTypeEnum } from '../../interface/type';
import { BaseMarkPoint } from './base-mark-point';
import type { CoordinateType } from '../../../typings';
export declare class GeoMarkPoint extends BaseMarkPoint {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    static coordinateType: string;
    coordinateType: CoordinateType;
    protected _computePointsAttr(): {
        point: import("../../../typings").IPoint;
    };
    protected _computeOptions(): any;
}
export declare const registerGeoMarkPoint: () => void;
