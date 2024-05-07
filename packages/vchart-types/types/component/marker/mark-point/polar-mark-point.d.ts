import { ComponentTypeEnum } from '../../interface/type';
import { BaseMarkPoint } from './base-mark-point';
import type { IMarkProcessOptions } from '../interface';
export declare class PolarMarkPoint extends BaseMarkPoint {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    static coordinateType: string;
    coordinateType: string;
    protected _computePointsAttr(): {
        point: {
            x: number;
            y: number;
        };
    };
    protected _computeOptions(): IMarkProcessOptions;
}
export declare const registerPolarMarkPoint: () => void;
